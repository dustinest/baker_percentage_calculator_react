import {base64Encode} from "../../../utils/Base64";
import {JsonExtraStandardIngredient} from "../type/JsonRecipeIngredientType";

export const resolveJsonRecipeTypeId = (value: { name: string, id?: any, amount?: number }): string => {
    if (value.id) return value.id;
    return base64Encode("json", "ingredient", value.name, value.amount || 1);
};

export const resolveJsonExtraStandardIngredient = (ingredient: JsonExtraStandardIngredient, grams: number) => {
    if (ingredient.id) return ingredient.id;
    return base64Encode("json", "ingredient", ingredient.type.toString(), ingredient.name, grams);
}
