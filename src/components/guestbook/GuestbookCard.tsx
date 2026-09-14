import { Flag } from "lucide-react";
import { useEffect, useRef } from "react";
import { renderDrawing } from "./drawing";
import type { PublicGuestbookEntry } from "./guestbookSchema";

type GuestbookCardProps = {
  entry: PublicGuestbookEntry;
  onReport: (entry: PublicGuestbookEntry) => void;
};

export function GuestbookCard({ entry, onReport }: GuestbookCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(rect.width * ratio));
      canvas.height = Math.max(1, Math.round(rect.height * ratio));
      const context = canvas.getContext("2d");
      if (context) renderDrawing(context, entry.drawing, canvas.width, canvas.height);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    return () => observer.disconnect();
  }, [entry.drawing]);

  return (
    <article className="group overflow-hidden rounded-md border border-white/10 bg-[#151515] transition hover:border-blue-500/30">
      <canvas ref={canvasRef} className="block aspect-[4/3] w-full bg-[#fffdf7]" aria-label={`Doodle by ${entry.name}`} />
      <div className="p-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-white">{entry.name}</h3>
            <time className="font-mono text-xs text-gray-500" dateTime={entry.createdAt}>
              {new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(entry.createdAt))}
            </time>
          </div>
          <button type="button" onClick={() => onReport(entry)} className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-gray-600 transition hover:bg-white/5 hover:text-red-400" title="Report this entry" aria-label={`Report doodle by ${entry.name}`}>
            <Flag size={14} aria-hidden="true" />
          </button>
        </div>
        {entry.message && <p className="mt-2.5 break-words text-sm leading-5 text-gray-400">{entry.message}</p>}
      </div>
    </article>
  );
}