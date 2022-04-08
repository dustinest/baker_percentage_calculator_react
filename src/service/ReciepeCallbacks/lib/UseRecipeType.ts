import {useEffect, useState} from "react";
import {BakerPercentageResult, recalculateBakerPercentage} from "../../../utils/BakerPercentageCalulation";
import {splitStarterAndDough} from "../../SourdoughStarter";
import {AsyncResulError, AsyncStatus, useAsyncEffect} from "../../../utils/Async";
import {newBlockingPromiseQueue} from "../../../utils/BlockingQueue";
import {
    CommonUseRecipeTypeResult,
    UseRecipeTypeDone,
    UseRecipeTypeError,
    UseRecipeTypeResult,
    UseRecipeTypeStatus, UseRecipeTypeWaiting
} from "../types/UseRecipeTypeResult.d";
import {useMessageSnackBar} from "../../../State";
import {RecipeType} from "../../../types";

export type UseRecipeResult = {
    bakerPercentage: BakerPercentageResult,
} & UseRecipeTypeResult;

const blockAndRunLater = (() => {
    const queue = newBlockingPromiseQueue();
    return (callable: () => Promise<any>) => queue.blockAndRun(callable);
})();
export const useRecipeType = (recipe: RecipeType | null): CommonUseRecipeTypeResult | UseRecipeResult => {
    const [result, setResult] = useState<CommonUseRecipeTypeResult | UseRecipeResult>({status: UseRecipeTypeStatus.WAITING} as UseRecipeTypeWaiting);
    const snackBar = useMessageSnackBar();

    const recipeItems = useAsyncEffect<UseRecipeResult>(async () => blockAndRunLater(async () => {
        if (recipe === null || recipe === undefined) return {status: UseRecipeTypeStatus.DONE} as UseRecipeTypeDone;
        const ingredients = await splitStarterAndDough(recipe.name, recipe.ingredients);
        const ingredientMicros = recalculateBakerPercentage(ingredients);
        return {
            status: UseRecipeTypeStatus.RESULT,
            bakerPercentage: ingredientMicros
        } as UseRecipeResult;
    }), [recipe])

    useEffect(() => {
        if (recipeItems.status === AsyncStatus.SUCCESS && recipeItems) {
            setResult(recipeItems.value);
        } else if (result.status !== UseRecipeTypeStatus.RESULT && recipeItems.waiting) {
            if (result.status !== UseRecipeTypeStatus.WAITING) {
                setResult({ status: UseRecipeTypeStatus.WAITING } as UseRecipeTypeWaiting);
            }
        } else if (recipeItems.failed) {
            if (result.status !== UseRecipeTypeStatus.ERROR) {
                setResult({ status: UseRecipeTypeStatus.ERROR } as UseRecipeTypeError);
            }
            snackBar.error((recipeItems as AsyncResulError<Error>).error, `Error while resolving the recipe ${recipe?.name}`).translate().enqueue();
        }
        // eslint-disable-next-line
    }, [recipeItems])

    return result;
}
