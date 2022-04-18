import {RecipeType} from "../../types";
// noinspection ES6PreferShortImport
import {
  EditRecipeStateActionTypes,
  RecipeManagementStateActions,
} from "./EditRecipeStateAction.d";
import {EditRecipeReducerService} from "./EditRecipeReducerService";
import {copyCopyOfAwareRecipe} from "../CopyOfRecipeHelper";

export const updateEditRecipeReducer = (recipe: RecipeType | null, action: RecipeManagementStateActions): RecipeType | null => {
  switch (action.type) {
    case EditRecipeStateActionTypes.EDIT_RECIPE:
      return copyCopyOfAwareRecipe(action.value);
      /*
      if (isCopyOfRecipe(result)) {
        result.amount = result.amount * 2;
      }
       */
    case EditRecipeStateActionTypes.SET_NAME:
      return EditRecipeReducerService.setName(recipe, action);
    case EditRecipeStateActionTypes.SET_AMOUNT:
      return EditRecipeReducerService.setAmount(recipe, action);
    case EditRecipeStateActionTypes.SET_INGREDIENT_GRAM:
      return EditRecipeReducerService.setIngredientGram(recipe, action);
    case EditRecipeStateActionTypes.SET_BAKING_TIME:
      return EditRecipeReducerService.setBakingTime(recipe, action);
    case EditRecipeStateActionTypes.REMOVE_BAKING_TIME:
      return EditRecipeReducerService.removeBakingTime(recipe, action);
    case EditRecipeStateActionTypes.SET_INNER_TEMPERATURE:
      return EditRecipeReducerService.setInnerTemperature(recipe, action);
    case EditRecipeStateActionTypes.SET_DESCRIPTION:
      return EditRecipeReducerService.setDescription(recipe, action);
    case EditRecipeStateActionTypes.SET_INGREDIENTS_NAME:
      return EditRecipeReducerService.setIngredientsName(recipe, action);
    case EditRecipeStateActionTypes.REMOVE_INGREDIENT:
      return EditRecipeReducerService.removeIngredient(recipe, action);
    case EditRecipeStateActionTypes.ADD_INGREDIENTS:
      return EditRecipeReducerService.addIngredients(recipe);
    case EditRecipeStateActionTypes.USE_INGREDIENT_IN_STARTER:
      return EditRecipeReducerService.setUseIngredientsInStarter(recipe, action);
    case EditRecipeStateActionTypes.CANCEL_EDIT_RECIPE:
      return null;
  }
  throw new Error(`${action.type} is not managed!`);
}
