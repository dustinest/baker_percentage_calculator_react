import {JsonDryIngredient, JsonRecipeType} from "../types";
import {base64Encode} from "./Base64";

export const resolveJsonRecipeTypeId = (value: JsonRecipeType): string => {
    if (value.id) return value.id;
    return base64Encode(value.name, value.amount || 1);
};

export const resolveJsonDryIngredientId = (ingredient: JsonDryIngredient, grams: number) => {
    if (ingredient.id) return ingredient.id;
    return base64Encode(ingredient.type, ingredient.name, grams);
}

export const getJsonRecipeTypeLabel = (value: { amount: number, name: string }): string => {
    if (value.amount && value.amount > 1) {
        return `${value.name} x ${value.amount}`;
    } else {
        return value.name;
    }
}
