import {NutritionType} from "../../../types/NutritionType";

export type MicroNutrientsValueType = {
  type: NutritionType;
  grams: number;
  percent: number;
}

export type MicroNutrientsResultType = {
  nutrients: { [key in NutritionType]: MicroNutrientsValueType };
  dry_total: number;
}
