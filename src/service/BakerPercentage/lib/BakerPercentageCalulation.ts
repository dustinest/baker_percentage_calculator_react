import {calculateMicroNutrientsResult} from "./MicroNutrientsCalculator";
import {
    IngredientGramsType, IngredientPercentType, RecipeIngredientsType,
    copyBakingTimeType,
    copyIngredientGramsType,
    copyNumberIntervalType,
    copyNutrientPercentType
} from "../../../types";
import {BakerPercentageResult, RecipeIngredientsWithPercentType} from "../type/BakerPercentageResult";

export const recalculateBakerPercentage = (ingredients: RecipeIngredientsType[]): BakerPercentageResult => {
    const microNutrients = calculateMicroNutrientsResult(ingredients);
    const percentages: RecipeIngredientsWithPercentType[] = ingredients.map((ingredients) => {
        const _ingredients: IngredientPercentType[] = ingredients.ingredients.map((ingredient) => (
          {
                id: ingredient.id,
                name: ingredient.name,
                nutrients: ingredient.nutrients.map(copyNutrientPercentType),
                grams: ingredient.grams,
                percent: microNutrients.dry_total > 0 && ingredient.grams > 0 ? ingredient.grams * 100 / microNutrients.dry_total : 0
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
