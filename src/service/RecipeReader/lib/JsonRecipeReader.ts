import {
    JsonBakingTimeType, JsonDryIngredient,
    JsonDryIngredientGrams,
    JsonDryIngredientPercentage,
    JsonRecipeIngredientConstantGramsType,
    JsonRecipeIngredientConstantPercentType,
    JsonRecipeIngredientConstantType,
    JsonRecipeIngredientsIngredientType,
    JsonRecipeIngredientsType,
    JsonRecipeType
} from "../types";
import {
    BakingTimeType, GramsAmountType,
    IngredientGramsType,
    IngredientPercentType, NumberIntervalType,
    RecipeIngredientsType,
    RecipeType
} from "../../../models/types";
import {
    PREDEFINED_INGREDIENT,
} from "../../../models/interfaces/IngredientConstant";
import {calculateDryAndLiquid} from "../../DryAndLiquidCalculator/DryAndLiquidCalculator";
import {getRecipe, Recipe} from "../../../models/interfaces/Recipe";
import {base64Encode} from "./Base64";

type JsonIngredientGramsType = IngredientGramsType | JsonRecipeIngredientConstantGramsType | JsonDryIngredientGrams;
type JsonIngredientPercentType = IngredientPercentType | JsonRecipeIngredientConstantPercentType | JsonDryIngredientPercentage;

type IngredientContainer = IngredientGramsType | JsonIngredientPercentType;

type IngredientsType = {
    jsonRecipe: JsonRecipeIngredientsType,
    ingredients: IngredientContainer[];
};


const resolveNumberIntervalType = (value: NumberIntervalType | number): NumberIntervalType => {
    const first: number = typeof value === "number" ? value as number : (value as NumberIntervalType).from;
    const second: number = typeof value === "number" ? value as number : (value as NumberIntervalType).until;
    return {
        from: Math.min(first, second),
        until: Math.max(first, second),
    } as NumberIntervalType;
};

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
        const name = (ingredient as JsonDryIngredient).name;
        const id = base64Encode(ingredient as JsonDryIngredient, name);
        return PREDEFINED_INGREDIENT.DRY(id, name, _grams);
    }
    return PREDEFINED_INGREDIENT[type](_grams).toType();
}

export const readJsonRecipe = async (recipe: JsonRecipeType): Promise<RecipeType> => {
    const result: RecipeType = {
        id: base64Encode(recipe, recipe.name),
        name: recipe.name,
        ingredients: [],
        bakingTime: resolveBakingTime(recipe.bakingTime),
        description: recipe.description
    };
    const _ingredients: IngredientsType[] = [];
    const ingredientGrams: IngredientGramsType[] = [];
    recipe.ingredients.forEach((ingredients) => {
        const currentIngredients: IngredientContainer[] = [];

        ingredients.ingredients.forEach((ingredient) => {
            if ((ingredient as JsonIngredientGramsType).grams === undefined) {
                currentIngredients.push(ingredient as JsonIngredientPercentType);
                return;
            }
            if ((ingredient as JsonRecipeIngredientConstantGramsType).type === undefined) {
                const ingredientGram = ingredient as IngredientGramsType;
                currentIngredients.push(ingredientGram);
                ingredientGrams.push(ingredientGram);
                return;
            }
            const value = getPredefined(ingredient);
            currentIngredients.push(value);
            ingredientGrams.push(value);
        })
        _ingredients.push({
            jsonRecipe: ingredients,
            ingredients: currentIngredients,
        } as IngredientsType);
    });
    const flourAmount = (await calculateDryAndLiquid(ingredientGrams)).totals.flour;
    _ingredients.forEach((ingredients) => {
        const currentIngredients: IngredientGramsType[] = [];
        ingredients.ingredients.forEach((ingredient) => {
            if ((ingredient as IngredientGramsType).grams !== undefined) {
                currentIngredients.push(ingredient as IngredientGramsType);
                return;
            }
            const grams = Math.round((ingredient as JsonIngredientPercentType).percent * flourAmount / 10) / 10;
            if ((ingredient as JsonRecipeIngredientConstantPercentType).type === undefined) {
                const v = ingredient as IngredientPercentType;
                currentIngredients.push({
                    id: v.id,
                    name: v.name,
                    grams,
                    nutrients: v.nutrients
                } as IngredientGramsType);
                return;
            }
            const value = getPredefined(ingredient, grams);
            currentIngredients.push(value);
            ingredientGrams.push(value);
        });
        result.ingredients.push({
            name: ingredients.jsonRecipe.name,
            starter: ingredients.jsonRecipe.starter === true,
            bakingTime: resolveBakingTime(ingredients.jsonRecipe.bakingTime),
            description: ingredients.jsonRecipe.description,
            ingredients: currentIngredients
        } as RecipeIngredientsType);
    });

    return result;
};

const jSonRecipeToRecipeObject = async (jsonRecipe: JsonRecipeType): Promise<Recipe> => {
    return new Promise((resolve, reject) => {
       setTimeout(() => {
           try {
               readJsonRecipe(jsonRecipe).then(getRecipe).then(resolve).catch(reject);
           } catch (e) {
               reject(e);
           }
       }, 1) ;
    });
};

export const readJsonRecipeToRecipeObjectArray = async (jsonRecipes: JsonRecipeType[]): Promise<Recipe[]> => {
    const recipes = [...jsonRecipes];
    const result: Recipe[] = [];
    while (recipes.length > 0) {
        const recipe = recipes.shift();
        if (recipe) {
            const _result = await jSonRecipeToRecipeObject(recipe);
            result.push(_result);

            const newName = recipe.name + " x 2";
            const recipe_x2 = {
                ...recipe,
                ...{
                    id: recipe.id ? recipe.id + "_x2" : undefined,
                    name: newName,
                    ingredients: recipe.ingredients.map((e) => ({
                        ...e,
                        ...{ingredients: e.ingredients.map((i) => {
                            const jsonGrams = i as JsonIngredientGramsType;
                            if (jsonGrams.grams) {
                                return {
                                    ...jsonGrams,
                                    ...{grams: jsonGrams.grams * 2}
                                } as JsonIngredientGramsType;
                            }
                            return i;
                        })}
                    }))
                }
            } as JsonRecipeType;

            const _result_x2 = await jSonRecipeToRecipeObject(recipe_x2);
            result.push(_result_x2);
        }
    }
    return result;
};