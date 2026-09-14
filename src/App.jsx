import { useEffect, useState, lazy, Suspense } from "react";
import "./App.css";
import { Navbar } from "./components/Navbar";
import { MobileMenu } from "./components/MobileMenu";
import { HomePage } from "./components/homepage/HomePage";
import { Footer } from "./components/Footer";
import { NotFound } from "./components/NotFound";
import "./index.css";
import { Routes, Route, useLocation } from "react-router-dom";

const BlogList = lazy(() => import("./components/blogs/BlogList"));
const BlogPostPage = lazy(() => import("./components/blogs/BlogPostPage"));
const reliefBannerEnabled = import.meta.env.VITE_SHOW_RELIEF_BANNER !== "false";

const RouteFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-black text-gray-400">
    Loading...
  </div>
);

const ReliefBanner = ({ onDismiss }) => {
  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 border-b border-amber-100/15 bg-[linear-gradient(90deg,rgba(130,62,38,0.95),rgba(157,83,50,0.94),rgba(122,53,54,0.94))] text-orange-50 shadow-[0_10px_24px_rgba(0,0,0,0.18)]"
      role="region"
      aria-label="Nepal disaster relief notice"
    >
      <div className="mx-auto grid min-h-9 max-w-5xl grid-cols-[1.75rem_minmax(0,1fr)_1.75rem] items-center gap-2 px-4 py-1 sm:gap-3">
        <div
          className="h-7 w-7 justify-self-start"
          aria-hidden="true"
        />

        <div className="flex min-w-0 items-center justify-center gap-2 text-center text-[13px] font-medium tracking-[0.01em] text-orange-50/95 sm:text-sm">
          <svg
            className="h-[13px] w-[13px] shrink-0 text-orange-50/90"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>

          <p className="min-w-0">
            <span className="mr-2 font-semibold text-white">
              Stand with Nepal after the floods.
            </span>
            <a
              href="https://pmdrf.nchl.com.np/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Support Nepal flood relief through the official disaster relief fund, opens in a new tab"
              className="inline-flex items-center justify-center gap-1 text-orange-50 underline decoration-orange-100/60 underline-offset-4 transition hover:text-white"
            >
              Support relief efforts
              <svg
                className="h-[13px] w-[13px] shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M7 7h10v10M7 17 17 7" />
              </svg>
            </a>
          </p>
        </div>

        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss the Nepal relief notice"
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/15 text-orange-50/90 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
        >
          <svg
            className="h-[14px] w-[14px]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showReliefBanner, setShowReliefBanner] = useState(true);
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const displayReliefBanner = reliefBannerEnabled && showReliefBanner;

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--site-top-offset",
      displayReliefBanner ? "6.25rem" : "5rem"
    );

    return () => {
      document.documentElement.style.setProperty("--site-top-offset", "5rem");
    };
  }, [displayReliefBanner]);

  const dismissReliefBanner = () => {
    setShowReliefBanner(false);
  };

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-blue-500 focus:text-white focus:px-4 focus:py-2 focus:rounded"
      >
        Skip to content
      </a>
      {displayReliefBanner && <ReliefBanner onDismiss={dismissReliefBanner} />}
      <Navbar
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        hasTopBanner={displayReliefBanner}
      />
      {isHome && (
        <MobileMenu
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          hasTopBanner={displayReliefBanner}
        />
      )}
      <main id="main-content">
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/blogs" element={<BlogList />} />
            <Route path="/blogs/:slug" element={<BlogPostPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

export default App;
