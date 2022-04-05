import {copyNutrientPercentType, IngredientGramsType, NutrientPercentType} from "../../types";

export const getCustomIngredient = (id: string, name: string, grams: number, nutrients?: NutrientPercentType[]): IngredientGramsType =>
  ({
    id,
    name,
    grams,
    nutrients: nutrients ? nutrients.map(copyNutrientPercentType) : []
  } as IngredientGramsType);
