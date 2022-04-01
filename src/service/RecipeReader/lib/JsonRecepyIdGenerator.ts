import {JsonRecipeType} from "../types";
import {useEffect, useState} from "react";
import {generateJsonRecipeTypeId} from "./Base64";
import {useTranslation} from "react-i18next";

export const resolveJsonRecipeTypeId = (value: JsonRecipeType): string => {
    if (value.id) return value.id;
    return generateJsonRecipeTypeId(value);
};


export type RecipeIdNameAndAmount = {
    id: string;
    label: string;
}

export const getRecipeIdNameAndAmount = (value: JsonRecipeType, name: string): RecipeIdNameAndAmount => {
    const id = resolveJsonRecipeTypeId(value);
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
    const translate = useTranslation();

    useEffect(() => {
        setTimeout(() => {
            setRecipeIdNameAndAmount(getRecipeIdNameAndAmount(value, translate.t(value.name)));
        }, 1);
        // eslint-disable-next-line
    }, [value]);
    return recipeIdNameAndAmount;
};
