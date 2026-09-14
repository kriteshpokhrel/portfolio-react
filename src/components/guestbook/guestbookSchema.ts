import { z } from "zod";

export const GUESTBOOK_FORM_NAME = "guestbook-entry";
export const GUESTBOOK_REPORT_FORM_NAME = "guestbook-report";
export const DRAWING_VERSION = 1;
export const MAX_DRAWING_BYTES = 96_000;
export const MAX_COMMANDS = 160;
export const MAX_PATH_POINTS = 1_500;
export const MAX_TOTAL_POINTS = 6_000;

export const drawingColors = [
  "#111827",
  "#dc2626",
  "#ea580c",
  "#ca8a04",
  "#16a34a",
  "#0284c7",
  "#4f46e5",
  "#9333ea",
] as const;

export const stampNames = ["heart", "sparkle", "star", "smile"] as const;
export const reportReasons = ["spam", "offensive", "personal-info", "other"] as const;

const pointSchema = z.object({
  x: z.number().min(0).max(1),
  y: z.number().min(0).max(1),
});

const styleSchema = z.object({
  color: z.enum(drawingColors),
  size: z.number().min(1).max(32),
});

const pathCommandSchema = styleSchema.extend({
  type: z.literal("path"),
  mode: z.enum(["pen", "eraser"]),
  points: z.array(pointSchema).min(1).max(MAX_PATH_POINTS),
});

const shapeCommandSchema = styleSchema.extend({
  type: z.literal("shape"),
  shape: z.enum(["line", "rectangle", "circle"]),
  start: pointSchema,
  end: pointSchema,
});

const stampCommandSchema = z.object({
  type: z.literal("stamp"),
  stamp: z.enum(stampNames),
  color: z.enum(drawingColors),
  size: z.number().min(12).max(72),
  point: pointSchema,
});

export const drawingCommandSchema = z.discriminatedUnion("type", [
  pathCommandSchema,
  shapeCommandSchema,
  stampCommandSchema,
]);

export const drawingSchema = z
  .object({
    version: z.literal(DRAWING_VERSION),
    background: z.literal("#fffdf7"),
    commands: z.array(drawingCommandSchema).min(1).max(MAX_COMMANDS),
  })
  .superRefine((drawing, context) => {
    const pointCount = drawing.commands.reduce((total, command) => {
      return total + (command.type === "path" ? command.points.length : 2);
    }, 0);

    if (pointCount > MAX_TOTAL_POINTS) {
      context.addIssue({
        code: "custom",
        message: `Drawing exceeds ${MAX_TOTAL_POINTS} points`,
        path: ["commands"],
      });
    }

    if (new TextEncoder().encode(JSON.stringify(drawing)).length > MAX_DRAWING_BYTES) {
      context.addIssue({
        code: "custom",
        message: `Drawing exceeds ${MAX_DRAWING_BYTES} bytes`,
      });
    }
  });

export const guestbookSubmissionSchema = z.object({
  name: z.string().trim().min(1).max(40),
  message: z.string().trim().max(180).default(""),
  drawing: drawingSchema,
  visitorId: z.string().uuid(),
  website: z.string().max(0).optional().default(""),
});

export const guestbookReportSchema = z.object({
  entryId: z.string().uuid(),
  reason: z.enum(reportReasons),
  details: z.string().trim().max(160).default(""),
  visitorId: z.string().uuid(),
  website: z.string().max(0).optional().default(""),
});

export const publicGuestbookEntrySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  message: z.string(),
  drawing: drawingSchema,
  createdAt: z.string().datetime({ offset: true }),
});

export const guestbookPageSchema = z.object({
  entries: z.array(publicGuestbookEntrySchema),
  nextCursor: z.string().nullable(),
});

export type Drawing = z.infer<typeof drawingSchema>;
export type DrawingCommand = z.infer<typeof drawingCommandSchema>;
export type DrawingPoint = z.infer<typeof pointSchema>;
export type GuestbookSubmission = z.infer<typeof guestbookSubmissionSchema>;
export type PublicGuestbookEntry = z.infer<typeof publicGuestbookEntrySchema>;