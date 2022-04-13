import {RecipeType} from "../../types";

export enum RecipesStateActionTypes {
    SET_RECIPES = "set_recipes",
    REMOVE_RECIPE = "remove_recipe",
    SAVE_RECIPE = "save_recipe"
}

type RecipesStateAction<Action extends RecipesStateActionTypes, ValueType> = {
    type: Action;
    value: ValueType;
}

export type SetRecipesAction = RecipesStateAction<RecipesStateActionTypes.SET_RECIPES, RecipeType[]>
export type UpdateRecipesAction = RecipesStateAction<RecipesStateActionTypes.SAVE_RECIPE, RecipeType>
export type RemoveRecipeAction = RecipesStateAction<RecipesStateActionTypes.REMOVE_RECIPE, RecipeType>

export type RecipesStateActions = SetRecipesAction | UpdateRecipesAction | RemoveRecipeAction;
