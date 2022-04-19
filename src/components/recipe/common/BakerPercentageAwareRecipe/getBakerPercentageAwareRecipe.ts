import {RecipeType} from "../../../../types";
import {recalculateRecipeBakerPercentage} from "../RecipeItemEditService";
// noinspection ES6PreferShortImport
import {BakerPercentageAwareRecipe} from "./BakerPercentageAwareRecipe.d";

const calculateTotalWeight = async (recipe: RecipeType): Promise<number> => {
  return recipe.ingredients.flatMap((ingredients) => ingredients.ingredients).map((ingredient) => ingredient.grams).reduce((total, value) => total + value, 0);
}
export const getBakerPercentageAwareRecipe = async (recipe: RecipeType): Promise<BakerPercentageAwareRecipe> => {
  const bakerPercentage = await recalculateRecipeBakerPercentage(recipe);
  const totalWeight = await calculateTotalWeight(recipe);
  return {
    ...recipe,
    ...{bakerPercentage, totalWeight}
  } as BakerPercentageAwareRecipe
}
