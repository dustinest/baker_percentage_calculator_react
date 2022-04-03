import {StateActions, StateActionTypes} from "../type/StateActions.d";
import {RecipeType} from "../../models";
import {SelectedRecipeState} from "../type/AppState";

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

export const setRecipeReducer = (selectedRecipe: SelectedRecipeState, action:StateActions): SelectedRecipeState => {
    if (action.type === StateActionTypes.SELECT_RECIPE && action.value !== selectedRecipe.id) {
        console.log("Selected: ", selectedRecipe.filter, action.value);
        return {
            id: action.value,
            filter: selectedRecipe.filter
        } as SelectedRecipeState;
    }
    if (action.type === StateActionTypes.SET_FILTER && action.value !== selectedRecipe.filter) {
        console.log("Selected: ", selectedRecipe.filter, "Set Selected: ", action.value);
        return {
            id: selectedRecipe.id,
            filter: action.value
        } as SelectedRecipeState;
    }
    return selectedRecipe;
}
