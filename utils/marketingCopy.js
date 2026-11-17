const retiredTransitClaim =
  /\b(?:full\s+transit\s+insurance|fully\s+insured(?:\s+for\s+full)?\s+transit)\b/gi;

// Apply current wording after reading CMS data, including cached responses.
export function updateMarketingCopy(value) {
  if (typeof value === "string") {
    return value.replace(retiredTransitClaim, (claim) =>
      /^[A-Z]/.test(claim)
        ? "Careful furniture handling"
        : "careful furniture handling",
    );
  }

  if (Array.isArray(value)) {
    return value.map(updateMarketingCopy);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, updateMarketingCopy(item)]),
    );
  }

  return value;
}
