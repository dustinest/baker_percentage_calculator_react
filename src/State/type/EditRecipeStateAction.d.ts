import {RecipeType} from "../../types";

export enum EditRecipeStateActionTypes {
  EDIT_RECIPE = "edit_recipe",
  CANCEL_EDIT_RECIPE = "cancel_edit_recipe"
}

type EditRecipeStateAction<Action extends EditRecipeStateActionTypes> = {
  type: Action;
}

type EditRecipeStateActionWithValue<Action extends EditRecipeStateActionTypes, ValueType> = {
  value: ValueType;
} & EditRecipeStateAction<Action>;

export type EditRecipesStateAction = EditRecipeStateActionWithValue<EditRecipeStateActionTypes.EDIT_RECIPE, RecipeType>;
export type CancelEditRecipesStateAction = EditRecipeStateAction<EditRecipeStateActionTypes.CANCEL_EDIT_RECIPE>;

export type RecipeManagementStateActions = EditRecipesStateAction | SaveRecipesStateAction | CancelEditRecipesStateAction;
