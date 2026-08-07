import fm from "front-matter";
import { z } from "zod";
import type { Post } from "../components/interfaces/Post";
import { DEFAULT_CATEGORY } from "../data/categories";

const PostMetaSchema = z.object({
  title: z.string(),
  date: z.string(),
  excerpt: z.string().optional(),
  tags: z.array(z.string()).optional(),
  coverImage: z.string().optional(),
  category: z.string().optional(),
});

const DEFAULT_COVER = "/developer-icon.png";
const WORDS_PER_MINUTE = 200;

function estimateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

// Eagerly parsed once at module load — blog posts are static.
const files = import.meta.glob("../blogs/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

const allPosts: Post[] = Object.entries(files)
  .map(([filePath, raw]) => {
    const parsed = fm(raw as string);
    const meta = PostMetaSchema.parse(parsed.attributes);
    meta.coverImage = meta.coverImage || DEFAULT_COVER;
    meta.category = (meta.category || DEFAULT_CATEGORY).toLowerCase();
    const slug = filePath.replace("../blogs/", "").replace(".md", "");

    return {
      slug,
      meta,
      content: parsed.body,
      readingTime: estimateReadingTime(parsed.body),
    };
  })
  .sort(
    (a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime()
  );

export function usePosts(): Post[] {
  return allPosts;
}

export function getPost(slug: string): Post | null {
  return allPosts.find((p) => p.slug === slug) ?? null;
}
