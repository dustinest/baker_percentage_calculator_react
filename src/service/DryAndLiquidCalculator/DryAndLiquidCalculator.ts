import {IngredientGramsType} from "../../types";
import {calculateFlourAndWaterPercent} from "./FlourAndWaterCalculation";

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



export type DryAndLiquidIngredientResult = {
    flour: {
        percent: number,
        grams: number;
    }
    water: {
        percent: number,
        grams: number;
    }
}

export const calculateDryAndLiquidNutrition = (ingredient: IngredientGramsType): DryAndLiquidIngredientResult => {
    const flourAndWaterPercent = calculateFlourAndWaterPercent(ingredient.nutrients);
    return {
        flour: {
            percent: flourAndWaterPercent.flour,
            grams: flourAndWaterPercent.flour > 0 ? (ingredient.grams * 100 / flourAndWaterPercent.flour) : 0
        },
        water: {
            percent: flourAndWaterPercent.water,
            grams: flourAndWaterPercent.water > 0 ? (ingredient.grams * 100 / flourAndWaterPercent.water) : 0
        }
    } as DryAndLiquidIngredientResult;
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
        const amount = calculateDryAndLiquidNutrition(ingredient);
        if (amount.flour.percent > 0) {
            result.ingredients.dry.push(ingredient);
            result.totals.flour += amount.flour.grams;
        }
        if (amount.water.percent > 0) {
            result.ingredients.liquid.push(ingredient);
            result.totals.liquid += amount.water.grams;
            if (amount.water.percent === 100) {
                result.totals.water += ingredient.grams;
            }
        }
        if (amount.flour.percent === 0 && amount.water.percent === 0) {
            result.ingredients.other.push(ingredient);
        }
    });
    return result;
}
