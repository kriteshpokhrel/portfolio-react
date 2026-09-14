import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { callSupabaseRpc, decodeCursor, encodeCursor, hashVisitor } from "../../netlify/lib/guestbook";
import { stubEnvironment } from "./environment";

describe("guestbook function helpers", () => {
  beforeEach(() => {
    stubEnvironment();
  });
  afterEach(() => vi.unstubAllGlobals());

  it("round trips stable feed cursors", () => {
    const timestamp = "2026-09-14T10:00:00.123456+00:00";
    const id = "f4f669e6-b66a-4b09-842e-b437f7f64b52";
    expect(decodeCursor(encodeCursor(timestamp, id))).toEqual([timestamp, id]);
  });

  it("rejects malformed cursors", () => {
    expect(decodeCursor("not-a-cursor")).toBeNull();
  });

  it("creates deterministic, non-reversible visitor hashes", () => {
    const hash = hashVisitor("f4f669e6-b66a-4b09-842e-b437f7f64b52");
    expect(hash).toHaveLength(64);
    expect(hash).not.toContain("f4f669e6");
    expect(hashVisitor("f4f669e6-b66a-4b09-842e-b437f7f64b52")).toBe(hash);
  });

  it.each([
    ["test-legacy-key-with-enough-length", true],
    ["sb_secret_test-key-with-enough-length", false],
  ])("uses the correct headers for server key format %s", async (key, hasAuthorization) => {
    stubEnvironment({ SUPABASE_URL: "https://example.supabase.co/", SUPABASE_SERVICE_ROLE_KEY: key });
    const fetchMock = vi.fn().mockResolvedValue(Response.json([]));
    vi.stubGlobal("fetch", fetchMock);
    await callSupabaseRpc("list_guestbook_entries", {});
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("https://example.supabase.co/rest/v1/rpc/list_guestbook_entries");
    expect(options.headers.apikey).toBe(key);
    expect(Boolean(options.headers.Authorization)).toBe(hasAuthorization);
    expect(options.signal).toBeInstanceOf(AbortSignal);
  });

  it("fails before persistence when required configuration is missing", async () => {
    stubEnvironment({ SUPABASE_SERVICE_ROLE_KEY: undefined });
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    await expect(callSupabaseRpc("list_guestbook_entries", {})).rejects.toThrow();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});