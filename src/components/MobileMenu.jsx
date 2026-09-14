import { renderNavLinks } from "../helpers/RenderNavigationLinks";
import { useLocation } from "react-router-dom";
import { useGuestbookModal } from "./guestbook/guestbookModalState";

export const MobileMenu = ({ menuOpen, setMenuOpen, hasTopBanner = false }) => {
  const { pathname } = useLocation();
  const { openGuestbook } = useGuestbookModal();
  const itemClass = `text-2xl font-semibold text-white my-4 transform transition-transform duration-300
    ${menuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`;

  return (
    <div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      hidden={!menuOpen}
      className={`fixed left-0 w-full bg-[rgba(10,10,10,0.8)] z-40 flex flex-col items-center justify-center
                     transition-all duration-300 ease-in-out
                     ${hasTopBanner ? "top-[2.25rem]" : "top-0"}

                     ${menuOpen
          ? hasTopBanner
            ? "h-[calc(100vh-2.25rem)] opacity-100 pointer-events-auto"
            : "h-screen opacity-100 pointer-events-auto"
          : "h-0 opacity-0 pointer-events-none"
        }
                   `}
    >
      <button
        onClick={() => setMenuOpen(false)}
        className="absolute top-6 right-6 text-white text-3xl focus:outline-none cursor-pointer"
        aria-label="Close Menu"
      >
        &times;
      </button>

      {renderNavLinks({
        className: itemClass,
        onClick: () => setMenuOpen(false),
        isHome: pathname === "/",
        activeKey: pathname === "/guestbook" ? "guestbook" : pathname.startsWith("/blogs") ? "blogs" : undefined,
        onGuestbookClick: () => openGuestbook(),
      })}
    </div>
  );
};