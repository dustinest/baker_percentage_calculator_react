import { test, expect } from "vitest";
import { readJsonRecipe } from "../lib/resolution.ts";
import { splitStarterAndDough } from "../lib/sourdough.ts";
import { PREDEFINED_RECIPES } from "../lib/recipes.ts";
import { nameStr, NutritionType, RecipeIngredientsType } from "../lib/types.ts";

const assertClose = (actual: number, expected: number, delta: number, msg?: string) =>
  expect(Math.abs(actual - expected), msg).toBeLessThan(delta);

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

// ── Bug 3: fillSlot else-branch — small flour ingredient grams inflated ───────
// When the first flour ingredient is smaller than the levain flour quota,
// fillSlot's else-branch runs. The bug:
//   1. Pushed slot.amount (the full remaining quota) instead of ingredient.grams
//   2. Never incremented `counted`, so every subsequent ingredient also saw the
//      full remaining quota and was over-allocated
// A recipe with two flour ingredients [50g rye, 450g wheat] and 300g water
// gives a starter flour quota of ~120g. The rye (50g < 120g) triggers the else
// branch. Correct behaviour: rye fully consumed into levain at 50g; quota counter
// advances to 50 so wheat is asked for only the remaining 70g.

test("Bug 3: small first-flour ingredient is consumed into levain at its actual grams", () => {
  const group: RecipeIngredientsType = {
    ingredients: [
      { id: "small_rye",    name: "Rye",   grams: 50,  nutrients: [{ type: NutritionType.flour, percent: 100 }] },
      { id: "large_wheat",  name: "Wheat", grams: 450, nutrients: [{ type: NutritionType.flour, percent: 100 }] },
      { id: "water",        name: "Water", grams: 300, nutrients: [{ type: NutritionType.water, percent: 100 }] },
    ],
  };

  const split = splitStarterAndDough([group]);
  const levain = split[0];
  const dough  = split[1];

  // Rye (50g) is smaller than the quota (~120g), so it goes entirely into
  // the levain. With the bug it was assigned `remaining` (120) grams instead.
  const ryeInLevain = levain.ingredients.find((i) => i.id === "small_rye");
  expect(ryeInLevain, "rye must appear in levain").toBeDefined();
  assertClose(ryeInLevain!.grams, 50, 0.1, "rye in levain must be its actual 50g, not the quota amount");

  // Rye was fully consumed, so it must not appear in the dough.
  const ryeInDough = dough?.ingredients.find((i) => i.id === "small_rye");
  expect(ryeInDough, "rye must not appear in dough (fully consumed by levain)").toBeUndefined();

  // Mass conservation: all flour must end up somewhere (levain + dough + fridge portion).
  // The fridge starter ingredient is 50% flour + 50% water, so half its grams are flour.
  const fridgeGrams = levain.ingredients.find((i) => i.id === "starter_from_fridge")!.grams;
  const flourInLevain = levain.ingredients
    .filter((i) => i.id !== "starter_from_fridge" && i.id !== "water")
    .reduce((s, i) => s + i.grams, 0);
  const flourInDough = (dough?.ingredients ?? [])
    .filter((i) => i.id !== "water")
    .reduce((s, i) => s + i.grams, 0);
  assertClose(flourInLevain + flourInDough + fridgeGrams / 2, 500, 1, "flour mass must be conserved");
});
