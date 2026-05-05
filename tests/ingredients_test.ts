import { test, expect } from "vitest";
import { getIngredientGrams } from "../lib/ingredients.ts";

test("ingredients: BUTTER_82 key resolves with correct type and id", () => {
  const ing = getIngredientGrams("BUTTER_82", 100);
  expect(ing).toBeDefined();
  expect(ing!.type).toBe("BUTTER_82");
  expect(ing!.id).toContain("butter.fat_82");
});

test("ingredients: old BUTTER key no longer resolves", () => {
  expect(getIngredientGrams("BUTTER", 100)).toBeUndefined();
});

test("ingredients: WHEAT_405_FLOUR id contains ash_405", () => {
  const ing = getIngredientGrams("WHEAT_405_FLOUR", 100);
  expect(ing).toBeDefined();
  expect(ing!.id).toContain("flour.wheat.ash_405");
});

test("ingredients: WHEAT_550_FLOUR id contains ash_550", () => {
  const ing = getIngredientGrams("WHEAT_550_FLOUR", 100);
  expect(ing).toBeDefined();
  expect(ing!.id).toContain("flour.wheat.ash_550");
});
