import { useEffect, useState } from "react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

// Medium-style vertical section rail: one tick per heading, hover reveals the name.
export default function ReadingRail({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    if (headings.length < 2) return;
    const els = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-15% 0px -75% 0px", threshold: [0, 1] }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <nav
      aria-label="On this page"
      className="hidden xl:flex fixed right-8 top-1/2 -translate-y-1/2 z-30 flex-col items-end"
    >
      {headings.map((h) => {
        const isActive = h.id === activeId;
        const tickWidth = isActive ? "w-8" : h.level === 3 ? "w-3.5" : "w-6";
        return (
          <a
            key={h.id}
            href={`#${h.id}`}
            aria-current={isActive ? "true" : undefined}
            className="group relative flex items-center justify-end py-1.5"
          >
            <span className="pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 max-w-[260px] translate-x-1 truncate whitespace-nowrap rounded-lg bg-neutral-800/95 px-3 py-1.5 text-sm font-medium text-neutral-100 opacity-0 shadow-lg ring-1 ring-white/10 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
              {h.text}
            </span>
            <span
              className={`h-[3px] rounded-full transition-all duration-200 ${tickWidth} ${
                isActive
                  ? "bg-neutral-300"
                  : "bg-neutral-600 group-hover:w-8 group-hover:bg-neutral-400"
              }`}
            />
          </a>
        );
      })}
    </nav>
  );
}
