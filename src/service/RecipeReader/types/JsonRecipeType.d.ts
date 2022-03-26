import {JsonRecipeIngredientsType} from "./JsonRecipeIngredientsType";
import {JsonBakingTimeType} from "./JsonBakingTimeType";

export type JsonRecipeType = {
    id?: string;
    name: string;
    amount?: number;

    bakingTime?: JsonBakingTimeType[];
    ingredients: JsonRecipeIngredientsType[];
    description?: string;
};
