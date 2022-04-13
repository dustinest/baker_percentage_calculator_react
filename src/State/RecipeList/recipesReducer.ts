// noinspection ES6PreferShortImport
import {RecipesStateActions, RecipesStateActionTypes} from "./RecipesStateActions.d";
import {RecipeType} from "../../types";

export const updateRecipesReducer = (recipes: RecipeType[], action: RecipesStateActions): RecipeType[] => {
    switch (action.type) {
        case RecipesStateActionTypes.SET_RECIPES:
            return [...action.value];
        case RecipesStateActionTypes.REMOVE_RECIPE: {
            return [...recipes.filter((e) => e.id !== action.value.id)];
        }
        case RecipesStateActionTypes.SAVE_RECIPE:
            const result:RecipeType[] = [];
            let updated = false;
            recipes.forEach((e) => {
                if (e.id === action.value.id) {
                    result.push(action.value);
                    updated = true;
                } else {
                    result.push(e);
                }
            })
            if (!updated) {
                result.unshift(action.value);
            }
            return result;
    }
    return recipes;
}
