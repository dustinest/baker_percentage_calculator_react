import { DRY_NUTRIENTS, IngredientGramsType, NutrientPercentType, NutritionType } from "../types.ts";
import { getCustomIngredient, getIngredientGrams } from "../ingredients.ts";

const utf8ToBase64 = (str: string): string => {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
};

const base64Encode = (...values: (string | number)[]): string => {
  const str = values.length === 1 ? values[0].toString() : JSON.stringify(values);
  return utf8ToBase64(str);
};

const resolveJsonExtraStandardIngredient = (
  ingredient: { type: string; name: string; id?: string },
  grams: number,
): string => {
  if (ingredient.id) return ingredient.id;
  return base64Encode("json", "ingredient", ingredient.type, ingredient.name, grams);
};

export type RawIngredient = {
  type?: string;
  grams?: number;
  percent?: number;
  name?: string;
  id?: string;
  nutrients?: NutrientPercentType[];
};

export const readJsonIngredient = (
  ingredient: RawIngredient,
): { ing: IngredientGramsType; grams?: number; percent?: number } => {
  if (ingredient.type == null) throw new Error(`Type is required`);

  if (ingredient.type === "DRY") {
    if (!ingredient.name) throw new Error(`.name required for DRY type`);
    const id = resolveJsonExtraStandardIngredient(
      { type: "DRY", name: ingredient.name, id: ingredient.id || undefined },
      ingredient.grams ?? 100,
    );
    const dryNutrients: NutrientPercentType[] = [{ type: NutritionType.dry, percent: 100 }];
    if (ingredient.nutrients && ingredient.nutrients.length > 0) {
      dryNutrients.push(...ingredient.nutrients);
    }
    return {
      ing: getCustomIngredient(id, ingredient.name, ingredient.grams ?? 100, dryNutrients, "DRY"),
      grams: ingredient.grams,
      percent: ingredient.percent,
    };
  }

  const ingredientGrams = getIngredientGrams(ingredient.type, ingredient.grams ?? 100);
  if (ingredientGrams != null) return { ing: ingredientGrams, grams: ingredient.grams, percent: ingredient.percent };

  throw new Error(`Could not resolve type ${ingredient.type}`);
};
