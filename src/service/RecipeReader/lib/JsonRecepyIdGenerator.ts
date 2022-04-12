import {JsonExtraStandardIngredientType, JsonRecipeType} from "../types";
import {base64Encode} from "../../../utils/Base64";

export const resolveJsonRecipeTypeId = (value: JsonRecipeType): string => {
    if (value.id) return value.id;
    return base64Encode("json", "ingredient", value.name, value.amount || 1);
};

export const resolveJsonExtraStandardIngredient = (ingredient: JsonExtraStandardIngredientType, grams: number) => {
    if (ingredient.id) return ingredient.id;
    return base64Encode("json", "ingredient", ingredient.type.toString(), ingredient.name, grams);
}
