import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { GuestbookModal } from "./GuestbookModal";
import { GuestbookModalContext, type GuestbookLaunchMode } from "./guestbookModalState";

export function GuestbookModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [launchMode, setLaunchMode] = useState<GuestbookLaunchMode>("preview");
  const [refreshSignal, setRefreshSignal] = useState(0);
  const { pathname, hash } = useLocation();
  const openGuestbook = useCallback((mode: GuestbookLaunchMode = "preview") => {
    setLaunchMode(mode);
    setIsOpen(true);
  }, []);
  const closeGuestbook = useCallback(() => setIsOpen(false), []);
  const handleSubmitted = useCallback(() => {
    setRefreshSignal((value) => value + 1);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname, hash]);

  return (
    <GuestbookModalContext.Provider
      value={{
        openGuestbook,
        closeGuestbook,
        refreshSignal,
      }}
    >
      {children}
      {isOpen && (
        <GuestbookModal
          launchMode={launchMode}
          refreshSignal={refreshSignal}
          onClose={closeGuestbook}
          onSubmitted={handleSubmitted}
        />
      )}
    </GuestbookModalContext.Provider>
  );
}
