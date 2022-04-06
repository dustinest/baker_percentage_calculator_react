import {copyRecipeType, RecipeType} from "../../types";
// noinspection ES6PreferShortImport
import {EditRecipeStateActionTypes, RecipeManagementStateActions} from "./EditRecipeStateAction.d";

export const updateEditRecipeReducer = (recipe: RecipeType | null, action: RecipeManagementStateActions): RecipeType | null => {
  switch (action.type) {
    case EditRecipeStateActionTypes.EDIT_RECIPE:
      return copyRecipeType(action.value);
  }
  return null;
}
