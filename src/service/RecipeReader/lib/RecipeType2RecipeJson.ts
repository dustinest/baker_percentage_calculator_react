import {
    BakingTimeType,
    IngredientGramsType,
    NumberIntervalType,
    RecipeIngredientsType,
    RecipeType
} from "../../../models/types";
import {INGREDIENT_CONSTANT} from "../../../models/interfaces/IngredientConstant";
import {
    JsonBakingTimeType, JsonDryIngredient, JsonDryIngredientGrams, JsonRecipeIngredientConstantGramsType,
    JsonRecipeIngredientsIngredientType,
    JsonRecipeIngredientsType,
    JsonRecipeType
} from "../types";
import {generateJsonDryIngredientId, generateJsonRecipeTypeId} from "./Base64";

const normalizeNumberIntervalType = (time: NumberIntervalType): NumberIntervalType | number  => {
    if (time.from === time.until) return time.from;
    return {
        from: time.from,
        until: time.until
    };
}

const recipeTypeBakingTime2JsonBakingTime = (bakingTime: BakingTimeType): JsonBakingTimeType => {
    const result = {
        time: normalizeNumberIntervalType(bakingTime.time),
        temperature: normalizeNumberIntervalType(bakingTime.temperature)
    } as JsonBakingTimeType;
    if (bakingTime.steam) {
        result.steam = true;
    }
    return result;
}

const INGREDIENT_CONSTANT_ID_MAP: { [key: string]: string } = Object.keys(INGREDIENT_CONSTANT).reduce((obj,key) => {
    // @ts-ignore
    obj[INGREDIENT_CONSTANT[key].id] = key;
    return obj;
}, {});

const normalizeIngredient = (ingredient: IngredientGramsType): JsonRecipeIngredientsIngredientType => {
    if (INGREDIENT_CONSTANT_ID_MAP[ingredient.id]) {
        return {
            type: INGREDIENT_CONSTANT_ID_MAP[ingredient.id],
            grams: ingredient.grams
        } as JsonRecipeIngredientConstantGramsType
    } else if (ingredient.nutrients.find(e => e.type === "dry") &&
        generateJsonDryIngredientId({ type: "DRY", name: ingredient.name } as JsonDryIngredient, ingredient.grams) === ingredient.id) {
        const nutrients = ingredient.nutrients.filter(e => e.type !== "dry");
        const result = {
            type: "DRY",
            name: ingredient.name,
            grams: ingredient.grams
        } as JsonDryIngredientGrams;
        if (nutrients && nutrients.length > 0) {
            // @ts-ignore
            result.nutrients = nutrients;
        }
        return result;
    } else {
        return {
            ...ingredient
        } as IngredientGramsType
    }
};

const normalizeIngredients = (ingredients: RecipeIngredientsType): JsonRecipeIngredientsType => {
    //const id = generateJsonRecipeTypeId(recipe.name, recipe.amount);
    const result = {
        ingredients: ingredients.ingredients.map(normalizeIngredient)
    } as JsonRecipeIngredientsType;

    if (ingredients.name) { result.name = ingredients.name; }
    if (ingredients.description) { result.name = ingredients.description; }
    if (ingredients.starter) { result.starter = ingredients.starter; }
    if (ingredients.bakingTime && ingredients.bakingTime.length > 0) { result.bakingTime = ingredients.bakingTime.map(recipeTypeBakingTime2JsonBakingTime); }
    return result;
}

export const recipeType2RecipeJson = async (recipe: RecipeType):Promise<JsonRecipeType> => {
    const result: JsonRecipeType = {
        name: recipe.name,
        ingredients: recipe.ingredients.map(normalizeIngredients)
    };
    if (recipe.amount > 0) { result.amount = recipe.amount; }
    const id = generateJsonRecipeTypeId(result);

    if (id !== recipe.id) { result.id = recipe.id; }
    if (recipe.description) { result.description = recipe.description; }
    if (recipe.bakingTime && recipe.bakingTime.length > 0) {
        result.bakingTime = recipe.bakingTime.map(recipeTypeBakingTime2JsonBakingTime);
    }
    return result;
}
