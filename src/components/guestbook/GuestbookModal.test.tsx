// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { GuestbookModal } from "./GuestbookModal";
import { GuestbookModalProvider } from "./GuestbookModalContext";
import { useGuestbookModal } from "./guestbookModalState";

vi.mock("./GuestbookCarousel", () => ({
  GuestbookCarousel: ({ onAddMark }: { onAddMark: () => void }) => (
    <div><span>Recent carousel</span><button type="button" onClick={onAddMark}>Carousel add</button></div>
  ),
}));

vi.mock("./GuestbookForm", () => ({
  GuestbookForm: ({ onSubmitted, onDirtyChange }: { onSubmitted: () => void; onDirtyChange: (dirty: boolean) => void }) => (
    <div>
      <span>Drawing editor</span>
      <button type="button" onClick={() => onDirtyChange(true)}>Make dirty</button>
      <button type="button" onClick={onSubmitted}>Submit mark</button>
    </div>
  ),
}));

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  document.body.style.overflow = "";
});

const renderModal = (launchMode: "preview" | "editor" = "preview", onClose = vi.fn()) => {
  render(
    <MemoryRouter>
      <GuestbookModal launchMode={launchMode} refreshSignal={0} onClose={onClose} onSubmitted={vi.fn()} />
    </MemoryRouter>
  );
  return onClose;
};

describe("GuestbookModal", () => {
  it("moves from preview to editor and success", () => {
    renderModal();
    expect(screen.getByText("Recent carousel")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Draw something" }));
    expect(screen.getByText("Drawing editor")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Submit mark" }));
    expect(screen.getByText("Nice. Your doodle is on the way.")).toBeTruthy();
  });

  it("confirms before leaving or closing a dirty editor", () => {
    const onClose = renderModal("editor");
    const confirm = vi.spyOn(window, "confirm").mockReturnValue(false);
    fireEvent.click(screen.getByRole("button", { name: "Make dirty" }));
    fireEvent.click(screen.getByRole("button", { name: "Back to recent marks" }));
    expect(screen.getByText("Drawing editor")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Close guestbook" }));
    expect(onClose).not.toHaveBeenCalled();

    confirm.mockReturnValue(true);
    fireEvent.click(screen.getByRole("button", { name: "Back to recent marks" }));
    expect(screen.getByText("Recent carousel")).toBeTruthy();
  });

  it("opens directly in the editor", () => {
    renderModal("editor");
    expect(screen.getByText("Drawing editor")).toBeTruthy();
    expect(screen.queryByText("Recent carousel")).toBeNull();
  });
});

function ModalHarness() {
  const { openGuestbook } = useGuestbookModal();
  return (
    <>
      <button type="button" onClick={() => openGuestbook("editor")}>Open editor</button>
      <button type="button" onClick={() => openGuestbook()}>Open preview</button>
    </>
  );
}

describe("GuestbookModalProvider", () => {
  it("resets to preview after close and supports direct editor launch", () => {
    render(
      <MemoryRouter>
        <GuestbookModalProvider><ModalHarness /></GuestbookModalProvider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: "Open editor" }));
    expect(screen.getByText("Drawing editor")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Close guestbook" }));
    fireEvent.click(screen.getByRole("button", { name: "Open preview" }));
    expect(screen.getByText("Recent carousel")).toBeTruthy();
  });
});