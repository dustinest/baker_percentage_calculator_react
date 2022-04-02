import {useEffect, useState} from "react";
import {readJsonRecipe} from "../../service/RecipeReader";
import {getRecipe, Recipe} from "../../models/interfaces/Recipe";
import {BakerPercentageResult, recalculateBakerPercentage} from "../../utils/BakerPercentageCalulation";
import {splitStarterAndDough} from "../../service/SourdoughStarter";
import {RecipeIngredients} from "../../models/interfaces/RecipeIngredients";
import {JsonRecipeType} from "../../service/RecipeReader/types";
import {RecipeType} from "../../models/types";
import {AsyncResulError, AsyncStatus, useAsync, useAsyncEffect} from "../../utils/Async";
import {newBlockingPromiseQueue} from "../../utils/BlockingQueue";

export type UseRecipeValues = {
    recipe: {
        recipe: Recipe;
        microNutrients: BakerPercentageResult;
        raw: RecipeType;
    }
    ingredients: {
        ingredients: RecipeIngredients[];
        microNutrients: BakerPercentageResult;
    }
}

export type UseRecipeResult = {
    result?: UseRecipeValues;
    error?: Error;
    loading: boolean;
}

type SetValueProps = (value: number, ingredientIndex: number, index: number) => Promise<void>;


const resolveRecipeType = async (recipe: JsonRecipeType, recipeType?: RecipeType): Promise<RecipeType> => {
    if (recipeType) return recipeType;
    return readJsonRecipe(recipe);
}

const blockAndRunLater = (() => {
    const queue = newBlockingPromiseQueue();
    return (callable: () => Promise<any>) => queue.blockAndRun(callable);
})();

export const UseRecipe = (recipe: JsonRecipeType): { result: UseRecipeResult; setGrams: SetValueProps; } => {
    const [recipeType, setRecipeType] = useState<RecipeType | undefined>();
    const [result, setResult] = useState<UseRecipeResult>({loading: true});

    const [recipeArgs, loadRecipeArgs] = useAsync<UseRecipeValues>(async (recipeType?: RecipeType) => {
        const _recipeType = await resolveRecipeType(recipe, recipeType);
        setRecipeType(_recipeType);
        const type = await readJsonRecipe(_recipeType);
        const _recipe = getRecipe(type);

        const micronutrients = recalculateBakerPercentage(_recipe.getIngredients());
        const ingredients = await splitStarterAndDough(_recipe.getName(), _recipe.getIngredients());
        const ingredientMicros = recalculateBakerPercentage(ingredients);
        return {
            recipe: {
                recipe: _recipe,
                microNutrients: micronutrients,
                raw: _recipeType
            },
            ingredients: {
                ingredients: ingredients,
                microNutrients: ingredientMicros
            }
        } as UseRecipeValues;
    });

    const loader = useAsyncEffect(() => blockAndRunLater(loadRecipeArgs), [recipe])

    const setGrams = async(grams: number, ingredientIndex: number, index: number) => {
        if (recipeType && recipeType.ingredients[ingredientIndex].ingredients[index].grams !== grams) {
            const _data = {...recipeType};
            _data.ingredients[ingredientIndex].ingredients[index].grams = grams;
            setRecipeType(_data);
            loadRecipeArgs(_data);
        }
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
            setResult({
                loading: false,
                error: (recipeArgs as AsyncResulError<Error>).error
            });
        }
        // eslint-disable-next-line
    }, [recipeArgs])

    return {
        result: result,
        setGrams
    }
};
