import { Link, useLocation } from "react-router-dom";
import { renderNavLinks } from "../helpers/RenderNavigationLinks";
import { useEffect } from "react";

export const Navbar = ({ menuOpen, setMenuOpen }) => {
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  const location = useLocation();
  const isHome = location.pathname === "/";
  const isBlogs = /^\/blogs(\/.*)?$/.test(location.pathname);

  return (
    <nav className="fixed top-0 w-full z-40 bg-[rgba(10, 10, 10, 0.8)] backdrop-blur-lg border-b border-white/10 shadow-lg">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="font-mono text-xl font-bold text-white">
            kritesh<span className="text-blue-500">.pokhrel</span>
          </Link>

          {/* Mobile Menu Icon (only on home) */}
          {isHome && (
            <div
              className="text-2xl w-7 h-10 relative cursor-pointer z-40 md:hidden"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              &#9776;
            </div>
          )}

          {/* Desktop Menu */}
          {isHome && (
            <div className="hidden md:flex items-center space-x-8">
              {renderNavLinks({ className: "text-gray-300 hover:text-white" })}
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
