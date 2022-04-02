import {IngredientGramsType} from "./IngredientType";
import {InnerTemperatureAwareType} from "./InnerTemperatureAwareType";

export type RecipeIngredientsType = {
    name?: string;
    ingredients: IngredientGramsType[];
    starter?: boolean; // to be included with starter. A corner case. Check pancakes
} & InnerTemperatureAwareType;
