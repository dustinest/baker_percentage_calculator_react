import { test, expect } from "vitest";
import { intervalStr } from "../lib/types.ts";

test("intervalStr: single value when from === until", () => {
  expect(intervalStr({ from: 20, until: 20 })).toBe("20");
});

test("intervalStr: range with em-dash when from !== until", () => {
  expect(intervalStr({ from: 20, until: 30 })).toBe("20–30");
});

test("intervalStr: temperatures display correctly", () => {
  expect(intervalStr({ from: 240, until: 240 })).toBe("240");
  expect(intervalStr({ from: 82, until: 88 })).toBe("82–88");
});
