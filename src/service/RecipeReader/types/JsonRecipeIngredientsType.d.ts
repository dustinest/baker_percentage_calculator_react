import {IngredientGramsType, IngredientPercentType} from "../../../models";
import {
    JsonDryIngredientGrams, JsonDryIngredientPercentage,
    JsonRecipeIngredientConstantGramsType, JsonRecipeIngredientConstantPercentType,
} from "./JsonRecipeIngredientType";
import {JsonBakingTimeType, JsonNumberIntervalType} from "./JsonBakingTimeType";

export type JsonRecipeIngredientsIngredientType = IngredientGramsType |
    IngredientPercentType |
    JsonRecipeIngredientConstantGramsType |
    JsonRecipeIngredientConstantPercentType |
    JsonDryIngredientGrams |
    JsonDryIngredientPercentage;

export type JsonRecipeIngredientsType = {
    name?: string;
    ingredients: JsonRecipeIngredientsIngredientType[];
    bakingTime?: JsonBakingTimeType[]
    innerTemperature?: JsonNumberIntervalType;

    description?: string;
    starter?: boolean; // to be included with starter. A corner case. Check pancakes
};
