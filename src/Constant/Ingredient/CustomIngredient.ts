import {copyNutrientPercentType, IngredientGramsType, NutrientPercentType} from "../../types";

export const getCustomIngredient = (id: string, name: string, grams: number, nutrients?: NutrientPercentType[], type?: string): IngredientGramsType =>
  ({
    id,
    name,
    grams,
    type,
    nutrients: nutrients ? nutrients.map(copyNutrientPercentType) : []
  } as IngredientGramsType);
