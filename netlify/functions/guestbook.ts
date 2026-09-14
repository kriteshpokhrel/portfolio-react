import type {} from "@netlify/functions";
import { publicGuestbookEntrySchema } from "../../src/components/guestbook/guestbookSchema";
import {
  callSupabaseRpc,
  decodeCursor,
  encodeCursor,
} from "../lib/guestbook";

type DatabaseEntry = {
  id: string;
  name: string;
  message: string;
  drawing: unknown;
  created_at: string;
};

const jsonHeaders = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "public, max-age=30, stale-while-revalidate=120",
  "X-Content-Type-Options": "nosniff",
};

export default async function guestbook(request: Request) {
  if (request.method !== "GET") {
    return Response.json({ error: "Method not allowed" }, {
      status: 405,
      headers: { ...jsonHeaders, "Cache-Control": "no-store", Allow: "GET" },
    });
  }

  const query = new URL(request.url).searchParams;
  const requestedLimit = Number(query.get("limit") ?? 12);
  const limit = Number.isInteger(requestedLimit)
    ? Math.min(Math.max(requestedLimit, 1), 24)
    : 12;
  const rawCursor = query.get("cursor");
  const cursor = decodeCursor(rawCursor);

  if (rawCursor && !cursor) {
    return Response.json({ error: "Invalid cursor" }, {
      status: 400,
      headers: { ...jsonHeaders, "Cache-Control": "no-store" },
    });
  }

  try {
    const rows = await callSupabaseRpc<DatabaseEntry[]>("list_guestbook_entries", {
      p_limit: limit + 1,
      p_cursor_created_at: cursor?.[0] ?? null,
      p_cursor_id: cursor?.[1] ?? null,
    });
    const hasMore = rows.length > limit;
    const visibleRows = rows.slice(0, limit);
    const entries = visibleRows.map((row) =>
      publicGuestbookEntrySchema.parse({
        id: row.id,
        name: row.name,
        message: row.message,
        drawing: row.drawing,
        createdAt: row.created_at,
      })
    );
    const last = entries.at(-1);

    return Response.json({
      entries,
      nextCursor: hasMore && last ? encodeCursor(last.createdAt, last.id) : null,
    }, { headers: jsonHeaders });
  } catch (error) {
    console.error("Guestbook feed failed", error);
    return Response.json({ error: "Guestbook is temporarily unavailable" }, {
      status: 503,
      headers: { ...jsonHeaders, "Cache-Control": "no-store" },
    });
  }
}