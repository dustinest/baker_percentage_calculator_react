import { test, expect } from "vitest";
import { readJsonRecipe } from "../lib/resolution.ts";
import { splitStarterAndDough } from "../lib/sourdough.ts";
import { PREDEFINED_RECIPES } from "../lib/recipes.ts";
import { nameStr } from "../lib/types.ts";

const recipe = (et: string) =>
  readJsonRecipe(PREDEFINED_RECIPES.find((r) => nameStr(r.name) === et)!);

const hasMilk = (group: ReturnType<typeof splitStarterAndDough>[0]) =>
  group.ingredients.some((i) => i.type === "MILK_25");

// ── Bug 1: milk rule fires incorrectly, moving milk to Eeltaigen ─────────────
// The milk rule in splitStarterAndDough fires whenever pure water is "fully
// consumed" — which is algebraically always true for recipes hitting the water
// branch. Result: milk ends up in split[0] (Eeltaigen) instead of split[1]
// (Taigen). Reference PDFs show milk must always stay in Taigen.

test("Bug 1: Vastlakuklid — milk stays in Taigen, not Eeltaigen", () => {
  const split = splitStarterAndDough(recipe("Vastlakuklid").ingredients);
  expect(hasMilk(split[0]), "milk must not be in Eeltaigen").toBe(false);
  expect(hasMilk(split[1]), "milk must be in Taigen").toBe(true);
});

test("Bug 1: Kaneelirullid — milk stays in Taigen, not Eeltaigen", () => {
  const split = splitStarterAndDough(recipe("Kaneelirullid").ingredients);
  expect(hasMilk(split[0]), "milk must not be in Eeltaigen").toBe(false);
  expect(hasMilk(split[1]), "milk must be in Taigen").toBe(true);
});

test("Bug 1: Plaadikook — milk stays in Taigen, not Eeltaigen", () => {
  const split = splitStarterAndDough(recipe("Plaadikook").ingredients);
  expect(hasMilk(split[0]), "milk must not be in Eeltaigen").toBe(false);
  expect(hasMilk(split[1]), "milk must be in Taigen").toBe(true);
});

test("Bug 1: Moskva saiakesed — milk stays in Taigen, not Eeltaigen", () => {
  const split = splitStarterAndDough(recipe("Moskva saiakesed").ingredients);
  expect(hasMilk(split[0]), "milk must not be in Eeltaigen").toBe(false);
  expect(hasMilk(split[1]), "milk must be in Taigen").toBe(true);
});

test("Bug 1: Croissant — milk stays in Taigen, not Eeltaigen", () => {
  const split = splitStarterAndDough(recipe("Croissant").ingredients);
  expect(hasMilk(split[0]), "milk must not be in Eeltaigen").toBe(false);
  expect(hasMilk(split[1]), "milk must be in Taigen").toBe(true);
});

// Sanity check: Pikk sai hits the else-branch (water ratio 41.8% > 40%),
// so the milk rule never fires — milk has always been in Taigen correctly.
test("Bug 1 (sanity): Pikk sai — milk already stays in Taigen (not broken)", () => {
  const split = splitStarterAndDough(recipe("Pikk sai").ingredients);
  expect(hasMilk(split[0]), "milk must not be in Eeltaigen").toBe(false);
  expect(hasMilk(split[1]), "milk must be in Taigen").toBe(true);
});

// ── Bug 2: Pannkook second group has no name (no "Taigen" header in display) ─
// In splitStarterAndDough the index > 0 path copies groups verbatim with no
// name defaulting. Pannkook's second group (butter/salt/sugar/egg) has no name
// in the recipe JSON, so it's displayed without a section header, making all
// ingredients appear under one "Eeltaigen" block.

test("Bug 2: Pannkook — produces 2 groups and second group has a name", () => {
  const split = splitStarterAndDough(recipe("Pannkook").ingredients);
  expect(split.length, "should have 2 groups").toEqual(2);
  expect(split[1].name, "second group must have a name for its Taigen header").not.toBeUndefined();
  expect(split[1].name, "second group name must not be null").not.toBeNull();
});
