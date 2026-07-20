/**
 * Physical branch data per parent city slug, used to build accurate
 * LocalBusiness/MovingCompany structured data on location pages.
 * Phone numbers are sourced from env so they stay in sync with the rest of the app.
 */
export const cityBranches = {
  auckland: {
    name: "Auckland",
    telephone: process.env.NEXT_PUBLIC_PHONE_NUMBER || "09 873 4212",
    email: process.env.NEXT_PUBLIC_AUCKLAND_EMAIL || "auckland@smartmovers.co.nz",
    address: {
      streetAddress: "17 Courage Road",
      addressLocality: "Papakura",
      addressRegion: "Auckland",
      postalCode: "3110",
    },
  },
  wellington: {
    name: "Wellington",
    telephone: process.env.NEXT_PUBLIC_PHONE_NUMBER_WELLINGTON || "04 887 2270",
    email:
      process.env.NEXT_PUBLIC_WELLINGTON_EMAIL || "wellington@smartmovers.co.nz",
    address: {
      streetAddress: "250 Grounsell Crescent",
      addressLocality: "Belmont, Lower Hutt",
      addressRegion: "Wellington",
      postalCode: "5010",
    },
  },
  christchurch: {
    name: "Christchurch",
    telephone:
      process.env.NEXT_PUBLIC_PHONE_NUMBER_CHRISTCHURCH || "03 667 2254",
    email:
      process.env.NEXT_PUBLIC_CHRISTCHURCH_EMAIL ||
      "christchurch@smartmovers.co.nz",
    address: {
      streetAddress: "9 McIntyre Street",
      addressLocality: "Shirley, Christchurch",
      addressRegion: "Canterbury",
      postalCode: "8013",
    },
  },
  hamilton: {
    name: "Hamilton",
    telephone: process.env.NEXT_PUBLIC_PHONE_NUMBER_HAMILTON ,
    email: process.env.NEXT_PUBLIC_HAMILTON_EMAIL || "hamilton@smartmovers.co.nz",
    address: {
      streetAddress: "83 Bryant Road",
      addressLocality: "St Andrews, Hamilton",
      addressRegion: "Waikato",
      postalCode: "3200",
    },
  },
};

export function getBranchForCity(citySlug) {
  const key = citySlug?.toLowerCase?.().trim();
  return cityBranches[key] || cityBranches.auckland;
}

const toTitleCase = (text) =>
  text.replace(
    /\w\S*/g,
    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
  );

/**
 * Derive a clean suburb/location name from the page title or slug, handling
 * both "House Movers Avondale" and "Henderson House Movers" naming, plus
 * inconsistent casing ("HOUSE MOVERS RANGIORA" -> "Rangiora").
 */
export function deriveSuburbName({ title, slug }) {
  const source = title || (slug || "").replace(/-/g, " ");

  const cleaned = source
    // leading "House/Office/Furniture Movers/Removals "
    .replace(/^\s*(house|office|furniture)\s+(movers|removals|removalists)\s+/i, "")
    // trailing "(House )?Movers/Removals"
    .replace(/\s*(house\s+|office\s+|furniture\s+)?(movers|removals|removalists)\s*$/i, "")
    .trim();

  return cleaned ? toTitleCase(cleaned) : "";
}

/** Strip HTML tags and decode a few common entities for plain-text schema fields. */
export function htmlToPlainText(html) {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#8217;|&rsquo;/g, "’")
    .replace(/&#8216;|&lsquo;/g, "‘")
    .replace(/&#8220;|&ldquo;/g, "“")
    .replace(/&#8221;|&rdquo;/g, "”")
    .replace(/&quot;/g, '"')
    .replace(/&#8211;|&ndash;/g, "–")
    .replace(/&#8212;|&mdash;/g, "—")
    .replace(/\s+/g, " ")
    .trim();
}

/** Pull FAQ question/answer pairs out of the ACF "local_faq" sections. */
export function extractFaqs(sections) {
  if (!Array.isArray(sections)) return [];
  return sections
    .filter((section) => section?.acf_fc_layout === "local_faq")
    .flatMap((section) => section.items || [])
    .map((item) => ({
      question: htmlToPlainText(item.question),
      answer: htmlToPlainText(item.answer),
    }))
    .filter((faq) => faq.question && faq.answer);
}
