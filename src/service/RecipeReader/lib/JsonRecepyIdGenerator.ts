import {JsonRecipeType} from "../types";
import {useEffect, useState} from "react";
import {getTranslation} from "../../TranslationService";
import {generateJsonRecipeTypeId} from "./Base64";

export const resolveJsonRecipeTypeId = (value: JsonRecipeType): string => {
    if (value.id) return value.id;
    return generateJsonRecipeTypeId(value);
};


export type RecipeIdNameAndAmount = {
    id: string;
    label: string;
}

export const getRecipeIdNameAndAmount = (value: JsonRecipeType): RecipeIdNameAndAmount => {
    const id = resolveJsonRecipeTypeId(value);
    const name = getTranslation(value.name);
    if (value.amount && value.amount > 0) {
        return {
            id: id,
            label: `${name} x ${value.amount}`
        };
    } else {
        return {
            id: id,
            label: `${name}`
        };
    }
}

export const useRecipeIdNameAndAmount = (value: JsonRecipeType): RecipeIdNameAndAmount | undefined => {
    const [recipeIdNameAndAmount, setRecipeIdNameAndAmount] = useState<RecipeIdNameAndAmount | undefined>();

    useEffect(() => {
        setTimeout(() => {
            setRecipeIdNameAndAmount(getRecipeIdNameAndAmount(value));
        }, 1);
    }, [value]);
    return recipeIdNameAndAmount;
};
