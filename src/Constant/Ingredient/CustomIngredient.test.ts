import { NutritionType } from "../../types/NutritionType";
import {getCustomIngredient} from "./CustomIngredient";

describe("getCustomIngredient are defined", () => {
  it("Ash 50 % works", () => {
    const ash = getCustomIngredient("ash_test", "This is hash 50", 10, [{
      type: NutritionType.ash,
      percent: 50
    }]);
    expect(ash.id).toBe("ash_test");
    expect(ash.name).toBe("This is hash 50");
    expect(ash.grams).toBe(10);
    expect(ash.nutrients.length).toBe(1);
    expect(ash.nutrients[0].type).toBe(NutritionType.ash);
    expect(ash.nutrients[0].percent).toBe(50);
  });

  it("Dry and water works", () => {
    const result = getCustomIngredient("test2", "Does not matter", 100, [{
      type: NutritionType.dry,
      percent: 25
    },
      {
        type: NutritionType.water,
        percent: 100
      }]);
    expect(result.id).toBe("test2");
    expect(result.name).toBe("Does not matter");
    expect(result.grams).toBe(100);
    expect(result.nutrients.length).toBe(2);
    expect(result.nutrients[0].type).toBe(NutritionType.dry);
    expect(result.nutrients[0].percent).toBe(25);
    expect(result.nutrients[1].type).toBe(NutritionType.water);
    expect(result.nutrients[1].percent).toBe(100);
  });
});
