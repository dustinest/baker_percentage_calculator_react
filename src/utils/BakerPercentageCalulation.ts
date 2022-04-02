import {DRY_NUTRIENTS, BakingTime, NutrientPercent, RecipeIngredients, Ingredient, NumberInterval} from "../models";
import {calculateMicroNutrientsResult, MicroNutrientsCalculationResult} from "./MicroNutrientsCalculator";

export interface IngredientWithPercent extends Ingredient {
    getPercent(): number;
}

export interface RecipeIngredientsWithPercent extends RecipeIngredients {
    getIngredientWithPercent(): IngredientWithPercent[];

}

export type BakerPercentageResult = {
    microNutrients: MicroNutrientsCalculationResult;
    ingredients: RecipeIngredientsWithPercent[]
}

export const recalculateBakerPercentage = (ingredients: RecipeIngredients[]): BakerPercentageResult => {
    const microNutrients = calculateMicroNutrientsResult(ingredients);

    const total = DRY_NUTRIENTS.map((e) => microNutrients.get(e)).map((e) => e.getGrams()).filter(e => e > 0).reduce((e1, e2) => e1 + e2, 0);
    const percentages: RecipeIngredientsWithPercent[] = ingredients.map((ingredients) => {
        const _ingredients: IngredientWithPercent[] = ingredients.getIngredients().map((ingredient) => {
            const percent = total > 0 && ingredient.getGrams() > 0 ? ingredient.getGrams() * 100 / total : 0;
            return {
                getId(): string {
                    return ingredient.getId();
                },
                getName(): string {
                    return ingredient.getName();
                },
                getNutrients(): NutrientPercent[]{
                    return ingredient.getNutrients();
                },
                getGrams(): number{
                    return ingredient.getGrams();
                },
                getPercent(): number {
                    return percent;
                }
            } as IngredientWithPercent;
        });
        return {
            getName(): string | null {
                return ingredients.getName();
            },
            getIngredients(): Ingredient[]{
                return ingredients.getIngredients();
            },
            getBakingTime(): BakingTime[]{
                return ingredients.getBakingTime();
            },
            getInnerTemperature(): NumberInterval | null {
                return ingredients.getInnerTemperature();
            },

            getDescription(): string | null{
                return ingredients.getDescription();
            },
            isStarter(): boolean{
                return ingredients.isStarter();
            },
            getIngredientWithPercent(): IngredientWithPercent[] {
                return _ingredients;
            }
        } as RecipeIngredientsWithPercent;
    });

    return {
        microNutrients,
        ingredients: percentages
    } as BakerPercentageResult;
}
