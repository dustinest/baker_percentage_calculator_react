import {NutrientPercentType} from "./NutrientPercentType";
import {GramsAmountType, PercentAmountType} from "./AmountTypes";

export type IngredientType = {
    id: string,
    name:string,
    nutrients: NutrientPercentType[]
};

export type IngredientGramsType = IngredientType & GramsAmountType;
export type IngredientPercentType = IngredientType & PercentAmountType;
