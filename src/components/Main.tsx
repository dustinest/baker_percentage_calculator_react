import {PREDEFINED_RECIPES} from "../data/PredefinedRecipes";
import {RecipeNavigation} from "./RecipeNavigation";
import {RecipeType} from "../types";
import {CircularProgress} from "@mui/material";
import {readJsonRecipe} from "../service/RecipeReader";
import {useContext, useEffect, useState} from "react";
import {
  EditRecipeProvider,
  RecipesContext,
  RecipesStateActionTypes,
  useMessageSnackBar,
} from "../State";
import {RecipeList} from "./recipe/RecipeList";
import {AsyncStatus, useAsyncEffect} from "../utils/Async";
import {EditRecipeDialog} from "./recipe/EditRecipe";
import {BakerPercentageAwareRecipe, getBakerPercentageAwareRecipe} from "./recipe/common/BakerPercentageAwareRecipe";
/*
const getDuplicateRecipe = (value: JsonRecipeType): JsonRecipeType => {
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
*/
const getRecipes = (): RecipeType[] => {
  return PREDEFINED_RECIPES
    //.reduce((current, value) => ([...current, ...[value, getDuplicateRecipe(value)]]), [] as JsonRecipeType[])
    //.map((e) => ({...e, ...{id: resolveJsonRecipeTypeId(e), label: getJsonRecipeTypeLabel(e, translate(e.name))}} as JsonRecipeTypeWithLabel))
    .map(readJsonRecipe);
}

export const Main = () => {
  const snackBar = useMessageSnackBar();
  const {recipesDispatch} = useContext(RecipesContext);
  const [status, setStatus] = useState<{loading: boolean, amount: number}>({ loading: true, amount: 0 });

  const result = useAsyncEffect<BakerPercentageAwareRecipe[]>(async () => {
    const recipes = getRecipes();
    const result: BakerPercentageAwareRecipe[] = [];
    for (let i = 0; i < recipes.length; i++) {
      const bakerPercentage = await getBakerPercentageAwareRecipe(recipes[i]);
      result.push(bakerPercentage);
    }
    return result;
  }, []);

  useEffect(() => {
    if (result.status === AsyncStatus.ERROR) {
      snackBar.error(result.error, "Error while reading the snackbar!").translate().enqueue();
    } else if (result.status === AsyncStatus.SUCCESS) {
      recipesDispatch({
        type: RecipesStateActionTypes.SET_RECIPES,
        value: result.value
      });
      setStatus({ loading: false, amount: result.value.length });
    } else {
      setStatus({...status, ...{loading: true}});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result])

  return (
    <>
      {
        status.loading ? (<CircularProgress/>) :
        <EditRecipeProvider>
          <RecipeNavigation>
              <EditRecipeDialog/>
              <RecipeList/>
          </RecipeNavigation>
        </EditRecipeProvider>
      }
    </>
  )
}
