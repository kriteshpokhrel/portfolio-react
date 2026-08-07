import { useState, lazy, Suspense } from "react";
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

const RouteFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-black text-gray-400">
    Loading…
  </div>
);

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-blue-500 focus:text-white focus:px-4 focus:py-2 focus:rounded"
      >
        Skip to content
      </a>
      <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      {isHome && <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />}
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
