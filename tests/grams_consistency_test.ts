import { assertAlmostEquals } from "@std/assert";
import { readJsonRecipe } from "../lib/resolution.ts";
import { splitStarterAndDough } from "../lib/sourdough.ts";
import { recalculateBakerPercentage } from "../lib/baker-percent.ts";
import { computeSummaryWeights } from "../lib/summary-weights.ts";
import { PREDEFINED_RECIPES } from "../lib/recipes.ts";
import { nameStr } from "../lib/types.ts";

interface Fixture { recipe: string; totalWeight: { dough: number; others: number; total: number } }

const FIXTURES_DIR = "tests/fixtures";

const fixtureFile = (name: string) =>
  `${FIXTURES_DIR}/${name
    .toLowerCase()
    .replace(/ä/g, "a").replace(/ö/g, "o").replace(/ü/g, "u").replace(/õ/g, "o")
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "")
    .replace(/_ja_kaerahelvestega$/, "")}.json`;

Deno.test("grams-consistency: split = baker% = summary = fixture for all 11 recipes", async () => {
  for (const jsonRecipe of PREDEFINED_RECIPES) {
    const recipe = readJsonRecipe(jsonRecipe);
    const name = nameStr(recipe.name);
    let fixture: Fixture;
    try {
      fixture = JSON.parse(await Deno.readTextFile(fixtureFile(name)));
    } catch { continue; }

    const split = splitStarterAndDough(recipe.ingredients);
    const bp = recalculateBakerPercentage(split);
    const summary = computeSummaryWeights(bp);

    const splitTotal = split.flatMap((g) => g.ingredients).reduce((s, i) => s + i.grams, 0);
    const bpTotal = bp.ingredients.flatMap((g) => g.ingredientWithPercent).reduce((s, i) => s + i.grams, 0);

    // baker% must not add or drop grams vs the split
    assertAlmostEquals(bpTotal, splitTotal, 0.01, `${name}: baker% total !== split total`);

    // summary must equal baker% total
    assertAlmostEquals(summary.totalGrams, bpTotal, 0.01, `${name}: summary.totalGrams !== baker% total`);

    // all three must match the fixture
    assertAlmostEquals(summary.totalGrams, fixture.totalWeight.total, 0.5, `${name}: totalGrams !== fixture`);
  }
});
