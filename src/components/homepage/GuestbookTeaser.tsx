import { ArrowUpRight, PencilLine } from "lucide-react";
import { Link } from "react-router-dom";
import { RevealOnScroll } from "../RevealOnScroll";
import { GuestbookCarousel } from "../guestbook/GuestbookCarousel";
import { useGuestbookModal } from "../guestbook/guestbookModalState";

export function GuestbookTeaser() {
  const { openGuestbook, refreshSignal } = useGuestbookModal();
  const openEditor = () => openGuestbook("editor");

  return (
    <section className="bg-black py-12 sm:py-14" aria-labelledby="guestbook-teaser-title">
      <RevealOnScroll>
        <div className="mx-auto max-w-5xl px-4">
          <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="font-mono text-xs uppercase text-blue-500">The wall so far</p>
              <h2 id="guestbook-teaser-title" className="mt-3 bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">People have been doodling</h2>
              <p className="mt-3 text-sm leading-6 text-gray-400">See what people left behind, then grab a pen and add a little something of your own.</p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-4">
              <button type="button" onClick={openEditor} className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-white px-4 text-sm font-semibold text-gray-950 transition hover:bg-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300">
                <PencilLine size={16} aria-hidden="true" /> Leave a mark
              </button>
              <Link to="/guestbook" className="inline-flex h-10 items-center gap-1.5 text-sm text-gray-400 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300">
                See the whole wall <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </header>
          <div className="mt-6 w-full sm:mt-8">
            <GuestbookCarousel refreshSignal={refreshSignal} onAddMark={openEditor} variant="banner" />
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
}