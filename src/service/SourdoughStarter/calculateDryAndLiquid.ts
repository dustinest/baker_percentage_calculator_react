import {IngredientGramsType, NutritionType} from "../../types/index";


interface DryAndLiquidCalculationResult {
    ingredients: {
        flour: IngredientGramsType[];
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
            flour: [],
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
        const percentages = ingredient.nutrients
          .reduce((result, value) => {
              if (value.type === NutritionType.flour) { result.flour += value.percent; }
              if (value.type === NutritionType.water) { result.water += value.percent; }
              return result;
          }, {
              flour: 0,
              water: 0
          });

        if (percentages.flour > 0) {
            result.ingredients.flour.push(ingredient);
            result.totals.flour += ingredient.grams * 100 / percentages.flour;
        }
        if (percentages.water > 0) {
            const grams = ingredient.grams * 100 / percentages.water;
            result.ingredients.liquid.push(ingredient);
            result.totals.liquid += grams;
            if (percentages.water === 100) {
                result.totals.water += grams;
            }
        }
        if (percentages.flour === 0 && percentages.water === 0) {
            result.ingredients.other.push(ingredient);
        }
    });
    return result;
}
