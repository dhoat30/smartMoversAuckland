import {
  getBranchForCity,
  deriveSuburbName,
  extractFaqs,
} from "./locationBusinessData";

const LOGO_URL =
  "https://cms.smartmovers.co.nz/wp-content/uploads/2025/08/Asset-8.svg";
const SAME_AS = ["https://www.facebook.com/smartMoversNZ/"];

const clean = (url) => (url || "").replace(/\/$/, "");
const orgId = (base) => `${base}/#organization`;
const siteId = (base) => `${base}/#website`;
const abs = (base, path) =>
  `${base}${path && !path.startsWith("/") ? `/${path}` : path || ""}`;

/** Reduce the raw google-reviews.json into an aggregate rating object. */
export function summariseReviews(reviewsData) {
  const list = reviewsData?.reviews;
  if (!Array.isArray(list) || list.length === 0) return null;

  const ratings = list
    .map((review) => Number(review.rating))
    .filter((rating) => rating > 0);
  if (ratings.length === 0) return null;

  const average =
    ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;

  return {
    ratingValue: Math.round(average * 10) / 10,
    reviewCount: reviewsData.total || ratings.length,
  };
}

/* ---- Sitewide nodes (emitted once in the root layout) ---- */

export function organizationNode(base, siteName) {
  return {
    "@type": "Organization",
    "@id": orgId(base),
    name: siteName,
    url: base,
    logo: { "@type": "ImageObject", url: LOGO_URL },
    sameAs: SAME_AS,
  };
}

export function websiteNode(base, siteName) {
  return {
    "@type": "WebSite",
    "@id": siteId(base),
    url: base,
    name: siteName,
    publisher: { "@id": orgId(base) },
    inLanguage: "en-NZ",
  };
}

export function buildRootSchema({ siteUrl, siteName = "Smart Movers" } = {}) {
  if (!siteUrl) return null;
  const base = clean(siteUrl);
  return {
    "@context": "https://schema.org",
    "@graph": [organizationNode(base, siteName), websiteNode(base, siteName)],
  };
}

/* ---- Reusable LocalBusiness/MovingCompany node for a branch/city ---- */

export function movingCompanyNode(
  base,
  { citySlug, siteName = "Smart Movers", areaServed, image, reviews } = {},
) {
  const branch = getBranchForCity(citySlug);
  const node = {
    "@type": "MovingCompany",
    "@id": `${base}/#branch-${(citySlug || "main").toLowerCase()}`,
    name: `${siteName} ${branch.name}`,
    url: base,
    telephone: branch.telephone,
    email: branch.email,
    image: image?.url || LOGO_URL,
    logo: LOGO_URL,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: branch.address.streetAddress,
      addressLocality: branch.address.addressLocality,
      addressRegion: branch.address.addressRegion,
      postalCode: branch.address.postalCode,
      addressCountry: "NZ",
    },
    areaServed: areaServed || [{ "@type": "City", name: branch.name }],
    parentOrganization: { "@id": orgId(base) },
  };
  if (reviews?.reviewCount > 0) {
    node.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: reviews.ratingValue,
      reviewCount: reviews.reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }
  return node;
}

/**
 * Generic per-page schema graph: WebPage (+ BreadcrumbList, business,
 * services, FAQPage as supplied). Organization/WebSite are referenced by @id
 * and defined once at the root layout.
 */
export function buildPageSchema({
  siteUrl,
  siteName = "Smart Movers",
  path = "",
  name,
  description,
  image,
  breadcrumbs = [],
  business,
  services = [],
  faqs = [],
} = {}) {
  if (!siteUrl) return null;
  const base = clean(siteUrl);
  const pageUrl = abs(base, path);
  const webPageId = `${pageUrl}#webpage`;
  const breadcrumbId = `${pageUrl}#breadcrumb`;
  const providerId = business?.["@id"] || orgId(base);
  const graph = [];

  const webPage = {
    "@type": "WebPage",
    "@id": webPageId,
    url: pageUrl,
    name: name || siteName,
    ...(description ? { description } : {}),
    isPartOf: { "@id": siteId(base) },
    inLanguage: "en-NZ",
    ...(image?.url
      ? {
          primaryImageOfPage: {
            "@type": "ImageObject",
            url: image.url,
            ...(image.width ? { width: image.width } : {}),
            ...(image.height ? { height: image.height } : {}),
          },
        }
      : {}),
  };
  if (breadcrumbs.length) webPage.breadcrumb = { "@id": breadcrumbId };
  graph.push(webPage);

  if (breadcrumbs.length) {
    graph.push({
      "@type": "BreadcrumbList",
      "@id": breadcrumbId,
      itemListElement: breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
        item: abs(base, crumb.path),
      })),
    });
  }

  if (business) graph.push(business);

  services.forEach((service, index) => {
    graph.push({
      "@type": "Service",
      "@id": `${pageUrl}#service${index ? `-${index}` : ""}`,
      name: service.name,
      ...(service.description ? { description: service.description } : {}),
      serviceType: service.serviceType || "Removals",
      provider: { "@id": providerId },
      ...(service.areaServed ? { areaServed: service.areaServed } : {}),
      url: pageUrl,
    });
  });

  if (faqs.length) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${pageUrl}#faq`,
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}

/** Full schema for a suburb (child) location page. */
export function buildLocationSchema({
  siteUrl,
  siteName = "Smart Movers",
  parentSlug,
  childSlug,
  post,
  reviews,
} = {}) {
  if (!siteUrl || !post) return null;
  const base = clean(siteUrl);
  const branch = getBranchForCity(parentSlug);
  const cityName = branch.name;
  const title = post?.title?.rendered || siteName;
  const description = post?.yoast_head_json?.description || "";
  const suburb = deriveSuburbName({ title, slug: childSlug });
  const heroImage = post?.acf?.image;

  const business = movingCompanyNode(base, {
    citySlug: parentSlug,
    siteName,
    areaServed: [
      { "@type": "City", name: cityName },
      { "@type": "Place", name: suburb },
    ],
    image: heroImage,
    reviews,
  });

  return buildPageSchema({
    siteUrl,
    siteName,
    path: `/movers/${parentSlug}/${childSlug}`,
    name: title,
    description,
    image: heroImage,
    breadcrumbs: [
      { name: "Home", path: "" },
      { name: cityName, path: `/movers/${parentSlug}` },
      { name: title, path: `/movers/${parentSlug}/${childSlug}` },
    ],
    business,
    services: [
      {
        name: title,
        serviceType: "House and furniture removals",
        areaServed: { "@type": "Place", name: suburb },
        description,
      },
    ],
    faqs: extractFaqs(post?.acf?.sections),
  });
}
