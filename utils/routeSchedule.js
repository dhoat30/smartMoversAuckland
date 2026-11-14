const nzDateFormatter = new Intl.DateTimeFormat("en-NZ", {
  timeZone: "Pacific/Auckland",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** A calendar date in New Zealand, independent of the server/browser timezone. */
export function getNewZealandDate(now = new Date()) {
  const parts = Object.fromEntries(
    nzDateFormatter.formatToParts(now).map(({ type, value }) => [type, value]),
  );
  return `${parts.year}-${parts.month}-${parts.day}`;
}

function parseDate(value) {
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  const nz = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  const [year, month, day] = iso
    ? iso.slice(1).map(Number)
    : nz
      ? [Number(nz[3]), Number(nz[2]), Number(nz[1])]
      : [];
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new RangeError(`Invalid route date: ${value}`);
  }
  return date;
}

function addMonths(date, months) {
  const firstDay = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, 1),
  );
  const lastDay = new Date(
    Date.UTC(firstDay.getUTCFullYear(), firstDay.getUTCMonth() + 1, 0),
  ).getUTCDate();
  firstDay.setUTCDate(Math.min(date.getUTCDate(), lastDay));
  return firstDay;
}

function formatDate(date) {
  return [
    String(date.getUTCDate()).padStart(2, "0"),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    date.getUTCFullYear(),
  ].join("/");
}

/**
 * Repeat a schedule monthly after its final day has passed. Always derive it
 * from the original dates so a 31st clamped in February returns to the 31st in
 * March. Both ends of a range move by the same number of calendar months.
 */
export function rollRouteSchedule(attributes, today = getNewZealandDate()) {
  const fields = attributes?.date_type === "fixed"
    ? ["fixed_date"]
    : attributes?.date_type === "date_range"
      ? ["start_date", "end_date"]
      : null;
  if (!fields) throw new RangeError("Unknown route date type");

  const dates = fields.map((field) => parseDate(attributes[field]));
  const end = dates[dates.length - 1];
  if (dates[0] > end) throw new RangeError("Route end date precedes start date");

  const currentDate = parseDate(today);
  let months = Math.max(
    0,
    (currentDate.getUTCFullYear() - end.getUTCFullYear()) * 12 +
      currentDate.getUTCMonth() - end.getUTCMonth(),
  );
  if (addMonths(end, months) < currentDate) months += 1;

  return {
    ...attributes,
    ...Object.fromEntries(
      fields.map((field, index) => [field, formatDate(addMonths(dates[index], months))]),
    ),
  };
}

export function getUpcomingRoutes(cards, today = getNewZealandDate()) {
  return cards.map((card) => ({
    ...card,
    scheduleAttributes: card.attributes,
    attributes: rollRouteSchedule(card.attributes, today),
  }));
}
