import { ArrowLeft, Check, ExternalLink, PencilLine, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { GuestbookCarousel } from "./GuestbookCarousel";
import { GuestbookForm } from "./GuestbookForm";
import type { GuestbookLaunchMode } from "./guestbookModalState";

type GuestbookModalProps = {
  launchMode: GuestbookLaunchMode;
  refreshSignal: number;
  onClose: () => void;
  onSubmitted: () => void;
};

type GuestbookModalView = GuestbookLaunchMode | "success";

const focusableSelector = [
  "button:not([disabled])",
  "a[href]",
  "input:not([disabled]):not([type='hidden'])",
  "textarea:not([disabled])",
  "select:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export function GuestbookModal({ launchMode, refreshSignal, onClose, onSubmitted }: GuestbookModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const dirtyRef = useRef(false);
  const sendingRef = useRef(false);
  const submittedRef = useRef(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [view, setView] = useState<GuestbookModalView>(launchMode);

  dirtyRef.current = isDirty;
  sendingRef.current = isSending;
  submittedRef.current = view === "success";

  const requestClose = useCallback(() => {
    if (sendingRef.current) return;
    if (dirtyRef.current && !submittedRef.current && !window.confirm("Discard this doodle?")) return;
    onClose();
  }, [onClose]);

  useEffect(() => {
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        requestClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector)
      ).filter((element) => !element.closest("[hidden], .hidden"));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const focusIsOutsideControls = !focusable.some((element) => element === document.activeElement);
      if (event.shiftKey && (document.activeElement === first || focusIsOutsideControls)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || focusIsOutsideControls)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      const returnTarget = returnFocusRef.current;
      if (returnTarget && returnTarget.offsetParent !== null) {
        returnTarget.focus();
      } else {
        document.querySelector<HTMLElement>('button[aria-controls="mobile-menu"]')?.focus();
      }
    };
  }, [requestClose]);

  useEffect(() => {
    headingRef.current?.focus();
  }, [view]);

  const handleSubmitted = () => {
    setIsSending(false);
    setView("success");
    setIsDirty(false);
    onSubmitted();
  };

  const showPreview = () => {
    if (sendingRef.current) return;
    if (dirtyRef.current && !window.confirm("Discard this doodle?")) return;
    setIsDirty(false);
    setView("preview");
  };

  const title = view === "preview" ? "See what people left" : view === "editor" ? "Make your mark" : "Made it";
  const subtitle = view === "preview" ? "Tiny drawings from folks who stopped by." : view === "editor" ? "Grab a pen. Art skills are very optional." : "Thanks for leaving a little something behind.";

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-2 backdrop-blur-sm sm:p-5"
      onMouseDown={(event) => event.target === event.currentTarget && requestClose()}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="guestbook-dialog-title"
        className={`relative max-h-[calc(100dvh-1rem)] w-full overflow-y-auto rounded-md border border-white/10 bg-[#151515] shadow-2xl transition-[max-width] motion-reduce:transition-none sm:max-h-[calc(100dvh-2.5rem)] ${view === "editor" ? "max-w-4xl" : "max-w-xl"}`}
      >
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#151515]/95 px-4 py-3 backdrop-blur sm:px-5">
          <div className="flex min-w-0 items-center gap-2">
            {view === "editor" && (
              <button type="button" onClick={showPreview} disabled={isSending} className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-gray-400 transition hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 disabled:opacity-40" aria-label="Back to recent marks">
                <ArrowLeft size={19} aria-hidden="true" />
              </button>
            )}
            <div className="min-w-0">
            <h2 ref={headingRef} tabIndex={-1} id="guestbook-dialog-title" className="truncate text-lg font-semibold text-white outline-none">
              {title}
            </h2>
            <p className="truncate text-xs text-gray-500">{subtitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={requestClose}
            disabled={isSending}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-400 transition hover:bg-white/5 hover:text-white disabled:opacity-40"
            aria-label="Close guestbook"
          >
            <X size={19} aria-hidden="true" />
          </button>
        </header>

        {view === "success" ? (
          <div className="flex min-h-72 flex-col items-center justify-center px-6 py-10 text-center">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-green-500/10 text-green-400">
              <Check size={22} aria-hidden="true" />
            </span>
            <h3 className="mt-4 text-xl font-semibold text-white">Nice. Your doodle is on the way.</h3>
            <p className="mt-2 max-w-sm text-sm leading-6 text-gray-400">
              Your submission was received for checks. Accepted doodles may take a few minutes to appear.
              Spam and entries over the posting limit will not be published.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={onClose} className="h-10 rounded-md bg-white px-4 text-sm font-semibold text-gray-950 transition hover:bg-cyan-300">
                Done
              </button>
              <Link to="/guestbook" onClick={onClose} className="inline-flex h-10 items-center gap-2 rounded-md border border-white/15 px-4 text-sm font-semibold text-gray-200 transition hover:border-blue-400 hover:text-white">
                Go to the wall <ExternalLink size={15} aria-hidden="true" />
              </Link>
            </div>
          </div>
        ) : view === "editor" ? (
          <GuestbookForm
            onSubmitted={handleSubmitted}
            onDirtyChange={setIsDirty}
            onSendingChange={setIsSending}
          />
        ) : (
          <div className="p-4 sm:p-5">
            <GuestbookCarousel refreshSignal={refreshSignal} onAddMark={() => setView("editor")} />
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <p className="max-w-xs text-sm leading-6 text-gray-400">Got a doodle in mind? Put it on the wall. No login, no fuss.</p>
              <div className="flex flex-wrap gap-3">
                <Link to="/guestbook" onClick={onClose} className="inline-flex h-10 items-center rounded-md border border-white/15 px-4 text-sm font-semibold text-gray-200 transition hover:border-blue-400 hover:text-white">See the whole wall</Link>
                <button type="button" onClick={() => setView("editor")} className="inline-flex h-10 items-center gap-2 rounded-md bg-white px-4 text-sm font-semibold text-gray-950 transition hover:bg-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300">
                  <PencilLine size={16} aria-hidden="true" /> Draw something
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}