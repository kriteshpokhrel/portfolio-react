import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { usePosts } from "../../utilities/MarkdownImport";
import type { Post } from "../interfaces/Post";
import { CATEGORIES } from "../../data/categories";
import BlogCard from "./BlogCard";
import { Seo } from "../Seo";
import { absoluteUrl } from "../../utilities/siteConfig";

export default function BlogList() {
  const posts = usePosts();
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  const closeSearch = () => {
    setSearchOpen(false);
    setQuery("");
  };

  // Only categories that actually have posts, in declared order.
  const categoriesPresent = useMemo(() => {
    const present = new Set(posts.map((p) => p.meta.category));
    return CATEGORIES.filter((c) => present.has(c.key));
  }, [posts]);

  const paramCategory = searchParams.get("category");
  const activeCategory = categoriesPresent.some((c) => c.key === paramCategory)
    ? paramCategory
    : null;

  const setCategory = (key: string | null) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (key) next.set("category", key);
        else next.delete("category");
        return next;
      },
      { replace: true }
    );
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      const matchesQuery =
        !q ||
        p.meta.title.toLowerCase().includes(q) ||
        p.meta.excerpt?.toLowerCase().includes(q) ||
        p.meta.tags?.some((t) => t.toLowerCase().includes(q));
      const matchesCategory =
        !activeCategory || p.meta.category === activeCategory;
      return matchesQuery && matchesCategory;
    });
  }, [posts, query, activeCategory]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Blog Space — Kritesh Pokhrel",
    url: absoluteUrl("/blogs"),
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.meta.title,
      datePublished: post.meta.date,
      url: absoluteUrl(`/blogs/${post.slug}`),
    })),
  };

  return (
    <section className="min-h-screen flex justify-center py-24 bg-black text-white">
      <Seo
        title="Blog Space"
        description="Ideas, insights, and the writing series 'AI, As I See It' by Kritesh Pokhrel."
        path="/blogs"
        jsonLd={jsonLd}
      />
      <div className="w-full max-w-[75%]">

        {/* Section Heading */}
        <div className="mb-8">
          <div className="relative flex items-center justify-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight pb-2">
              Blog Space
            </h1>

            {/* Search — parallel to the title, aligned right */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-1 pr-3">
              <label htmlFor="blog-search" className="sr-only">
                Search posts
              </label>
              <input
                id="blog-search"
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Escape" && closeSearch()}
                placeholder="Search posts…"
                aria-hidden={!searchOpen}
                tabIndex={searchOpen ? 0 : -1}
                className={`bg-white/5 rounded-full text-sm text-white transition-all duration-300 focus:outline-none focus:border-blue-500 focus:bg-blue-500/5 ${
                  searchOpen
                    ? "w-40 sm:w-56 opacity-100 px-4 py-2 border border-white/10"
                    : "w-0 opacity-0 p-0 border-0 pointer-events-none"
                }`}
              />
              <button
                type="button"
                onClick={() => (searchOpen ? closeSearch() : setSearchOpen(true))}
                aria-label={searchOpen ? "Close search" : "Search posts"}
                aria-expanded={searchOpen}
                aria-controls="blog-search"
                className="shrink-0 p-2 rounded-full bg-white/5 border border-white/10 text-neutral-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                {searchOpen ? <X size={18} /> : <Search size={18} />}
              </button>
            </div>
          </div>

          <p className="text-neutral-400 text-lg max-w-3xl mx-auto text-center">
            I write about ideas, insights, and anything that sparks my curiosity.
          </p>

          {/* Decorative Line */}
          <div className="w-24 h-1 bg-neutral-700 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Category chips (appear once posts span 2+ categories) */}
        {categoriesPresent.length >= 2 && (
          <div className="mb-12 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => setCategory(null)}
              className={`px-3 py-1 rounded-full text-sm transition cursor-pointer ${
                activeCategory === null
                  ? "bg-blue-500 text-white"
                  : "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
              }`}
            >
              All
            </button>
            {categoriesPresent.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setCategory(cat.key)}
                className={`px-3 py-1 rounded-full text-sm transition cursor-pointer ${
                  activeCategory === cat.key
                    ? "bg-blue-500 text-white"
                    : "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* Blog Cards Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {filtered.map((post: Post) => (
              <div
                key={post.slug}
                className="h-full transition-transform duration-300 hover:-translate-y-1"
              >
                <BlogCard post={post} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-neutral-500 py-16">
            No posts match your search
            {query ? ` for “${query}”` : ""}.
          </p>
        )}

      </div>
    </section>
  );
}
