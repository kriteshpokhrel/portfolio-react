import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPost } from "../../utilities/MarkdownImport";
import "github-markdown-css/github-markdown-dark.css";
import { md } from "../../utilities/MarkdownRenderer";
import { Seo } from "../Seo";
import ReadingRail from "./ReadingRail";
import { siteConfig, absoluteUrl } from "../../utilities/siteConfig";

export default function BlogPostPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = slug ? getPost(slug) : null;

  const html = useMemo(
    () => (post ? md.render(post.content) : ""),
    [post]
  );

  // Build a table of contents from the rendered headings (ids come from markdown-it-anchor).
  const toc = useMemo(() => {
    if (!html) return [];
    const doc = new DOMParser().parseFromString(html, "text/html");
    return Array.from(doc.querySelectorAll("h2, h3"))
      .filter((el) => el.id)
      .map((el) => ({
        id: el.id,
        text: el.textContent ?? "",
        level: Number(el.tagName[1]),
      }));
  }, [html]);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-900 text-white gap-4">
        <Seo title="Blog not found" noindex />
        <p className="text-2xl font-semibold">404 - Blog not found</p>
        <button
          onClick={() => navigate("/blogs")}
          className="px-4 py-2 text-sm rounded-lg bg-neutral-700 hover:bg-neutral-600 cursor-pointer"
        >
          ← Back to Blogs
        </button>
      </div>
    );
  }

  const excerpt =
    post.meta.excerpt || post.content.replace(/[#>*_`~-]/g, "").slice(0, 160).trim() + "...";
  const formattedDate = new Date(post.meta.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.meta.title,
    description: excerpt,
    image: absoluteUrl(post.meta.coverImage),
    datePublished: post.meta.date,
    dateModified: post.meta.date,
    author: { "@type": "Person", name: siteConfig.author, url: siteConfig.url },
    publisher: { "@type": "Person", name: siteConfig.author },
    mainEntityOfPage: absoluteUrl(`/blogs/${post.slug}`),
    keywords: post.meta.tags?.join(", "),
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex justify-center py-20">
      <Seo
        title={post.meta.title}
        description={excerpt}
        path={`/blogs/${post.slug}`}
        image={post.meta.coverImage}
        type="article"
        publishedTime={post.meta.date}
        jsonLd={articleJsonLd}
      />
      <ReadingRail headings={toc} />
      <article className="w-full max-w-6xl bg-neutral-800/70 border border-white/10 rounded-2xl shadow-2xl shadow-black/30 markdown-body p-4 sm:p-6 md:p-10 lg:p-12 leading-[1.75]">
        {/* Go Back Button */}
        <button
          onClick={() => navigate("/blogs")}
          className="mb-6 px-4 py-2 text-sm rounded-lg bg-neutral-700 hover:bg-neutral-600 text-white font-semibold flex items-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg border border-white/10 backdrop-blur-sm cursor-pointer"
        >
          ← Back to Blogs
        </button>

        <h1 className="text-4xl sm:text-5xl font-bold mb-2 tracking-tight">
          {post.meta.title}
        </h1>

        <p className="text-neutral-400 text-sm mb-2">
          {formattedDate} · {post.readingTime} min read
        </p>

        {post.meta.tags && post.meta.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.meta.tags.map((tag) => (
              <span
                key={tag}
                className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {post.meta.coverImage && (
          <div className="mb-10 text-center">
            <img
              src={post.meta.coverImage}
              alt={post.meta.title}
              loading="lazy"
              className="inline-block max-w-[min(100%,44rem)] rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.5)]"
            />
          </div>
        )}

        <div
          className="markdown-body"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </article>
    </div>
  );
}
