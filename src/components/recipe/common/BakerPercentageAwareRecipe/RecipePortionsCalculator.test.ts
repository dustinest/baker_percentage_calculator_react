import {getRecipePortions, RecipePortion} from "./RecipePortionsCalculator";

describe("Portions work", () => {
  it.each([
    [850, 0.9,  [{label: "0.9", amount: 1, grams: 850}]],
    [850, 1,    [{label: "1", amount: 1, grams: 850}]],
    [850, 1.9,  [{label: "1.9", amount: 1.9, grams: 850}, {label: "1", amount: 1, grams: 447}, {label: "0.9", amount: 0.9, grams: 850 - 447}]],
    [850, 2,    [{label: "2", amount: 2, grams: 850}, {label: "1/2", amount: 1, grams: 425}]],
    [850, 2.2,  [{label: "2.2", amount: 2.2, grams: 850}, {label: "1.2", amount: 1.2, grams: 464}, {label: "1", amount: 1, grams: 850 - 464}]],
    [850, 3,    [{label: "3", amount: 3, grams: 850}, {label: "1/3", amount: 1, grams: 283.3}]],
    [850, 3.7,  [{label: "3.7", amount: 3.7, grams: 850}, {label: "2", amount: 2, grams: 459}, {label: "1.7", amount: 1.7, grams: 850 - 459}]],
    [850, 4,    [{label: "4", amount: 4, grams: 850}, {label: "1/4", amount: 1, grams: 212.5}]],
    [850, 4.6,  [{label: "4.6", amount: 4.6, grams: 850}, {label: "3", amount: 3, grams: 554}, {label: "1.6", amount: 1.6, grams: 850 - 554}]],

  ])('Grams %i, amount %d', (grams: number, amount: number, result: RecipePortion[]) => {
    expect(getRecipePortions(grams, amount)).toStrictEqual(result)
  });
});
