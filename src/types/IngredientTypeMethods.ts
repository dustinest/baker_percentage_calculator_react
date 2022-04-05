import {IngredientGramsType, IngredientPercentType} from "./IngredientType";
import {copyNutrientPercentType} from "./NutrientPercentTypeMethods";

export const copyIngredientGramsType = (value: IngredientGramsType): IngredientGramsType =>
  ({
    grams: value.grams,
    name: value.name,
    id: value.id,
    nutrients: value.nutrients.map(copyNutrientPercentType)
  });

export const copyIngredientPercentType = (value: IngredientPercentType): IngredientPercentType =>
  ({
    percent: value.percent,
    name: value.name,
    id: value.id,
    nutrients: value.nutrients.map(copyNutrientPercentType)
  });
