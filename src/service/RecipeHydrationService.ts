import {DRY_NUTRIENTS, IngredientGramsType, NutritionType} from "../types";
type RecipeHydration = {
  dry: number,
  water: number,
  hydration: number
}
export const getIngredientsHydration = (ingredients: IngredientGramsType[]): RecipeHydration => {
  const result = {
    dry: 0,
    water: 0,
    hydration: 0
  } as RecipeHydration;
  ingredients.forEach((ingredient) => {
    const hydration = {
      dry: 0,
      water: 0
    }
    ingredient.nutrients.forEach((nutrient) => {
      if (nutrient.type === NutritionType.water) {
        hydration.water = Math.max(hydration.dry, nutrient.percent);
      }
      if (DRY_NUTRIENTS.includes(nutrient.type)) {
        hydration.dry = Math.max(hydration.dry, nutrient.percent);
      }
    })
    result.dry += ingredient.grams * hydration.dry / 100;
    result.water += ingredient.grams * hydration.water / 100;
  })
  if (result.dry > 0 && result.water > 0) {
    result.hydration = Math.floor(result.water * 10000 / result.dry) / 100;
  } else if (result.water > 0) {
    result.hydration = 100;
  }
  return result;
}
