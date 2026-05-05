import { BakerPercentageResult } from "./types.ts";

export interface SummaryWeights {
  doughGrams: number;
  customGroups: Array<{ name: Record<string, string>; grams: number }>;
  totalGrams: number;
  showDough: boolean;
}

// Computes the footer weight summary shown in RecipePreview.
// doughGrams = all dough weight (Eeltaigen + Taigen combined).
// customGroups = extra named groups (Kihistamiseks, Kaanelikiht, etc.).
export function computeSummaryWeights(bp: BakerPercentageResult): SummaryWeights {
  const groupTotals = bp.ingredients.map((g) => ({
    name: g.name,
    grams: g.ingredientWithPercent.reduce((s, i) => s + i.grams, 0),
  }));
  const totalGrams = groupTotals.reduce((s, g) => s + g.grams, 0);
  const customGroups = groupTotals.filter(
    (g) => g.name && typeof g.name === "object",
  ) as Array<{ name: Record<string, string>; grams: number }>;
  const doughGrams = totalGrams - customGroups.reduce((s, g) => s + g.grams, 0);
  const showDough = customGroups.length > 0;
  return { doughGrams, customGroups, totalGrams, showDough };
}
