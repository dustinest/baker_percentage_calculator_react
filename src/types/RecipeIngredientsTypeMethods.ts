import {RecipeIngredientsType} from "./RecipeIngredientsType";
import {copyIngredientGramsType} from "./IngredientTypeMethods";
import {copyBakingTimeType} from "./BakingTimeTypeMethods";
import {copyNumberIntervalType} from "./NumberIntervalTypeMethods";

export const copyRecipeIngredientsType = (value: RecipeIngredientsType): RecipeIngredientsType => {
  return {
    ingredients: value.ingredients.map(copyIngredientGramsType),
    name: value.name,
    description: value.description,
    bakingTime: value.bakingTime.map(copyBakingTimeType),
    starter: value.starter,
    innerTemperature: value.innerTemperature ? copyNumberIntervalType(value.innerTemperature) : null
  }
}
