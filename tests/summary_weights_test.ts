import { test, expect } from "vitest";
import { readJsonRecipe } from "../lib/resolution.ts";
import { splitStarterAndDough } from "../lib/sourdough.ts";
import { recalculateBakerPercentage } from "../lib/baker-percent.ts";
import { computeSummaryWeights } from "../lib/summary-weights.ts";
import { PREDEFINED_RECIPES } from "../lib/recipes.ts";
import { nameStr } from "../lib/types.ts";

const assertClose = (actual: number, expected: number, delta: number, msg?: string) =>
  expect(Math.abs(actual - expected), msg).toBeLessThan(delta);

const bp = (et: string) => {
  const r = readJsonRecipe(PREDEFINED_RECIPES.find((r) => nameStr(r.name) === et)!);
  return recalculateBakerPercentage(splitStarterAndDough(r.ingredients));
};

// ── Bug 4: "Taigen: Xg" excludes Eeltaigen weight ───────────────────────────
// computeSummaryWeights filters out the Eeltaigen group before computing
// doughGrams, so only the Taigen group weight is shown. Reference PDFs show
// "Taigen" must equal Eeltaigen + Taigen combined (everything except extra
// groups like Kihistamiseks / Kaanelikiht).
// Consequence: doughGrams + customGroupsGrams ≠ totalGrams (internally broken).

test("Bug 4: Croissant — doughGrams includes Eeltaigen (887g, not 467g)", () => {
  const { doughGrams, customGroups, totalGrams } = computeSummaryWeights(bp("Croissant"));
  const customTotal = customGroups.reduce((s, g) => s + g.grams, 0);
  assertClose(doughGrams, 887, 1, "dough weight (Eeltaigen + Taigen) should be 887g");
  assertClose(doughGrams + customTotal, totalGrams, 1, "doughGrams + Kihistamiseks must equal Kokku");
});

test("Bug 4: Kaneelirullid — doughGrams includes Eeltaigen (907g, not 531g)", () => {
  const { doughGrams, customGroups, totalGrams } = computeSummaryWeights(bp("Kaneelirullid"));
  const customTotal = customGroups.reduce((s, g) => s + g.grams, 0);
  assertClose(doughGrams, 907, 1, "dough weight (Eeltaigen + Taigen) should be 907g");
  assertClose(doughGrams + customTotal, totalGrams, 1, "doughGrams + Kaanelikiht must equal Kokku");
});

test("Bug 4: Moskva saiakesed — doughGrams includes Eeltaigen (746g, not 346g)", () => {
  const { doughGrams, customGroups, totalGrams } = computeSummaryWeights(bp("Moskva saiakesed"));
  const customTotal = customGroups.reduce((s, g) => s + g.grams, 0);
  assertClose(doughGrams, 746, 1, "dough weight (Eeltaigen + Taigen) should be 746g");
  assertClose(doughGrams + customTotal, totalGrams, 1, "doughGrams + Kihistamiseks must equal Kokku");
});

// Sanity checks: recipes without extra groups should still work correctly
// (showDough = false, doughGrams + 0 = totalGrams).
test("Bug 4 (sanity): Vastlakuklid — no extra groups, doughGrams = totalGrams", () => {
  const { doughGrams, customGroups, totalGrams } = computeSummaryWeights(bp("Vastlakuklid"));
  assertClose(doughGrams + customGroups.reduce((s, g) => s + g.grams, 0), totalGrams, 1);
});
