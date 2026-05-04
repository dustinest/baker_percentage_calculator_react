import { computed, effect, signal } from "@preact/signals";
import {
  BakerPercentageAwareRecipe,
  copyRecipeType,
  nameStr,
  RecipeType,
} from "./types.ts";
import { readJsonRecipe, recipeToJson, resolveJsonRecipeTypeId } from "./resolution.ts";
import { splitStarterAndDough } from "./sourdough.ts";
import { recalculateBakerPercentage } from "./baker-percent.ts";
import { PREDEFINED_RECIPES } from "./recipes.ts";
import { parseUrlIds, syncUrlEffect } from "./url.ts";
import { language } from "./i18n.ts";

// ── Bootstrap resolved recipes ───────────────────────────────────────────────

const resolvedPredefined: RecipeType[] = PREDEFINED_RECIPES.map(readJsonRecipe);

// ── Core signals ─────────────────────────────────────────────────────────────

export const allRecipes = signal<RecipeType[]>(resolvedPredefined);
export const selectedIds = signal<Set<string>>(new Set());
export const editingRecipe = signal<RecipeType | null>(null);
export const bakerResults = signal<Map<string, BakerPercentageAwareRecipe>>(new Map());
export const toast = signal<{ msg: string; key: number } | null>(null);

export { language };

// ── Toast helper ─────────────────────────────────────────────────────────────

export const showToast = (msg: string) => {
  toast.value = { msg, key: Date.now() };
};

// ── Recalculation (debounced 300ms) ──────────────────────────────────────────

let debounceTimer: number | undefined;

const recalculate = async () => {
  const ids = selectedIds.value;
  const recipes = allRecipes.value;
  const newMap = new Map<string, BakerPercentageAwareRecipe>();

  for (const recipe of recipes) {
    if (!ids.has(recipe.id)) continue;
    const split = await splitStarterAndDough(recipe.ingredients);
    const bp = recalculateBakerPercentage(split);
    newMap.set(recipe.id, { ...recipe, bakerPercentage: bp });
  }
  bakerResults.value = newMap;
};

effect(() => {
  // read signals to subscribe
  void allRecipes.value;
  void selectedIds.value;
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(recalculate, 300) as unknown as number;
});

// ── Selection mutations ───────────────────────────────────────────────────────

export const toggleSelected = (id: string) => {
  const next = new Set(selectedIds.value);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  selectedIds.value = next;
};

export const selectAll = () => {
  selectedIds.value = new Set(allRecipes.value.map((r) => r.id));
};

export const selectNone = () => {
  selectedIds.value = new Set();
};

// ── Recipe mutations ──────────────────────────────────────────────────────────

export const updateRecipe = (updated: RecipeType) => {
  allRecipes.value = allRecipes.value.map((r) => r.id === updated.id ? updated : r);
};

export const copyRecipe = (recipe: RecipeType) => {
  const copied = copyRecipeType(recipe);
  copied.name = `Koopia — ${nameStr(recipe.name)}`;
  copied.id = resolveJsonRecipeTypeId({ name: copied.name, amount: copied.amount }) + "_copy_" + Date.now();
  allRecipes.value = [...allRecipes.value, copied];
  selectedIds.value = new Set([...selectedIds.value, copied.id]);
  showToast("Retsept kopeeritud");
};

export const addImportedRecipe = (recipe: RecipeType) => {
  const existing = allRecipes.value.find((r) => r.id === recipe.id);
  if (existing) {
    updateRecipe(recipe);
    showToast("Retsept uuendatud");
  } else {
    allRecipes.value = [...allRecipes.value, recipe];
    selectedIds.value = new Set([...selectedIds.value, recipe.id]);
    showToast("Retsept imporditud");
  }
};

export const setIngredientGrams = (
  recipeId: string, groupIndex: number, ingredientIndex: number, grams: number,
) => {
  const recipe = allRecipes.value.find((r) => r.id === recipeId);
  if (!recipe) return;
  const copy = copyRecipeType(recipe);
  copy.ingredients[groupIndex].ingredients[ingredientIndex].grams = grams;
  updateRecipe(copy);
};

export const setRecipeName = (recipeId: string, name: string) => {
  const recipe = allRecipes.value.find((r) => r.id === recipeId);
  if (!recipe || nameStr(recipe.name) === name) return;
  const copy = copyRecipeType(recipe);
  copy.name = name;
  updateRecipe(copy);
};

export const setRecipeAmount = (recipeId: string, amount: number) => {
  const recipe = allRecipes.value.find((r) => r.id === recipeId);
  if (!recipe || recipe.amount === amount) return;
  const copy = copyRecipeType(recipe);
  copy.amount = amount;
  updateRecipe(copy);
};

// ── Derived ───────────────────────────────────────────────────────────────────

export const selectedRecipes = computed(() =>
  allRecipes.value.filter((r) => selectedIds.value.has(r.id))
);

// ── URL sync (call once on island mount) ─────────────────────────────────────

export const initUrlSync = () => {
  selectedIds.value = parseUrlIds();
  if (selectedIds.value.size === 0) {
    selectedIds.value = new Set(allRecipes.value.map((r) => r.id));
  }
  syncUrlEffect(selectedIds);
};

export const recipeToJsonExport = recipeToJson;
