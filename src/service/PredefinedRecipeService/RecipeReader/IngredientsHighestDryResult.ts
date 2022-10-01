import {DRY_NUTRIENTS, RecipeIngredientsType} from "../../../types/index";

export type FindHighestDryResult = {
  ingredients: number,
  ingredient: number,
  total: number
};

export const findHighestDryResult = async (ingredients: RecipeIngredientsType[]): Promise<FindHighestDryResult | null> => {
  if (ingredients.length === 0) return null;
  const result = {
    ingredients: -1,
    ingredient: -1,
    total: 0
  } as FindHighestDryResult;

  let highest = 0;

  ingredients.forEach((ingredients, ingredientsIndex) => {
    ingredients.ingredients.forEach((ingredient, ingredientIndex) => {
      const total = ingredient.nutrients.filter(nutrient => DRY_NUTRIENTS.includes(nutrient.type) && nutrient.percent > 0).reduce((maxDry, nutrient) => {
        const grams = ingredient.grams > 0 ? ingredient.grams * nutrient.percent / 100 : 0;
        if (grams <= 0) return maxDry;
        if (DRY_NUTRIENTS.includes(nutrient.type)) {
          return Math.max(grams, maxDry);
        }
        return maxDry;
      }, 0);
      result.total += total;
      if (highest > result.total) {
        highest = result.total;
        result.ingredients = ingredientsIndex;
        result.ingredient = ingredientIndex;
      }
    });
  });

  if (result.total > 0) return result;
  return null;
}
