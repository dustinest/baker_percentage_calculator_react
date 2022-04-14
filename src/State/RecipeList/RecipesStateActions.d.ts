import {RecipeType} from "../../types";

export enum RecipesStateActionTypes {
    SET_RECIPES = "set_recipes",
    REMOVE_RECIPE = "remove_recipe",
    SAVE_RECIPE = "save_recipe",
    UPDATE_FILTER = "update_filter"
}

type RecipesStateAction<Action extends RecipesStateActionTypes, ValueType> = {
    type: Action;
    value: ValueType;
}

export type SetRecipesAction = RecipesStateAction<RecipesStateActionTypes.SET_RECIPES, RecipeType[]>
export type UpdateRecipesAction = RecipesStateAction<RecipesStateActionTypes.SAVE_RECIPE, RecipeType>
export type RemoveRecipeAction = RecipesStateAction<RecipesStateActionTypes.REMOVE_RECIPE, RecipeType>
export type UpdateFilterAction = RecipesStateAction<RecipesStateActionTypes.UPDATE_FILTER, string[]>

export type RecipesStateActions = SetRecipesAction | UpdateRecipesAction | RemoveRecipeAction | UpdateFilterAction;
