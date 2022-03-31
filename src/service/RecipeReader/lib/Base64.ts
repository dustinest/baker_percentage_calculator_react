import {Buffer} from "buffer";
import {JsonDryIngredient, JsonRecipeType} from "../types";

export const base64Encode = (value: string) => {
    return Buffer.from(value, 'utf8').toString('base64');
}

const base64EncodeArray = (...values: (string | number)[]) => {
    const id = JSON.stringify(values);
    return base64Encode(id);
}

export const generateJsonRecipeTypeId = (jsonRecipe: JsonRecipeType): string => {
    return base64EncodeArray(jsonRecipe.name, jsonRecipe.amount || 1);
}

export const generateJsonDryIngredientId = (ingredient: JsonDryIngredient, grams: number) => {
    return base64EncodeArray(ingredient.type, ingredient.name, grams);
}
