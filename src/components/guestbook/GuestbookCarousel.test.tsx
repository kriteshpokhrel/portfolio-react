// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GuestbookCarousel } from "./GuestbookCarousel";
import { fetchGuestbookPage } from "./guestbookApi";

vi.mock("./guestbookApi", () => ({ fetchGuestbookPage: vi.fn() }));
vi.mock("./drawing", () => ({ renderDrawing: vi.fn() }));

const mockedFetchPage = vi.mocked(fetchGuestbookPage);
const makeEntry = (name: string, id: string) => ({
  id,
  name,
  message: `${name}'s note`,
  drawing: {
    version: 1 as const,
    background: "#fffdf7" as const,
    commands: [{
      type: "path" as const,
      mode: "pen" as const,
      color: "#111827" as const,
      size: 4,
      points: [{ x: 0.1, y: 0.2 }],
    }],
  },
  createdAt: "2026-09-14T12:00:00.000Z",
});

beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal("ResizeObserver", class {
    observe() {}
    disconnect() {}
  });
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({} as CanvasRenderingContext2D);
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

async function finishLoad() {
  await act(async () => {
    await vi.runAllTimersAsync();
  });
}

describe("GuestbookCarousel", () => {
  it("loads entries and wraps with buttons and keyboard", async () => {
    mockedFetchPage.mockResolvedValue({
      entries: [
        makeEntry("Ada", "1c94c91f-ec57-486b-9538-142f1d3948de"),
        makeEntry("Lin", "f7bf2191-55af-4d64-803c-96fe2bd9461e"),
      ],
      nextCursor: null,
    });
    render(<GuestbookCarousel refreshSignal={0} onAddMark={vi.fn()} />);

    expect(screen.getByText("Fetching the latest doodles...")).toBeTruthy();
    await finishLoad();
    expect(screen.getByText("Ada")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Previous guestbook mark" }));
    expect(screen.getByText("Lin")).toBeTruthy();
    fireEvent.keyDown(screen.getByRole("region", { name: "Recent guestbook marks" }), { key: "ArrowRight" });
    expect(screen.getByText("Ada")).toBeTruthy();
  });

  it("shows an empty action", async () => {
    const onAddMark = vi.fn();
    mockedFetchPage.mockResolvedValue({ entries: [], nextCursor: null });
    render(<GuestbookCarousel refreshSignal={0} onAddMark={onAddMark} />);
    await finishLoad();

    expect(screen.getByText("It is a little quiet in here. Be the first to leave a doodle.")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Leave a mark" }));
    expect(onAddMark).toHaveBeenCalledOnce();
  });

  it("shows an error and retries", async () => {
    mockedFetchPage
      .mockRejectedValueOnce(new Error("offline"))
      .mockResolvedValueOnce({
        entries: [makeEntry("Grace", "ed887208-76a7-4260-b42f-6e193fa0dc52")],
        nextCursor: null,
      });
    render(<GuestbookCarousel refreshSignal={0} onAddMark={vi.fn()} />);
    await finishLoad();

    expect(screen.getByText("Could not grab the latest doodles. One more try?")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Give it another go" }));
    await finishLoad();
    expect(screen.getByText("Grace")).toBeTruthy();
  });

  it("refetches after the refresh signal delay", async () => {
    mockedFetchPage.mockResolvedValue({
      entries: [makeEntry("Ada", "1c94c91f-ec57-486b-9538-142f1d3948de")],
      nextCursor: null,
    });
    const { rerender } = render(<GuestbookCarousel refreshSignal={0} onAddMark={vi.fn()} />);
    await finishLoad();
    expect(mockedFetchPage).toHaveBeenCalledTimes(1);

    rerender(<GuestbookCarousel refreshSignal={1} onAddMark={vi.fn()} />);
    expect(mockedFetchPage).toHaveBeenCalledTimes(1);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1800);
    });
    expect(mockedFetchPage).toHaveBeenCalledTimes(2);
  });
});