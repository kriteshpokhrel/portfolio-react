import { useState } from "react";
import "./App.css";
import { Navbar } from "./components/Navbar";
import { MobileMenu } from "./components/MobileMenu";
import { HomePage } from "./components/homepage/HomePage";
import BlogList from "./components/blogs/BlogList";
import "./index.css";
import { Routes, Route } from "react-router-dom";
import BlogPostPage from "./components/blogs/BlogPostPage";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const isHome = location.pathname === "/";
  console
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
