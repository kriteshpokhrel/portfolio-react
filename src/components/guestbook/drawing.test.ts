import { describe, expect, it, vi } from "vitest";
import { drawingHistoryReducer, emptyDrawing, isDrawingBlank, renderDrawing } from "./drawing";
import type { DrawingCommand } from "./guestbookSchema";

const command: DrawingCommand = {
  type: "path",
  mode: "pen",
  color: "#111827",
  size: 4,
  points: [{ x: 0.5, y: 0.5 }],
};

describe("drawing history", () => {
  it("commits, undoes, and redoes without mutating history", () => {
    const initial = { commands: [], future: [] };
    const committed = drawingHistoryReducer(initial, { type: "commit", command });
    const undone = drawingHistoryReducer(committed, { type: "undo" });
    const redone = drawingHistoryReducer(undone, { type: "redo" });

    expect(initial.commands).toHaveLength(0);
    expect(undone.commands).toHaveLength(0);
    expect(redone.commands).toEqual([command]);
  });

  it("clears and restores the drawing with redo", () => {
    const cleared = drawingHistoryReducer({ commands: [command], future: [] }, { type: "clear" });
    expect(cleared.commands).toHaveLength(0);
    expect(drawingHistoryReducer(cleared, { type: "redo" }).commands).toEqual([command]);
  });

  it("identifies an empty command list as blank", () => {
    expect(isDrawingBlank(emptyDrawing())).toBe(true);
    expect(isDrawingBlank({ ...emptyDrawing(), commands: [command] })).toBe(false);
  });

  it("renders the sparkle stamp as three drawn sparkles instead of a text glyph", () => {
    const context = {
      beginPath: vi.fn(),
      clearRect: vi.fn(),
      closePath: vi.fn(),
      fill: vi.fn(),
      fillRect: vi.fn(),
      fillText: vi.fn(),
      lineTo: vi.fn(),
      moveTo: vi.fn(),
    } as unknown as CanvasRenderingContext2D;

    renderDrawing(context, {
      ...emptyDrawing(),
      commands: [{
        type: "stamp",
        stamp: "sparkle",
        color: "#111827",
        size: 36,
        point: { x: 0.5, y: 0.5 },
      }],
    }, 400, 300);

    expect(context.fill).toHaveBeenCalledTimes(3);
    expect(context.fillText).not.toHaveBeenCalled();
  });
});