import {PREDEFINED_RECIPES} from "../data/PredefinedRecipes";
import {RecipeNavigation} from "./recipe/RecipeNavigation";
import {JsonRecipeType} from "../service/RecipeReader/types";
import {GramsAmountType, RecipeType} from "../models";
import {CircularProgress} from "@mui/material";
import {readJsonRecipe} from "../service/RecipeReader";
import {useContext, useEffect, useState} from "react";
import {RecipesContext, StateActionTypes} from "../State";
import {RecipeList} from "./recipe/RecipeList";

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

const getRecipes = (): RecipeType[] => {
    return PREDEFINED_RECIPES
        .reduce((current, value) => ( [...current, ...[value, getDouble(value)]] ), [] as JsonRecipeType[])
        //.map((e) => ({...e, ...{id: resolveJsonRecipeTypeId(e), label: getJsonRecipeTypeLabel(e, translate(e.name))}} as JsonRecipeTypeWithLabel))
        .map(readJsonRecipe);
}

export const Main = () => {
    const { recipesDispatch } = useContext(RecipesContext);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | undefined>(undefined);

    useEffect(() => {
        setLoading(true);
        try {
            const result = getRecipes();
            recipesDispatch({
                type: StateActionTypes.SET_RECIPES,
                value: result
            });
        } catch (error) {
            setError(error as Error);
        } finally {
            setLoading(false);
        }
    } , [recipesDispatch]);

    return (
        <>
            {
                loading ? (<CircularProgress />):
                    error ? <label className="error">{error}</label>:
                        (
                            <>
                                <RecipeNavigation/>
                                <RecipeList/>
                            </>
                        )
            }
        </>
    )
}
