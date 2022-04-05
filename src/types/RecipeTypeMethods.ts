import {RecipeType} from "./RecipeType";
import {copyNumberIntervalType} from "./NumberIntervalTypeMethods";
import {copyBakingTimeType} from "./BakingTimeTypeMethods";
import {copyRecipeIngredientsType} from "./RecipeIngredientsTypeMethods";

export const copyRecipeType = (value: RecipeType): RecipeType => {
  return {
    innerTemperature: value.innerTemperature ? copyNumberIntervalType(value.innerTemperature) : null,
    bakingTime: value.bakingTime.map(copyBakingTimeType),
    description: value.description,
    amount: value.amount,
    name: value.name,
    ingredients: value.ingredients.map(copyRecipeIngredientsType),
    id: value.id
  }
}
