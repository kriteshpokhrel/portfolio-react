// Generates public/sitemap.xml from static routes + blog markdown frontmatter.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import fm from "front-matter";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const BASE_URL = "https://kriteshp.com.np";

const staticRoutes = [
  { loc: "/", priority: "1.0" },
  { loc: "/blogs", priority: "0.8" },
];

const blogsDir = join(root, "src", "blogs");
const blogRoutes = readdirSync(blogsDir)
  .filter((f) => f.endsWith(".md"))
  .map((file) => {
    const raw = readFileSync(join(blogsDir, file), "utf-8");
    const { attributes } = fm(raw);
    const slug = file.replace(/\.md$/, "");
    return {
      loc: `/blogs/${slug}`,
      lastmod: attributes.date,
      priority: "0.7",
    };
  });

const urls = [...staticRoutes, ...blogRoutes]
  .map(({ loc, lastmod, priority }) => {
    const lastmodTag = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : "";
    return `  <url>\n    <loc>${BASE_URL}${loc}</loc>${lastmodTag}\n    <priority>${priority}</priority>\n  </url>`;
  })
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

writeFileSync(join(root, "public", "sitemap.xml"), xml);
console.log(`Generated sitemap with ${staticRoutes.length + blogRoutes.length} URLs.`);
