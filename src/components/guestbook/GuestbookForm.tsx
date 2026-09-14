import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DoodleCanvas } from "./DoodleCanvas";
import { emptyDrawing, isDrawingBlank } from "./drawing";
import {
  GUESTBOOK_FORM_NAME,
  guestbookSubmissionSchema,
  type Drawing,
} from "./guestbookSchema";
import { getVisitorId, submitNetlifyForm } from "./visitor";

type GuestbookFormProps = {
  onSubmitted: () => void;
  onDirtyChange?: (isDirty: boolean) => void;
  onSendingChange?: (isSending: boolean) => void;
};

export function GuestbookForm({
  onSubmitted,
  onDirtyChange,
  onSendingChange,
}: GuestbookFormProps) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [drawing, setDrawing] = useState<Drawing>(emptyDrawing);
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");
  const sendingRef = useRef(false);

  useEffect(() => {
    onDirtyChange?.(Boolean(name || message || drawing.commands.length));
  }, [drawing.commands.length, message, name, onDirtyChange]);

  useEffect(() => {
    onSendingChange?.(status === "sending");
  }, [onSendingChange, status]);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sendingRef.current) return;
    if (isDrawingBlank(drawing)) {
      setStatus("error");
      setFeedback("Give the canvas at least one tiny scribble first.");
      return;
    }

    try {
      const visitorId = getVisitorId();
      const parsed = guestbookSubmissionSchema.safeParse({
        name,
        message,
        drawing,
        visitorId,
        website,
      });
      if (!parsed.success) {
        setStatus("error");
        setFeedback("Something needs a quick check. Take a look at your name, note, and doodle.");
        return;
      }

      sendingRef.current = true;
      setStatus("sending");
      setFeedback("");
      await submitNetlifyForm({
        "form-name": GUESTBOOK_FORM_NAME,
        name: parsed.data.name,
        message: parsed.data.message,
        drawing: JSON.stringify(parsed.data.drawing),
        visitorId,
        website,
      });
      setName("");
      setMessage("");
      setDrawing(emptyDrawing());
      setStatus("success");
      setFeedback("Received for checks. Accepted doodles may take a few minutes to appear.");
      onSubmitted();
    } catch (error) {
      setStatus("error");
      setFeedback(
        error instanceof DOMException && error.name === "SecurityError"
          ? "Browser storage is blocked. Allow site storage and try again; your doodle is still here."
          : navigator.onLine
          ? "That did not send, but your doodle is still here. Give it another go."
          : "Looks like you are offline. Your doodle will stay right here until you reconnect."
      );
    } finally {
      sendingRef.current = false;
    }
  };

  return (
    <form
      name={GUESTBOOK_FORM_NAME}
      data-netlify="true"
      data-netlify-honeypot="website"
      onSubmit={submit}
      className="grid gap-4 p-4 text-gray-100 sm:p-5 md:grid-cols-[minmax(0,1.2fr)_minmax(17rem,0.8fr)] md:gap-5"
    >
      <input type="hidden" name="form-name" value={GUESTBOOK_FORM_NAME} />
      <p className="hidden">
        <label>
          Do not fill this out: <input name="website" value={website} onChange={(event) => setWebsite(event.target.value)} tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      <DoodleCanvas drawing={drawing} onChange={setDrawing} disabled={status === "sending"} />

      <div className="flex min-w-0 flex-col rounded-md border border-white/10 bg-[#151515] p-4 shadow-lg shadow-black/10">
        <p className="mb-4 text-sm leading-6 text-gray-400">
          Sign your doodle and add a note if you feel like it. Everyone who visits can see it.
        </p>
        <label className="block">
          <span className="mb-1.5 flex justify-between text-sm font-medium text-gray-300">
            Display name <span className="font-normal text-gray-500">{name.length}/40</span>
          </span>
          <input
            required
            maxLength={40}
            value={name}
            disabled={status === "sending"}
            onChange={(event) => setName(event.target.value)}
            className="h-10 w-full rounded-md border border-white/10 bg-black/40 px-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
            placeholder="Name or nickname"
          />
        </label>
        <label className="mt-4 block">
          <span className="mb-1.5 flex justify-between text-sm font-medium text-gray-300">
            Short note <span className="font-normal text-gray-500">{message.length}/180</span>
          </span>
          <textarea
            maxLength={180}
            rows={4}
            value={message}
            disabled={status === "sending"}
            onChange={(event) => setMessage(event.target.value)}
            className="w-full resize-none rounded-md border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
            placeholder="Optional, but welcome"
          />
        </label>

        <p className={`mt-4 min-h-10 text-xs leading-5 ${status === "error" ? "text-red-400" : "text-gray-500"}`} role="status" aria-live="polite">
          {feedback || "No signup. Up to three doodles per ten minutes; entries are checked before publishing."}
        </p>
        <button
          type="submit"
          disabled={status === "sending"}
          className="mt-auto inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-white px-4 text-sm font-semibold text-gray-950 transition hover:bg-cyan-300 disabled:cursor-wait disabled:opacity-60"
        >
          <Send size={16} aria-hidden="true" />
          {status === "sending" ? "Sending..." : "Put it on the wall"}
        </button>
      </div>
    </form>
  );
}