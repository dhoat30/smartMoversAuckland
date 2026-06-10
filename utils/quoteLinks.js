const cityQuotePaths = {
  auckland: "/get-free-quote/auckland",
  hamilton: "/get-free-quote/hamilton",
  christchurch: "/get-free-quote/christchurch",
  thames: "/get-free-quote/thames",
  wellington: "/get-free-quote/wellington",
  whangarei: "/get-free-quote/whangarei",
};

export function getQuoteLinkFromPathname(pathname) {
  const normalizedPathname = pathname?.toLowerCase?.() || "";
  const city = Object.keys(cityQuotePaths).find((citySlug) =>
    normalizedPathname.includes(citySlug)
  );

  return city ? cityQuotePaths[city] : "/get-free-quote";
}
