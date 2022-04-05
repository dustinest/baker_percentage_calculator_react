import {DRY_NUTRIENTS, NutritionType, RecipeIngredientsType} from "../types";

export type MicroNutrientsCalculationDetails = {
    getPercent(): number;
    getGrams(): number;
}

export interface MicroNutrientsCalculationResult {
    get(type: NutritionType): MicroNutrientsCalculationDetails;
    getNutritionTypes(): NutritionType[];
    getTotal(): number;
}

const dummyMicroNutrientsCalculationDetails: MicroNutrientsCalculationDetails = {
    getGrams(): number { return 0; },
    getPercent(): number { return 0; },
};

export const calculateMicroNutrientsResult = (recipeIngredients: RecipeIngredientsType[]): MicroNutrientsCalculationResult => {
    const microNutrients = new Map<NutritionType, number>();

    const dryNutrients = recipeIngredients
        .flatMap((ingredients) => ingredients.ingredients)
        .map((ingredient) =>
            ingredient.nutrients.map((nutrient) => {
                const grams = nutrient.percent > 0 && ingredient.grams > 0 ? ingredient.grams * nutrient.percent / 100 : 0;
                if (grams <= 0) return 0;

                microNutrients.set(nutrient.type, (microNutrients.get(nutrient.type) || 0) + grams);

                return DRY_NUTRIENTS.includes(nutrient.type) ? grams : 0;
            }).reduce((a1, a2) => a1 + a2, 0)
        ).reduce((a1, a2) => a1 + a2, 0);

    const result = new Map<NutritionType, MicroNutrientsCalculationDetails>();
    const keys: NutritionType[] = [];
    microNutrients.forEach((value, key) => {
        if (value <= 0) return;
        const grams = value;
        const percent = dryNutrients > 0 ? grams * 100 / dryNutrients : 0;
        result.set(key, {
            getGrams(): number { return grams; },
            getPercent(): number { return percent; },
        } as MicroNutrientsCalculationDetails);
        keys.push(key);
    });
    return {
        get(type: NutritionType): MicroNutrientsCalculationDetails {
            return result.get(type) || dummyMicroNutrientsCalculationDetails;
        },
        getNutritionTypes(): NutritionType[] {
            return keys;
        }
    } as MicroNutrientsCalculationResult
};
