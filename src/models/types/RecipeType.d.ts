import {RecipeIngredientsType} from "./RecipeIngredientsType";
import {InnerTemperatureAwareType} from "./InnerTemperatureAwareType";

export type RecipeType = {
    id: string;
    name: string;
    amount: number;
    ingredients: RecipeIngredientsType[];
} & InnerTemperatureAwareType;
