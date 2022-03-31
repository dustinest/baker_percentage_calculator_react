import {useEffect, useState} from "react";
import {readJsonRecipe} from "../../service/RecipeReader";
import {runPromiseLater} from "../../service/RunLater";
import {getRecipe, Recipe} from "../../models/interfaces/Recipe";
import {BakerPercentageResult, recalculateBakerPercentage} from "../../utils/BakerPercentageCalulation";
import {splitStarterAndDough} from "../../service/SourdoughStarter";
import {RecipeIngredients} from "../../models/interfaces/RecipeIngredients";
import {JsonRecipeType} from "../../service/RecipeReader/types";
import {RecipeType} from "../../models/types";

export type UseRecipeResult = {
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

type SetValueProps = (value: number, ingredientIndex: number, index: number) => Promise<void>;

export const UseRecipe = (recipe: JsonRecipeType): { result: UseRecipeResult | undefined, setGrams: SetValueProps } => {
    const [recipeArgs, setRecipeArgs] = useState<UseRecipeResult | undefined>();
    const [recipeType, setRecipeType] = useState<RecipeType | undefined>();

    useEffect(() => {
        if (recipeType === undefined) return;
        const recipeObject = getRecipe(recipeType);
        const micronutrients = recalculateBakerPercentage(recipeObject.getIngredients());
        runPromiseLater(async () => {
            const ingredients = await splitStarterAndDough(recipeObject.getName(), recipeObject.getIngredients());
            const ingredientMicros = recalculateBakerPercentage(ingredients);
            setRecipeArgs({
                recipe: {
                    recipe: recipeObject,
                    microNutrients: micronutrients,
                    raw: recipeType
                },
                ingredients: {
                    ingredients: ingredients,
                    microNutrients: ingredientMicros
                }
            } as UseRecipeResult);
        }).catch(console.error);
    }, [recipeType])

    const setGrams = async(grams: number, ingredientIndex: number, index: number) => {
        if (recipeType && recipeType.ingredients[ingredientIndex].ingredients[index].grams !== grams) {
            const _data = {...recipeType};
            _data.ingredients[ingredientIndex].ingredients[index].grams = grams;
            setRecipeType(_data);
        }
    }

    useEffect(() => {
        setRecipeArgs(undefined);
        setRecipeType(undefined);
        readJsonRecipe(recipe).then(setRecipeType).catch(console.error);
        // eslint-disable-next-line
    }, [recipe]);

    return {
        result: recipeArgs,
        setGrams
    }
};
