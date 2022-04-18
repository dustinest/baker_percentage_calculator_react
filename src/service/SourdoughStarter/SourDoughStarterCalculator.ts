import {calculateDryAndLiquid} from "./calculateDryAndLiquid";
import {NutritionType, copyIngredientGramsType, RecipeIngredientsType, IngredientGramsType} from "../../types";

const STARTER_FLOUR_PERCENTAGE = 0.02; // 2 % should be a starter ( 4 / 200, which means water + flour * 4 / 100)
const calculateStarterFlour = (amount: number) => {
    const result = Math.floor(amount * STARTER_FLOUR_PERCENTAGE);
    if (result > 11) return 11;
    return result;
};

export interface StarterIngredients {
    fridge: number,
    amount: number,
    isFixed: boolean
}

export type StarterCalculationResult = {
    starter: {
        flour: StarterIngredients,
        liquid: StarterIngredients;
    },
    ingredients: {
        flour: IngredientGramsType[];
        liquid: IngredientGramsType[];
        other: IngredientGramsType[];
    },
};

export const calculateSourDoughStarter = async (ingredients: RecipeIngredientsType[]): Promise<StarterCalculationResult | null> => {
    if (ingredients.length === 0) return null;
    const dryAndLiquidResult = await calculateDryAndLiquid(ingredients[0].ingredients.map(copyIngredientGramsType));
    const flour = Math.floor(dryAndLiquidResult.totals.flour);
    const water = Math.floor(dryAndLiquidResult.totals.water);
    const liquid = Math.floor(dryAndLiquidResult.totals.liquid);

    const flourFromFridge = calculateStarterFlour(dryAndLiquidResult.totals.flour);
    const result: StarterCalculationResult = {
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
        },
        ingredients: {
            flour: dryAndLiquidResult.ingredients.flour,
            liquid: dryAndLiquidResult.ingredients.liquid,
            other: dryAndLiquidResult.ingredients.other
        },
    };

    if (liquid * 100 / flour < 30) {
        result.starter.flour.amount = Math.floor(liquid);
    } else if (water * 100 / flour > 10 && water * 100 / flour < 40) {
        result.starter.flour.amount = Math.floor(water);
    } else {
        result.starter.flour.amount = Math.floor(flour * 26 / 100);
    }
    result.starter.flour.amount -= result.starter.flour.fridge;

    result.starter.liquid.amount = result.starter.flour.amount;

    if (dryAndLiquidResult.ingredients.flour.find((flourIngredeint) => flourIngredeint.nutrients.find((nutrient) => nutrient.type === NutritionType.whole_grain) !== undefined) !== undefined) {
        // when the flour is whole grain
        result.starter.flour.amount = Math.floor(flour * 50 / 100);
        result.starter.liquid.amount = Math.floor(liquid * 62 / 100);
    }
    return result;
}
