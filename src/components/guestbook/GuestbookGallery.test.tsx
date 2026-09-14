// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GuestbookGallery } from "./GuestbookGallery";
import { fetchGuestbookPage } from "./guestbookApi";
import type { PublicGuestbookEntry } from "./guestbookSchema";

vi.mock("./guestbookApi", () => ({ fetchGuestbookPage: vi.fn() }));
vi.mock("./GuestbookCard", () => ({
  GuestbookCard: ({ entry, onReport }: { entry: PublicGuestbookEntry; onReport: (entry: PublicGuestbookEntry) => void }) => (
    <div>{entry.name}<button type="button" onClick={() => onReport(entry)}>Report {entry.name}</button></div>
  ),
}));

const entry: PublicGuestbookEntry = {
  id: "f4f669e6-b66a-4b09-842e-b437f7f64b52",
  name: "Ada",
  message: "",
  createdAt: "2026-09-14T10:00:00.123456+00:00",
  drawing: {
    version: 1, background: "#fffdf7",
    commands: [{ type: "stamp", stamp: "heart", color: "#111827", size: 24, point: { x: 0.5, y: 0.5 } }],
  },
};
type Page = Awaited<ReturnType<typeof fetchGuestbookPage>>;

beforeEach(() => {
  vi.mocked(fetchGuestbookPage).mockReset();
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("guestbook gallery requests", () => {
  it("prevents duplicate pagination requests", async () => {
    let resolvePage: (page: Page) => void = () => { throw new Error("Request not started"); };
    vi.mocked(fetchGuestbookPage)
      .mockResolvedValueOnce({ entries: [entry], nextCursor: "next" })
      .mockImplementationOnce(() => new Promise((resolve) => { resolvePage = resolve; }));
    render(<GuestbookGallery refreshSignal={0} />);
    const more = await screen.findByRole("button", { name: "Load more" });
    fireEvent.click(more);
    fireEvent.click(more);
    expect(fetchGuestbookPage).toHaveBeenCalledTimes(2);
    expect((more as HTMLButtonElement).disabled).toBe(true);
    await act(async () => resolvePage({ entries: [{ ...entry, id: "3f84552d-36df-41b1-96a1-75266bb03e22", name: "Grace" }], nextCursor: null }));
    expect(screen.getByText("Ada")).toBeTruthy();
    expect(screen.getByText("Grace")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Load more" })).toBeNull();
  });

  it("aborts an outstanding request when unmounted", async () => {
    vi.mocked(fetchGuestbookPage).mockReturnValue(new Promise(() => {}));
    const { unmount } = render(<GuestbookGallery refreshSignal={0} />);
    await waitFor(() => expect(fetchGuestbookPage).toHaveBeenCalledOnce());
    const signal = vi.mocked(fetchGuestbookPage).mock.calls[0][0].signal;
    unmount();
    expect(signal?.aborted).toBe(true);
  });

  it("handles blocked storage when reporting without losing the report dialog", async () => {
    vi.mocked(fetchGuestbookPage).mockResolvedValue({ entries: [entry], nextCursor: null });
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new DOMException("Blocked", "SecurityError"); });
    render(<GuestbookGallery refreshSignal={0} />);
    fireEvent.click(await screen.findByRole("button", { name: "Report Ada" }));
    fireEvent.click(screen.getByRole("button", { name: "Send report" }));
    expect(await screen.findByRole("alert")).toBeTruthy();
    expect(screen.getByRole("dialog", { name: "Report this mark" })).toBeTruthy();
  });
});
