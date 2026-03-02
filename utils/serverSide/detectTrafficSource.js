export function detectTrafficSource(clickIds = {}, referrer = "") {
  const utmSource = (clickIds.utm_source || "").toLowerCase().trim();
  const utmMedium = (clickIds.utm_medium || "").toLowerCase().trim();
  const ref = (referrer || "").toLowerCase().trim();

  // 1) Strong signals
  if (clickIds.gclid || clickIds.gbraid || clickIds.wbraid) return "Google Ads";
  if (clickIds.fbclid || clickIds.fbc || clickIds.fbp) return "Facebook Ads";

  // 2) UTMs
  if (utmSource.includes("google") || (utmMedium === "cpc" && utmSource))
    return "Google";
  if (
    ["facebook", "fb", "instagram", "ig", "meta"].some((k) =>
      utmSource.includes(k),
    )
  )
    return "Facebook";

  // 3) Referrer fallback (optional)
  if (ref.includes("google")) return "Organic Google";
  if (ref.includes("facebook") || ref.includes("instagram"))
    return "Organic Social";

  return "Direct";
}
