import {RecipeType} from "../../../../types";
import {recalculateRecipeBakerPercentage} from "../RecipeItemEditService";
// noinspection ES6PreferShortImport
import {BakerPercentageAwareRecipe, TotalWeights} from "./BakerPercentageAwareRecipe.d";
import {BakerPercentageResult} from "../../../../service/BakerPercentage";

const calculateTotalWeights = async (bakerPercentage: BakerPercentageResult): Promise<TotalWeights> => {
  return bakerPercentage.ingredients.reduce((result, ingredients, index) => {
    const total = ingredients.ingredients.map(e => e.grams).reduce((total, grams) => total + grams, 0);
    if (index <= 1) {
      result.dough += total;
    } else {
      result.others += total;
    }
    result.total += total;
    return result;
  }, {dough: 0, others: 0, total: 0} as TotalWeights);
}

export const getBakerPercentageAwareRecipe = async (recipe: RecipeType): Promise<BakerPercentageAwareRecipe> => {
  const bakerPercentage = await recalculateRecipeBakerPercentage(recipe);
  const totalWeight = await calculateTotalWeights(bakerPercentage);
  return {
    ...recipe,
    ...{
      bakerPercentage,
      totalWeight
    }
  } as BakerPercentageAwareRecipe
}
