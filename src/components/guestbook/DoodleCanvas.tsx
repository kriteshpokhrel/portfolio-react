import {
  Circle,
  Download,
  Eraser,
  Heart,
  Minus,
  Pencil,
  Redo2,
  Smile,
  Sparkles,
  Square,
  Stamp,
  Star,
  Trash2,
  Undo2,
} from "lucide-react";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import {
  drawingColors,
  drawingSchema,
  MAX_PATH_POINTS,
  type Drawing,
  type DrawingCommand,
  type DrawingPoint,
  type stampNames,
} from "./guestbookSchema";
import { drawingHistoryReducer, renderDrawing } from "./drawing";

type Tool = "pen" | "eraser" | "line" | "rectangle" | "circle" | "stamp";
type StampName = (typeof stampNames)[number];

type DoodleCanvasProps = {
  drawing: Drawing;
  onChange: (drawing: Drawing) => void;
  disabled?: boolean;
};

const toolOptions = [
  { value: "pen" as const, label: "Pen", icon: Pencil },
  { value: "eraser" as const, label: "Eraser", icon: Eraser },
  { value: "line" as const, label: "Line", icon: Minus },
  { value: "rectangle" as const, label: "Rectangle", icon: Square },
  { value: "circle" as const, label: "Circle", icon: Circle },
  { value: "stamp" as const, label: "Stamp", icon: Stamp },
];

const stampOptions = [
  { value: "heart" as const, label: "Heart", icon: Heart },
  { value: "sparkle" as const, label: "Sparkle", icon: Sparkles },
  { value: "star" as const, label: "Star", icon: Star },
  { value: "smile" as const, label: "Smile", icon: Smile },
];

