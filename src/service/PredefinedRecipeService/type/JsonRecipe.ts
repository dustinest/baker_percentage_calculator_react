import {JsonIngredients} from "./JsonIngredients";
import {JsonBakingTime, JsonNumberInterval} from "./JsonBakingTime";

export interface JsonRecipe {
    id?: string;
    name: string;
    amount?: number;

    bakingTime?: JsonBakingTime[];
    innerTemperature?: JsonNumberInterval;
    ingredients: JsonIngredients[];
    description?: string;
}
