import {RecipeNavigation} from "./RecipeNavigation";
import {CircularProgress} from "@mui/material";
import {useContext, useEffect, useState} from "react";
import {EditRecipeProvider, RecipesContext, RecipesStateActionTypes, useMessageSnackBar,} from "../State";
import {RecipeList} from "./recipe/RecipeList";
import {EditRecipeDialog} from "./recipe/EditRecipe";
import {BakerPercentageAwareRecipe, getBakerPercentageAwareRecipe} from "./recipe/common/BakerPercentageAwareRecipe";
import {AsyncStatus, useAsyncEffect} from "react-useasync-hooks";
import {readPredefinedRecipes} from "../service/PredefinedRecipeService";
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
export const Main = () => {
  const snackBar = useMessageSnackBar();
  const {recipesDispatch} = useContext(RecipesContext);
  const [status, setStatus] = useState<{ loading: boolean, amount: number }>({loading: true, amount: 0});

  const result = useAsyncEffect<BakerPercentageAwareRecipe[]>(async () => {
    const recipes = readPredefinedRecipes();
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
      setStatus({loading: false, amount: result.value.length});
    } else {
      setStatus({...status, ...{loading: true}});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result])

  if (status.loading) {
    return <CircularProgress/>;
  }

  return (
    <EditRecipeProvider>
      <RecipeNavigation>
        <EditRecipeDialog/>
        <RecipeList/>
      </RecipeNavigation>
    </EditRecipeProvider>
  )
}
