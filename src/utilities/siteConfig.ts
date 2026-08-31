// Central place for site-wide SEO/metadata defaults.
export const siteConfig = {
  name: "Kritesh Pokhrel",
  title: "Kritesh Pokhrel - Software Engineer",
  description:
    "Portfolio and blog of Kritesh Pokhrel, a software engineer focused on .NET, Azure, and cloud-native development. Home of the writing series 'AI, As I See It'.",
  url: "https://kriteshp.com.np",
  author: "Kritesh Pokhrel",
  // Absolute default social share image (used when a page has no cover).
  defaultImage: "https://kriteshp.com.np/kritesh.jpg",
  twitterHandle: "",
  locale: "en_US",
};

// Build an absolute URL from a path or (possibly relative) asset.
export function absoluteUrl(pathOrUrl?: string): string {
  if (!pathOrUrl) return siteConfig.url;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${siteConfig.url}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}
