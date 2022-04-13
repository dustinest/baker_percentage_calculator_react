import {PREDEFINED_RECIPES} from "../data/PredefinedRecipes";
import {RecipeNavigation} from "./recipe/RecipeNavigation";
import {JsonRecipeType} from "../service/RecipeReader/types";
import {GramsAmountType, RecipeType} from "../types";
import {CircularProgress} from "@mui/material";
import {readJsonRecipe} from "../service/RecipeReader";
import {useContext, useState} from "react";
import {
  EditRecipeProvider,
  RecipesContext,
  RecipesStateActionTypes,
  useMessageSnackBar,
} from "../State";
import {RecipeList} from "./recipe/RecipeList";
import {useAsyncEffect} from "../utils/Async";
import {EditRecipeDialog} from "./recipe/EditRecipe";
import {AddRecipeIcon} from "./AddRecipeIcon";

const getDouble = (value: JsonRecipeType): JsonRecipeType => {
  return {
    ...value,
    ...{
      id: undefined,
      name: value.name,
      amount: value.amount ? value.amount * 2 : 2,
      ingredients: value.ingredients.map((e) => ({
        ...e,
        ...{
          ingredients: e.ingredients.map((i) => {
            const jsonGrams = i as GramsAmountType;
            if (jsonGrams.grams) {
              return {
                ...jsonGrams,
                ...{grams: jsonGrams.grams * 2}
              };
            }
            return i;
          })
        }
      }))
    }
  } as JsonRecipeType;
};

const getRecipes = (): RecipeType[] => {
  return PREDEFINED_RECIPES
    .reduce((current, value) => ([...current, ...[value, getDouble(value)]]), [] as JsonRecipeType[])
    //.map((e) => ({...e, ...{id: resolveJsonRecipeTypeId(e), label: getJsonRecipeTypeLabel(e, translate(e.name))}} as JsonRecipeTypeWithLabel))
    .map(readJsonRecipe);
}

export const Main = () => {
  const snackBar = useMessageSnackBar();
  const {recipesDispatch} = useContext(RecipesContext);
  const [status, setStatus] = useState<{loading: boolean, amount: number}>({ loading: true, amount: 0 });

  useAsyncEffect(async () => {
    setStatus({...status, ...{loading: true}});
    try {
      const result = getRecipes();
      recipesDispatch({
        type: RecipesStateActionTypes.SET_RECIPES,
        value: result
      });
      setStatus({ loading: false, amount: result.length });
    } catch (error) {
      snackBar.error(error as Error, "Error while reading the snackbar!").translate().enqueue();
      setStatus({...status, ...{loading: false}});
    }
  }, [recipesDispatch]);

  return (
    <>
      {
        status.loading ? (<CircularProgress/>) :
          (
            <>
              <RecipeNavigation/>
              <EditRecipeProvider>
                <AddRecipeIcon/>
                <EditRecipeDialog/>
                <RecipeList/>
              </EditRecipeProvider>
            </>
          )
      }
    </>
  )
}
