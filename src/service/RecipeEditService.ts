import {useContext} from "react";
import {
  EditRecipeContext,
  EditRecipeStateActionTypes,
  RecipesContext,
  RecipesStateActionTypes,
  UpdateRecipesAction
} from "../State";
import {RecipeType, RecipeTypeCopy} from "../types";
import {RECIPE_CONSTANTS} from "../State/RecipeConstants";
import {getBakerPercentageAwareRecipe} from "../components/recipe/common/BakerPercentageAwareRecipe";
import {hasValue} from "../utils/NullSafe";
import {copyCopyOfAwareRecipe} from "../State/CopyOfRecipeHelper";

interface RecipeEditMethods {
  edit: (recipe: RecipeType) => void;
  editCopy: (recipe: RecipeType) => void;
  create: () => void;
  save: () => Promise<void>;
  cancel: () => void;
}

export const useRecipeEditService = (): {editedRecipe: RecipeType | null, editRecipeMethods: RecipeEditMethods} => {
  const {editRecipe, editRecipeDispatch} = useContext(EditRecipeContext);
  const {recipesDispatch} = useContext(RecipesContext);

  const getRecipeToSave = (recipe: RecipeType) => {
    if (recipe.id === RECIPE_CONSTANTS.NEW_RECIPE) {
      return copyCopyOfAwareRecipe({...recipe, ...{id: `new_${Date.now() + Math.random()}`}});
    }
    return copyCopyOfAwareRecipe(recipe);
  }

  const doEditRecipe = (recipe: RecipeType) => {
      editRecipeDispatch({
        type: EditRecipeStateActionTypes.EDIT_RECIPE,
        value: recipe
      });
  };

  const recipeEditMethods = {
    editCopy: (recipe: RecipeType) => {
      doEditRecipe({...recipe, ...{id: RECIPE_CONSTANTS.NEW_RECIPE, copyId: recipe.id}} as RecipeTypeCopy);
    },
    edit: (recipe: RecipeType) => {
      doEditRecipe(recipe)
    },
    create: () => {
      doEditRecipe({
          id: RECIPE_CONSTANTS.NEW_RECIPE,
          name: "New recipe",
          amount: 1,
          bakingTime: [],
          description: null,
          innerTemperature: null,
          ingredients: [{
            ingredients: [],
            starter: false,
            innerTemperature: null,
            bakingTime: [],
            description: null
          }]
        } as RecipeType
      );
    },
    save: async (): Promise<void> => {
      if (hasValue(editRecipe)) {
        const value = await getBakerPercentageAwareRecipe(getRecipeToSave(editRecipe));
        recipesDispatch({
          type: RecipesStateActionTypes.SAVE_RECIPE,
          value
        } as UpdateRecipesAction);
      }
      editRecipeDispatch({type: EditRecipeStateActionTypes.CANCEL_EDIT_RECIPE});
    },
    cancel: () => {
      editRecipeDispatch({ type: EditRecipeStateActionTypes.CANCEL_EDIT_RECIPE });
    }
  } as RecipeEditMethods;

  return {editedRecipe: editRecipe, editRecipeMethods: recipeEditMethods};
}
