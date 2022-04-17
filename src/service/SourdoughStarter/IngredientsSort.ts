import {IngredientGramsType, NutrientPercentType, NutritionType, RecipeIngredientsType} from "../../types";

const INGREDIENTS_TO_CALCULATE: string[] = [
  NutritionType.flour,
  NutritionType.water,
  NutritionType.fat,
  NutritionType.salt,
  NutritionType.sugar
].map((e) => NutritionType[e]);
const MAXIMUM = (100 / INGREDIENTS_TO_CALCULATE.length) - 2;

type CalculationType = { [key: string]: number };
const getFlourAndWaterPercentage = (values: NutrientPercentType[]): number => {
  const calculationResult = (INGREDIENTS_TO_CALCULATE).reduce(
    (result, value) => {
      result[value] = 0;
      return result;
      }, {} as CalculationType);

  values.forEach(e => {
    const type = NutritionType[e.type];
    if (calculationResult[type] !== undefined) {
      calculationResult[type] += e.percent;
    }
  });
  if (calculationResult[NutritionType.flour] === 50 && calculationResult[NutritionType.flour] === 50) {
    return 0;
  }
  for (let i = 0; i < INGREDIENTS_TO_CALCULATE.length; i++) {
    const type = INGREDIENTS_TO_CALCULATE[i];
    // @ts-ignore
    const val: number = calculationResult[type];
    if (val > 80) {
      return val / 100 * (MAXIMUM * i);
    }
  }

  return 100;
}

const getIngredientGramsTypeSort = (value1: IngredientGramsType, value2: IngredientGramsType): number => {
  const sort1 = getFlourAndWaterPercentage(value1.nutrients);
  const sort2 = getFlourAndWaterPercentage(value2.nutrients);
  return sort1 - sort2;
}

export const sortIngredientGramsType = (values: IngredientGramsType[]): IngredientGramsType[] => {
  return values.sort(getIngredientGramsTypeSort);
}

export const sortRecipeIngredientsType = (values: RecipeIngredientsType[]): RecipeIngredientsType[] => {
  return values.map((e) => {
    return {...e, ...{ingredients: sortIngredientGramsType(e.ingredients)}}
  });
}
