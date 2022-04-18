import {
    JsonBakingTimeType,
    JsonRecipeType
} from "../types";
import {
    BakingTimeType, DRY_NUTRIENTS,
    IngredientGramsType,
    NumberIntervalType,
    RecipeIngredientsType,
    RecipeType
} from "../../../types";
import {resolveJsonRecipeTypeId} from "./JsonRecepyIdGenerator";
import {resolveIngredient, ResolveTestType} from "./JsonRecipeReaderMethods";

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

export const readJsonRecipe = (recipe: JsonRecipeType): RecipeType => {
    const result = {
        id: resolveJsonRecipeTypeId(recipe),
        name: recipe.name,
        ingredients: [],
        bakingTime: resolveBakingTime(recipe.bakingTime),
        innerTemperature: resolveInnerTemperature(recipe.innerTemperature),
        description: recipe.description,
        amount: recipe.amount || 1,
    } as RecipeType;

    const toBeCalculated = {
        flour: {
            amount: 0,
            percent: 100,
        },
        percent: [] as [IngredientGramsType, ResolveTestType][]
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

        ingredients.ingredients.map(resolveIngredient).forEach(([ingredient, resolveTest]) => {
            recipeIngredientsType.ingredients.push(ingredient);
            const dryPercentage = ingredient.nutrients
              .filter((ingredient) => DRY_NUTRIENTS.includes(ingredient.type))
              .reduce((value, ingredient) => value + ingredient.percent, 0);

            if (dryPercentage <= 0) {
                if (!resolveTest.grams.has) {
                    toBeCalculated.percent.push([ingredient, resolveTest]);
                }
                return;
            }
            if (resolveTest.grams.has) {
                toBeCalculated.flour.amount += resolveTest.grams.value * dryPercentage / 100;
            } else if (resolveTest.percent.has) {
                toBeCalculated.flour.percent -= resolveTest.percent.value * 100 / dryPercentage;
                toBeCalculated.percent.push([ingredient, resolveTest])
            } else {
                throw new Error(`Unresolved item- no amount nor percent ${JSON.stringify(resolveTest)!}`);
            }
        });
        result.ingredients.push(recipeIngredientsType)
    });
    if (toBeCalculated.percent.length === 0) {
        return result;
    }
    if (toBeCalculated.flour.amount === 0) {
        throw new Error("There is no flour amount defined!")
    }
    if (toBeCalculated.flour.percent <= 0) {
        throw new Error(`Total flour percent in recipe ${result.name} is over 100% and not correct!`)
    }
    const totalFlourAmount = 100 *  toBeCalculated.flour.amount / toBeCalculated.flour.percent;
    toBeCalculated.percent.forEach(([ingredient, resolveTest]) => {
        ingredient.grams = Math.round(resolveTest.percent.value * totalFlourAmount / 10) / 10;
    });
    return result;
};
