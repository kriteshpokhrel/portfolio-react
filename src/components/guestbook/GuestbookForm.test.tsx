// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GuestbookForm } from "./GuestbookForm";
import type { Drawing } from "./guestbookSchema";

vi.mock("./DoodleCanvas", () => ({
  DoodleCanvas: ({ drawing, onChange }: { drawing: Drawing; onChange: (value: Drawing) => void }) => (
    <button type="button" onClick={() => onChange({
      ...drawing,
      commands: [{ type: "stamp", stamp: "heart", color: "#111827", size: 24, point: { x: 0.5, y: 0.5 } }],
    })}>Draw ({drawing.commands.length})</button>
  ),
}));

afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

function prepareForm() {
  const onSubmitted = vi.fn();
  render(<GuestbookForm onSubmitted={onSubmitted} />);
  fireEvent.change(screen.getByRole("textbox", { name: /Display name/ }), { target: { value: "Ada" } });
  fireEvent.click(screen.getByRole("button", { name: "Draw (0)" }));
  const form = screen.getByRole("button", { name: "Put it on the wall" }).closest("form");
  if (!form) throw new Error("Guestbook form not found");
  return { form, onSubmitted };
}

describe("guestbook submission resilience", () => {
  it("keeps the doodle and name on network failure", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Offline")));
    const { form, onSubmitted } = prepareForm();
    fireEvent.submit(form);
    await screen.findByText(/That did not send/);
    expect((screen.getByRole("textbox", { name: /Display name/ }) as HTMLInputElement).value).toBe("Ada");
    expect(screen.getByRole("button", { name: "Draw (1)" })).toBeTruthy();
    expect(onSubmitted).not.toHaveBeenCalled();
  });

  it("shows a recoverable error when browser storage is blocked", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("Storage disabled", "SecurityError");
    });
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const { form } = prepareForm();
    fireEvent.submit(form);
    await screen.findByText(/Browser storage is blocked/);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Draw (1)" })).toBeTruthy();
  });

  it("sends only once during repeated submissions and clears after acceptance", async () => {
    let resolveResponse: (response: Response) => void = () => { throw new Error("Request not started"); };
    const fetchMock = vi.fn().mockImplementation(() => new Promise<Response>((resolve) => { resolveResponse = resolve; }));
    vi.stubGlobal("fetch", fetchMock);
    const { form, onSubmitted } = prepareForm();
    fireEvent.submit(form);
    fireEvent.submit(form);
    expect(fetchMock).toHaveBeenCalledOnce();
    resolveResponse(new Response(null, { status: 200 }));
    await waitFor(() => expect(onSubmitted).toHaveBeenCalledOnce());
    expect(screen.getByRole("button", { name: "Draw (0)" })).toBeTruthy();
    expect(screen.getByText(/Received for checks/)).toBeTruthy();
  });
});
