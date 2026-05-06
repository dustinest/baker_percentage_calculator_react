import { test, expect } from "vitest";
import { readFileSync } from "node:fs";
import { readJsonRecipe } from "../lib/json_recipe";
import { calculateSourDoughStarter, splitStarterAndDough } from "../lib/sourdough.ts";
import { PREDEFINED_RECIPES } from "../lib/recipes.ts";
import { nameStr, NutritionType, RecipeIngredientsType } from "../lib/types.ts";

const assertClose = (actual: number, expected: number, delta: number, msg?: string) =>
  expect(Math.abs(actual - expected), msg).toBeLessThan(delta);

const makeGroup = (flourGrams: number, waterGrams: number): RecipeIngredientsType => ({
  ingredients: [
    ...(flourGrams > 0 ? [{ id: "f", name: "flour", grams: flourGrams, nutrients: [{ type: NutritionType.flour, percent: 100 }] }] : []),
    ...(waterGrams > 0 ? [{ id: "w", name: "water", grams: waterGrams, nutrients: [{ type: NutritionType.water, percent: 100 }] }] : []),
  ],
});

test("calculateSourDoughStarter: 20g flour + 20g water → fridge bumped to 10g", () => {
  const cal = calculateSourDoughStarter(makeGroup(20, 20));
  expect(cal.starter.flour.fridge + cal.starter.liquid.fridge).toEqual(10);
});

test("calculateSourDoughStarter: 5g flour + 5g water → fridge bumped to 10g", () => {
  const cal = calculateSourDoughStarter(makeGroup(5, 5));
  expect(cal.starter.flour.fridge + cal.starter.liquid.fridge).toEqual(10);
});

test("calculateSourDoughStarter: 100g flour + 4g water → fridge not bumped (liquid < 5g)", () => {
  const cal = calculateSourDoughStarter(makeGroup(100, 4));
  expect(cal.starter.flour.fridge + cal.starter.liquid.fridge).toEqual(4);
});

test("calculateSourDoughStarter: 500g flour + 200g water → normal fridge amount", () => {
  const cal = calculateSourDoughStarter(makeGroup(500, 200));
  expect(cal.starter.flour.fridge + cal.starter.liquid.fridge).toEqual(20);
});

interface FixtureIngredient { key: string; grams: number; bakerPercent: number }
interface FixtureGroup { translationKey: string; ingredients: FixtureIngredient[] }
interface Fixture {
  recipe: string;
  levainAlgorithm: { condition: string; fridge: number; flourAmount: number; liquidAmount: number };
  groups: FixtureGroup[];
}

const FIXTURES_DIR = "tests/fixtures";

const ingredientKey = (ing: { id: string; type?: string }): string =>
  ing.id === "starter_from_fridge" ? "SOURDOUGH_STARTER" : (ing.type ?? ing.id);

test("sourdough: split matches fixtures for all 11 recipes", () => {
  for (const jsonRecipe of PREDEFINED_RECIPES) {
    const recipe = readJsonRecipe(jsonRecipe);
    const fixturePath = `${FIXTURES_DIR}/${nameStr(recipe.name)
      .toLowerCase()
      .replace(/ä/g, "a").replace(/ö/g, "o").replace(/ü/g, "u").replace(/õ/g, "o")
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "")
      .replace(/_ja_kaerahelvestega$/, "")}.json`;

    let fixture: Fixture;
    try {
      fixture = JSON.parse(readFileSync(fixturePath, "utf-8"));
    } catch {
      console.warn(`Fixture not found: ${fixturePath}, skipping`);
      continue;
    }

    const split = splitStarterAndDough(recipe.ingredients);

    expect(split.length, `${recipe.name}: group count`).toEqual(fixture.groups.length);

    for (let gi = 0; gi < fixture.groups.length; gi++) {
      const fixtureGroup = fixture.groups[gi];
      const splitGroup = split[gi];

      expect(splitGroup.ingredients.length, `${recipe.name} group[${gi}]: ingredient count`).toEqual(fixtureGroup.ingredients.length);

      for (let ii = 0; ii < fixtureGroup.ingredients.length; ii++) {
        const fi = fixtureGroup.ingredients[ii];
        const si = splitGroup.ingredients[ii];
        const key = ingredientKey(si);

        expect(key, `${recipe.name} group[${gi}][${ii}]: key mismatch`).toEqual(fi.key);
        assertClose(si.grams, fi.grams, 0.1, `${recipe.name} ${fi.key}: expected ${fi.grams}g, got ${si.grams}g`);
      }
    }
  }
});
