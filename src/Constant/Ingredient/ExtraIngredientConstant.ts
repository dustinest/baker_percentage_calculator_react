import {NutritionType, IngredientGramsType, IngredientType, NutrientPercentType} from "../../types";
import {getCustomIngredient} from "./CustomIngredient";

export interface ExtraStandardIngredient {
  DRY: IngredientType,
}

const ExtraStandardIngredients: ExtraStandardIngredient = Object.freeze({
  DRY: {name: "dry", id: "dry", nutrients: [Object.freeze({type: NutritionType.dry, percent: 100})]}
});

type ExtraStandardIngredientMethodsType = { [Property in keyof ExtraStandardIngredient]: (id: string, name: string, grams: number, nutrients?: NutrientPercentType[]) => IngredientGramsType };

export const ExtraStandardIngredientMethods: ExtraStandardIngredientMethodsType = Object.freeze(
  Object.entries(ExtraStandardIngredients).reduce((obj, [key, value]) => {
    obj[key as keyof ExtraStandardIngredient] = (id: string, name: string, grams: number, nutrients?: NutrientPercentType[]) => getCustomIngredient(
      id, name, grams, nutrients ? [...value.nutrients, ...nutrients] : value.nutrients, key
    );
    return obj;
  }, {} as ExtraStandardIngredientMethodsType)) as ExtraStandardIngredientMethodsType;
