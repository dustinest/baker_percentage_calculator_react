import {GramsAmountType, PercentAmountType} from "../../../models";
import {PredefinedIngredientConstant} from "../../../models";

export type JsonRecipeIngredientConstantType = {
    type: keyof PredefinedIngredientConstant;
};

export type JsonDryIngredient = {
    id?: string;
    type: "DRY",
    name: string,
}

export type JsonDryIngredientGrams = JsonDryIngredient & GramsAmountType;
export type JsonDryIngredientPercentage = JsonDryIngredient & PercentAmountType;

export type JsonRecipeIngredientConstantGramsType = JsonRecipeIngredientConstantType & GramsAmountType;
export type JsonRecipeIngredientConstantPercentType = JsonRecipeIngredientConstantType & PercentAmountType;
