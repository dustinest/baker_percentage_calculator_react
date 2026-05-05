import { test, expect } from "vitest";
import { readFileSync } from "node:fs";
import { readJsonRecipe } from "../lib/resolution.ts";
import { splitStarterAndDough } from "../lib/sourdough.ts";
import { recalculateBakerPercentage } from "../lib/baker-percent.ts";
import { computeSummaryWeights } from "../lib/summary-weights.ts";
import { PREDEFINED_RECIPES } from "../lib/recipes.ts";
import { nameStr } from "../lib/types.ts";

const assertClose = (actual: number, expected: number, delta: number, msg?: string) =>
  expect(Math.abs(actual - expected), msg).toBeLessThan(delta);

interface Fixture { recipe: string; totalWeight: { dough: number; others: number; total: number } }

const FIXTURES_DIR = "tests/fixtures";

const fixtureFile = (name: string) =>
  `${FIXTURES_DIR}/${name
    .toLowerCase()
    .replace(/ä/g, "a").replace(/ö/g, "o").replace(/ü/g, "u").replace(/õ/g, "o")
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "")
    .replace(/_ja_kaerahelvestega$/, "")}.json`;

test("grams-consistency: split = baker% = summary = fixture for all 11 recipes", () => {
  for (const jsonRecipe of PREDEFINED_RECIPES) {
    const recipe = readJsonRecipe(jsonRecipe);
    const name = nameStr(recipe.name);
    let fixture: Fixture;
    try {
      fixture = JSON.parse(readFileSync(fixtureFile(name), "utf-8"));
    } catch { continue; }

    const split = splitStarterAndDough(recipe.ingredients);
    const bp = recalculateBakerPercentage(split);
    const summary = computeSummaryWeights(bp);

    const splitTotal = split.flatMap((g) => g.ingredients).reduce((s, i) => s + i.grams, 0);
    const bpTotal = bp.ingredients.flatMap((g) => g.ingredientWithPercent).reduce((s, i) => s + i.grams, 0);

    // baker% must not add or drop grams vs the split
    assertClose(bpTotal, splitTotal, 0.01, `${name}: baker% total !== split total`);

    // summary must equal baker% total
    assertClose(summary.totalGrams, bpTotal, 0.01, `${name}: summary.totalGrams !== baker% total`);

    // all three must match the fixture
    assertClose(summary.totalGrams, fixture.totalWeight.total, 0.5, `${name}: totalGrams !== fixture`);
  }
});
