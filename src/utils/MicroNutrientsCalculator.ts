import {
    DRY_NUTRIENTS,
    NutritionType,
    RecipeIngredients
} from "../models";

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

export const calculateMicroNutrientsResult = (recipeIngredients: RecipeIngredients[]): MicroNutrientsCalculationResult => {
    const microNutrients = new Map<NutritionType, number>();

    const dryNutrients = recipeIngredients
        .flatMap((ingredients) => ingredients.getIngredients())
        .map((ingredient) =>
            ingredient.getNutrients().map((nutrient) => {
                const grams = nutrient.getPercent() > 0 && ingredient.getGrams() > 0 ? ingredient.getGrams() * nutrient.getPercent() / 100 : 0;
                if (grams <= 0) return 0;

                microNutrients.set(nutrient.getType(), (microNutrients.get(nutrient.getType()) || 0) + grams);

                return DRY_NUTRIENTS.includes(nutrient.getType()) ? grams : 0;
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
