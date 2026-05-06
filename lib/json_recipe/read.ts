import { DRY_NUTRIENTS, RecipeIngredientsType, RecipeType } from "../types.ts";
import { JsonRecipe } from "../recipes.ts";
import { resolveJsonRecipeTypeId } from "./recipe_id.ts";
import { resolveInnerTemperature, resolveBakingTime } from "./intervals.ts";
import { readJsonIngredient, RawIngredient } from "./ingredient_reader.ts";

export const readJsonRecipe = (recipe: JsonRecipe): RecipeType => {
  const result: RecipeType = {
    id: resolveJsonRecipeTypeId(recipe),
    name: recipe.name,
    ingredients: [],
    bakingTime: resolveBakingTime(recipe.bakingTime),
    innerTemperature: resolveInnerTemperature(recipe.innerTemperature),
    amount: recipe.amount || 1,
  };

  const toBeCalculated = {
    flour: { amount: 0, percent: 100 },
    percent: [] as [import("../types.ts").IngredientGramsType, number][],
  };

  for (const group of recipe.ingredients) {
    const recipeGroup: RecipeIngredientsType = {
      name: group.name,
      starter: group.starter === true,
      ingredients: [],
    };

    for (const raw of group.ingredients) {
      const { ing: ingredient, grams: rawGrams, percent: rawPercent } = readJsonIngredient(raw as RawIngredient);
      recipeGroup.ingredients.push(ingredient);

      const dryPercent = ingredient.nutrients
        .filter((n) => DRY_NUTRIENTS.includes(n.type))
        .reduce((max, n) => Math.max(max, n.percent), 0);

      if (dryPercent <= 0) {
        if (rawGrams === undefined && rawPercent !== undefined) toBeCalculated.percent.push([ingredient, rawPercent]);
        continue;
      }
      if (rawGrams !== undefined) {
        toBeCalculated.flour.amount += (rawGrams * dryPercent) / 100;
      } else if (rawPercent !== undefined) {
        toBeCalculated.flour.percent -= (rawPercent * 100) / dryPercent;
        toBeCalculated.percent.push([ingredient, rawPercent]);
      } else {
        throw new Error(`Unresolved item: no amount nor percent`);
      }
    }
    result.ingredients.push(recipeGroup);
  }

  if (toBeCalculated.percent.length === 0) return result;
  if (toBeCalculated.flour.amount === 0) throw new Error("No flour amount defined!");
  if (toBeCalculated.flour.percent <= 0) throw new Error(`Total flour percent in ${result.name} exceeds 100%`);

  const totalFlourAmount = (100 * toBeCalculated.flour.amount) / toBeCalculated.flour.percent;
  for (const [ingredient, percent] of toBeCalculated.percent) {
    ingredient.grams = Math.round((percent * totalFlourAmount) / 10) / 10;
  }
  return result;
};
