# Local long-distance route listings

The source for `/intercity-movers/long-distance-routes` is
`data/long-distance-routes.json`. It contains 176 listings: the original 145
imported from the CMS and 31 added locally, plus the listing page's metadata
and footer social links. This page no
longer fetches WordPress data. Other CMS-backed pages, including the quote page's
surrounding content, still use WordPress.

Edit the JSON file and deploy to change destinations, descriptions, capacity,
status, truck size or crew size. Keep each card's `id` unique and stable; multiple
listings for the same pair of cities are supported. Social icons are in
`public/social/`.

## Added destinations

The 31 new listings fill missing connections from these four origins without
duplicating an existing origin/destination pair:

- Auckland (8): Blenheim, Hastings, Napier, New Plymouth, Palmerston North,
  Rotorua, Taupō and Whakatāne.
- Christchurch (2): New Plymouth and Whakatāne.
- Hamilton (4): Hastings, New Plymouth, Taupō and Whakatāne.
- Wellington (17): Blenheim, Dunedin, Gisborne, Hamilton, Hastings,
  Invercargill, Kerikeri, Napier, Nelson, New Plymouth, Palmerston North,
  Queenstown, Rotorua, Taupō, Tauranga, Whakatāne and Whangārei.

These listings use flexible monthly windows from the 1st to the last day of
the month (anchored to 1–31 August 2026). The requested moving date is confirmed
through the quote flow. Crew size, truck size and spare capacity are `null`
until supplied: the cards omit those details and quote summaries label them
"To be confirmed". Existing listings retain their original values.

## Recurring dates

Dates use `DD/MM/YYYY`. Keep the original dates in the file: the application
calculates the current occurrence without writing back to disk.

- `date_type: "fixed"` uses `fixed_date`.
- `date_type: "date_range"` uses `start_date` and `end_date`.
- A listing remains on its current occurrence through the end of its final day
  in `Pacific/Auckland`. It moves forward only when that day is in the past.
- Both ends of a range move by the same number of calendar months. For example,
  8–21 August becomes 8–21 September on 22 August; 25 August–2 September becomes
  25 September–2 October on 3 September.
- If several months have elapsed, the calculation skips directly to the first
  occurrence whose end date is today or later.
- Days absent from a month are clamped to its last day. The original day is
  retained as the anchor, so a 31st becomes 28 February and then 31 March.
- Dates spanning months or years, leap years and NZ daylight saving are handled.
- Capacity and status remain the values in the file; date rollover does not
  calculate booking availability.

The page renders on each request because it reads `searchParams`, so server
HTML contains current dates without requiring a rebuild or cron job. Open tabs
check the NZ date once a minute and on focus/visibility changes. The date filter
uses the rolled dates. Selected cards retain their original schedule in session
storage so the quote card and submitted route summary also stay current.

The original Nelson → Dunedin listing had an end date before its start date.
With the owner's confirmation, it was corrected to 25 August–2 September 2026,
which repeats from the 25th to the 2nd of the following month.

Run `npm test` for the date rollover and local-data validation checks.
