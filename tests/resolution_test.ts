import { test, expect } from "vitest";
import { readJsonRecipe, recipeToJson } from "../lib/json_recipe";
import { PREDEFINED_RECIPES } from "../lib/recipes.ts";
import { nameStr, NutritionType } from "../lib/types.ts";

const assertClose = (actual: number, expected: number, delta: number, msg?: string) =>
  expect(Math.abs(actual - expected), msg).toBeLessThan(delta);

// Expected resolved grams for percent-based ingredients per recipe
const EXPECTED: Record<string, Record<string, number>> = {
  "Täisteraleib":   { WATER: 425, SALT: 7.5 },
  "Sai":            { WATER: 378.8, SALT: 7.5 },
  "Sai seemnete ja kaerahelvestega": { WATER: 357, SALT: 7.5 },
  "Croissant":      { SUGAR: 55, SALT: 12 },
  "Vastlakuklid":   { CARDAMOM: 1 },
  "Kaneelirullid":  { CARDAMOM: 1, CINNAMON: 15.8 },
};

test("resolution: percent-based ingredients resolve to correct grams", () => {
  for (const jsonRecipe of PREDEFINED_RECIPES) {
    const recipe = readJsonRecipe(jsonRecipe);
    const expected = EXPECTED[nameStr(recipe.name)];
    if (!expected) continue;

    const allIngredients = recipe.ingredients.flatMap((g) => g.ingredients);
    for (const [key, expectedGrams] of Object.entries(expected)) {
      const found = allIngredients.find((i) => i.type === key);
      if (!found) throw new Error(`${recipe.name}: ingredient ${key} not found`);
      assertClose(
        found.grams, expectedGrams, 0.1,
        `${recipe.name} ${key}: expected ${expectedGrams}g, got ${found.grams}g`,
      );
    }
  }
});

test("resolution: grams-based ingredients pass through unchanged", () => {
  const sai = readJsonRecipe(PREDEFINED_RECIPES.find((r) => nameStr(r.name) === "Sai")!);
  const flour = sai.ingredients[0].ingredients.find((i) => i.type === "WHEAT_550_FLOUR");
  expect(flour?.grams).toEqual(462);
});

test("resolution: all 11 recipes resolve without error", () => {
  expect(PREDEFINED_RECIPES.length).toEqual(11);
  for (const r of PREDEFINED_RECIPES) {
    readJsonRecipe(r); // must not throw
  }
});

// ── Edge cases exercised by the HasValue / undefined-distinction pattern ───────

test("resolution: grams: 0 is treated as explicit zero, not as missing", () => {
  // If the code confuses 'grams === undefined' with 'grams === 0' (e.g. by using
  // || instead of !== undefined), a 0g ingredient would be assigned the default
  // grams (100) or treated as percent-based. The correct result is 0g.
  const recipe = readJsonRecipe({
    name: "test",
    ingredients: [{
      ingredients: [
        { type: "WHEAT_550_FLOUR", grams: 100 },
        { type: "WATER", grams: 0 },
      ],
    }],
  });
  const water = recipe.ingredients[0].ingredients.find((i) => i.type === "WATER");
  expect(water?.grams).toEqual(0);
});

test("resolution: DRY ingredient without extra nutrients has only the dry nutrient", () => {
  const recipe = readJsonRecipe({
    name: "test",
    ingredients: [{
      ingredients: [
        { type: "WHEAT_550_FLOUR", grams: 100 },
        { type: "DRY", name: "Plain dry", grams: 10 },
      ],
    }],
  });
  const dry = recipe.ingredients[0].ingredients.find((i) => i.name === "Plain dry");
  expect(dry?.nutrients).toEqual([{ type: NutritionType.dry, percent: 100 }]);
});

test("resolution: DRY ingredient with extra nutrients includes them alongside dry", () => {
  // If the code fails to check whether nutrients were provided (e.g. treats an
  // empty default array as 'nutrients were explicitly given'), extra nutrients
  // would be incorrectly added or omitted.
  const recipe = readJsonRecipe({
    name: "test",
    ingredients: [{
      ingredients: [
        { type: "WHEAT_550_FLOUR", grams: 100 },
        { type: "DRY", name: "Enriched dry", grams: 10, nutrients: [{ type: "protein", percent: 80 }] },
      ],
    }],
  });
  const dry = recipe.ingredients[0].ingredients.find((i) => i.name === "Enriched dry");
  const types = dry?.nutrients.map((n) => n.type);
  expect(types).toContain(NutritionType.dry);
  expect(types).toContain(NutritionType.protein);
});

// ── recipeToJson ──────────────────────────────────────────────────────────────

test("recipeToJson: round-trips a grams-based recipe without data loss", () => {
  const original = PREDEFINED_RECIPES.find((r) => nameStr(r.name) === "Sai")!;
  const roundTripped = recipeToJson(readJsonRecipe(original));

  const origIngredients = original.ingredients.flatMap((g) => g.ingredients);
  const rtIngredients = roundTripped.ingredients.flatMap((g) => g.ingredients);
  expect(rtIngredients.length).toEqual(origIngredients.length);
  for (const ing of origIngredients) {
    if (ing.grams !== undefined) {
      const found = rtIngredients.find((i) => i.type === ing.type);
      expect(found?.grams, `grams for ${ing.type}`).toEqual(ing.grams);
    }
  }
});

test("recipeToJson: preserves bakingTime and innerTemperature intervals", () => {
  const täis = PREDEFINED_RECIPES.find((r) => nameStr(r.name) === "Täisteraleib")!;
  const rt = recipeToJson(readJsonRecipe(täis));

  expect(rt.bakingTime).toBeDefined();
  expect(rt.innerTemperature).toBeDefined();
  // single-value temperature collapses to a number
  expect(typeof (rt.bakingTime![0].temperature)).toEqual("number");
  // range stays an object
  const rangeStep = rt.bakingTime!.find((bt) => typeof bt.time === "object");
  if (rangeStep) expect(typeof rangeStep.time).toEqual("object");
});

test("recipeToJson: amount > 1 is preserved, amount 1 is omitted", () => {
  const base = PREDEFINED_RECIPES[0];
  const with1 = recipeToJson(readJsonRecipe({ ...base, amount: 1 }));
  const with2 = recipeToJson(readJsonRecipe({ ...base, amount: 2 }));
  expect(with1.amount).toBeUndefined();
  expect(with2.amount).toEqual(2);
});
