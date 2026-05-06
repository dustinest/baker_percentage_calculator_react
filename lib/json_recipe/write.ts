import { RecipeType } from "../types.ts";
import { JsonIngredients, JsonRecipe } from "../recipes.ts";
import { StandardIngredients } from "../ingredients.ts";
import { resolveJsonRecipeTypeId } from "./recipe_id.ts";
import { normalizeInterval } from "./intervals.ts";

export const recipeToJson = (recipe: RecipeType): JsonRecipe => {
  const result: JsonRecipe = {
    name: recipe.name,
    ingredients: recipe.ingredients.map((group) => {
      const g: JsonIngredients = {
        ingredients: group.ingredients.map((ing) => {
          const stdKey =
            ing.type && (StandardIngredients as unknown as Record<string, unknown>)[ing.type] ? ing.type : null;
          if (stdKey) return { type: stdKey, grams: ing.grams };
          return { ...ing, type: ing.type ?? "" };
        }),
      };
      if (group.name) g.name = group.name;
      if (group.starter) g.starter = true;
      return g;
    }),
  };
  if (recipe.amount > 1) result.amount = recipe.amount;
  if (recipe.bakingTime?.length)
    result.bakingTime = recipe.bakingTime.map((bt) => ({
      time: normalizeInterval(bt.time),
      temperature: normalizeInterval(bt.temperature),
      ...(bt.steam ? { steam: true } : {}),
      ...(bt.label ? { label: bt.label } : {}),
    }));
  if (recipe.innerTemperature) result.innerTemperature = normalizeInterval(recipe.innerTemperature);
  const id = resolveJsonRecipeTypeId(result);
  if (id !== recipe.id) result.id = recipe.id;
  return result;
};
