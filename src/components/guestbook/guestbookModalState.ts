import { createContext, useContext } from "react";

export type GuestbookLaunchMode = "preview" | "editor";

export type GuestbookModalContextValue = {
  openGuestbook: (mode?: GuestbookLaunchMode) => void;
  closeGuestbook: () => void;
  refreshSignal: number;
};

export const GuestbookModalContext = createContext<GuestbookModalContextValue | null>(null);

export function useGuestbookModal() {
  const context = useContext(GuestbookModalContext);
  if (!context) {
    throw new Error("useGuestbookModal must be used within GuestbookModalProvider");
  }
  return context;
}