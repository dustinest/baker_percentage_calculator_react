import {useEffect, useState} from "react";
import {BakerPercentageResult, recalculateBakerPercentage} from "../../../utils/BakerPercentageCalulation";
import {splitStarterAndDough} from "../../../service/SourdoughStarter";
import {RecipeIngredientsType, RecipeType} from "../../../types";
import {AsyncResulError, AsyncStatus, useAsyncEffect} from "../../../utils/Async";
import {newBlockingPromiseQueue} from "../../../utils/BlockingQueue";

export type UseRecipeItemValues = {
    recipe: {
        microNutrients: BakerPercentageResult;
    }
    ingredients: {
        ingredients: RecipeIngredientsType[];
        microNutrients: BakerPercentageResult;
    }
}

export type UseRecipeResultStatus = {
    result?: UseRecipeItemValues | null;
    error?: Error;
    loading: boolean;
};

const blockAndRunLater = (() => {
    const queue = newBlockingPromiseQueue();
    return (callable: () => Promise<any>) => queue.blockAndRun(callable);
})();
export const useRecipeType = (recipe: RecipeType | null): UseRecipeResultStatus => {
    const [result, setResult] = useState<UseRecipeResultStatus>({loading: true});

    const recipeItems = useAsyncEffect<UseRecipeItemValues | null>(async () => blockAndRunLater(async () => {
        if (recipe === null) return null;
        const micronutrients = recalculateBakerPercentage(recipe.ingredients);
        const ingredients = await splitStarterAndDough(recipe.name, recipe.ingredients);
        const ingredientMicros = recalculateBakerPercentage(ingredients);
        return {
            recipe: {
                microNutrients: micronutrients
            },
            ingredients: {
                ingredients: ingredients,
                microNutrients: ingredientMicros
            }
        } as UseRecipeItemValues;
    }), [recipe])

    useEffect(() => {
        if (recipeItems.status === AsyncStatus.SUCCESS) {
            setResult({
                loading: false,
                result: recipeItems.value
            });
        } else if (!result.result && recipeItems.waiting) {
            if (!result.loading) {
                setResult({loading: true});
            }
        } else if (recipeItems.failed) {
            console.error((recipeItems as AsyncResulError<Error>).error);
            setResult({
                loading: false,
                error: (recipeItems as AsyncResulError<Error>).error
            });
        }
        // eslint-disable-next-line
    }, [recipeItems])

    return result;
}
