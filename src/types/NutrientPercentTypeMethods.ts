import {NutrientPercentType} from "./NutrientPercentType";

export const copyNutrientPercentType = (value: NutrientPercentType): NutrientPercentType => ({ percent: value.percent, type: value.type })
