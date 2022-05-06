import {copyRecipeType, RecipeType, RecipeTypeCopy} from "../types";
import {hasValue} from "typescript-nullsafe";

export const isCopyOfRecipe = (recipe: RecipeType): recipe is RecipeTypeCopy => {
  return hasValue((recipe as RecipeTypeCopy).copyId)
}

export const copyCopyOfAwareRecipe = <T extends RecipeType | RecipeTypeCopy>(recipe: T): T => {
  if (isCopyOfRecipe(recipe)) {
    return {...copyRecipeType(recipe), ...{copyId: recipe.copyId}} as T;
  }
  return copyRecipeType(recipe) as T;
}
