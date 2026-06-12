import {
  getBranchForCity,
  deriveSuburbName,
  extractFaqs,
} from "./locationBusinessData";

const LOGO_URL =
  "https://cms.smartmovers.co.nz/wp-content/uploads/2025/08/Asset-8.svg";
const SAME_AS = ["https://www.facebook.com/smartMoversNZ/"];

/**
 * Build a full schema.org @graph for a location (suburb) moving page.
 * All @id/url references resolve to the public front-end domain — never the headless CMS.
 */
export function buildLocationSchema({
  siteUrl,
  siteName = "Smart Movers",
  parentSlug,
  childSlug,
  post,
  reviews,
}) {
  if (!siteUrl || !post) return null;

  const base = siteUrl.replace(/\/$/, "");
  const pageUrl = `${base}/movers/${parentSlug}/${childSlug}`;
  const parentUrl = `${base}/movers/${parentSlug}`;
  const branch = getBranchForCity(parentSlug);

  const title = post?.title?.rendered || siteName;
  const description = post?.yoast_head_json?.description || "";
  const suburb = deriveSuburbName({ title, slug: childSlug });
  const cityName = branch.name;
  const heroImage = post?.acf?.image;
  const faqs = extractFaqs(post?.acf?.sections);

  const orgId = `${base}/#organization`;
  const websiteId = `${base}/#website`;
  const businessId = `${base}/#branch-${parentSlug}`;
  const webPageId = `${pageUrl}#webpage`;
  const breadcrumbId = `${pageUrl}#breadcrumb`;

  const graph = [];

  // Organization
  graph.push({
    "@type": "Organization",
    "@id": orgId,
    name: siteName,
    url: base,
    logo: { "@type": "ImageObject", url: LOGO_URL },
    sameAs: SAME_AS,
  });

  // WebSite
  graph.push({
    "@type": "WebSite",
    "@id": websiteId,
    url: base,
    name: siteName,
    publisher: { "@id": orgId },
    inLanguage: "en-NZ",
  });

  // MovingCompany (LocalBusiness subtype) for the serving branch
  const aggregateRating =
    reviews?.reviewCount > 0
      ? {
          "@type": "AggregateRating",
          ratingValue: reviews.ratingValue,
          reviewCount: reviews.reviewCount,
          bestRating: 5,
          worstRating: 1,
        }
      : undefined;

  graph.push({
    "@type": "MovingCompany",
    "@id": businessId,
    name: `${siteName} ${cityName}`,
    url: base,
    telephone: branch.telephone,
    email: branch.email,
    image: heroImage?.url || LOGO_URL,
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
    areaServed: [
      { "@type": "City", name: cityName },
      { "@type": "Place", name: suburb },
    ],
    parentOrganization: { "@id": orgId },
    ...(aggregateRating ? { aggregateRating } : {}),
  });

  // WebPage
  graph.push({
    "@type": "WebPage",
    "@id": webPageId,
    url: pageUrl,
    name: title,
    ...(description ? { description } : {}),
    isPartOf: { "@id": websiteId },
    about: { "@id": businessId },
    inLanguage: "en-NZ",
    ...(heroImage?.url
      ? {
          primaryImageOfPage: {
            "@type": "ImageObject",
            url: heroImage.url,
            width: heroImage.width,
            height: heroImage.height,
          },
        }
      : {}),
    ...(post?.date ? { datePublished: post.date } : {}),
    ...(post?.modified ? { dateModified: post.modified } : {}),
    breadcrumb: { "@id": breadcrumbId },
  });

  // BreadcrumbList (front-end URLs)
  graph.push({
    "@type": "BreadcrumbList",
    "@id": breadcrumbId,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: base },
      { "@type": "ListItem", position: 2, name: cityName, item: parentUrl },
      { "@type": "ListItem", position: 3, name: title, item: pageUrl },
    ],
  });

  // Service
  graph.push({
    "@type": "Service",
    "@id": `${pageUrl}#service`,
    serviceType: "House and furniture removals",
    name: title,
    ...(description ? { description } : {}),
    provider: { "@id": businessId },
    areaServed: { "@type": "Place", name: suburb },
    url: pageUrl,
  });

  // FAQPage
  if (faqs.length > 0) {
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

/** Reduce the raw google-reviews.json into an aggregate rating object. */
export function summariseReviews(reviewsData) {
  const list = reviewsData?.reviews;
  if (!Array.isArray(list) || list.length === 0) return null;

  const ratings = list
    .map((review) => Number(review.rating))
    .filter((rating) => rating > 0);

  if (ratings.length === 0) return null;

  const average = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;

  return {
    ratingValue: Math.round(average * 10) / 10,
    reviewCount: reviewsData.total || ratings.length,
  };
}
