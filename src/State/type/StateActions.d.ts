export enum StateActionTypes {
    SET_RECIPES = "set_recipes",
    UPDATE_RECIPE = "update_recipe",
    SELECT_RECIPE = "select_recipe"
}

export type StateAction<Action extends StateActionTypes, ValueType> = {
    type: Action;
    value: ValueType;
}

export type SetRecipesAction = StateAction<StateActionTypes.SET_RECIPES, RecipeType[]>
export type UpdateRecipesAction = StateAction<StateActionTypes.UPDATE_RECIPE, RecipeType>
export type SelectRecipeAction = {
    filter: boolean;
} & StateAction<StateActionTypes.SELECT_RECIPE, string>

export type StateActions = SetRecipesAction | UpdateRecipesAction | SelectRecipeAction;
