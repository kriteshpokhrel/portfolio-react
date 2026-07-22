import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { loadPost } from "../../utilities/MarkdownImport";
import "github-markdown-css/github-markdown-dark.css";
import { md } from "../../utilities/MarkdownRenderer";

export default function BlogPostPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      const result = await loadPost(slug!);
      if (!result) setError(true);
      else setPost(result);
    }
    fetchPost();
  }, [slug]);

  if (error) return <div className="text-white p-20">404 — Blog not found</div>;
  if (!post) return <div className="text-white p-20">Loading...</div>;

  // Generate excerpt if not provided
  const excerpt = post.meta.excerpt || post.content.substring(0, 200) + "...";

  return (
    <div className="min-h-screen bg-neutral-900 flex justify-center py-20">
      <article
        className="w-full max-w-6xl bg-neutral-800/70 border border-white/10 rounded-2xl shadow-2xl shadow-black/30 markdown-body p-4 sm:p-6 md:p-10 lg:p-12"
        style={{
          lineHeight: "1.75",
        }}
      >

        {/* Go Back Button */}
        <button
          onClick={() => navigate("/blogs")}
          className="mb-6 px-4 py-2 text-sm rounded-lg bg-neutral-700 hover:bg-neutral-600 text-white font-semibold flex items-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg"
          style={{
            backdropFilter: "blur(6px)",
            border: "1px solid rgba(255,255,255,0.1)",
            cursor: "pointer",
          }}
        >
          ← Back to Blogs
        </button>

        {/* Blog Title */}
        <h1
          style={{
            fontSize: "2.8rem",
            fontWeight: "700",
            marginBottom: "0.5rem",
            letterSpacing: "0.5px",
          }}
        >
          {post.meta.title}
        </h1>

        {/* Date */}
        <p
          style={{
            color: "#aaa",
            marginBottom: "1rem",
            fontSize: "0.95rem",
            letterSpacing: "0.3px",
          }}
        >
          {post.meta.date}
        </p>

        {/* Excerpt */}
        <p
          style={{
            color: "#ccc",
            marginBottom: "2rem",
            fontSize: "1.05rem",
            lineHeight: "1.5",
          }}
        >
          {excerpt}
        </p>

        {/* Optional cover image */}
        {post.meta.coverImage && (
          <div style={{ marginBottom: "2.5rem", textAlign: "center" }}>
            <img
              src={post.meta.coverImage}
              alt={post.meta.title}
              style={{
                maxWidth: "min(100%, 44rem)",
                borderRadius: "0.75rem",
                boxShadow: "0 8px 20px rgba(0,0,0,0.5)",
              }}
            />
          </div>
        )}

        {/* Render Markdown */}
        <div
          className="markdown-body"
          dangerouslySetInnerHTML={{ __html: md.render(post.content) }}
        />
      </article>
    </div>
  );
}
