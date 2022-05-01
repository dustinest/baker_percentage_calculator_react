import {NutritionType} from "../../types";
import {changeHydration} from "./editRecipeHydrationReducerService";
import {getIngredientsHydration} from "../../service/RecipeHydrationService";

describe("Changing hydration works", () => {
  it.each([
    [100, 100, 100, 100],
    [100, 100, 12, 12],
    [100, 12, 100, 100],

    [50, 100, 100, 200],
    [50, 100, 12, 24],
    [50, 12, 100, 200],

    [25, 100, 100, 400],
    [25, 100, 12, 48],
    [25, 12, 100, 400]
  ])("When %i of water in %i of liquid is changed to %i% the result should be be %i", (waterPercentage, amount, targetHydration, targetAmount) => {
    const ingredients = [
      { id: "test1", grams: 100, name: "test1", nutrients: [ {type: NutritionType.flour, percent: 100}, {type: NutritionType.dry, percent: 100} ] },
      { id: "test1", grams: amount, name: "test1", nutrients: [ {type: NutritionType.water, percent: waterPercentage}, ] }
    ];
    changeHydration(ingredients, targetHydration);
    expect(ingredients[0].grams).toBe(100);
    expect(ingredients[1].grams).toBe(targetAmount);

    expect(getIngredientsHydration(ingredients).hydration).toBe(targetHydration);
  });
});
