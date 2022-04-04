import {useEffect, useState} from "react";
import {RecipeIngredients, getRecipe, Recipe} from "../../../models";
import {BakerPercentageResult, recalculateBakerPercentage} from "../../../utils/BakerPercentageCalulation";
import {splitStarterAndDough} from "../../../service/SourdoughStarter";
import {RecipeType} from "../../../models";
import {AsyncResulError, AsyncStatus, useAsyncEffect} from "../../../utils/Async";
import {newBlockingPromiseQueue} from "../../../utils/BlockingQueue";

export type UseRecipeItemValues = {
    recipe: {
        recipe: Recipe;
        microNutrients: BakerPercentageResult;
    }
    ingredients: {
        ingredients: RecipeIngredients[];
        microNutrients: BakerPercentageResult;
    }
}

export type UseRecipeResultStatus = {
    result?: UseRecipeItemValues;
    error?: Error;
    loading: boolean;
};

const blockAndRunLater = (() => {
    const queue = newBlockingPromiseQueue();
    return (callable: () => Promise<any>) => queue.blockAndRun(callable);
})();
export const useRecipeType = (recipe: RecipeType): UseRecipeResultStatus => {
    const [result, setResult] = useState<{
        result?: UseRecipeItemValues;
        error?: Error;
        loading: boolean;
    }>({loading: true});

    const recipeItems = useAsyncEffect<UseRecipeItemValues>(async () => blockAndRunLater(async () => {
        const _recipe = getRecipe(recipe);
        const micronutrients = recalculateBakerPercentage(_recipe.getIngredients());
        const ingredients = await splitStarterAndDough(_recipe.getName(), _recipe.getIngredients());
        const ingredientMicros = recalculateBakerPercentage(ingredients);
        return {
            recipe: {
                recipe: _recipe,
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

export type UseRecipeActions = {
    cancel: () => void;
    setGrams: (value: number, ingredientIndex: number, index: number) => Promise<void>;
    setName: (value: string) => Promise<void>;
    setAmount: (valye: number) => Promise<void>;
}


export const useRecipeItemData = (recipe: RecipeType): [RecipeType, UseRecipeActions, UseRecipeResultStatus] => {
    const [recipeTypeValue, setRecipeTypeValue] = useState<RecipeType>(recipe);

    const result = useRecipeType(recipeTypeValue);

    const withRecipeArgs = async (callable: (newRecipe: RecipeType) => Promise<RecipeType | undefined>) => {
        const result = await callable(getRecipe(recipeTypeValue).toType());
        if (result) {
            setRecipeTypeValue(result);
        }
    }

    const recipeActions: UseRecipeActions = {
        cancel: async () => setRecipeTypeValue(recipe),
        setGrams: async(grams: number, ingredientIndex: number, index: number) => {
            if (recipeTypeValue && recipeTypeValue.ingredients[ingredientIndex].ingredients[index].grams !== grams) {
                await withRecipeArgs(async (recipeType) => {
                    recipeType.ingredients[ingredientIndex].ingredients[index].grams = grams;
                    return recipeType;
                });
            }
        },
        setName: async(name: string) => {
            if (!name || name.trim().length === 0 || recipeTypeValue.name === name) {
                return;
            }
            await withRecipeArgs (async (recipeType) => {
                recipeType.name = name.trim();
                return recipeType;
            });
        },
        setAmount: async (value: number) => {
            const _value = Math.floor(value * 10) / 10;
            if (_value <= 0) {
                return;
            }
            await withRecipeArgs (async (recipeType) => {
                const _amountChange = _value / recipeType.amount;
                recipeType.ingredients.forEach((e) => {
                   e.ingredients.forEach((i) => {
                       i.grams = i.grams * _amountChange;
                   })
                });
                recipeType.amount = _value;
                return recipeType;
            });
        }
    }

    return [ recipeTypeValue, recipeActions, result ];
};
