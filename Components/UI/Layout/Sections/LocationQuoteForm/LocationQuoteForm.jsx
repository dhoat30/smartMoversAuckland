import FormSection from "../FormSection/FormSection";

/**
 * Renders the same "Get Your Free Quote" hero used on the /get-free-quote pages
 * (the FormSection component), with the location name interpolated so each
 * suburb/city movers page gets its own headline and copy.
 *
 * Headline is the page name + "Quote in 15 Minutes" (e.g.
 * "House Movers Avondale — Quote in 15 Minutes"). It defaults to <h2> because
 * the location page already carries an <h1> (the suburb title); pass
 * headingLevel="h1" if this is used as the page hero.
 */
const TEXT_USP = [
  { value: "2 Men+ Truck | $45/hh" },
  { value: "No depot fee, pay on arrival" },
  { value: "Packing & unpacking available" },
  { value: "We can beat any quote by 10%" },
  { value: "WINZ Quotes" },
  { value: "Full transit insurance" },
];

export default function LocationQuoteForm({
  pageTitle,
  location,
  reviewerPics,
  headingLevel = "h2",
}) {
  const place = location?.trim() || "Local";
  const possessive = `${place}${place.endsWith("s") ? "'" : "'s"}`;
  const heading = pageTitle?.trim() || `${place} House Movers`;

  const title = `<${headingLevel}>${heading} — Quote in <strong>15 Minutes</strong></${headingLevel}>`;
  const description = `<p><strong>${possessive} most trusted removalists.</strong> 24/7 availability, professional team, and transparent pricing — no hidden costs, ever. Quote response within 15 minutes.</p>`;

  return (
    <FormSection
      title={title}
      description={description}
      usp={{ text_usp: TEXT_USP }}
      graphic={{}}
      googleReviewSnippetText={`Loved by ${place} locals`}
      reviewerPics={reviewerPics}
    />
  );
}
