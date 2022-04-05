import {copyRecipeType, RecipeType} from "../../types";
import {EditRecipeStateActionTypes, RecipeManagementStateActions} from "../type/EditRecipeStateAction.d";

export const editRecipesReducer = (recipe: RecipeType | null, action: RecipeManagementStateActions): RecipeType | null => {
  switch (action.type) {
    case EditRecipeStateActionTypes.EDIT_RECIPE:
      return copyRecipeType(action.value);
  }
  return null;
}
