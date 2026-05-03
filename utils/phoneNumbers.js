const cityPhoneNumbers = {
  auckland: process.env.NEXT_PUBLIC_PHONE_NUMBER,
  hamilton: process.env.NEXT_PUBLIC_PHONE_NUMBER_HAMILTON,
  christchurch: process.env.NEXT_PUBLIC_PHONE_NUMBER_CHRISTCHURCH,
};

export function getPhoneNumberForCity(citySlug) {
  const normalizedSlug = citySlug?.toLowerCase?.().trim();

  return (
    cityPhoneNumbers[normalizedSlug] ||
    process.env.NEXT_PUBLIC_PHONE_NUMBER
  );
}

export function getPhoneHref(phoneNumber) {
  const normalizedNumber = phoneNumber?.replace(/[^\d+]/g, "");

  return normalizedNumber ? `tel:${normalizedNumber}` : undefined;
}

export function getPhoneLinkForCity(citySlug) {
  const phoneNumber = getPhoneNumberForCity(citySlug);

  return {
    phoneNumber,
    phoneHref: getPhoneHref(phoneNumber),
  };
}

export function getQuoteCitySlugFromPathname(pathname) {
  const segments = pathname?.split("/").filter(Boolean) || [];
  const getQuoteIndex = segments.indexOf("get-free-quote");

  if (getQuoteIndex === -1) return "auckland";

  return segments[getQuoteIndex + 1] || "auckland";
}
