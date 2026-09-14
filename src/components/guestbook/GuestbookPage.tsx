import { PencilLine } from "lucide-react";
import { Seo } from "../Seo";
import { GuestbookGallery } from "./GuestbookGallery";
import { useGuestbookModal } from "./guestbookModalState";

export default function GuestbookPage() {
  const { openGuestbook, refreshSignal } = useGuestbookModal();

  return (
    <>
      <Seo
        title="Doodle Guestbook"
        description="Leave a doodle or a quick note on Kritesh Pokhrel's guestbook wall."
        path="/guestbook"
      />
      <div className="min-h-screen bg-[#0a0a0a] px-4 pb-10 pt-[calc(var(--site-top-offset)+2rem)] text-gray-100">
        <div className="mx-auto max-w-5xl">
          <header className="flex flex-col gap-5 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <h1 className="text-3xl font-bold text-white">Guestbook</h1>
              <p className="mt-3 text-sm leading-6 text-gray-400">
                Doodles and notes from people who stopped by. Leave a mark here without signing up for anything.
              </p>
            </div>
            <button
              type="button"
              onClick={() => openGuestbook("editor")}
              className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md bg-white px-4 text-sm font-semibold text-gray-950 transition hover:bg-cyan-300"
            >
              <PencilLine size={16} aria-hidden="true" />
              Draw something
            </button>
          </header>

          <GuestbookGallery refreshSignal={refreshSignal} />
        </div>
      </div>
    </>
  );
}