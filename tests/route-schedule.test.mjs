import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  getNewZealandDate,
  getUpcomingRoutes,
  rollRouteSchedule,
} from "../utils/routeSchedule.js";

const range = (start, end) => ({
  date_type: "date_range",
  start_date: start,
  end_date: end,
  number_of_movers: "2",
  truck_size: "45",
});
const fixed = (date) => ({ date_type: "fixed", fixed_date: date });

test("8–21 August becomes 8–21 September on 22 August", () => {
  const result = rollRouteSchedule(range("08/08/2026", "21/08/2026"), "2026-08-22");
  assert.equal(result.start_date, "08/09/2026");
  assert.equal(result.end_date, "21/09/2026");
});

test("a range remains available through its end date", () => {
  const schedule = range("08/08/2026", "21/08/2026");
  for (const today of ["2026-08-01", "2026-08-08", "2026-08-15", "2026-08-21"]) {
    assert.deepEqual(rollRouteSchedule(schedule, today), schedule);
  }
});

test("fixed dates roll the next day, never on the listed date", () => {
  const schedule = fixed("29/08/2026");
  assert.equal(rollRouteSchedule(schedule, "2026-08-29").fixed_date, "29/08/2026");
  assert.equal(rollRouteSchedule(schedule, "2026-08-30").fixed_date, "29/09/2026");
});

test("old schedules catch up over several months and years", () => {
  const result = rollRouteSchedule(range("08/08/2026", "21/08/2026"), "2028-11-22");
  assert.equal(result.start_date, "08/12/2028");
  assert.equal(result.end_date, "21/12/2028");
});

test("a future schedule is never pulled backwards", () => {
  const schedule = range("08/08/2028", "21/08/2028");
  assert.deepEqual(rollRouteSchedule(schedule, "2026-11-15"), schedule);
});

test("both dates of a cross-month range move together", () => {
  const schedule = range("25/08/2026", "02/09/2026");
  assert.deepEqual(rollRouteSchedule(schedule, "2026-09-02"), schedule);
  const result = rollRouteSchedule(schedule, "2026-09-03");
  assert.equal(result.start_date, "25/09/2026");
  assert.equal(result.end_date, "02/10/2026");
});

test("rollovers cross December and January correctly", () => {
  assert.equal(rollRouteSchedule(fixed("31/12/2026"), "2027-01-01").fixed_date, "31/01/2027");
  const result = rollRouteSchedule(range("26/12/2026", "05/01/2027"), "2027-01-06");
  assert.equal(result.start_date, "26/01/2027");
  assert.equal(result.end_date, "05/02/2027");
});

test("month-end dates clamp without drifting in later months", () => {
  const schedule = fixed("31/01/2026");
  assert.equal(rollRouteSchedule(schedule, "2026-02-01").fixed_date, "28/02/2026");
  assert.equal(rollRouteSchedule(schedule, "2026-02-28").fixed_date, "28/02/2026");
  assert.equal(rollRouteSchedule(schedule, "2026-03-01").fixed_date, "31/03/2026");
  const result = rollRouteSchedule(range("29/01/2026", "31/01/2026"), "2026-02-01");
  assert.equal(result.start_date, "28/02/2026");
  assert.equal(result.end_date, "28/02/2026");
});

test("February handles leap years", () => {
  assert.equal(rollRouteSchedule(fixed("31/01/2028"), "2028-02-01").fixed_date, "29/02/2028");
  assert.equal(rollRouteSchedule(fixed("29/02/2024"), "2025-02-01").fixed_date, "28/02/2025");
});

test("today follows New Zealand midnight in standard and daylight time", () => {
  assert.equal(getNewZealandDate(new Date("2026-08-21T11:59:59Z")), "2026-08-21");
  assert.equal(getNewZealandDate(new Date("2026-08-21T12:00:00Z")), "2026-08-22");
  assert.equal(getNewZealandDate(new Date("2026-11-14T10:59:59Z")), "2026-11-14");
  assert.equal(getNewZealandDate(new Date("2026-11-14T11:00:00Z")), "2026-11-15");
});

test("invalid or reversed dates fail clearly instead of silently rolling", () => {
  for (const date of [null, "", "31/02/2026", "29/02/2025", "not-a-date"]) {
    assert.throws(() => rollRouteSchedule(fixed(date), "2026-08-22"), /Invalid route date/);
  }
  assert.throws(() => rollRouteSchedule(range("25/08/2026", "02/07/2026"), "2026-08-22"), /precedes/);
});

test("rolling leaves the stored schedule and other route details untouched", () => {
  const attributes = Object.freeze(range("08/08/2026", "21/08/2026"));
  const original = Object.freeze({ id: "test-route", description: "Shared load", attributes });
  const [result] = getUpcomingRoutes([original], "2026-08-22");
  assert.equal(result.attributes.start_date, "08/09/2026");
  assert.equal(result.attributes.number_of_movers, "2");
  assert.equal(result.attributes.truck_size, "45");
  assert.equal(result.description, original.description);
  assert.equal(result.scheduleAttributes, attributes);
  assert.equal(original.attributes.start_date, "08/08/2026");
});

test("every local listing has a unique ID and a valid recurring schedule", async () => {
  const { cards } = JSON.parse(await readFile(new URL("../data/long-distance-routes.json", import.meta.url), "utf8"));
  assert.ok(cards.length > 0);
  assert.equal(new Set(cards.map(({ id }) => id)).size, cards.length);
  const toISO = (date) => date.split("/").reverse().join("-");
  for (const today of ["2026-11-15", "2027-02-28", "2028-02-29", "2028-12-31"]) {
    const upcoming = getUpcomingRoutes(cards, today);
    assert.equal(upcoming.length, cards.length);
    for (const { id, attributes: a } of upcoming) {
      const end = a.date_type === "fixed" ? a.fixed_date : a.end_date;
      assert.ok(toISO(end) >= today, `${id} must not be expired`);
      if (a.date_type === "date_range") assert.ok(toISO(a.start_date) <= toISO(end), `${id} must stay ordered`);
    }
  }
});
