import {calculateDryAndLiquid, DryAndLiquidCalculationResult} from "../DryAndLiquidCalculator/DryAndLiquidCalculator";
import {NutritionType, copyIngredientGramsType, RecipeIngredientsType} from "../../types";

export interface StarterIngredients {
    fridge: number,
    amount: number,
    isFixed: boolean
}

export type StarterCalculationResult = {
    starter: {
        flour: StarterIngredients,
        liquid: StarterIngredients;
    }
} & DryAndLiquidCalculationResult;

const calculateStarterFlour  = (value: DryAndLiquidCalculationResult): number => {
    const result = Math.floor(value.totals.flour * 4 / 200);
    return result > 10 ? 10 : result;
}

export const calculateStarter = async (ingredients: RecipeIngredientsType[]): Promise<StarterCalculationResult> => {
    const dryAndLiquidResult = await calculateDryAndLiquid(ingredients[0].ingredients.map(copyIngredientGramsType));
    const flour = Math.floor(dryAndLiquidResult.totals.flour);
    const water = Math.floor(dryAndLiquidResult.totals.water);
    const liquid = Math.floor(dryAndLiquidResult.totals.liquid);
    const flourFromFridge = calculateStarterFlour(dryAndLiquidResult);
    const result: StarterCalculationResult = {
        ...dryAndLiquidResult,
        ...{
            totals: {
                flour,
                water,
                liquid
            }
        },
        ...{
            starter: {
                flour: {
                    isFixed: ingredients[0].starter === true,
                    fridge: flourFromFridge,
                    amount: 0
                },
                liquid: {
                    isFixed: ingredients[0].starter === true,
                    fridge: flourFromFridge,
                    amount: 0
                }
            }
        }
    };

    if (result.totals.liquid * 100 / result.totals.flour < 30) {
        result.starter.flour.amount = Math.floor(result.totals.liquid);
    } else if (result.totals.water * 100 / result.totals.flour > 10 && result.totals.water * 100 / result.totals.flour < 40) {
        result.starter.flour.amount = Math.floor(result.totals.water);
    } else {
        result.starter.flour.amount = Math.floor(result.totals.flour * 26 / 100);
    }
    result.starter.flour.amount -= result.starter.flour.fridge;

    result.starter.liquid.amount = result.starter.flour.amount;

    if (result.ingredients.dry.find(e => e.nutrients.find(n => n.type === NutritionType.whole_grain) !== undefined) !== undefined) {
        // when the flour is whole grain
        result.starter.flour.amount = Math.floor(result.totals.flour * 50 / 100);
        result.starter.liquid.amount = Math.floor(result.totals.liquid * 62 / 100);
    }
    return result;
}
