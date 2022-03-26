import {DRY_NUTRIENTS} from "../models/interfaces/NutritionType";
import {Ingredient} from "../models/interfaces/Ingredient";
import {calculateMicroNutrientsResult, MicroNutrientsCalculationResult} from "./MicroNutrientsCalculator";
import {RecipeIngredients} from "../models/interfaces/RecipeIngredients";
import {NutrientPercent} from "../models/interfaces/NutrientPercent";
import {BakingTime} from "../models/interfaces/BakingTime";

export interface IngredientWithPercent extends Ingredient {
    getPercent(): number;
}

export interface RecipeIngredientsWithPercent extends RecipeIngredients {
    getIngredientWithPercent(): IngredientWithPercent[];

}

export type RecipePercentsResult = {
    microNutrients: MicroNutrientsCalculationResult;
    ingredients: RecipeIngredientsWithPercent[]
}

export const recalculateRecipePercents = (ingredients: RecipeIngredients[]): RecipePercentsResult => {
    const microNutrients = calculateMicroNutrientsResult(ingredients);

    const total = DRY_NUTRIENTS.map((e) => microNutrients.get(e)).map((e) => e.getGrams()).filter(e => e > 0).reduce((e1, e2) => e1 + e2, 0);
    const percentages: RecipeIngredientsWithPercent[] = ingredients.map((ingredients) => {
        const _ingredients: IngredientWithPercent[] = ingredients.getIngredients().map((ingredient) => {
            const percent = total > 0 ? ingredient.getGrams() * 100 / total : 0;
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
    } as RecipePercentsResult;
}
