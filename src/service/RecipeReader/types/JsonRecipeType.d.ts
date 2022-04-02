import {JsonRecipeIngredientsType} from "./JsonRecipeIngredientsType";
import {JsonBakingTimeType, JsonNumberIntervalType} from "./JsonBakingTimeType";

export type JsonRecipeType = {
    id?: string;
    name: string;
    amount?: number;

    bakingTime?: JsonBakingTimeType[];
    innerTemperature?: JsonNumberIntervalType;
    ingredients: JsonRecipeIngredientsType[];
    description?: string;
};
