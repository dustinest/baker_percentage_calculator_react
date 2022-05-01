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
    JsonStandardIngredientTypeGramsType, JsonStandardIngredientTypePercentType
} from "../types";
import {resolveJsonExtraStandardIngredient, resolveJsonRecipeTypeId} from "./JsonRecepyIdGenerator";
import {StandardIngredients} from "../../../Constant/Ingredient";
import {FindHighestDryResult, findHighestDryResult} from "./IngredientsHighestDryResult";

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

const getPercentage = (ingredient: IngredientGramsType, highestDry: FindHighestDryResult) => {
    return Math.round(ingredient.grams * 10000 / highestDry.total) / 100;
}

const normalizeIngredient = (ingredient: IngredientGramsType, highestDry: FindHighestDryResult | null): JsonRecipeIngredientsIngredientType => {
    // @ts-ignore
    const type = ingredient.type ? StandardIngredients[ingredient.type] : undefined;
    if (type) {
        if (highestDry) {
            return {
                type: ingredient.type,
                percent: getPercentage(ingredient, highestDry)
            } as JsonStandardIngredientTypePercentType;
        }
        return {
            type: ingredient.type,
            grams: ingredient.grams
        } as JsonStandardIngredientTypeGramsType
    } else if (ingredient.nutrients.find(e => e.type === NutritionType.dry) &&
        resolveJsonExtraStandardIngredient(
          { type: "DRY", name: ingredient.name } as JsonExtraStandardIngredientType,
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

const normalizeIngredients = (ingredients: RecipeIngredientsType, ingredientsIndex: number, highestDry: FindHighestDryResult | null): JsonRecipeIngredientsType => {
    //const id = generateJsonRecipeTypeId(recipe.name, recipe.amount);
    const result = {
        ingredients: ingredients.ingredients.map((ingredient, index) => normalizeIngredient(
          ingredient, highestDry !== null && (highestDry.ingredients !== ingredientsIndex || highestDry.ingredient !== index) ? highestDry : null
        ))
    } as JsonRecipeIngredientsType;

    if (ingredients.name) { result.name = ingredients.name; }
    if (ingredients.description) { result.name = ingredients.description; }
    if (ingredients.starter) { result.starter = ingredients.starter; }
    if (ingredients.bakingTime && ingredients.bakingTime.length > 0) { result.bakingTime = ingredients.bakingTime.map(recipeTypeBakingTime2JsonBakingTime); }
    if (ingredients.innerTemperature) result.innerTemperature = normalizeNumberIntervalType(ingredients.innerTemperature);
    return result;
}

export const recipeType2RecipeJson = async (recipe: RecipeType):Promise<JsonRecipeType> => {
    const highestDry = await findHighestDryResult(recipe.ingredients);

    const result: JsonRecipeType = {
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
