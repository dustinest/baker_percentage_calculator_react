import {StateActions, StateActionTypes} from "../type/StateActions.d";
import {SelectedRecipeType} from "../type/AppState";
import {RecipeType} from "../../models";

export const updateRecipesReducer = (recipes: RecipeType[], action: StateActions): RecipeType[] => {
    if (action.type === StateActionTypes.SET_RECIPES) {
        return action.value;
    } else if (action.type === StateActionTypes.UPDATE_RECIPE) {
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
            result.push(action.value);
        }
        return result;
    }
    return recipes;
}

export const setRecipeReducer = (selectedRecipe: SelectedRecipeType | null, action:StateActions): SelectedRecipeType | null => {
    if (action.type === StateActionTypes.SELECT_RECIPE && (action.value !== selectedRecipe?.id || action.filter !== selectedRecipe?.filter)) {
        return {
            id: action.value,
            filter: action.filter
        } as SelectedRecipeType;
    }
    return selectedRecipe;
}
