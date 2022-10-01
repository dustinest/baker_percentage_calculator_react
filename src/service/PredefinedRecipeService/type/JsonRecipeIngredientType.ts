import {GramsAmountType, PercentAmountType} from "../../../types";
import {ExtraStandardIngredient, StandardIngredients} from "../../../Constant/Ingredient";

export type JsonStandardIngredient = {
    // @ts-ignore
    type: keyof StandardIngredients;
};

export type JsonExtraStandardIngredient = {
    id?: string;
    type: keyof ExtraStandardIngredient,
    name: string,
}

export type JsonExtraStandardIngredientGrams = JsonExtraStandardIngredient & GramsAmountType;
export type JsonExtraStandardIngredientPercentage = JsonExtraStandardIngredient & PercentAmountType;

export type JsonStandardIngredientGrams = JsonStandardIngredient & GramsAmountType;
export type JsonStandardIngredientPercent = JsonStandardIngredient & PercentAmountType;
