const cityPhoneNumbers = {
  wellington: process.env.NEXT_PUBLIC_PHONE_NUMBER_WELLINGTON || "04 887 2270",
  christchurch:
    process.env.NEXT_PUBLIC_PHONE_NUMBER_CHRISTCHURCH || "03 667 2254",
  auckland: process.env.NEXT_PUBLIC_PHONE_NUMBER || "09 873 4212",
  hamilton: process.env.NEXT_PUBLIC_PHONE_NUMBER_HAMILTON || "0800 001 656",
};

const restOfNewZealandPhoneNumber =
  process.env.NEXT_PUBLIC_PHONE_NUMBER_REST_OF_NEW_ZEALAND || "0800 001 656";

export function getPhoneNumberForCity(citySlug) {
  const normalizedSlug = citySlug?.toLowerCase?.().trim();

  return cityPhoneNumbers[normalizedSlug] || restOfNewZealandPhoneNumber;
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

export function getCitySlugFromPathname(pathname) {
  const normalizedPathname = pathname?.toLowerCase?.() || "";

  return (
    Object.keys(cityPhoneNumbers).find((city) =>
      normalizedPathname.includes(city)
    ) || "rest-of-new-zealand"
  );
}
