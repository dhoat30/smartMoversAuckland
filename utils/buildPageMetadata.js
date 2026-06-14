/**
 * Builds a consistent Next.js Metadata object from Yoast SEO data.
 *
 * - Self-referencing canonical on the public front-end domain (never the headless CMS).
 * - Prefers a supplied hero image for OG/Twitter, else Yoast's og_image.
 * - Forwards index/follow + large preview directives; pass noindex for lead-gen
 *   / utility pages so they don't compete with the main content pages.
 *
 * @param {object}  args
 * @param {object}  args.seoData  - post.yoast_head_json
 * @param {string}  args.path     - path after the domain, e.g. "/movers/auckland" ("" = homepage)
 * @param {object} [args.image]   - preferred OG image { url, width, height }
 * @param {boolean}[args.noindex] - force noindex,follow
 */
export function buildPageMetadata({ seoData = {}, path = "", image, noindex = false } = {}) {
  const siteUrl = (process.env.siteUrl || "").replace(/\/$/, "");
  const normalizedPath = path && !path.startsWith("/") ? `/${path}` : path;
  const canonical = `${siteUrl}${normalizedPath}` || siteUrl;

  const ogImage = image?.url ? image : seoData?.og_image?.[0];
  const images = ogImage?.url
    ? [
        {
          url: ogImage.url,
          width: ogImage.width || 1200,
          height: ogImage.height || 630,
        },
      ]
    : [];

  const yoastRobots = seoData?.robots || {};

  return {
    title: seoData?.title,
    description: seoData?.description,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical,
    },
    robots: {
      index: !noindex && yoastRobots.index !== "noindex",
      follow: yoastRobots.follow !== "nofollow",
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
    openGraph: {
      title: seoData?.title,
      description: seoData?.description,
      url: canonical,
      siteName: process.env.siteName,
      locale: "en_NZ",
      images,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seoData?.title,
      description: seoData?.description,
      images: images.map((img) => img.url),
    },
  };
}
