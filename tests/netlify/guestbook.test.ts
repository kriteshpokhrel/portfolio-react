import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DRAWING_VERSION } from "../../src/components/guestbook/guestbookSchema";
import guestbook from "../../netlify/functions/guestbook";
import { decodeCursor, encodeCursor } from "../../netlify/lib/guestbook";
import { stubEnvironment } from "./environment";

const invoke = (query = "", method = "GET") =>
  guestbook(new Request(`https://example.test/api/guestbook${query}`, { method }));

const databaseEntry = {
  id: "f4f669e6-b66a-4b09-842e-b437f7f64b52",
  name: "Ada",
  message: "Hello",
  drawing: {
    version: DRAWING_VERSION,
    background: "#fffdf7",
    commands: [{
      type: "path",
      mode: "pen",
      color: "#111827",
      size: 4,
      points: [{ x: 0.2, y: 0.3 }],
    }],
  },
  created_at: "2026-09-14T10:00:00.123456+00:00",
  visitor_hash: "must-not-leak",
};

describe("guestbook feed function", () => {
  beforeEach(() => {
    stubEnvironment();
    vi.restoreAllMocks();
  });
  afterEach(() => vi.unstubAllGlobals());

  it("rejects invalid cursors without calling persistence", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const response = await invoke("?cursor=bad");
    expect(response.status).toBe(400);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("maps private database rows to the public contract", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json([databaseEntry])));

    const response = await invoke();
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.entries[0]).toMatchObject({ name: "Ada", message: "Hello" });
    expect(body.entries[0].createdAt).toBe(databaseEntry.created_at);
    expect(body.entries[0]).not.toHaveProperty("visitor_hash");
  });

  it("returns a continuation cursor at the maximum page size without losing timestamp precision", async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json(Array.from({ length: 25 }, () => databaseEntry)));
    vi.stubGlobal("fetch", fetchMock);
    const response = await invoke("?limit=24");
    const body = await response.json();
    expect(body.entries).toHaveLength(24);
    expect(decodeCursor(body.nextCursor)).toEqual([databaseEntry.created_at, databaseEntry.id]);
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).p_limit).toBe(25);
  });

  it("passes exact cursor values to the database", async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json([]));
    vi.stubGlobal("fetch", fetchMock);
    await invoke(`?cursor=${encodeCursor(databaseEntry.created_at, databaseEntry.id)}`);
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toMatchObject({
      p_cursor_created_at: databaseEntry.created_at,
      p_cursor_id: databaseEntry.id,
    });
  });

  it.each([["0", 2], ["999", 25], ["bad", 13], ["1.5", 13]])(
    "bounds requested limit %s",
    async (limit, databaseLimit) => {
      const fetchMock = vi.fn().mockResolvedValue(Response.json([]));
      vi.stubGlobal("fetch", fetchMock);
      await invoke(`?limit=${limit}`);
      expect(JSON.parse(fetchMock.mock.calls[0][1].body).p_limit).toBe(databaseLimit);
    }
  );

  it("rejects non-GET requests", async () => {
    const response = await invoke("", "POST");
    expect(response.status).toBe(405);
    expect(response.headers.get("Allow")).toBe("GET");
  });

  it("does not cache database failures", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 500 })));
    const response = await invoke();
    expect(response.status).toBe(503);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
  });
});