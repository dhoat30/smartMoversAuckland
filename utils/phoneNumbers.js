const cityPhoneNumbers = {
  wellington: process.env.NEXT_PUBLIC_PHONE_NUMBER_WELLINGTON,
  christchurch: process.env.NEXT_PUBLIC_PHONE_NUMBER_CHRISTCHURCH,
  auckland: process.env.NEXT_PUBLIC_PHONE_NUMBER,
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

export function getCitySlugFromPathname(pathname) {
  const normalizedPathname = pathname?.toLowerCase?.() || "";

  return (
    Object.keys(cityPhoneNumbers).find((city) =>
      normalizedPathname.includes(city)
    ) || "auckland"
  );
}
