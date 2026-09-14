import { ChevronLeft, ChevronRight, PencilLine, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { fetchGuestbookPage } from "./guestbookApi";
import { renderDrawing } from "./drawing";
import type { PublicGuestbookEntry } from "./guestbookSchema";

type GuestbookCarouselProps = {
  refreshSignal: number;
  onAddMark: () => void;
  variant?: "default" | "banner";
};

const SWIPE_THRESHOLD = 48;

function getWrappedIndex(index: number, length: number) {
  return ((index % length) + length) % length;
}

export function GuestbookCarousel({ refreshSignal, onAddMark, variant = "default" }: GuestbookCarouselProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerStartRef = useRef<{ id: number; x: number } | null>(null);
  const requestRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const [entries, setEntries] = useState<PublicGuestbookEntry[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const activeEntry = entries[activeIndex];

  const abortLoad = useCallback(() => {
    requestRef.current?.abort();
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
  }, []);

  const load = useCallback((delay = false) => {
    abortLoad();
    const controller = new AbortController();
    requestRef.current = controller;
    setStatus("loading");

    timeoutRef.current = window.setTimeout(async () => {
      try {
        const page = await fetchGuestbookPage({ limit: 8, signal: controller.signal });
        setEntries(page.entries);
        setActiveIndex(0);
        setStatus("ready");
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setStatus("error");
      }
    }, delay ? 1800 : 0);
  }, [abortLoad]);

  useEffect(() => {
    load(refreshSignal > 0);
    return abortLoad;
  }, [abortLoad, load, refreshSignal]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !activeEntry) return;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(rect.width * ratio));
      canvas.height = Math.max(1, Math.round(rect.height * ratio));
      const context = canvas.getContext("2d");
      if (context) renderDrawing(context, activeEntry.drawing, canvas.width, canvas.height);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    return () => observer.disconnect();
  }, [activeEntry]);

  const move = (amount: number) => {
    if (entries.length < 2) return;
    setActiveIndex((index) => getWrappedIndex(index + amount, entries.length));
  };

  const fallback = status !== "ready" || entries.length === 0;
  if (fallback) {
    const isOffline = typeof navigator !== "undefined" && !navigator.onLine;
    return (
      <div className={`flex aspect-[4/3] w-full flex-col items-center justify-center rounded-md border border-white/10 bg-[#151515] px-6 text-center shadow-2xl shadow-black/20 ${variant === "banner" ? "sm:aspect-auto sm:min-h-80" : ""}`} aria-live="polite">
        {status === "loading" ? (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <RefreshCw size={16} className="animate-spin motion-reduce:animate-none" aria-hidden="true" />
            Fetching the latest doodles...
          </div>
        ) : (
          <>
            <p className="text-sm leading-6 text-gray-300">
              {status === "error"
                ? isOffline ? "Looks like you are offline. The doodles will be here when you are back." : "Could not grab the latest doodles. One more try?"
                : "It is a little quiet in here. Be the first to leave a doodle."}
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              {status === "error" && !isOffline && (
                <button type="button" onClick={() => void load()} className="inline-flex h-9 items-center gap-2 rounded-md border border-white/15 px-3 text-sm font-semibold text-gray-200 transition hover:border-blue-400 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300">
                  <RefreshCw size={15} aria-hidden="true" /> Give it another go
                </button>
              )}
              <button type="button" onClick={onAddMark} className="inline-flex h-9 items-center gap-2 rounded-md bg-white px-3 text-sm font-semibold text-gray-950 transition hover:bg-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300">
                <PencilLine size={15} aria-hidden="true" /> Leave a mark
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div
      className="w-full rounded-md border border-white/10 bg-[#151515] p-3 shadow-2xl shadow-black/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 sm:p-4"
      role="region"
      aria-roledescription="carousel"
      aria-label="Recent guestbook marks"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          move(event.key === "ArrowLeft" ? -1 : 1);
        }
      }}
      onPointerDown={(event) => {
        if (event.pointerType === "mouse" && event.button !== 0) return;
        if (event.target instanceof Element && event.target.closest("button, a")) return;
        pointerStartRef.current = { id: event.pointerId, x: event.clientX };
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerUp={(event) => {
        const start = pointerStartRef.current;
        pointerStartRef.current = null;
        if (!start || start.id !== event.pointerId) return;
        const distance = event.clientX - start.x;
        if (Math.abs(distance) >= SWIPE_THRESHOLD) move(distance > 0 ? -1 : 1);
      }}
      onPointerCancel={() => {
        pointerStartRef.current = null;
      }}
    >
      <div className={variant === "banner" ? "sm:grid sm:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]" : undefined}>
      <div className={`relative overflow-hidden rounded-md border border-black/20 bg-[#fffdf7] shadow-[0_14px_35px_rgba(0,0,0,0.28)] ${variant === "banner" ? "sm:rounded-r-none" : ""}`}>
        <canvas ref={canvasRef} className="block aspect-[4/3] w-full touch-pan-y bg-[#fffdf7] brightness-[0.92]" aria-label={`Doodle by ${activeEntry.name}`} />
        {entries.length > 1 && (
          <>
            <button type="button" onClick={() => move(-1)} className="absolute left-2 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-md border border-white/15 bg-[#202020]/95 text-white shadow-lg transition hover:bg-[#0a0a0a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300" aria-label="Previous guestbook mark">
              <ChevronLeft size={21} aria-hidden="true" />
            </button>
            <button type="button" onClick={() => move(1)} className="absolute right-2 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-md border border-white/15 bg-[#202020]/95 text-white shadow-lg transition hover:bg-[#0a0a0a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300" aria-label="Next guestbook mark">
              <ChevronRight size={21} aria-hidden="true" />
            </button>
          </>
        )}
      </div>
      <div className={`flex min-h-16 items-start justify-between gap-4 px-1 pb-0.5 pt-3.5 ${variant === "banner" ? "sm:min-h-0 sm:flex-col sm:items-start sm:border-l sm:border-white/10 sm:px-6 sm:py-5" : ""}`} aria-live="polite" aria-atomic="true">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">{activeEntry.name}</p>
          {activeEntry.message && <p className="mt-1 line-clamp-2 break-words text-sm leading-5 text-gray-300">{activeEntry.message}</p>}
          <time className="mt-1.5 block font-mono text-xs text-gray-500" dateTime={activeEntry.createdAt}>
            {new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(activeEntry.createdAt))}
          </time>
        </div>
        <span className="shrink-0 rounded-md bg-white/5 px-2 py-1 font-mono text-xs text-gray-400">{activeIndex + 1} / {entries.length}</span>
      </div>
      </div>
    </div>
  );
}