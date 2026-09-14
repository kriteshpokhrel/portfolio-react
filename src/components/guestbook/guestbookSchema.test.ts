import { describe, expect, it } from "vitest";
import {
  DRAWING_VERSION,
  MAX_DRAWING_BYTES,
  drawingSchema,
  guestbookReportSchema,
  guestbookSubmissionSchema,
} from "./guestbookSchema";

const drawing = {
  version: DRAWING_VERSION,
  background: "#fffdf7" as const,
  commands: [
    {
      type: "path" as const,
      mode: "pen" as const,
      color: "#111827" as const,
      size: 4,
      points: [
        { x: 0.1, y: 0.2 },
        { x: 0.4, y: 0.6 },
      ],
    },
  ],
};
const visitorId = "f4f669e6-b66a-4b09-842e-b437f7f64b52";

describe("guestbook schemas", () => {
  it("accepts a valid normalized drawing submission", () => {
    const parsed = guestbookSubmissionSchema.parse({
      name: "  Ada  ",
      message: "Hello",
      drawing,
      visitorId,
    });

    expect(parsed.name).toBe("Ada");
  });

  it("rejects coordinates outside the normalized canvas", () => {
    const invalid = structuredClone(drawing);
    invalid.commands[0].points[0].x = 1.1;

    expect(drawingSchema.safeParse(invalid).success).toBe(false);
  });

  it("rejects unknown colors and blank drawings", () => {
    expect(
      drawingSchema.safeParse({ ...drawing, commands: [] }).success
    ).toBe(false);
    expect(
      drawingSchema.safeParse({
        ...drawing,
        commands: [{ ...drawing.commands[0], color: "url(javascript:alert(1))" }],
      }).success
    ).toBe(false);
  });

  it("rejects honeypot content and invalid report identifiers", () => {
    expect(
      guestbookSubmissionSchema.safeParse({
        name: "Ada",
        drawing,
        visitorId,
        website: "bot",
      })
        .success
    ).toBe(false);
    expect(
      guestbookReportSchema.safeParse({
        entryId: "nope",
        reason: "spam",
        visitorId,
      }).success
    ).toBe(false);
  });

  it("enforces the total point boundary", () => {
    const commands = Array.from({ length: 4 }, () => ({
      ...drawing.commands[0],
      points: Array.from({ length: 1500 }, () => ({ x: 0, y: 0 })),
    }));
    expect(drawingSchema.safeParse({ ...drawing, commands }).success).toBe(true);
    commands.push({ ...drawing.commands[0], points: [{ x: 0, y: 0 }] });
    expect(drawingSchema.safeParse({ ...drawing, commands }).success).toBe(false);
  });

  it("rejects oversized drawings even within the point limit", () => {
    const large = {
      ...drawing,
      commands: Array.from({ length: 2 }, () => ({
        ...drawing.commands[0],
        points: Array.from({ length: 1500 }, () => ({ x: 0.1234567890123456, y: 0.9876543210987654 })),
      })),
    };
    expect(new TextEncoder().encode(JSON.stringify(large)).length).toBeGreaterThan(MAX_DRAWING_BYTES);
    expect(drawingSchema.safeParse(large).success).toBe(false);
  });
});