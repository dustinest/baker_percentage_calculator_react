import {IngredientGramsType, NutritionType, RecipeIngredientsType} from "../../../types";
import {StandardIngredientMethods} from "../../../Constant/Ingredient";
import {calculateMicroNutrientsResult} from "./MicroNutrientsCalculator";

describe("calculateMicroNutrientsResult works", () => {
  const STANDARD_INGREDIENTS = [
    StandardIngredientMethods.WHOLE_RYE_FLOUR(405),
    StandardIngredientMethods.WHOLE_RYE_MALT_FLOUR(20),
    StandardIngredientMethods.WATER(425),
    StandardIngredientMethods.SALT(7.5)
  ] as IngredientGramsType[];

  it ("Standard recipe is OK", async () => {
    const result = calculateMicroNutrientsResult([ { ingredients: STANDARD_INGREDIENTS } ] as RecipeIngredientsType[]);
    expect(Object.keys(result.nutrients)).toStrictEqual(["flour", "whole_grain", "water", "salt"]);
    expect(result.nutrients.flour).toStrictEqual({grams: 425, percent: 100, type: NutritionType.flour})
    expect(result.nutrients.whole_grain).toStrictEqual({grams: 425, percent: 100, type: NutritionType.whole_grain})
    expect(result.nutrients.water).toStrictEqual({grams: 425, percent: 100, type: NutritionType.water})
    expect(result.nutrients.salt.grams).toBe(7.5);
    expect(Math.floor(result.nutrients.salt.percent * 1000)).toBe(1764);
    expect(result.nutrients.salt.type).toBe(NutritionType.salt);
    expect(result.dry_total).toBe(425);
  });

  const CUSTOM_INGREDIENT1 = {
    name: "test dry and mixed",
    grams: 150,
    id: "dry_and_mixed_1",
    nutrients: [
      { type: NutritionType.dry, percent: 10 },
      { type: NutritionType.flour, percent: 20 }
    ]
  } as IngredientGramsType;

  const CUSTOM_INGREDIENT2 = {
    name: "test dry and mixed",
    grams: 150,
    id: "dry_and_mixed_1",
    nutrients: [
      { type: NutritionType.dry, percent: 40 },
      { type: NutritionType.flour, percent: 30 }
    ]
  } as IngredientGramsType;

  it ("Custom CUSTOM_INGREDIENT1 is OK", async () => {
    const result = calculateMicroNutrientsResult([ { ingredients: [CUSTOM_INGREDIENT1] } ] as RecipeIngredientsType[]);
    expect(Object.keys(result.nutrients)).toStrictEqual(["dry", "flour"]);
    expect(result.nutrients.dry).toStrictEqual({grams: 15, percent: 50, type: NutritionType.dry})
    expect(result.nutrients.flour).toStrictEqual({grams: 30, percent: 100, type: NutritionType.flour})
    expect(result.dry_total).toBe(30);
  });

  it ("Custom CUSTOM_INGREDIENT2 is OK", async () => {
    const result = calculateMicroNutrientsResult([ { ingredients: [CUSTOM_INGREDIENT2] } ] as RecipeIngredientsType[]);
    expect(Object.keys(result.nutrients)).toStrictEqual(["dry", "flour"]);
    expect(result.nutrients.dry).toStrictEqual({grams: 60, percent: 100, type: NutritionType.dry})
    expect(result.nutrients.flour).toStrictEqual({grams: 45, percent: 75, type: NutritionType.flour})
    expect(result.dry_total).toBe(60);
  });

  it ("Custom CUSTOM_INGREDIENT1 and CUSTOM_INGREDIENT2 is OK", async () => {
    const result = calculateMicroNutrientsResult([ { ingredients: [CUSTOM_INGREDIENT1, CUSTOM_INGREDIENT2] } ] as RecipeIngredientsType[]);
    expect(Object.keys(result.nutrients)).toStrictEqual(["dry", "flour"]);

    expect(result.nutrients.dry.grams).toBe(75);
    expect(Math.floor(result.nutrients.dry.percent * 100)).toBe(8333);
    expect(result.nutrients.dry.type).toBe(NutritionType.dry);

    expect(result.nutrients.flour.grams).toBe(75);
    expect(Math.floor(result.nutrients.flour.percent * 100)).toBe(8333);
    expect(result.nutrients.flour.type).toBe(NutritionType.flour);

    expect(result.dry_total).toBe(90);
  });

  it ("Standard and  CUSTOM_INGREDIENT1 and CUSTOM_INGREDIENT2 is OK", async () => {
    const result = calculateMicroNutrientsResult([ { ingredients: [...STANDARD_INGREDIENTS, ...[CUSTOM_INGREDIENT1, CUSTOM_INGREDIENT2]] } ] as RecipeIngredientsType[]);
    expect(Object.keys(result.nutrients)).toStrictEqual(["flour", "whole_grain", "water", "salt", "dry"]);

    expect(result.nutrients.dry.grams).toBe(75);
    expect(Math.floor(result.nutrients.dry.percent * 100)).toBe(1456);
    expect(result.nutrients.dry.type).toBe(NutritionType.dry);

    expect(result.nutrients.flour.grams).toBe(500);
    expect(Math.floor(result.nutrients.flour.percent * 100)).toBe(9708);
    expect(result.nutrients.flour.type).toBe(NutritionType.flour);

    expect(result.nutrients.whole_grain.grams).toBe(425);
    expect(Math.floor(result.nutrients.whole_grain.percent * 100)).toBe(8252);
    expect(result.nutrients.whole_grain.type).toBe(NutritionType.whole_grain);

    expect(result.nutrients.water.grams).toBe(425);
    expect(Math.floor(result.nutrients.water.percent * 100)).toBe(8252);
    expect(result.nutrients.water.type).toBe(NutritionType.water);

    expect(result.nutrients.salt.grams).toBe(7.5);
    expect(Math.floor(result.nutrients.salt.percent * 100)).toBe(145);
    expect(result.nutrients.salt.type).toBe(NutritionType.salt);

    expect(result.dry_total).toBe(515);
  });

});
