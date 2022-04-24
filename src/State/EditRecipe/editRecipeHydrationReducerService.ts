import {NutritionType, RecipeType} from "../../types";
import {SetEditRecipeIngredientHydrationStateAction} from "./EditRecipeStateAction";
import {resolveActionGenericIndex} from "./resolveActionGenericIndex";
import {getIngredientsHydration} from "../../service/RecipeHydrationService";
import {copyCopyOfAwareRecipe} from "../CopyOfRecipeHelper";


export const editRecipeHydrationReducerService = (recipe: RecipeType | null, action: SetEditRecipeIngredientHydrationStateAction): RecipeType | null => {
  if (recipe === null) return null;
  return resolveActionGenericIndex(action.index, (index) => {
    const hydration = getIngredientsHydration(recipe.ingredients[index].ingredients);
    if (hydration.water === 0 || hydration.hydration === action.hydration) return recipe;
    const result = copyCopyOfAwareRecipe(recipe);
    const newWater = hydration.dry * action.hydration / 100;
    const reducer = newWater / hydration.water;
    result.ingredients[index].ingredients.forEach((ingredient) => {
      const waterNutrient = ingredient.nutrients.find(e => e.type === NutritionType.water);
      if (!waterNutrient) return;
      const waterGrams = ingredient.grams * waterNutrient.percent / 100;
      const grams = waterGrams * reducer;
      ingredient.grams = grams + (ingredient.grams - waterGrams);
    });
    return result;
  }, () => {
    throw new Error("Auto Ingredient index is not implemented!")
  });
}
