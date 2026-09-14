import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DRAWING_VERSION } from "../../src/components/guestbook/guestbookSchema";
import submissionCreated from "../../netlify/functions/submission-created";
import { stubEnvironment } from "./environment";

const invoke = (event: { body: string; headers?: Record<string, string> }) =>
  submissionCreated(new Request("https://example.test/.netlify/functions/submission-created", {
    method: "POST",
    body: event.body,
    headers: event.headers,
  }));

const visitorId = "f4f669e6-b66a-4b09-842e-b437f7f64b52";
const drawing = {
  version: DRAWING_VERSION,
  background: "#fffdf7",
  commands: [{
    type: "path",
    mode: "pen",
    color: "#111827",
    size: 4,
    points: [{ x: 0.2, y: 0.3 }],
  }],
};

describe("Netlify submission event", () => {
  beforeEach(() => {
    stubEnvironment();
    vi.restoreAllMocks();
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "info").mockImplementation(() => {});
  });
  afterEach(() => vi.unstubAllGlobals());

  it("validates and mirrors a guestbook entry", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ status: "created" }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const response = await invoke({
      body: JSON.stringify({
        payload: {
          id: "submission-1",
          form_name: "guestbook-entry",
          data: { name: "Ada", message: "Hello", drawing: JSON.stringify(drawing), visitorId },
        },
      }),
      headers: {},
    });

    expect(response.status).toBe(204);
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock.mock.calls[0][0]).toContain("create_guestbook_entry");
  });

  it("rejects disallowed drawing content before persistence", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const unsafeDrawing = {
      ...drawing,
      commands: [{ ...drawing.commands[0], color: "url(javascript:alert(1))" }],
    };

    const response = await invoke({
      body: JSON.stringify({
        payload: {
          id: "submission-2",
          form_name: "guestbook-entry",
          data: { name: "Ada", drawing: JSON.stringify(unsafeDrawing), visitorId },
        },
      }),
      headers: {},
    });

    expect(response.status).toBe(422);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects a missing submission id", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const response = await invoke({ body: JSON.stringify({ payload: {
      form_name: "guestbook-entry",
      data: { name: "Ada", drawing: JSON.stringify(drawing), visitorId },
    } }) });
    expect(response.status).toBe(422);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("does not log malformed drawing content", async () => {
    const response = await invoke({ body: JSON.stringify({ payload: {
      id: "submission-invalid-json",
      form_name: "guestbook-entry",
      data: { name: "Ada", drawing: '{"private-message":', visitorId },
    } }) });
    expect(response.status).toBe(422);
    expect(console.warn).toHaveBeenCalledWith("Guestbook submission rejected", {
      submissionId: "submission-invalid-json",
      reason: "Invalid JSON",
    });
    expect(JSON.stringify(vi.mocked(console.warn).mock.calls)).not.toContain("private-message");
  });

  it.each(["created", "duplicate", "rate_limited"])("records the %s entry outcome", async (status) => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json({ status })));
    const response = await invoke({ body: JSON.stringify({ payload: {
      id: "submission-outcome",
      form_name: "guestbook-entry",
      data: { name: "Ada", drawing: JSON.stringify(drawing), visitorId },
    } }) });
    expect(response.status).toBe(204);
    expect(status === "rate_limited" ? console.warn : console.info).toHaveBeenCalledWith(
      expect.any(String), { submissionId: "submission-outcome", status }
    );
  });

  it("reports infrastructure failure separately from invalid submissions", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network unavailable")));
    const response = await invoke({ body: JSON.stringify({ payload: {
      id: "submission-failure",
      form_name: "guestbook-entry",
      data: { name: "Ada", drawing: JSON.stringify(drawing), visitorId },
    } }) });
    expect(response.status).toBe(503);
    expect(console.error).toHaveBeenCalled();
  });

  it("keeps report identity stable across event delivery IP addresses", async () => {
    const fetchMock = vi.fn().mockImplementation(() => Promise.resolve(Response.json({ status: "created" })));
    vi.stubGlobal("fetch", fetchMock);
    const body = JSON.stringify({ payload: {
      id: "report-1",
      form_name: "guestbook-report",
      data: { entryId: visitorId, visitorId, reason: "spam" },
    } });
    await invoke({ body, headers: { "x-nf-client-connection-ip": "192.0.2.1" } });
    await invoke({ body, headers: { "x-nf-client-connection-ip": "192.0.2.2" } });
    const first = JSON.parse(fetchMock.mock.calls[0][1].body);
    const second = JSON.parse(fetchMock.mock.calls[1][1].body);
    expect(first.p_reporter_hash).toHaveLength(64);
    expect(first.p_reporter_hash).not.toBe(visitorId);
    expect(first.p_reporter_hash).toBe(second.p_reporter_hash);
  });
});