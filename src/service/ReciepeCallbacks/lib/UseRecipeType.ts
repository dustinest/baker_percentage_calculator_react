import {useEffect, useState} from "react";
import {recalculateBakerPercentage} from "../../../utils/BakerPercentageCalulation";
import {splitStarterAndDough} from "../../SourdoughStarter";
import {RecipeType} from "../../../types";
import {AsyncResulError, AsyncStatus, useAsyncEffect} from "../../../utils/Async";
import {newBlockingPromiseQueue} from "../../../utils/BlockingQueue";
import {UseRecipeTypeResult} from "../types/UseRecipeTypeResult";
import {useMessageSnackBar} from "../../../State";

export type UseRecipeResultStatus = {
    result?: UseRecipeTypeResult | null;
    error: boolean;
    loading: boolean;
};

const blockAndRunLater = (() => {
    const queue = newBlockingPromiseQueue();
    return (callable: () => Promise<any>) => queue.blockAndRun(callable);
})();
export const useRecipeType = (recipe: RecipeType | null): UseRecipeResultStatus => {
    const [result, setResult] = useState<UseRecipeResultStatus>({loading: true, error: false});
    const snackBar = useMessageSnackBar();

    const recipeItems = useAsyncEffect<UseRecipeTypeResult | null>(async () => blockAndRunLater(async () => {
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
        } as UseRecipeTypeResult;
    }), [recipe])

    useEffect(() => {
        if (recipeItems.status === AsyncStatus.SUCCESS) {
            setResult({
                loading: false,
                error: false,
                result: recipeItems.value
            });
        } else if (!result.result && recipeItems.waiting) {
            if (!result.loading) {
                setResult({loading: true, error: false});
            }
        } else if (recipeItems.failed) {
            setResult({
                loading: false,
                error: true
            });
            snackBar.error((recipeItems as AsyncResulError<Error>).error, `Error while resolving the recipe ${recipe?.name}`).translate().enqueue();
        }
        // eslint-disable-next-line
    }, [recipeItems])

    return result;
}
