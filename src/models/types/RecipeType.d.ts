import {BakingTimeType} from "./BakingTimeType";
import {RecipeIngredientsType} from "./RecipeIngredientsType";

export type RecipeType = {
    id: string;
    name: string;
    amount: number;

    bakingTime: BakingTimeType[];
    ingredients: RecipeIngredientsType[];
    description?: string;
};
