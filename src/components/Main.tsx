import {PREDEFINED_RECIPES} from "../data/PredefinedRecipes";
import {RecipeNavigation} from "./recipe/RecipeNavigation";
import {RecipeList} from "./recipe/RecipeList";
import {JsonRecipeType} from "../service/RecipeReader/types";
import {GramsAmountType} from "../models";
import {CircularProgress} from "@mui/material";
import {AsyncStatus, useAsyncEffect} from "../utils/Async";
import {useTranslation} from "react-i18next";
import {getJsonRecipeTypeLabel, resolveJsonRecipeTypeId} from "../service/RecipeReader";
import {JsonRecipeTypeWithLabel} from "./recipe/JsonRecipeTypeWithLabel";

const getDouble = (value: JsonRecipeType): JsonRecipeType => {
    return {
        ...value,
        ...{
            id: undefined,
            name: value.name,
            amount: value.amount ? value.amount * 2 : 2,
            ingredients: value.ingredients.map((e) => ({
                ...e,
                ...{ingredients: e.ingredients.map((i) => {
                        const jsonGrams = i as GramsAmountType;
                        if (jsonGrams.grams) {
                            return {
                                ...jsonGrams,
                                ...{grams: jsonGrams.grams * 2}
                            };
                        }
                        return i;
                    })}
            }))
        }
    } as JsonRecipeType;
};

const getRecipes = (translate: (label: string) => string): JsonRecipeTypeWithLabel[] => {
    return PREDEFINED_RECIPES
        .reduce((current, value) => ( [...current, ...[value, getDouble(value)]] ), [] as JsonRecipeType[])
        .map((e) => ({...e, ...{id: resolveJsonRecipeTypeId(e), label: getJsonRecipeTypeLabel(e, translate(e.name))}} as JsonRecipeTypeWithLabel));
}

export const Main = () => {
    const translate = useTranslation();
    const result = useAsyncEffect<JsonRecipeTypeWithLabel[]>(async () => getRecipes(translate.t) , []);
    return (
        <>
            {
                result.waiting ? (<CircularProgress />):
                    result.status === AsyncStatus.CANCELLED ? translate.t("Cancelled"):
                        result.failed ? <label className="error">{result.error}</label>:
                                result.value.length === 0 ? (<label>No recipes</label>):
                        (
                            <>
                                <RecipeNavigation recipes={result.value}/>
                                <RecipeList recipes={result.value}/>
                            </>
                        )
            }
        </>
    )
}
