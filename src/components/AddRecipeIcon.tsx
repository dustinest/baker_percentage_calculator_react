import {useSetEditRecipe} from "../State";
import {AddIcon} from "./common/Icons";
import {Fab, Box} from "@mui/material";
import {RecipeType} from "../types";
import {RECIPE_CONSTANTS} from "./recipe/EditRecipe";


export const AddRecipeIcon = () => {
  const setEditRecipe = useSetEditRecipe();
  const addRecipe = () => {
    setEditRecipe({
      id: RECIPE_CONSTANTS.NEW_RECIPE,
      name: "New recipe",
      amount: 0,
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
  return (
    <Box
      className="menu-trigger"
      sx={{
      position: 'fixed',
      right: 0,
      bottom: 0,
    }}><Fab variant="extended" color="primary" aria-label="add" onClick={addRecipe}><AddIcon/></Fab></Box>
  )
};
