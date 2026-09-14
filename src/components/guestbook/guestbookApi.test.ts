import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchGuestbookPage } from "./guestbookApi";

const entry = {
  id: "3f84552d-36df-41b1-96a1-75266bb03e22",
  name: "Ada",
  message: "Hello",
  drawing: {
    version: 1,
    background: "#fffdf7",
    commands: [
      {
        type: "path",
        mode: "pen",
        color: "#111827",
        size: 4,
        points: [{ x: 0.1, y: 0.2 }],
      },
    ],
  },
  createdAt: "2026-09-14T12:00:00.000Z",
};

afterEach(() => vi.unstubAllGlobals());

describe("fetchGuestbookPage", () => {
  it("requests and validates a page with cursor and signal", async () => {
    const signal = new AbortController().signal;
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ entries: [entry], nextCursor: "next-page" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const page = await fetchGuestbookPage({ limit: 8, cursor: "current page", signal });

    expect(page.entries[0].name).toBe("Ada");
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/guestbook?limit=8&cursor=current+page",
      { signal }
    );
  });

  it("omits an empty cursor", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ entries: [], nextCursor: null }),
    });
    vi.stubGlobal("fetch", fetchMock);

    await fetchGuestbookPage({ limit: 12, cursor: null });

    expect(fetchMock).toHaveBeenCalledWith("/api/guestbook?limit=12", { signal: undefined });
  });

  it("rejects invalid response data", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ entries: [{ name: "Incomplete" }], nextCursor: null }),
    }));

    await expect(fetchGuestbookPage({ limit: 8 })).rejects.toThrow();
  });
});