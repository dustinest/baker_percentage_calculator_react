import {PREDEFINED_RECIPES} from "../data/PredefinedRecipes";
import {readJsonRecipe} from "../RecipeReader/readJsonRecipe";
import {RecipeType} from "../../../types";
import {recalculateBakerPercentage} from "../../BakerPercentage";
import {resolveJsonRecipeTypeId} from "../RecipeReader/JsonRecepyIdGenerator";

const recalculateName = (recipe1: RecipeType, recipe2: RecipeType) => {
  const nutrients1 = recalculateBakerPercentage(recipe1.ingredients).microNutrients.nutrients;
  const nutrients2 = recalculateBakerPercentage(recipe2.ingredients).microNutrients.nutrients;

  if (nutrients1.water.percent && nutrients2.water.percent) {
    const water1 = Math.round(nutrients1.water.percent);
    const water2 = Math.round(nutrients2.water.percent);
    recipe1.name = `${recipe1.name} (${water1}%)`;
    recipe1.id = resolveJsonRecipeTypeId({name: recipe1.name, amount: recipe1.amount});

    recipe2.name = `${recipe2.name} (${water2}%)`;
    recipe2.id = resolveJsonRecipeTypeId({name: recipe2.name, amount: recipe2.amount});
  }
};



export const readPredefinedRecipes = (): RecipeType[] => {
  const result = [] as RecipeType[];
  const recipeCache = {} as {[ key:string]: RecipeType};
  PREDEFINED_RECIPES.map(readJsonRecipe).forEach((recipe) => {
    if (recipeCache[recipe.name]) {
      const oldName = recipe.name;
      recalculateName(recipeCache[recipe.name], recipe);
      recipeCache[recipeCache[oldName].name] = recipeCache[oldName];
      delete recipeCache[oldName];
    }
    result.push(recipe);
    recipeCache[recipe.name] = recipe;
  });
  return result;
}
