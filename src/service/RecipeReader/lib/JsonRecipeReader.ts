import {
    JsonBakingTimeType, JsonDryIngredient,
    JsonDryIngredientGrams,
    JsonRecipeIngredientConstantGramsType,
    JsonRecipeIngredientConstantType,
    JsonRecipeIngredientsIngredientType,
    JsonRecipeType
} from "../types";
import {
    BakingTimeType, GramsAmountType,
    IngredientGramsType,
    IngredientPercentType,
    NumberIntervalType,
    RecipeIngredientsType,
    RecipeType,
    PREDEFINED_INGREDIENT
} from "../../../models";
import {resolveJsonRecipeTypeId} from "./JsonRecepyIdGenerator";
import {calculateFlourAndWaterPercent} from "../../DryAndLiquidCalculator/FlourAndWaterCalculation";
import {generateJsonDryIngredientId} from "./Base64";


type JsonIngredientGramsType = IngredientGramsType | JsonRecipeIngredientConstantGramsType | JsonDryIngredientGrams;

const resolveNumberIntervalType = (value: NumberIntervalType | number): NumberIntervalType => {
    const first: number = typeof value === "number" ? value as number : (value as NumberIntervalType).from;
    const second: number = typeof value === "number" ? value as number : (value as NumberIntervalType).until;
    return {
        from: Math.min(first, second),
        until: Math.max(first, second),
    } as NumberIntervalType;
};

const resolveInnerTemperature = (value?: NumberIntervalType | number): NumberIntervalType | null => {
    if (value === undefined || value === null) return null;
    return resolveNumberIntervalType(value);
}

const resolveBakingTime = (bakingTimes?: JsonBakingTimeType[]): BakingTimeType[] => {
    if (bakingTimes) {
        return bakingTimes.map((bakingTime) => ({
            time: resolveNumberIntervalType(bakingTime.time),
            temperature: resolveNumberIntervalType(bakingTime.temperature),
            steam: bakingTime.steam === true
        } as BakingTimeType));
    }
    return [];
};


const getPredefined = (ingredient: JsonRecipeIngredientsIngredientType, grams?: number) => {
    const type = (ingredient as (JsonRecipeIngredientConstantType | JsonDryIngredient)).type;
    const _grams = grams || (ingredient as GramsAmountType).grams;
    if (type === "DRY") {
        const dryIngredient = ingredient as JsonDryIngredient;
        const name = dryIngredient.name;
        const id = dryIngredient.id ? dryIngredient.id : generateJsonDryIngredientId(dryIngredient, _grams);
        return PREDEFINED_INGREDIENT.DRY(id, name, _grams);
    }
    return PREDEFINED_INGREDIENT[type](_grams).toType();
}

export const readJsonRecipe = async (recipe: JsonRecipeType): Promise<RecipeType> => {
    const result = {
        id: resolveJsonRecipeTypeId(recipe),
        name: recipe.name,
        ingredients: [],
        bakingTime: resolveBakingTime(recipe.bakingTime),
        innerTemperature: resolveInnerTemperature(recipe.innerTemperature),
        description: recipe.description,
        amount: recipe.amount || 0,
    } as RecipeType;

    const toBeCalculated = {
        flour: {
            grams: 0,
            totalPercentage: 0
        },
        flourCalculation: [] as {
            gram:  IngredientGramsType,
            percent: number
        }[],
        ingredients: [] as {
            gram:  IngredientGramsType,
            percent: number
        }[]
    };

    recipe.ingredients.forEach((ingredients) => {
        const recipeIngredientsType: RecipeIngredientsType = {
            name: ingredients.name,
            description: ingredients.description,
            bakingTime: resolveBakingTime(ingredients.bakingTime),
            innerTemperature: resolveInnerTemperature(ingredients.innerTemperature),
            starter: ingredients.starter === true,
            ingredients: []
        } as RecipeIngredientsType;
        ingredients.ingredients.forEach((ingredient) => {
            if ((ingredient as JsonIngredientGramsType).grams === undefined) {
                const ingredientPercent = ingredient as IngredientPercentType;
                const ingredientGram = (ingredient as JsonRecipeIngredientConstantType).type === undefined ?
                    {
                        id: ingredientPercent.id,
                        name: ingredientPercent.name,
                        grams: 100,
                        nutrients: ingredientPercent.nutrients
                    } as IngredientGramsType :
                    getPredefined(ingredient, 100);
                recipeIngredientsType.ingredients.push(ingredientGram);
                // check if there is any flour
                const flourAndWater = calculateFlourAndWaterPercent(ingredientGram.nutrients);
                if (flourAndWater.flour > 0) {
                    toBeCalculated.flour.totalPercentage += ingredientPercent.percent * 100 / flourAndWater.flour;
                    toBeCalculated.flourCalculation.push({
                        percent: ingredientPercent.percent,
                        gram: ingredientGram
                    });
                } else {
                    toBeCalculated.ingredients.push({
                        percent: ingredientPercent.percent,
                        gram: ingredientGram
                    });
                }
            } else {
                const ingredientGram = (ingredient as JsonRecipeIngredientConstantGramsType).type === undefined ?
                    ingredient as IngredientGramsType :
                    getPredefined(ingredient);
                recipeIngredientsType.ingredients.push(ingredientGram);
                const flourAndWater = calculateFlourAndWaterPercent(ingredientGram.nutrients);
                if (flourAndWater.flour > 0) {
                    toBeCalculated.flour.grams += ingredientGram.grams;
                }
            }
        });
        result.ingredients.push(recipeIngredientsType)
    });

    // recalculate flour percentages
    if (toBeCalculated.flour.totalPercentage > 0) {
        if (toBeCalculated.flour.totalPercentage >= 100) throw new Error("Somehow other flour percentage is larger than 100!")
        toBeCalculated.flour.grams = toBeCalculated.flour.grams * 100 / (100 - toBeCalculated.flour.totalPercentage);
        toBeCalculated.flourCalculation.forEach((ingredient) => {
            ingredient.gram.grams = Math.round(ingredient.percent * toBeCalculated.flour.grams / 10) / 10;
        });
    }

    // recalculate percentages
    toBeCalculated.ingredients.forEach((ingredient) => {
        ingredient.gram.grams = Math.round(ingredient.percent * toBeCalculated.flour.grams / 10) / 10;
    });
    return result;
};
