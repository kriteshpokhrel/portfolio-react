import { Link, useLocation } from "react-router-dom";
import { renderNavLinks } from "../helpers/RenderNavigationLinks";
import { useEffect, useState } from "react";

export const Navbar = ({ menuOpen, setMenuOpen }) => {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  const location = useLocation();
  const isHome = location.pathname === "/";
  const isBlogs = /^\/blogs(\/.*)?$/.test(location.pathname);

  // Highlight the nav link for whichever section is currently in view.
  useEffect(() => {
    if (!isHome) return;
    const sections = ["home", "about", "projects", "contact"]
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveSection(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [isHome]);

  return (
    <nav className="fixed top-0 w-full z-40 bg-[rgba(10,10,10,0.8)] backdrop-blur-lg border-b border-white/10 shadow-lg">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="font-mono text-xl font-bold text-white">
            kritesh<span className="text-blue-500">.pokhrel</span>
          </Link>

          {/* Mobile Menu Icon (only on home) */}
          {isHome && (
            <button
              type="button"
              className="text-2xl w-7 h-10 relative cursor-pointer z-40 md:hidden text-white"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              &#9776;
            </button>
          )}

          {/* Desktop Menu */}
          {isHome && (
            <div className="hidden md:flex items-center space-x-8">
              {renderNavLinks({
                className: "text-gray-300 hover:text-white transition-colors",
                activeKey: activeSection,
              })}
            </div>
          )}

          {/* Blogs Page Home Button */}
          {isBlogs && (
            <div className="flex items-center">
              <Link to="/">Home</Link>
            </div>
          )}

        </div>
      </div>
    </nav>
  );
};
