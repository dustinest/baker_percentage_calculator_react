import {IngredientGramsType} from "./IngredientType";
import {BakingAwareType} from "./BakingAware";

export type RecipeIngredientsType = {
    name?: string;
    ingredients: IngredientGramsType[];
    starter?: boolean; // to be included with starter. A corner case. Check pancakes
} & BakingAwareType;
