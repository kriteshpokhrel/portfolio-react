import { useState } from "react";
import "./App.css";
import { Navbar } from "./components/Navbar";
import { MobileMenu } from "./components/MobileMenu";
import { HomePage } from "./components/homepage/HomePage";
import BlogList from "./components/blogs/BlogList";
import "./index.css";
import { Routes, Route, useLocation } from "react-router-dom";
import BlogPostPage from "./components/blogs/BlogPostPage";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  // Account for the optional Vite base path (e.g. /portfolio-react/).
  const isHome = pathname === import.meta.env.BASE_URL;

  return (
    <>
      <div>
        <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        { isHome && <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} /> }
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blogs" element={<BlogList />} />
          <Route path="/blogs/:slug" element={<BlogPostPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
