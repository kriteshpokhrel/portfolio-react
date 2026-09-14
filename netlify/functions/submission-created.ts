import type {} from "@netlify/functions";
import { z } from "zod";
import {
  GUESTBOOK_FORM_NAME,
  GUESTBOOK_REPORT_FORM_NAME,
  guestbookReportSchema,
  guestbookSubmissionSchema,
} from "../../src/components/guestbook/guestbookSchema";
import { callSupabaseRpc, hashVisitor } from "../lib/guestbook";

const eventSchema = z.object({
  payload: z.object({
    id: z.string().min(1),
    form_name: z.string().min(1),
    data: z.record(z.string(), z.unknown()),
  }),
});

const resultSchema = z.object({
  status: z.enum(["created", "duplicate", "rate_limited", "not_found"]),
});

export default async function submissionCreated(request: Request) {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: { Allow: "POST" } });
  }

  let rpcName: string;
  let parameters: Record<string, unknown>;
  let submissionId: string | undefined;
  try {
    const { payload } = eventSchema.parse(await request.json());
    const { data } = payload;
    submissionId = payload.id;

    if (payload.form_name === GUESTBOOK_FORM_NAME) {
      const submission = guestbookSubmissionSchema.parse({
        name: data.name,
        message: data.message ?? "",
        drawing: JSON.parse(z.string().parse(data.drawing)),
        visitorId: data.visitorId,
        website: data.website ?? "",
      });

      rpcName = "create_guestbook_entry";
      parameters = {
        p_form_submission_id: payload.id,
        p_name: submission.name,
        p_message: submission.message,
        p_drawing: submission.drawing,
        p_visitor_hash: submission.visitorId,
      };
    } else if (payload.form_name === GUESTBOOK_REPORT_FORM_NAME) {
      const report = guestbookReportSchema.parse({
        entryId: data.entryId,
        reason: data.reason,
        details: data.details ?? "",
        visitorId: data.visitorId,
        website: data.website ?? "",
      });

      rpcName = "report_guestbook_entry";
      parameters = {
        p_entry_id: report.entryId,
        p_reporter_hash: report.visitorId,
        p_reason: report.reason,
        p_details: report.details,
      };
    } else {
      return new Response(null, { status: 204 });
    }
  } catch (error) {
    console.warn("Guestbook submission rejected", {
      submissionId,
      reason: error instanceof z.ZodError
        ? error.issues.map(({ code, path }) => ({ code, path }))
        : "Invalid JSON",
    });
    return new Response("Submission could not be processed", { status: 422 });
  }

  try {
    const hashField = rpcName === "create_guestbook_entry" ? "p_visitor_hash" : "p_reporter_hash";
    parameters[hashField] = hashVisitor(z.string().parse(parameters[hashField]));
    const result = resultSchema.parse(await callSupabaseRpc(rpcName, parameters));
    if (result.status === "rate_limited" || result.status === "not_found") {
      console.warn("Guestbook submission not published", { submissionId, status: result.status });
    } else {
      console.info("Guestbook submission processed", { submissionId, status: result.status });
    }
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Guestbook persistence failed", { submissionId, error });
    return new Response("Guestbook persistence is temporarily unavailable", { status: 503 });
  }
}