-- Run as postgres in SQL Editor or psql. All fixture data is rolled back.
begin;

do $$
declare
  run_id text := 'guestbook-test-' || gen_random_uuid()::text;
  drawing jsonb := '{"version":1,"background":"#fffdf7","commands":[{"type":"path","mode":"pen","color":"#111827","size":4,"points":[{"x":0.2,"y":0.3}]}]}'::jsonb;
  result jsonb;
  test_entry_id uuid;
  cursor_id uuid;
  cursor_time timestamptz;
  i integer;
  role_name text;
  signature text;
begin
  foreach role_name in array array['anon', 'authenticated'] loop
    if has_table_privilege(role_name, 'public.guestbook_entries', 'SELECT')
       or has_table_privilege(role_name, 'public.guestbook_entries', 'INSERT')
       or has_table_privilege(role_name, 'public.guestbook_reports', 'SELECT')
       or has_table_privilege(role_name, 'public.guestbook_reports', 'INSERT') then
      raise exception 'Browser roles must not access guestbook tables';
    end if;
    foreach signature in array array[
      'public.create_guestbook_entry(text,text,text,jsonb,text)',
      'public.report_guestbook_entry(uuid,text,text,text)',
      'public.list_guestbook_entries(integer,timestamp with time zone,uuid)'
    ] loop
      if has_function_privilege(role_name, signature, 'EXECUTE') then
        raise exception 'Browser role % can execute %', role_name, signature;
      end if;
      if not has_function_privilege('service_role', signature, 'EXECUTE') then
        raise exception 'Server role cannot execute %', signature;
      end if;
    end loop;
  end loop;

  result := public.create_guestbook_entry(run_id || '-1', 'Test', '', drawing, run_id);
  if result->>'status' <> 'created' then raise exception 'Entry creation failed'; end if;
  test_entry_id := (result->>'id')::uuid;
  result := public.create_guestbook_entry(run_id || '-1', 'Changed', '', drawing, run_id || '-different');
  if result->>'status' <> 'duplicate' or (result->>'id')::uuid <> test_entry_id then
    raise exception 'Submission retry was not idempotent';
  end if;
  for i in 2..3 loop
    result := public.create_guestbook_entry(run_id || '-' || i, 'Test', '', drawing, run_id);
    if result->>'status' <> 'created' then raise exception 'Allowed entry rejected'; end if;
  end loop;
  result := public.create_guestbook_entry(run_id || '-4', 'Test', '', drawing, run_id);
  if result->>'status' <> 'rate_limited' then raise exception 'Fourth entry was not limited'; end if;

  result := public.report_guestbook_entry(test_entry_id, run_id || '-reporter-1', 'spam', '');
  if result->>'status' <> 'created' or (result->>'reportCount')::integer <> 1 then
    raise exception 'Initial report failed';
  end if;
  result := public.report_guestbook_entry(test_entry_id, run_id || '-reporter-1', 'spam', '');
  if result->>'status' <> 'duplicate' then raise exception 'Duplicate report was counted'; end if;
  for i in 2..3 loop
    result := public.report_guestbook_entry(test_entry_id, run_id || '-reporter-' || i, 'spam', '');
  end loop;
  if not (result->>'hidden')::boolean or (result->>'reportCount')::integer <> 3 then
    raise exception 'Three reports did not hide the entry';
  end if;
  if exists (select 1 from public.list_guestbook_entries(25) where id = test_entry_id) then
    raise exception 'Hidden entry leaked into the public feed';
  end if;
  result := public.report_guestbook_entry(gen_random_uuid(), run_id, 'spam', '');
  if result->>'status' <> 'not_found' then raise exception 'Missing entry not handled'; end if;
  begin
    perform public.report_guestbook_entry(test_entry_id, run_id || '-invalid', 'invalid-reason', '');
    raise exception 'Invalid report reason accepted';
  exception when check_violation then
    null;
  end;

  insert into public.guestbook_entries (form_submission_id, name, drawing, visitor_hash, created_at)
  select run_id || '-feed-' || n, 'Pagination test', drawing, run_id,
         '2099-01-01T00:00:00Z'::timestamptz + n * interval '1 microsecond'
  from generate_series(1, 26) n;

  if (select count(*) from public.list_guestbook_entries(100)) <> 25 then
    raise exception 'Feed must cap database reads at 25 (24 entries plus lookahead)';
  end if;
  select id, created_at into cursor_id, cursor_time
  from public.list_guestbook_entries(24)
  order by created_at, id limit 1;
  if (select count(*) from public.list_guestbook_entries(25, cursor_time, cursor_id)
      where created_at >= '2099-01-01T00:00:00Z'::timestamptz) <> 2 then
    raise exception 'Microsecond-precision cursor skipped or repeated feed entries';
  end if;

  delete from public.guestbook_entries where id = test_entry_id;
  if exists (select 1 from public.guestbook_reports where entry_id = test_entry_id) then
    raise exception 'Deleting an entry did not cascade to its reports';
  end if;
end;
$$;

rollback;
