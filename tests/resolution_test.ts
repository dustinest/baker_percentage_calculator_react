import { test, expect } from "vitest";
import { readJsonRecipe } from "../lib/resolution.ts";
import { PREDEFINED_RECIPES } from "../lib/recipes.ts";
import { nameStr } from "../lib/types.ts";

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
