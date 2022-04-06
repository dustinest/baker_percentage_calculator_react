import {BakerPercentageResult} from "../../../utils/BakerPercentageCalulation";
import {RecipeIngredientsType} from "../../../types";

export type UseRecipeTypeMicroNutrients = {
  microNutrients: BakerPercentageResult;
}

export type UseRecipeTypeIngredients = {
  ingredients: RecipeIngredientsType[];
} & UseReceipeTypeMicroNutrients;

export type UseRecipeTypeResult = {
  recipe: UseRecipeTypeMicroNutrients;
  ingredients: UseRecipeTypeIngredients;
}
