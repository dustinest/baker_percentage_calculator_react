import {NutritionType} from "../../types/NutritionType";
import {StandardIngredientMethods, StandardIngredients} from "./StandardIngredientConstant";

describe("INGREDIENT_CONSTANT are defined", () => {
  console.log(StandardIngredientMethods);
  it ("Salt is OK", () => {
    expect(StandardIngredients.SALT.id).toBe("salt");
    expect(StandardIngredients.SALT.name).toBe("Salt");
    expect(StandardIngredients.SALT.nutrients.length).toBe(1);
    // @ts-ignore
    expect(StandardIngredients.SALT.nutrients[0].type).toBe(NutritionType.salt);
    // @ts-ignore
    expect(StandardIngredients.SALT.nutrients[0].percent).toBe(100);
  });

  it ("butter_82 is OK", () => {
    expect(StandardIngredients.BUTTER.id).toBe("butter_82");
    expect(StandardIngredients.BUTTER.name).toBe("Butter");
    expect(StandardIngredients.BUTTER.nutrients.length).toBe(2);
    // @ts-ignore
    expect(StandardIngredients.BUTTER.nutrients[0].type).toBe(NutritionType.fat);
    // @ts-ignore
    expect(StandardIngredients.BUTTER.nutrients[0].percent).toBe(82);
    // @ts-ignore
    expect(StandardIngredients.BUTTER.nutrients[1].type).toBe(NutritionType.water);
    // @ts-ignore
    expect(StandardIngredients.BUTTER.nutrients[1].percent).toBe(18);
  });
});

describe("PREDEFINED_INGREDIENT are defined", () => {
  it ("Salt is OK", () => {
    const salt = StandardIngredientMethods.SALT(123);
    expect(salt.id).toBe("salt");
    expect(salt.name).toBe("Salt");
    expect(salt.nutrients.length).toBe(1);
    expect(salt.nutrients[0].type).toBe(NutritionType.salt);
    expect(salt.nutrients[0].percent).toBe(100);
    expect(salt.grams).toBe(123);
  });

  it ("butter_82 is OK", () => {
    const butter = StandardIngredientMethods.BUTTER(321);
    expect(butter.id).toBe("butter_82");
    expect(butter.name).toBe("Butter");
    expect(butter.nutrients.length).toBe(2);
    expect(butter.nutrients[0].type).toBe(NutritionType.fat);
    expect(butter.nutrients[0].percent).toBe(82);
    expect(butter.nutrients[1].type).toBe(NutritionType.water);
    expect(butter.nutrients[1].percent).toBe(18);
    expect(butter.grams).toBe(321);
  });
});
