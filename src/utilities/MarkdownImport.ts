import fm from "front-matter";
import { z } from "zod";

const PostMetaSchema = z.object({
  title: z.string(),
  date: z.string(),
  excerpt: z.string().optional(),
  tags: z.array(z.string()).optional(),
  coverImage: z.string().optional(),
});

export function usePosts() {
  const files = import.meta.glob("../blogs/*.md", {
    eager: true,
    as: "raw",
  });

  const posts = Object.entries(files).map(([filePath, raw]) => {
    const parsed = fm(raw as string);

    const meta = PostMetaSchema.parse(parsed.attributes);
    meta.coverImage = meta.coverImage || "/developer-icon.png";
    const slug = filePath
      .replace("../blogs/", "")
      .replace(".md", "");

    return {
      slug,
      meta,
      content: parsed.body,
    };
  });

  // Sort posts by date (newest first)
  return posts.sort(
    (a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime()
  );
}

export async function loadPost(slug: string) {
  try {
    const raw = await import(`../blogs/${slug}.md?raw`);
    console.log(raw);
    const parsed = fm(raw.default);

    const meta = PostMetaSchema.parse(parsed.attributes);
    meta.coverImage = meta.coverImage || "/developer-icon.png";

    return {
      slug,
      meta,
      content: parsed.body,
    };
  } catch (e) {
    console.error("Failed to load post:", e);
    return null;
  }
}
