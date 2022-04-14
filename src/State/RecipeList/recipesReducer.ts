// noinspection ES6PreferShortImport
import {RecipesStateActions, RecipesStateActionTypes} from "./RecipesStateActions.d";
import {RecipeType} from "../../types";
import {RecipeStateType} from "./RecipesProvider";

export const updateRecipesReducer = (state: RecipeStateType, action: RecipesStateActions): RecipeStateType => {
    switch (action.type) {
        case RecipesStateActionTypes.SET_RECIPES:
            return {recipes: action.value, recipesFilter: action.value.map(e => e.id)}
        case RecipesStateActionTypes.REMOVE_RECIPE: {
            return {...state, ...{ recipes: state.recipes.filter((e) => e.id !== action.value.id)}}
        }
        case RecipesStateActionTypes.SAVE_RECIPE:
            const result:RecipeType[] = [];
            let updated = false;
            state.recipes.forEach((e) => {
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
            return {...state, ...{ recipes: result}}
        case RecipesStateActionTypes.UPDATE_FILTER:
            return {...state, ...{recipesFilter: action.value}};
    }
    return state;
}
