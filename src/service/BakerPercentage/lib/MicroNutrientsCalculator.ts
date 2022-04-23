import {DRY_NUTRIENTS, RecipeIngredientsType} from "../../../types/index";
// noinspection ES6PreferShortImport
import {MicroNutrientsResultType} from "../type/MicroNutrientsCalculationResult.d";

export const calculateMicroNutrientsResult = (recipeIngredients: RecipeIngredientsType[]): MicroNutrientsResultType => {
    const result = recipeIngredients.flatMap((ingredients) => ingredients.ingredients)
      .reduce((total, ingredient) => {
        total.dry_total += ingredient.nutrients.reduce((maxDry, nutrient) => {
          const grams = nutrient.percent > 0 && ingredient.grams > 0 ? ingredient.grams * nutrient.percent / 100 : 0;
          if (grams <= 0) return maxDry;
          const gramsTotal = (total.nutrients[nutrient.type]?.grams || 0) + grams;
          total.nutrients[nutrient.type] = {
            grams: gramsTotal,
            percent: 0,
            type: nutrient.type
          };
          if (DRY_NUTRIENTS.includes(nutrient.type)) {
            return Math.max(grams, maxDry);
          }
          return maxDry;
        }, 0);

        return total;
      }, {dry_total:0, nutrients: {}} as MicroNutrientsResultType);
    if (result.dry_total <= 0) return result;

    Object.values(result.nutrients).forEach((nutrient) => {
      nutrient.percent = result.dry_total > 0 ? nutrient.grams * 100 / result.dry_total : 0;
    });
    return result;
};
