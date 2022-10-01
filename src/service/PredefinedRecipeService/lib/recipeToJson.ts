import {
    NutritionType,
    BakingTimeType,
    IngredientGramsType,
    NumberIntervalType,
    RecipeIngredientsType,
    RecipeType,
} from "../../../types/index";

import {resolveJsonExtraStandardIngredient, resolveJsonRecipeTypeId} from "../RecipeReader/JsonRecepyIdGenerator";
import {StandardIngredients} from "../../../Constant/Ingredient";
import {FindHighestDryResult, findHighestDryResult} from "../RecipeReader/IngredientsHighestDryResult";
import { JsonBakingTime } from "../type/JsonBakingTime";
import {JsonIngredients, JsonIngredientsIngredient} from "../type/JsonIngredients";
import {
    JsonExtraStandardIngredientGrams,
    JsonExtraStandardIngredient,
    JsonStandardIngredientGrams, JsonStandardIngredientPercent
} from "../type/JsonRecipeIngredientType";
import {JsonRecipe} from "../type/JsonRecipe";

const normalizeNumberIntervalType = (time: NumberIntervalType): NumberIntervalType | number  => {
    if (time.from === time.until) return time.from;
    return {
        from: time.from,
        until: time.until
    };
}

const recipeTypeBakingTime2JsonBakingTime = (bakingTime: BakingTimeType): JsonBakingTime => {
    const result = {
        time: normalizeNumberIntervalType(bakingTime.time),
        temperature: normalizeNumberIntervalType(bakingTime.temperature)
    } as JsonBakingTime;
    if (bakingTime.steam) {
        result.steam = true;
    }
    return result;
}

const getPercentage = (ingredient: IngredientGramsType, highestDry: FindHighestDryResult) => {
    return Math.round(ingredient.grams * 10000 / highestDry.total) / 100;
}

const normalizeIngredient = (ingredient: IngredientGramsType, highestDry: FindHighestDryResult | null): JsonIngredientsIngredient => {
    // @ts-ignore
    const type = ingredient.type ? StandardIngredients[ingredient.type] : undefined;
    if (type) {
        if (highestDry) {
            return {
                type: ingredient.type,
                percent: getPercentage(ingredient, highestDry)
            } as JsonStandardIngredientPercent;
        }
        return {
            type: ingredient.type,
            grams: ingredient.grams
        } as JsonStandardIngredientGrams
    } else if (ingredient.nutrients.find(e => e.type === NutritionType.dry) &&
        resolveJsonExtraStandardIngredient(
          { type: "DRY", name: ingredient.name } as JsonExtraStandardIngredient,
          ingredient.grams) === ingredient.id) {

        const nutrients = ingredient.nutrients.filter(e => e.type !== NutritionType.dry);
        if (nutrients && nutrients.length > 0) {
            return {
                type: "DRY",
                name: ingredient.name,
                grams: ingredient.grams,
                nutrients
            } as IngredientGramsType;
        }
        return {
            type: "DRY",
            name: ingredient.name,
            grams: ingredient.grams
        } as JsonExtraStandardIngredientGrams;
    } else {
        return {
            ...ingredient
        } as IngredientGramsType
    }
};

const normalizeIngredients = (ingredients: RecipeIngredientsType, ingredientsIndex: number, highestDry: FindHighestDryResult | null): JsonIngredients => {
    //const id = generateJsonRecipeTypeId(recipe.name, recipe.amount);
    const result = {
        ingredients: ingredients.ingredients.map((ingredient, index) => normalizeIngredient(
          ingredient, highestDry !== null && (highestDry.ingredients !== ingredientsIndex || highestDry.ingredient !== index) ? highestDry : null
        ))
    } as JsonIngredients;

    if (ingredients.name) { result.name = ingredients.name; }
    if (ingredients.description) { result.name = ingredients.description; }
    if (ingredients.starter) { result.starter = ingredients.starter; }
    if (ingredients.bakingTime && ingredients.bakingTime.length > 0) { result.bakingTime = ingredients.bakingTime.map(recipeTypeBakingTime2JsonBakingTime); }
    if (ingredients.innerTemperature) result.innerTemperature = normalizeNumberIntervalType(ingredients.innerTemperature);
    return result;
}

export const recipeToJson = async (recipe: RecipeType):Promise<JsonRecipe> => {
    const highestDry = await findHighestDryResult(recipe.ingredients);

    const result: JsonRecipe = {
        name: recipe.name,
        ingredients: recipe.ingredients.map((ingredients, index) => normalizeIngredients( ingredients, index, highestDry ))
    };
    if (recipe.amount > 0) { result.amount = recipe.amount; }
    const id = resolveJsonRecipeTypeId(result);

    if (id !== recipe.id) { result.id = recipe.id; }
    if (recipe.description) { result.description = recipe.description; }
    if (recipe.bakingTime && recipe.bakingTime.length > 0) {
        result.bakingTime = recipe.bakingTime.map(recipeTypeBakingTime2JsonBakingTime);
    }
    if (recipe.innerTemperature) {
        result.innerTemperature = normalizeNumberIntervalType(recipe.innerTemperature);
    }
    return result;
}
