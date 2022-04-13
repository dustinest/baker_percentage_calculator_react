import {NutrientPercentType} from "./NutrientPercentType";
import {GramsAmountType, PercentAmountType} from "./AmountTypes";
import {StandardIngredients} from "../Constant/Ingredient";

export type IngredientType = {
    id: string,
    name:string,
    type?: keyof StandardIngredients;
    nutrients: NutrientPercentType[]
};

export type IngredientGramsType = IngredientType & GramsAmountType;
export type IngredientPercentType = IngredientType & PercentAmountType;
