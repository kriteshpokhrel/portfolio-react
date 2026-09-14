import { guestbookPageSchema } from "./guestbookSchema";

type FetchGuestbookPageOptions = {
  limit: number;
  cursor?: string | null;
  signal?: AbortSignal;
};

export async function fetchGuestbookPage({
  limit,
  cursor,
  signal,
}: FetchGuestbookPageOptions) {
  const query = new URLSearchParams({ limit: String(limit) });
  if (cursor) query.set("cursor", cursor);

  const response = await fetch(`/api/guestbook?${query}`, { signal });
  if (!response.ok) throw new Error("Feed unavailable");
  return guestbookPageSchema.parse(await response.json());
}