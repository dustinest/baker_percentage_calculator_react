// noinspection ES6PreferShortImport
import {RecipesStateActions, RecipesStateActionTypes} from "./RecipesStateActions.d";
import {RecipeType} from "../../types";
import {RecipeStateType} from "./RecipesProvider";
import {isCopyOfRecipe} from "../CopyOfRecipeHelper";

export const updateRecipesReducer = (state: RecipeStateType, action: RecipesStateActions): RecipeStateType => {
    switch (action.type) {
        case RecipesStateActionTypes.SET_RECIPES:
            return {recipes: action.value, recipesFilter: action.value.map(e => e.id)}
        case RecipesStateActionTypes.REMOVE_RECIPE: {
            const recipes = state.recipes.filter((e) => e.id !== action.value.id);
            const recipesFilter = state.recipesFilter.filter((e) => e !== action.value.id);
            return {...state, ...{ recipes: recipes, recipesFilter: recipesFilter}}
        }
        case RecipesStateActionTypes.SAVE_RECIPE:
            const result:RecipeType[] = [];
            let updated = false;
            const copyId = isCopyOfRecipe(action.value) ? action.value.copyId : undefined;
            state.recipes.forEach((e) => {
                if (e.id === action.value.id) {
                    result.push(action.value);
                    updated = true;
                } else {
                    result.push(e);
                }
                if (e.id === copyId) {
                    result.push(action.value);
                    updated = true;
                }
            })
            if (!updated) {
                result.unshift(action.value);
            }
            if (!state.recipesFilter.includes(action.value.id)) {
                return {...state, ...{recipes: result, recipesFilter: [...state.recipesFilter, ...[action.value.id]]}}
            } else {
                return {...state, ...{recipes: result}}
            }
        case RecipesStateActionTypes.UPDATE_FILTER:
            return {...state, ...{recipesFilter: action.value}};
    }
    return state;
}
