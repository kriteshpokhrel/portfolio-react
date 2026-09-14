// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DoodleCanvas } from "./DoodleCanvas";
import { emptyDrawing } from "./drawing";
import { MAX_COMMANDS, type DrawingCommand } from "./guestbookSchema";

beforeEach(() => {
  vi.stubGlobal("ResizeObserver", class { observe() {} disconnect() {} });
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
  vi.spyOn(HTMLCanvasElement.prototype, "getBoundingClientRect").mockReturnValue(new DOMRect(0, 0, 400, 300));
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("drawing detail limits", () => {
  it.each([MAX_COMMANDS - 1, MAX_COMMANDS])("handles a drawing with %i existing commands", (count) => {
    const command: DrawingCommand = {
      type: "stamp", stamp: "heart", color: "#111827", size: 24, point: { x: 0.5, y: 0.5 },
    };
    const onChange = vi.fn();
    render(<DoodleCanvas drawing={{ ...emptyDrawing(), commands: Array.from({ length: count }, () => command) }} onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Stamp" }));
    const canvas = screen.getByLabelText("Doodle canvas");
    Object.defineProperty(canvas, "setPointerCapture", { value: vi.fn() });
    vi.stubGlobal("PointerEvent", MouseEvent);
    fireEvent.pointerDown(canvas, { clientX: 200, clientY: 150 });
    if (count === MAX_COMMANDS) {
      expect(onChange).not.toHaveBeenCalled();
      expect(screen.getByText(/last mark was not added/)).toBeTruthy();
    } else {
      expect(onChange).toHaveBeenCalledOnce();
      expect(onChange.mock.calls[0][0].commands).toHaveLength(MAX_COMMANDS);
    }
  });
});
