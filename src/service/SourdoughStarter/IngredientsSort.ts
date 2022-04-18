import {IngredientGramsType, NutrientPercentType, NutritionType, RecipeIngredientsType} from "../../types";

type RecipeSort = {
  ingredients: (values: RecipeIngredientsType[]) => RecipeIngredientsType[];
}
type IngredientsSort = {
  add: (values: IngredientGramsType[]) => IngredientGramsType[];
};

export const SORT_INGREDIENTS = Object.entries(
  {
    add: [
      NutritionType.flour,
      NutritionType.water,
      NutritionType.fat,
      NutritionType.salt,
      NutritionType.sugar
    ],
    ingredients: [
      NutritionType.water,
      NutritionType.flour,
      NutritionType.fat,
      NutritionType.salt,
      NutritionType.sugar
    ]
  }
).reduce((result, [key,nutritionTypes]) => {
  const maximum = (100 / nutritionTypes.length) - 2;

  const getFlourAndWaterPercentage = (values: NutrientPercentType[]) => {
    const calculationResult = (nutritionTypes).reduce((result, value) => {
        result[value] = 0;
        return result;
      }, {} as { [key: string]: number });

    values.forEach(e => {
      const type = NutritionType[e.type];
      if (calculationResult[type] !== undefined) {
        calculationResult[type] += e.percent;
      }
    });
    if (calculationResult[NutritionType.flour] === 50 && calculationResult[NutritionType.flour] === 50) {
      return 0;
    }
    for (let i = 0; i < nutritionTypes.length; i++) {
      const type = nutritionTypes[i];
      const val: number = calculationResult[type];
      if (val > 80) {
        return val / 100 * (maximum * i);
      }
    }
    return 100;
  }

  const sortIngredientGramsType = (values: IngredientGramsType[]): IngredientGramsType[] => {
    return values.sort(
      (value1, value2) => getFlourAndWaterPercentage(value1.nutrients) - getFlourAndWaterPercentage(value2.nutrients)
    );
  }
  if (key === "add") {
    result[key] = sortIngredientGramsType;
  } else if (key === "ingredients") {
    result[key] = (values: RecipeIngredientsType[]): RecipeIngredientsType[] => {
      return values.map((e) => {
        return {...e, ...{ingredients: sortIngredientGramsType(e.ingredients)}}
      });
    }
  }
  return result;
}, {} as  {[key: string]: any}) as RecipeSort & IngredientsSort;

