import {calculateMicroNutrientsResult, MicroNutrientsCalculationResult} from "./MicroNutrientsCalculator";
import {
    DRY_NUTRIENTS, IngredientGramsType, IngredientPercentType, RecipeIngredientsType,
    copyBakingTimeType,
    copyIngredientGramsType,
    copyNumberIntervalType,
    copyNutrientPercentType
} from "../types";

export type IngredientWithPercentType = IngredientPercentType & IngredientGramsType;

export type RecipeIngredientsWithPercentType = {
    ingredientWithPercent: IngredientWithPercentType[];

} & RecipeIngredientsType;

export type BakerPercentageResult = {
    microNutrients: MicroNutrientsCalculationResult;
    ingredients: RecipeIngredientsWithPercentType[];
}

export const recalculateBakerPercentage = (ingredients: RecipeIngredientsType[]): BakerPercentageResult => {
    const microNutrients = calculateMicroNutrientsResult(ingredients);

    const total = DRY_NUTRIENTS.map((e) => microNutrients.get(e)).map((e) => e.getGrams()).filter(e => e > 0).reduce((e1, e2) => e1 + e2, 0);
    const percentages: RecipeIngredientsWithPercentType[] = ingredients.map((ingredients) => {
        const _ingredients: IngredientPercentType[] = ingredients.ingredients.map((ingredient) => (
          {
                id: ingredient.id,
                name: ingredient.name,
                nutrients: ingredient.nutrients.map(copyNutrientPercentType),
                grams: ingredient.grams,
                percent: total > 0 && ingredient.grams > 0 ? ingredient.grams * 100 / total : 0
            } as (IngredientPercentType & IngredientGramsType)
        ));
        return {
            name: ingredients.name,
            ingredients: ingredients.ingredients.map(copyIngredientGramsType),
            bakingTime: ingredients.bakingTime.map(copyBakingTimeType),
            innerTemperature: ingredients.innerTemperature ? copyNumberIntervalType(ingredients.innerTemperature) : null,
            description: ingredients.description,
            starter: ingredients.starter,
            ingredientWithPercent: _ingredients
        } as RecipeIngredientsWithPercentType;
    });

    return {
        microNutrients,
        ingredients: percentages
    } as BakerPercentageResult;
}
