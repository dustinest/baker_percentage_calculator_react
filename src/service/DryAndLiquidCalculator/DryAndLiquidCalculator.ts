import {NutritionType} from "../../models/interfaces/NutritionType";
import {IngredientGramsType} from "../../models/types";

export interface DryAndLiquidCalculationResult {
    ingredients: {
        dry: IngredientGramsType[];
        liquid: IngredientGramsType[];
        other: IngredientGramsType[];
    },
    totals: {
        flour: number,
        liquid: number,
        water: number
    }
}

export const calculateDryAndLiquid = async (ingredients: IngredientGramsType[]): Promise<DryAndLiquidCalculationResult> => {
    if (!ingredients) throw new Error("No ingredients defined!");
    const result = {
        ingredients: {
            dry: [],
            liquid: [],
            other: []
        },
        totals: {
            flour: 0,
            liquid: 0,
            water: 0
        }
    } as DryAndLiquidCalculationResult;


    ingredients.forEach((ingredient) => {
        const type = ingredient.nutrients.find(e => e.type === NutritionType.flour || e.type === NutritionType.water);
        if (type?.type === NutritionType.flour) {
            result.ingredients.dry.push(ingredient);
            result.totals.flour += ingredient.grams * 100 / type.percent;
        } else if (type?.type === NutritionType.water && type.percent> 50) {
            result.ingredients.liquid.push(ingredient);
            result.totals.liquid += ingredient.grams * 100 / type.percent;
            if (type.percent=== 100) {
                result.totals.water += ingredient.grams;
            }
        } else {
            result.ingredients.other.push(ingredient);
        }
    });
    return result;
}
