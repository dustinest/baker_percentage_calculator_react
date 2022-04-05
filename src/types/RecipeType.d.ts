import {RecipeIngredientsType} from "./RecipeIngredientsType";
import {BakingAwareType} from "./BakingAware";

export type RecipeType = {
    id: string;
    name: string;
    amount: number;
    ingredients: RecipeIngredientsType[];
} & BakingAwareType;

