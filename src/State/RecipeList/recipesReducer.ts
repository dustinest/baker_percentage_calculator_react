// noinspection ES6PreferShortImport
import {RecipesStateActions, RecipesStateActionTypes} from "./RecipesStateActions.d";
import {RecipeType} from "../../types";
import {RecipeStateType} from "./RecipesProvider";
import {isCopyOfRecipe} from "../CopyOfRecipeHelper";

const resolveCopy = (recipe: RecipeType): [RecipeType, String | undefined] => {
  if (isCopyOfRecipe(recipe)) {
    const copyId = recipe.copyId;
    const result = {...recipe} as { copyId?: string };
    delete result.copyId;
    return [result as RecipeType, copyId];
  }
  return [recipe, undefined];
}

export const updateRecipesReducer = (state: RecipeStateType, action: RecipesStateActions): RecipeStateType => {
  switch (action.type) {
    case RecipesStateActionTypes.SET_RECIPES:
      return {recipes: action.value, recipesFilter: action.value.map(e => e.id)}
    case RecipesStateActionTypes.REMOVE_RECIPE: {
      const recipes = state.recipes.filter((e) => e.id !== action.value.id);
      const recipesFilter = state.recipesFilter.filter((e) => e !== action.value.id);
      return {...state, ...{recipes: recipes, recipesFilter: recipesFilter}}
    }
    case RecipesStateActionTypes.SAVE_RECIPE:
      const result: RecipeType[] = [];
      let updated = false;
      const [recipe, copyId] = resolveCopy(action.value);
      state.recipes.forEach((e) => {
        if (e.id === action.value.id) {
          result.push(recipe);
          updated = true;
        } else {
          result.push(e);
        }
        if (e.id === copyId) {
          result.push(recipe);
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
