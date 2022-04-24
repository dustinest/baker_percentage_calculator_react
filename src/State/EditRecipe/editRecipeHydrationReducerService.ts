import {IngredientGramsType, NutritionType, RecipeType} from "../../types";
import {SetEditRecipeIngredientHydrationStateAction} from "./EditRecipeStateAction";
import {resolveActionGenericIndex} from "./resolveActionGenericIndex";
import {getIngredientsHydration} from "../../service/RecipeHydrationService";
import {copyCopyOfAwareRecipe} from "../CopyOfRecipeHelper";

export const changeHydration = (ingredients: IngredientGramsType[], targetHydration: number) => {
  const hydration = getIngredientsHydration(ingredients);
  const newWater = hydration.dry * targetHydration / 100;
  const reducer = newWater / hydration.water;
  ingredients.forEach((ingredient) => {
    const waterNutrient = ingredient.nutrients.find(e => e.type === NutritionType.water);
    if (!waterNutrient) return;
    const waterGrams = ingredient.grams * waterNutrient.percent / 100;
    const gramsPortion = waterGrams * reducer;
    ingredient.grams = gramsPortion * 100 / waterNutrient.percent;
  });
}

export const editRecipeHydrationReducerService = (recipe: RecipeType | null, action: SetEditRecipeIngredientHydrationStateAction): RecipeType | null => {
  if (recipe === null) return null;
  return resolveActionGenericIndex(action.index, (index) => {
    const result = copyCopyOfAwareRecipe(recipe);
    changeHydration(result.ingredients[index].ingredients, action.hydration);
    return result;
  }, () => {
    throw new Error("Auto Ingredient index is not implemented!")
  });
}
