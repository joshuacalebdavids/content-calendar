import { describe, expect, it } from "vitest";
import { getCalendarDays, shiftMonth, toDateKey } from "./calendar";

describe("calendar utilities", () => {
  it("builds a six-week Monday-first calendar", () => {
    const days = getCalendarDays(2026, 7);
    expect(days).toHaveLength(42);
    expect(days[0].date).toBe("2026-07-27");
    expect(days[41].date).toBe("2026-09-06");
  });

  it("moves cleanly across year boundaries", () => {
    expect(shiftMonth(2026, 11, 1)).toEqual({ year: 2027, month: 0 });
    expect(shiftMonth(2026, 0, -1)).toEqual({ year: 2025, month: 11 });
  });

  it("creates local date keys without timezone conversion", () => {
    expect(toDateKey(new Date(2026, 7, 11))).toBe("2026-08-11");
  });
});
