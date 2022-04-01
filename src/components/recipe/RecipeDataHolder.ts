import {useState} from "react";
import {readJsonRecipe} from "../../service/RecipeReader";
import {getRecipe, Recipe} from "../../models/interfaces/Recipe";
import {BakerPercentageResult, recalculateBakerPercentage} from "../../utils/BakerPercentageCalulation";
import {splitStarterAndDough} from "../../service/SourdoughStarter";
import {RecipeIngredients} from "../../models/interfaces/RecipeIngredients";
import {JsonRecipeType} from "../../service/RecipeReader/types";
import {RecipeType} from "../../models/types";
import {AsyncStatusResult, useAsyncEffect} from "../../service/AsyncHooks";

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


const readRecipe = async (recipeType: RecipeType | undefined, jsonRecipeType: JsonRecipeType): Promise<{ type: RecipeType, recipe: Recipe}> => {
    if (recipeType !== undefined) {
        const recipe = getRecipe(recipeType);
        return {
            type: recipeType,
            recipe
        }
    }
    const type = await readJsonRecipe(jsonRecipeType);
    const recipe = getRecipe(type);
    return {
        type,
        recipe
    };
};

export const UseRecipe = (recipe: JsonRecipeType): { result: AsyncStatusResult<UseRecipeResult>; setGrams: SetValueProps; } => {
    const [recipeType, setRecipeType] = useState<RecipeType | undefined>();

    const recipeArgs = useAsyncEffect<UseRecipeResult>(async () => {
        const recipeObject = await readRecipe(recipeType, recipe);
        const micronutrients = recalculateBakerPercentage(recipeObject.recipe.getIngredients());
        const ingredients = await splitStarterAndDough(recipeObject.recipe.getName(), recipeObject.recipe.getIngredients());
        const ingredientMicros = recalculateBakerPercentage(ingredients);
        return {
            recipe: {
                recipe: recipeObject.recipe,
                microNutrients: micronutrients,
                raw: recipeObject.type
            },
            ingredients: {
                ingredients: ingredients,
                microNutrients: ingredientMicros
            }
        } as UseRecipeResult;
    }, [recipeType, recipe]);


    const setGrams = async(grams: number, ingredientIndex: number, index: number) => {
        if (recipeType && recipeType.ingredients[ingredientIndex].ingredients[index].grams !== grams) {
            const _data = {...recipeType};
            _data.ingredients[ingredientIndex].ingredients[index].grams = grams;
            setRecipeType(_data);
        }
    }

    return {
        result: recipeArgs,
        setGrams
    }
};
