import {NutritionType} from "../interfaces/NutritionType";
import {PercentAmountType} from "./AmountTypes";

export type NutrientPercentType = {
    type: NutritionType;
} & PercentAmountType;
