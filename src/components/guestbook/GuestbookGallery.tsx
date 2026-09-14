import { Flag, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { GuestbookCard } from "./GuestbookCard";
import { fetchGuestbookPage } from "./guestbookApi";
import {
  GUESTBOOK_REPORT_FORM_NAME,
  guestbookReportSchema,
  reportReasons,
  type PublicGuestbookEntry,
} from "./guestbookSchema";
import { getVisitorId, submitNetlifyForm } from "./visitor";

type GuestbookGalleryProps = {
  refreshSignal: number;
};

const reasonLabels: Record<(typeof reportReasons)[number], string> = {
  spam: "Spam",
  offensive: "Offensive content",
  "personal-info": "Personal information",
  other: "Something else",
};

export function GuestbookGallery({ refreshSignal }: GuestbookGalleryProps) {
  const [entries, setEntries] = useState<PublicGuestbookEntry[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [reporting, setReporting] = useState<PublicGuestbookEntry | null>(null);
  const [reportReason, setReportReason] = useState<(typeof reportReasons)[number]>("spam");
  const [reportDetails, setReportDetails] = useState("");
  const [reportStatus, setReportStatus] = useState<"idle" | "sending" | "error">("idle");
  const [loadingMore, setLoadingMore] = useState(false);
  const requestRef = useRef<AbortController | null>(null);
  const loadingMoreRef = useRef(false);
  const reportingRef = useRef(false);

  const load = useCallback(async (cursor: string | null = null, append = false) => {
    if (append && loadingMoreRef.current) return;
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    loadingMoreRef.current = append;
    setLoadingMore(append);
    if (!append) setStatus("loading");
    try {
      const page = await fetchGuestbookPage({ limit: 12, cursor, signal: controller.signal });
      if (controller.signal.aborted) return;
      setEntries((current) => append ? [...current, ...page.entries] : page.entries);
      setNextCursor(page.nextCursor);
      setStatus("ready");
    } catch {
      if (controller.signal.aborted) return;
      setStatus("error");
    } finally {
      if (!controller.signal.aborted) {
        loadingMoreRef.current = false;
        setLoadingMore(false);
      }
    }
  }, []);

  useEffect(() => {
    const delay = refreshSignal > 0 ? window.setTimeout(() => load(), 1800) : 0;
    if (refreshSignal === 0) void load();
    return () => {
      window.clearTimeout(delay);
      requestRef.current?.abort();
    };
  }, [load, refreshSignal]);

  const submitReport = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!reporting || reportingRef.current) return;
    try {
      const visitorId = getVisitorId();
      const parsed = guestbookReportSchema.safeParse({
        entryId: reporting.id,
        reason: reportReason,
        details: reportDetails,
        visitorId,
        website: "",
      });
      if (!parsed.success) {
        setReportStatus("error");
        return;
      }

      reportingRef.current = true;
      setReportStatus("sending");
      await submitNetlifyForm({
        "form-name": GUESTBOOK_REPORT_FORM_NAME,
        entryId: parsed.data.entryId,
        reason: parsed.data.reason,
        details: parsed.data.details,
        visitorId,
        website: "",
      });
      setEntries((current) => current.filter((entry) => entry.id !== reporting.id));
      setReporting(null);
      setReportDetails("");
      setReportStatus("idle");
    } catch {
      setReportStatus("error");
    } finally {
      reportingRef.current = false;
    }
  };

  return (
    <section aria-labelledby="guestbook-wall-heading" className="py-10 sm:py-12">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 id="guestbook-wall-heading" className="text-xl font-semibold text-white">The whole wall</h2>
          <p className="mt-1 text-sm text-gray-500">Fresh ones first</p>
        </div>
      </div>

      {status === "loading" && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label="Loading guestbook entries">
          {Array.from({ length: 6 }).map((_, index) => <div key={index} className="aspect-[4/3] animate-pulse rounded-md border border-white/5 bg-[#151515]" />)}
        </div>
      )}

      {status === "error" && (
        <div className="rounded-md border border-white/10 bg-[#151515] py-10 text-center">
          <p className="text-gray-300">{navigator.onLine ? "The wall could not be loaded right now." : "You are offline. The wall will be here when you reconnect."}</p>
          <button type="button" onClick={() => void load()} className="mt-4 rounded-md border border-white/15 px-4 py-2 font-semibold text-white transition hover:border-blue-400 hover:text-blue-300">Try again</button>
        </div>
      )}

      {status === "ready" && entries.length === 0 && (
        <div className="rounded-md border border-dashed border-white/15 py-12 text-center">
          <p className="text-gray-300">Nothing here yet. Someone has to go first.</p>
        </div>
      )}

      {entries.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map((entry) => <GuestbookCard key={entry.id} entry={entry} onReport={setReporting} />)}
        </div>
      )}

      {nextCursor && status === "ready" && (
        <div className="mt-10 text-center">
          <button type="button" disabled={loadingMore} onClick={() => void load(nextCursor, true)} className="h-10 rounded-md border border-white/15 px-4 text-sm font-semibold text-gray-200 transition hover:border-blue-400 hover:text-white disabled:opacity-60">{loadingMore ? "Loading..." : "Load more"}</button>
        </div>
      )}

      {reporting && (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-black/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="report-title">
          <form onSubmit={submitReport} className="w-full max-w-sm rounded-md border border-white/10 bg-[#151515] p-5 shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-red-400"><Flag size={18} aria-hidden="true" /><h2 id="report-title" className="font-semibold text-white">Report this mark</h2></div>
              <button type="button" disabled={reportStatus === "sending"} onClick={() => setReporting(null)} className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-400 hover:bg-white/5 hover:text-white disabled:opacity-60" aria-label="Close report dialog"><X size={18} /></button>
            </div>
            <label className="mt-5 block text-sm font-medium text-gray-300">
              Reason
              <select value={reportReason} onChange={(event) => setReportReason(event.target.value as typeof reportReason)} className="mt-2 h-11 w-full rounded-md border border-white/15 bg-black px-3 text-white outline-none focus:border-blue-500">
                {reportReasons.map((reason) => <option key={reason} value={reason}>{reasonLabels[reason]}</option>)}
              </select>
            </label>
            <label className="mt-4 block text-sm font-medium text-gray-300">
              Details <span className="font-normal text-gray-500">(optional)</span>
              <textarea maxLength={160} rows={3} value={reportDetails} onChange={(event) => setReportDetails(event.target.value)} className="mt-2 w-full resize-none rounded-md border border-white/15 bg-black p-3 text-white outline-none focus:border-blue-500" />
            </label>
            {reportStatus === "error" && <p className="mt-3 text-sm text-red-400" role="alert">The report could not be sent. Please try again.</p>}
            <div className="mt-5 flex justify-end gap-3">
              <button type="button" disabled={reportStatus === "sending"} onClick={() => setReporting(null)} className="rounded-md px-4 py-2 text-gray-300 hover:text-white disabled:opacity-60">Cancel</button>
              <button type="submit" disabled={reportStatus === "sending"} className="rounded-md bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-500 disabled:opacity-60">{reportStatus === "sending" ? "Sending..." : "Send report"}</button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}