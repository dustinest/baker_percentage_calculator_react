import {JsonRecipeIngredientsType} from "./JsonRecipeIngredientsType";
import {JsonBakingTimeType} from "./JsonBakingTimeType";

export type JsonRecipeType = {
    id?: string;
    name: string;

    bakingTime?: JsonBakingTimeType[];
    ingredients: JsonRecipeIngredientsType[];
    description?: string;
};
