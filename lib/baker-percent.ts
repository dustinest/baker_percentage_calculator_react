import {
  BakerPercentageResult,
  copyIngredientGramsType,
  copyNutrientPercentType,
  DISPLAYABLE_NUTRIENTS_TYPE_ARRAY,
  DRY_NUTRIENTS,
  IngredientWithPercentType,
  MicroNutrientsResultType,
  MicroNutrientsValueType,
  RecipeIngredientsType,
  RecipeIngredientsWithPercentType,
} from "./types.ts";

export const calculateMicroNutrients = (recipeIngredients: RecipeIngredientsType[]): MicroNutrientsResultType => {
  const result = recipeIngredients
    .flatMap((g) => g.ingredients)
    .reduce(
      (total, ingredient) => {
        total.dry_total += ingredient.nutrients.reduce((maxDry, nutrient) => {
          const grams = nutrient.percent > 0 && ingredient.grams > 0
            ? ingredient.grams * nutrient.percent / 100
            : 0;
          if (grams <= 0) return maxDry;

          const existing = total.nutrients[nutrient.type];
          total.nutrients[nutrient.type] = {
            grams: (existing?.grams ?? 0) + grams,
            percent: 0,
            type: nutrient.type,
          } as MicroNutrientsValueType;

          return DRY_NUTRIENTS.includes(nutrient.type) ? Math.max(grams, maxDry) : maxDry;
        }, 0);
        return total;
      },
      { dry_total: 0, nutrients: {} } as MicroNutrientsResultType,
    );

  if (result.dry_total > 0) {
    for (const nutrient of Object.values(result.nutrients) as MicroNutrientsValueType[]) {
      nutrient.percent = nutrient.grams * 100 / result.dry_total;
    }
  }
  return result;
};

export const recalculateBakerPercentage = (ingredients: RecipeIngredientsType[]): BakerPercentageResult => {
  const microNutrients = calculateMicroNutrients(ingredients);
  const percentages: RecipeIngredientsWithPercentType[] = ingredients.map((group) => {
    const ingredientWithPercent: IngredientWithPercentType[] = group.ingredients.map((ing) => ({
      id: ing.id,
      name: ing.name,
      type: ing.type,
      nutrients: ing.nutrients.map(copyNutrientPercentType),
      grams: ing.grams,
      percent: microNutrients.dry_total > 0 && ing.grams > 0
        ? ing.grams * 100 / microNutrients.dry_total
        : 0,
    }));
    return {
      name: group.name,
      starter: group.starter,
      ingredients: group.ingredients.map(copyIngredientGramsType),
      ingredientWithPercent,
    } as RecipeIngredientsWithPercentType;
  });
  return { microNutrients, ingredients: percentages };
};

export const DISPLAYABLE_NUTRIENTS = DISPLAYABLE_NUTRIENTS_TYPE_ARRAY;
