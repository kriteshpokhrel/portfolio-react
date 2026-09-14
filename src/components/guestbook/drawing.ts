import {
  DRAWING_VERSION,
  type Drawing,
  type DrawingCommand,
  type DrawingPoint,
} from "./guestbookSchema";

export type DrawingHistory = {
  commands: DrawingCommand[];
  future: DrawingCommand[];
};

export type DrawingAction =
  | { type: "commit"; command: DrawingCommand }
  | { type: "undo" }
  | { type: "redo" }
  | { type: "clear" }
  | { type: "replace"; commands: DrawingCommand[] };

export const emptyDrawing = (): Drawing => ({
  version: DRAWING_VERSION,
  background: "#fffdf7",
  commands: [],
});

export function drawingHistoryReducer(
  state: DrawingHistory,
  action: DrawingAction
): DrawingHistory {
  switch (action.type) {
    case "commit":
      return { commands: [...state.commands, action.command], future: [] };
    case "undo": {
      const command = state.commands[state.commands.length - 1];
      if (!command) return state;
      return {
        commands: state.commands.slice(0, -1),
        future: [command, ...state.future],
      };
    }
    case "redo": {
      const [command, ...future] = state.future;
      if (!command) return state;
      return { commands: [...state.commands, command], future };
    }
    case "clear":
      return { commands: [], future: state.commands };
    case "replace":
      return { commands: action.commands, future: [] };
  }
}

function denormalize(point: DrawingPoint, width: number, height: number) {
  return { x: point.x * width, y: point.y * height };
}

function drawPath(
  context: CanvasRenderingContext2D,
  command: Extract<DrawingCommand, { type: "path" }>,
  width: number,
  height: number,
  background: string
) {
  const points = command.points.map((point) => denormalize(point, width, height));
  context.beginPath();
  context.strokeStyle = command.mode === "eraser" ? background : command.color;
  context.lineWidth = command.size;
  context.lineCap = "round";
  context.lineJoin = "round";
  context.moveTo(points[0].x, points[0].y);
  if (points.length === 1) context.lineTo(points[0].x + 0.01, points[0].y);
  points.slice(1).forEach((point) => context.lineTo(point.x, point.y));
  context.stroke();
}

function drawShape(
  context: CanvasRenderingContext2D,
  command: Extract<DrawingCommand, { type: "shape" }>,
  width: number,
  height: number
) {
  const start = denormalize(command.start, width, height);
  const end = denormalize(command.end, width, height);
  context.beginPath();
  context.strokeStyle = command.color;
  context.lineWidth = command.size;
  context.lineCap = "round";
  context.lineJoin = "round";

  if (command.shape === "line") {
    context.moveTo(start.x, start.y);
    context.lineTo(end.x, end.y);
  } else if (command.shape === "rectangle") {
    context.rect(start.x, start.y, end.x - start.x, end.y - start.y);
  } else {
    const centerX = (start.x + end.x) / 2;
    const centerY = (start.y + end.y) / 2;
    context.ellipse(
      centerX,
      centerY,
      Math.abs(end.x - start.x) / 2,
      Math.abs(end.y - start.y) / 2,
      0,
      0,
      Math.PI * 2
    );
  }
  context.stroke();
}

function drawStamp(
  context: CanvasRenderingContext2D,
  command: Extract<DrawingCommand, { type: "stamp" }>,
  width: number,
  height: number
) {
  const point = denormalize(command.point, width, height);
  if (command.stamp === "sparkle") {
    const drawSparkle = (centerX: number, centerY: number, radius: number) => {
      const inset = radius * 0.22;
      context.beginPath();
      context.moveTo(centerX, centerY - radius);
      context.lineTo(centerX + inset, centerY - inset);
      context.lineTo(centerX + radius, centerY);
      context.lineTo(centerX + inset, centerY + inset);
      context.lineTo(centerX, centerY + radius);
      context.lineTo(centerX - inset, centerY + inset);
      context.lineTo(centerX - radius, centerY);
      context.lineTo(centerX - inset, centerY - inset);
      context.closePath();
      context.fill();
    };

    context.fillStyle = command.color;
    drawSparkle(point.x, point.y, command.size * 0.42);
    drawSparkle(point.x + command.size * 0.42, point.y - command.size * 0.36, command.size * 0.15);
    drawSparkle(point.x - command.size * 0.38, point.y + command.size * 0.34, command.size * 0.11);
    return;
  }

  const glyph = {
    heart: "♥",
    star: "★",
    smile: "☺",
  }[command.stamp];
  context.fillStyle = command.color;
  context.font = `${command.size}px "Space Grotesk", sans-serif`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(glyph, point.x, point.y);
}

export function renderDrawing(
  context: CanvasRenderingContext2D,
  drawing: Drawing,
  width: number,
  height: number,
  draft?: DrawingCommand | null
) {
  context.clearRect(0, 0, width, height);
  context.fillStyle = drawing.background;
  context.fillRect(0, 0, width, height);

  [...drawing.commands, ...(draft ? [draft] : [])].forEach((command) => {
    if (command.type === "path") {
      drawPath(context, command, width, height, drawing.background);
    } else if (command.type === "shape") {
      drawShape(context, command, width, height);
    } else {
      drawStamp(context, command, width, height);
    }
  });
}

export const isDrawingBlank = (drawing: Drawing) => drawing.commands.length === 0;