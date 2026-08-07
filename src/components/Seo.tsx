import { Helmet } from "react-helmet-async";
import { siteConfig, absoluteUrl } from "../utilities/siteConfig";

type SeoProps = {
  title?: string;
  description?: string;
  /** Path or absolute URL of this page, e.g. "/blogs/my-post". */
  path?: string;
  /** Social share image (path or absolute URL). */
  image?: string;
  type?: "website" | "article";
  /** ISO date for articles. */
  publishedTime?: string;
  /** Extra structured-data objects to embed as JSON-LD. */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  noindex?: boolean;
};

export const Seo = ({
  title,
  description = siteConfig.description,
  path,
  image,
  type = "website",
  publishedTime,
  jsonLd,
  noindex = false,
}: SeoProps) => {
  const fullTitle = title ? `${title} — ${siteConfig.name}` : siteConfig.title;
  const canonical = absoluteUrl(path);
  const shareImage = absoluteUrl(image) || siteConfig.defaultImage;

  const structured = jsonLd
    ? Array.isArray(jsonLd)
      ? jsonLd
      : [jsonLd]
    : [];

  return (
    <Helmet prioritizeSeoTags>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:site_name" content={siteConfig.name} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={shareImage} />
      <meta property="og:locale" content={siteConfig.locale} />
      {type === "article" && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === "article" && (
        <meta property="article:author" content={siteConfig.author} />
      )}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={shareImage} />

      {structured.map((obj, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(obj)}
        </script>
      ))}
    </Helmet>
  );
};
