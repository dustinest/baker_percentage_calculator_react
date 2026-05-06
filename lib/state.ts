import { effect, signal } from "@preact/signals";
import {
  BakerPercentageAwareRecipe,
  copyRecipeType,
  RecipeType,
} from "./types.ts";
import { readJsonRecipe, recipeToJson } from "./json_recipe";
import { splitStarterAndDough } from "./sourdough.ts";
import { recalculateBakerPercentage } from "./baker-percent.ts";
import { PREDEFINED_RECIPES } from "./recipes.ts";
import { parseUrlIds, syncUrlEffect } from "./url.ts";
import { language, t } from "./i18n.ts";
import ee from "../locales/ee.json";
import gb from "../locales/gb.json";

const COPY_PREFIXES: Record<string, string> = { et: ee.recipe.copy_prefix, en: gb.recipe.copy_prefix };

// ── Bootstrap resolved recipes ───────────────────────────────────────────────

const resolvedPredefined: RecipeType[] = PREDEFINED_RECIPES.map(readJsonRecipe);

// ── Core signals ─────────────────────────────────────────────────────────────

export const allRecipes = signal<RecipeType[]>(resolvedPredefined);
export const selectedIds = signal<Set<string>>(new Set());
export const editingRecipe = signal<RecipeType | null>(null);
export const bakerResults = signal<Map<string, BakerPercentageAwareRecipe>>(new Map());
export const toast = signal<{ msg: string; key: number } | null>(null);
export const showPercent = signal(true);
export const compactMode = signal(false);

export { language };

// ── Toast helper ─────────────────────────────────────────────────────────────

export const showToast = (msg: string) => {
  toast.value = { msg, key: Date.now() };
};

// ── Recalculation (debounced 300ms) ──────────────────────────────────────────

let debounceTimer: number | undefined;

const recalculate = () => {
  const ids = selectedIds.value;
  const recipes = allRecipes.value;
  const newMap = new Map<string, BakerPercentageAwareRecipe>();

  for (const recipe of recipes) {
    if (!ids.has(recipe.id)) continue;
    const split = splitStarterAndDough(recipe.ingredients);
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
  copied.id = "";
  if (typeof copied.name === "object") {
    copied.name = Object.fromEntries(Object.entries(copied.name).map(([k, v]) => [k, `${COPY_PREFIXES[k] ?? COPY_PREFIXES["en"]}${v}`]));
  } else {
    copied.name = `${COPY_PREFIXES["et"]}${copied.name}`;
  }
  editingRecipe.value = copied;
};

export const addNewRecipe = () => {
  editingRecipe.value = {
    id: "",
    name: { et: "Uus retsept", en: "New recipe" },
    amount: 1,
    ingredients: [{ ingredients: [] }],
    bakingTime: [],
    innerTemperature: null,
  };
};

export const confirmNewRecipe = (recipe: RecipeType) => {
  const withId = { ...recipe, id: `new_${Date.now()}` };
  allRecipes.value = [...allRecipes.value, withId];
  selectedIds.value = new Set([...selectedIds.value, withId.id]);
};

export const addImportedRecipe = (recipe: RecipeType) => {
  const existing = allRecipes.value.find((r) => r.id === recipe.id);
  if (existing) {
    updateRecipe(recipe);
    showToast(t("toast.recipe_updated"));
  } else {
    allRecipes.value = [...allRecipes.value, recipe];
    selectedIds.value = new Set([...selectedIds.value, recipe.id]);
    showToast(t("toast.recipe_imported"));
  }
};

// ── URL sync (call once on island mount) ─────────────────────────────────────

export const initUrlSync = () => {
  selectedIds.value = parseUrlIds();
  if (selectedIds.value.size === 0) {
    selectedIds.value = new Set(allRecipes.value.map((r) => r.id));
  }
  syncUrlEffect(selectedIds);
};

export const recipeToJsonExport = recipeToJson;
