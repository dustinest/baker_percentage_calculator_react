import {IngredientGramsType, IngredientPercentType} from "../../../types";
import {
    JsonExtraStandardIngredientGrams, JsonExtraStandardIngredientPercentage,
    JsonStandardIngredientTypeGramsType, JsonStandardIngredientTypePercentType,
} from "./JsonRecipeIngredientType";
import {JsonBakingTimeType, JsonNumberIntervalType} from "./JsonBakingTimeType";

export type JsonRecipeIngredientsIngredientType = IngredientGramsType |
    IngredientPercentType |
    JsonStandardIngredientTypeGramsType |
    JsonStandardIngredientTypePercentType |
    JsonExtraStandardIngredientGrams |
    JsonExtraStandardIngredientPercentage;

export type JsonRecipeIngredientsType = {
    name?: string;
    ingredients: JsonRecipeIngredientsIngredientType[];
    bakingTime?: JsonBakingTimeType[]
    innerTemperature?: JsonNumberIntervalType;

    description?: string;
    starter?: boolean; // to be included with starter. A corner case. Check pancakes
};
