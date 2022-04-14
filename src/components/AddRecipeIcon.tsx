import {useSetEditRecipe} from "../State";
import {RecipeType} from "../types";
import {RECIPE_CONSTANTS} from "./recipe/EditRecipe";
import {AddRecipeFloatingButton} from "../Constant/Buttons";


export const AddRecipeIcon = () => {
  const setEditRecipe = useSetEditRecipe();
  const addRecipe = () => {
    setEditRecipe({
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
    } as RecipeType);
  }
  return (<AddRecipeFloatingButton onClick={addRecipe}/>);
};
