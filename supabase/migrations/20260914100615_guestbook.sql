create table public.guestbook_entries (
  id uuid primary key default gen_random_uuid(),
  form_submission_id text not null unique,
  name varchar(40) not null,
  message varchar(180) not null default '',
  drawing jsonb not null,
  visitor_hash text not null,
  is_hidden boolean not null default false,
  report_count integer not null default 0,
  created_at timestamptz not null default now(),
  constraint guestbook_name_not_blank check (length(trim(name)) > 0)
);

create table public.guestbook_reports (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references public.guestbook_entries(id) on delete cascade,
  reporter_hash text not null,
  reason text not null check (reason in ('spam', 'offensive', 'personal-info', 'other')),
  details varchar(160) not null default '',
  created_at timestamptz not null default now(),
  unique (entry_id, reporter_hash)
);

create index guestbook_entries_public_feed_idx
  on public.guestbook_entries (created_at desc, id desc)
  where is_hidden = false;

create index guestbook_entries_rate_limit_idx
  on public.guestbook_entries (visitor_hash, created_at desc);

alter table public.guestbook_entries enable row level security;
alter table public.guestbook_reports enable row level security;

revoke all on public.guestbook_entries from public, anon, authenticated;
revoke all on public.guestbook_reports from public, anon, authenticated;

create or replace function public.create_guestbook_entry(
  p_form_submission_id text,
  p_name text,
  p_message text,
  p_drawing jsonb,
  p_visitor_hash text
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  existing_id uuid;
  created_id uuid;
begin
  -- Serialize retries first, then submissions sharing the same browser identity.
  perform pg_advisory_xact_lock(hashtextextended('guestbook:submission:' || p_form_submission_id, 0));
  perform pg_advisory_xact_lock(hashtextextended('guestbook:visitor:' || p_visitor_hash, 0));

  select id into existing_id
  from public.guestbook_entries
  where form_submission_id = p_form_submission_id;

  if existing_id is not null then
    return jsonb_build_object('status', 'duplicate', 'id', existing_id);
  end if;

  if (
    select count(*)
    from public.guestbook_entries
    where visitor_hash = p_visitor_hash
      and created_at > now() - interval '10 minutes'
  ) >= 3 then
    return jsonb_build_object('status', 'rate_limited');
  end if;

  insert into public.guestbook_entries (
    form_submission_id, name, message, drawing, visitor_hash
  ) values (
    p_form_submission_id, p_name, p_message, p_drawing, p_visitor_hash
  )
  returning id into created_id;

  return jsonb_build_object('status', 'created', 'id', created_id);
end;
$$;

create or replace function public.report_guestbook_entry(
  p_entry_id uuid,
  p_reporter_hash text,
  p_reason text,
  p_details text
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  inserted_count integer;
  total_reports integer;
  now_hidden boolean;
begin
  -- Lock the entry before inserting/counting reports to avoid lost moderation updates.
  perform 1 from public.guestbook_entries where id = p_entry_id for update;
  if not found then
    return jsonb_build_object('status', 'not_found');
  end if;

  insert into public.guestbook_reports (entry_id, reporter_hash, reason, details)
  values (p_entry_id, p_reporter_hash, p_reason, p_details)
  on conflict (entry_id, reporter_hash) do nothing;

  get diagnostics inserted_count = row_count;
  if inserted_count = 0 then
    return jsonb_build_object('status', 'duplicate');
  end if;

  select count(*) into total_reports
  from public.guestbook_reports
  where entry_id = p_entry_id;

  now_hidden := total_reports >= 3;
  update public.guestbook_entries
  set report_count = total_reports,
      is_hidden = is_hidden or now_hidden
  where id = p_entry_id;

  return jsonb_build_object(
    'status', 'created',
    'reportCount', total_reports,
    'hidden', now_hidden
  );
end;
$$;

create or replace function public.list_guestbook_entries(
  p_limit integer default 12,
  p_cursor_created_at timestamptz default null,
  p_cursor_id uuid default null
) returns table (
  id uuid,
  name text,
  message text,
  drawing jsonb,
  created_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select entry.id, entry.name::text, entry.message::text, entry.drawing, entry.created_at
  from public.guestbook_entries entry
  where entry.is_hidden = false
    and (
      p_cursor_created_at is null
      or (entry.created_at, entry.id) < (p_cursor_created_at, p_cursor_id)
    )
  order by entry.created_at desc, entry.id desc
  -- One lookahead row is needed for a 24-entry API page.
  limit least(greatest(p_limit, 1), 25);
$$;

revoke all on function public.create_guestbook_entry(text, text, text, jsonb, text) from public, anon, authenticated;
revoke all on function public.report_guestbook_entry(uuid, text, text, text) from public, anon, authenticated;
revoke all on function public.list_guestbook_entries(integer, timestamptz, uuid) from public, anon, authenticated;
grant execute on function public.create_guestbook_entry(text, text, text, jsonb, text) to service_role;
grant execute on function public.report_guestbook_entry(uuid, text, text, text) to service_role;
grant execute on function public.list_guestbook_entries(integer, timestamptz, uuid) to service_role;