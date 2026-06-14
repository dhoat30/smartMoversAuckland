import JsonLd from "./JsonLd";
import { buildPageSchema, movingCompanyNode, summariseReviews } from "@/utils/schema";
import reviewsData from "@/data/google-reviews.json";

/**
 * One-line per-page structured data. Emits WebPage + BreadcrumbList (+ optional
 * Service / FAQ / LocalBusiness). Organization + WebSite come from the root layout.
 *
 * Pass `businessCity` (a parent city slug, e.g. "auckland") to attach a
 * MovingCompany node for that branch, or `business` for a pre-built node.
 */
export default function PageSchema({ businessCity, business, ...rest }) {
  const siteUrl = process.env.siteUrl;
  const siteName = process.env.siteName;

  let businessNode = business;
  if (!businessNode && businessCity) {
    businessNode = movingCompanyNode((siteUrl || "").replace(/\/$/, ""), {
      citySlug: businessCity,
      siteName,
      reviews: summariseReviews(reviewsData),
    });
  }

  const data = buildPageSchema({
    siteUrl,
    siteName,
    business: businessNode,
    ...rest,
  });

  return <JsonLd data={data} />;
}
