import {BakingTimeType} from "./BakingTimeType";
import {IngredientGramsType} from "./IngredientType";

export type RecipeIngredientsType = {
    name?: string;
    ingredients: IngredientGramsType[];
    bakingTime: BakingTimeType[]

    description?: string;
    starter?: boolean; // to be included with starter. A corner case. Check pancakes
};
