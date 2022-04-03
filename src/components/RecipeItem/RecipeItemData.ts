import {useEffect, useState} from "react";
import {RecipeIngredients, getRecipe, Recipe} from "../../models";
import {BakerPercentageResult, recalculateBakerPercentage} from "../../utils/BakerPercentageCalulation";
import {splitStarterAndDough} from "../../service/SourdoughStarter";
import {RecipeType} from "../../models";
import {AsyncResulError, AsyncStatus, useAsync, useAsyncEffect} from "../../utils/Async";
import {newBlockingPromiseQueue} from "../../utils/BlockingQueue";

export type UseRecipeItemValues = {
    recipe: {
        recipe: Recipe;
        microNutrients: BakerPercentageResult;
        raw: RecipeType
    }
    ingredients: {
        ingredients: RecipeIngredients[];
        microNutrients: BakerPercentageResult;
    }
}

export type UseRecipeResult = {
    result?: UseRecipeItemValues;
    error?: Error;
    loading: boolean;
}

type UseRecipeResultType = {
    result: UseRecipeResult;
    setGrams: (value: number, ingredientIndex: number, index: number) => Promise<void>;
    setName: (value: string) => Promise<void>
};

const blockAndRunLater = (() => {
    const queue = newBlockingPromiseQueue();
    return (callable: () => Promise<any>) => queue.blockAndRun(callable);
})();

export const UseRecipe = (recipe: RecipeType): UseRecipeResultType => {
    const [recipeTypeValue, setRecipeTypeValue] = useState<RecipeType>(recipe);
    const [result, setResult] = useState<UseRecipeResult>({loading: true});

    const [recipeArgs, loadRecipeArgs] = useAsync<UseRecipeItemValues>(async (recipeType?: RecipeType) => {
        if (recipeType === undefined) {
            recipeType = recipeTypeValue;
        }
        const _recipe = getRecipe(recipeType);

        const micronutrients = recalculateBakerPercentage(_recipe.getIngredients());
        const ingredients = await splitStarterAndDough(_recipe.getName(), _recipe.getIngredients());
        const ingredientMicros = recalculateBakerPercentage(ingredients);
        setRecipeTypeValue(recipeType);
        return {
            recipe: {
                recipe: _recipe,
                microNutrients: micronutrients,
                raw: recipeType
            },
            ingredients: {
                ingredients: ingredients,
                microNutrients: ingredientMicros
            }
        } as UseRecipeItemValues;
    });

    const loader = useAsyncEffect(() => blockAndRunLater(loadRecipeArgs), [recipe])

    const withRecipeArgs = async (callable: (newRecipe: RecipeType) => Promise<RecipeType | undefined>) => {
        const result = await callable({...recipeTypeValue});
        if (result) {
            await loadRecipeArgs(result);
        }
    }

    const setGrams = async(grams: number, ingredientIndex: number, index: number) => {
        if (recipeTypeValue && recipeTypeValue.ingredients[ingredientIndex].ingredients[index].grams !== grams) {
            await withRecipeArgs (async (recipeType) => {
                recipeType.ingredients[ingredientIndex].ingredients[index].grams = grams;
                return recipeType;
            });
        }
    }

    const setName = async(name: string) => {
        if (!name || name.trim().length == 0 || recipeTypeValue.name === name) {
            return;
        }
        await withRecipeArgs (async (recipeType) => {
            recipeType.name = name.trim();
            return recipeType;
        });
    }

    useEffect(() => {
        if (loader.failed) {
            setResult({
                loading: false,
                error: (loader as AsyncResulError<Error>).error
            });
        }
    }, [loader]);

    useEffect(() => {
        if (recipeArgs.status === AsyncStatus.SUCCESS) {
            setResult({
               loading: false,
               result: recipeArgs.value
            });
        } else if (!result.result && recipeArgs.waiting) {
            if (!result.loading) {
                setResult({loading: true});
            }
        } else if (recipeArgs.failed) {
            console.error((recipeArgs as AsyncResulError<Error>).error);
            setResult({
                loading: false,
                error: (recipeArgs as AsyncResulError<Error>).error
            });
        }
        // eslint-disable-next-line
    }, [recipeArgs])

    return {
        result: result,
        setGrams,
        setName
    }
};