export function DoodleCanvas({ drawing, onChange, disabled = false }: DoodleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const draftRef = useRef<DrawingCommand | null>(null);
  const startRef = useRef<DrawingPoint | null>(null);
  const [tool, setTool] = useState<Tool>("pen");
  const [color, setColor] = useState<(typeof drawingColors)[number]>("#111827");
  const [size, setSize] = useState(4);
  const [stamp, setStamp] = useState<StampName>("heart");
  const [feedback, setFeedback] = useState("");
  const [history, dispatch] = useReducer(drawingHistoryReducer, {
    commands: drawing.commands,
    future: [],
  });

  useEffect(() => {
    if (drawing.commands.length === 0 && history.commands.length > 0) {
      dispatch({ type: "replace", commands: [] });
    }
  }, [drawing.commands.length, history.commands.length]);

  const redraw = useCallback((draft: DrawingCommand | null = draftRef.current) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    renderDrawing(context, { ...drawing, commands: history.commands }, canvas.width, canvas.height, draft);
  }, [drawing, history.commands]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(rect.width * ratio));
      canvas.height = Math.max(1, Math.round(rect.height * ratio));
      redraw();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    return () => observer.disconnect();
  }, [redraw]);

  const pointFromEvent = (event: React.PointerEvent<HTMLCanvasElement>): DrawingPoint => {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width)),
      y: Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height)),
    };
  };

  const applyHistory = (action: Parameters<typeof drawingHistoryReducer>[1]) => {
    const next = drawingHistoryReducer(history, action);
    if (next.commands.length && !drawingSchema.safeParse({ ...drawing, commands: next.commands }).success) {
      setFeedback("This doodle has reached its detail limit. The last mark was not added. Undo a few marks to make room.");
      return;
    }
    setFeedback("");
    dispatch(action);
    onChange({ ...drawing, commands: next.commands });
  };

  const commit = (command: DrawingCommand) => {
    applyHistory({ type: "commit", command });
    draftRef.current = null;
    redraw(null);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (disabled) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const point = pointFromEvent(event);
    startRef.current = point;

    if (tool === "stamp") {
      commit({ type: "stamp", stamp, color, size: Math.max(24, size * 3), point });
      return;
    }

    draftRef.current = tool === "pen" || tool === "eraser"
      ? { type: "path", mode: tool, color, size, points: [point] }
      : { type: "shape", shape: tool, color, size, start: point, end: point };
    redraw();
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!draftRef.current || !event.currentTarget.hasPointerCapture(event.pointerId)) return;
    const point = pointFromEvent(event);
    const current = draftRef.current;
    if (current.type === "path") {
      if (current.points.length >= MAX_PATH_POINTS) {
        setFeedback("This stroke is full. Lift your pointer to finish it, then start another.");
        return;
      }
      draftRef.current = { ...current, points: [...current.points, point] };
    } else if (current.type === "shape") {
      draftRef.current = { ...current, end: point };
    }
    redraw();
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    if (draftRef.current) commit(draftRef.current);
    startRef.current = null;
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "my-guestbook-doodle.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const iconButton = "inline-flex h-9 w-9 items-center justify-center border border-white/15 bg-white/10 text-gray-200 shadow-sm transition hover:border-blue-400/60 hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/[0.07] disabled:text-gray-400 disabled:shadow-none";

  return (
    <div className="min-w-0 space-y-3 rounded-md border border-white/10 bg-[#151515] p-3 shadow-lg shadow-black/10">
      <div className="grid gap-2.5 rounded-md border border-white/10 bg-black/40 p-2.5" aria-label="Drawing tools">
        <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex overflow-hidden rounded-md border border-white/10">
          {toolOptions.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              title={label}
              aria-label={label}
              aria-pressed={tool === value}
              disabled={disabled}
              onClick={() => setTool(value)}
              className={`${iconButton} border-0 border-r border-white/10 last:border-r-0 ${tool === value ? "bg-blue-500/20 text-blue-300" : ""}`}
            >
              <Icon size={16} aria-hidden="true" />
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-xs text-gray-400">
          <span className="sr-only">Brush size</span>
          <input
            type="range"
            min="1"
            max="24"
            value={size}
            disabled={disabled}
            onChange={(event) => setSize(Number(event.target.value))}
            className="w-24 accent-blue-500"
          />
        </label>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 border-t border-white/10 pt-2.5" aria-label="Ink color">
          {drawingColors.map((option) => (
            <button
              key={option}
              type="button"
              title={`Use ${option}`}
              aria-label={`Use color ${option}`}
              aria-pressed={color === option}
              disabled={disabled}
              onClick={() => setColor(option)}
              className={`h-6 w-6 rounded-full border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 ${color === option ? "border-white ring-2 ring-blue-500" : "border-white/25"}`}
              style={{ backgroundColor: option }}
            />
          ))}
        </div>
      </div>

      {tool === "stamp" && (
        <div className="flex items-center gap-1.5 rounded-md border border-white/10 bg-black/40 p-2" aria-label="Stamp choices">
          {stampOptions.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              title={label}
              aria-label={label}
              aria-pressed={stamp === value}
              onClick={() => setStamp(value)}
              className={`${iconButton} rounded-md ${stamp === value ? "bg-blue-500/20 text-blue-300" : ""}`}
            >
              <Icon size={16} aria-hidden="true" />
            </button>
          ))}
        </div>
      )}

      <div className="overflow-hidden rounded-md border border-white/20 bg-[#fffdf7] shadow-[0_12px_30px_rgba(0,0,0,0.24)]">
        <canvas
          ref={canvasRef}
          aria-label="Doodle canvas"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="block aspect-[16/10] max-h-[23rem] w-full cursor-crosshair touch-none sm:aspect-[4/3]"
        />
      </div>

      {feedback && <p className="text-sm text-amber-300" role="status">{feedback}</p>}

      <div className="flex items-center justify-between gap-3 rounded-md border border-white/10 bg-black/40 p-2 shadow-sm">
        <div className="flex gap-1.5">
          <button type="button" title="Undo" aria-label="Undo" disabled={disabled || history.commands.length === 0} onClick={() => applyHistory({ type: "undo" })} className={`${iconButton} rounded-md`}>
            <Undo2 size={16} aria-hidden="true" />
          </button>
          <button type="button" title="Redo" aria-label="Redo" disabled={disabled || history.future.length === 0} onClick={() => applyHistory({ type: "redo" })} className={`${iconButton} rounded-md`}>
            <Redo2 size={16} aria-hidden="true" />
          </button>
          <button
            type="button"
            title="Clear drawing"
            aria-label="Clear drawing"
            disabled={disabled || history.commands.length === 0}
            onClick={() => window.confirm("Clear the entire doodle?") && applyHistory({ type: "clear" })}
            className={`${iconButton} rounded-md hover:border-red-500/50 hover:text-red-400`}
          >
            <Trash2 size={16} aria-hidden="true" />
          </button>
        </div>
        <button type="button" onClick={download} disabled={history.commands.length === 0} className="inline-flex h-9 items-center gap-1.5 rounded-md border border-white/15 bg-white/10 px-3 text-xs font-medium text-gray-200 shadow-sm transition hover:border-blue-400/60 hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/[0.07] disabled:text-gray-400 disabled:shadow-none">
          <Download size={15} aria-hidden="true" />
          Download
        </button>
      </div>
    </div>
  );
}