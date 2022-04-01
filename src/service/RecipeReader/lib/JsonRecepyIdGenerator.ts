import {JsonRecipeType} from "../types";
import {generateJsonRecipeTypeId} from "./Base64";

export const resolveJsonRecipeTypeId = (value: JsonRecipeType): string => {
    if (value.id) return value.id;
    return generateJsonRecipeTypeId(value);
};


export type RecipeIdNameAndAmount = {
    id: string;
    label: string;
}

export const getJsonRecipeTypeLabel = (value: JsonRecipeType, name: string): string => {
    if (value.amount && value.amount > 0) {
        return `${name} x ${value.amount}`;
    } else {
        return name;
    }
}
