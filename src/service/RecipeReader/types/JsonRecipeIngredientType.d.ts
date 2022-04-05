import {GramsAmountType, PercentAmountType} from "../../../types";
import {ExtraStandardIngredient, StandardIngredient, StandardIngredients} from "../../../Constant/Ingredient";

export type JsonStandardIngredientType = {
    type: keyof StandardIngredients;
};

export type JsonExtraStandardIngredientType = {
    id?: string;
    type: keyof ExtraStandardIngredient,
    name: string,
}

export type JsonExtraStandardIngredientGrams = JsonExtraStandardIngredientType & GramsAmountType;
export type JsonExtraStandardIngredientPercentage = JsonExtraStandardIngredientType & PercentAmountType;

export type JsonStandardIngredientTypeGramsType = JsonStandardIngredientType & GramsAmountType;
export type JsonStandardIngredientTypePercentType = JsonStandardIngredientType & PercentAmountType;
