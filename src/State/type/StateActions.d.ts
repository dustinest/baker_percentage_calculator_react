export enum StateActionTypes {
    SET_RECIPES = "set_recipes",
    UPDATE_RECIPE = "update_recipe",
    SELECT_RECIPE = "select_recipe",
    SET_FILTER = "set_filter"
}

export type StateAction<Action extends StateActionTypes, ValueType> = {
    type: Action;
    value: ValueType;
}

export type SetRecipesAction = StateAction<StateActionTypes.SET_RECIPES, RecipeType[]>
export type UpdateRecipesAction = StateAction<StateActionTypes.UPDATE_RECIPE, RecipeType>
export type SelectRecipeAction = StateAction<StateActionTypes.SELECT_RECIPE, string>
export type SetFilterAction = StateAction<StateActionTypes.SET_FILTER, boolean>


export type StateActions = SetRecipesAction | UpdateRecipesAction | SelectRecipeAction | SetFilterAction;
