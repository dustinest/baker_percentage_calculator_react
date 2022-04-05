import {NutritionType} from "./NutritionType";
import {PercentAmountType} from "./AmountTypes";

export type NutrientPercentType = {
    type: NutritionType;
} & PercentAmountType;
