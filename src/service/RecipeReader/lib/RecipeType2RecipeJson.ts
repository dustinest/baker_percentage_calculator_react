import {
    NutritionType,
    BakingTimeType,
    IngredientGramsType,
    NumberIntervalType,
    RecipeIngredientsType,
    RecipeType,
} from "../../../types";
import {
    JsonBakingTimeType,
    JsonExtraStandardIngredientGrams,
    JsonExtraStandardIngredientType,
    JsonRecipeIngredientsIngredientType,
    JsonRecipeIngredientsType,
    JsonRecipeType,
    JsonStandardIngredientTypeGramsType
} from "../types";
import {resolveJsonExtraStandardIngredient, resolveJsonRecipeTypeId} from "./JsonRecepyIdGenerator";
import {StandardIngredients} from "../../../Constant/Ingredient";

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

const INGREDIENT_CONSTANT_ID_MAP: { [key: string]: string } = Object.entries(StandardIngredients).reduce((obj,[key, type]) => {
    obj[type.id] = key;
    return obj;
}, {} as { [key: string]: string });

const normalizeIngredient = (ingredient: IngredientGramsType): JsonRecipeIngredientsIngredientType => {
    if (INGREDIENT_CONSTANT_ID_MAP[ingredient.id]) {
        return {
            type: INGREDIENT_CONSTANT_ID_MAP[ingredient.id],
            grams: ingredient.grams
        } as JsonStandardIngredientTypeGramsType
    } else if (ingredient.nutrients.find(e => e.type === NutritionType.dry) &&
        resolveJsonExtraStandardIngredient(
          { type: "DRY", name: ingredient.name } as JsonExtraStandardIngredientType,
          ingredient.grams) === ingredient.id) {
        const nutrients = ingredient.nutrients.filter(e => e.type !== NutritionType.dry);
        const result = {
            type: "DRY",
            name: ingredient.name,
            grams: ingredient.grams
        } as JsonExtraStandardIngredientGrams;
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
    if (ingredients.innerTemperature) result.innerTemperature = normalizeNumberIntervalType(ingredients.innerTemperature);
    return result;
}

export const recipeType2RecipeJson = async (recipe: RecipeType):Promise<JsonRecipeType> => {
    const result: JsonRecipeType = {
        name: recipe.name,
        ingredients: recipe.ingredients.map(normalizeIngredients)
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
