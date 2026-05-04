import {
  BakingTimeType,
  copyIngredientGramsType,
  DRY_NUTRIENTS,
  GramsAmountType,
  IngredientGramsType,
  IngredientType,
  nameStr,
  NutrientPercentType,
  NutritionType,
  NumberIntervalType,
  PercentAmountType,
  RecipeIngredientsType,
  RecipeType,
} from "./types.ts";
import { getCustomIngredient, getIngredientGrams, StandardIngredients } from "./ingredients.ts";
import { JsonIngredients, JsonRecipe } from "./recipes.ts";

// ── Base64 (UTF-8 safe) ─────────────────────────────────────────────────────

const utf8ToBase64 = (str: string): string => {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
};

export const base64Encode = (...values: (string | number)[]): string => {
  const str = values.length === 1 ? values[0].toString() : JSON.stringify(values);
  return utf8ToBase64(str);
};

// ── ID generators ───────────────────────────────────────────────────────────

export const resolveJsonRecipeTypeId = (value: { name: string | Record<string, string>; id?: string; amount?: number }): string => {
  if (value.id) return value.id;
  return base64Encode("json", "ingredient", nameStr(value.name), value.amount || 1);
};

const resolveJsonExtraStandardIngredient = (
  ingredient: { type: string; name: string; id?: string },
  grams: number,
): string => {
  if (ingredient.id) return ingredient.id;
  return base64Encode("json", "ingredient", ingredient.type, ingredient.name, grams);
};

// ── Number interval ─────────────────────────────────────────────────────────

const resolveNumberIntervalType = (value: NumberIntervalType | number): NumberIntervalType => {
  const first = typeof value === "number" ? value : value.from;
  const second = typeof value === "number" ? value : value.until;
  return { from: Math.min(first, second), until: Math.max(first, second) };
};

const resolveInnerTemperature = (value?: NumberIntervalType | number | null): NumberIntervalType | null => {
  if (value == null) return null;
  return resolveNumberIntervalType(value);
};

const resolveBakingTime = (bakingTimes?: Array<{ time: NumberIntervalType | number; temperature: NumberIntervalType | number; steam?: boolean; label?: string | Record<string, string> }>): BakingTimeType[] => {
  if (!bakingTimes) return [];
  return bakingTimes.map((bt) => ({
    time: resolveNumberIntervalType(bt.time),
    temperature: resolveNumberIntervalType(bt.temperature),
    steam: bt.steam === true,
    ...(bt.label ? { label: typeof bt.label === "string" ? { et: bt.label, en: bt.label } : bt.label } : {}),
  }));
};

// ── Ingredient reader ───────────────────────────────────────────────────────

type HasValue<T> = { hadValue: boolean; value: T };

const resolveValue = <T>(value: T | undefined | null, defaultValue: T): HasValue<T> => ({
  hadValue: value != null,
  value: value != null ? value : defaultValue,
});

type RawIngredient = {
  type?: string;
  grams?: number;
  percent?: number;
  name?: string;
  id?: string;
  nutrients?: NutrientPercentType[];
};

type ResolveTestType = {
  id: HasValue<string>;
  grams: HasValue<number>;
  percent: HasValue<number>;
  type: string;
  name: HasValue<string>;
  nutrients: HasValue<NutrientPercentType[]>;
};

const readJsonIngredient = (ingredient: RawIngredient): [IngredientGramsType, ResolveTestType] => {
  if (ingredient.type == null) throw new Error(`Type is required`);

  const resultTest: ResolveTestType = {
    id: resolveValue((ingredient as IngredientType).id, ""),
    grams: resolveValue((ingredient as GramsAmountType).grams, 100),
    percent: resolveValue((ingredient as PercentAmountType).percent, -1),
    type: ingredient.type,
    name: resolveValue((ingredient as IngredientType).name, ""),
    nutrients: resolveValue((ingredient as IngredientType).nutrients, []),
  };

  // Custom "DRY" type (extra ingredient, not in StandardIngredients)
  if (ingredient.type === "DRY") {
    if (!resultTest.name.hadValue) throw new Error(`.name required for DRY type`);
    const id = resolveJsonExtraStandardIngredient(
      { type: "DRY", name: resultTest.name.value, id: resultTest.id.value || undefined },
      resultTest.grams.value,
    );
    const dryNutrients: NutrientPercentType[] = [{ type: NutritionType.dry, percent: 100 }];
    if (resultTest.nutrients.hadValue && resultTest.nutrients.value.length > 0) {
      dryNutrients.push(...resultTest.nutrients.value);
    }
    return [getCustomIngredient(id, resultTest.name.value, resultTest.grams.value, dryNutrients, "DRY"), resultTest];
  }

  const ingredientGrams = getIngredientGrams(resultTest.type, resultTest.grams.value);
  if (ingredientGrams != null) return [ingredientGrams, resultTest];

  throw new Error(`Could not resolve type ${resultTest.type}`);
};

// ── Recipe reader ───────────────────────────────────────────────────────────

export const readJsonRecipe = (recipe: JsonRecipe): RecipeType => {
  const result: RecipeType = {
    id: resolveJsonRecipeTypeId(recipe),
    name: recipe.name,
    ingredients: [],
    bakingTime: resolveBakingTime(recipe.bakingTime),
    innerTemperature: resolveInnerTemperature(recipe.innerTemperature),
    description: recipe.description ?? null,
    amount: recipe.amount || 1,
  };

  const toBeCalculated = {
    flour: { amount: 0, percent: 100 },
    percent: [] as [IngredientGramsType, ResolveTestType][],
  };

  for (const group of recipe.ingredients) {
    const recipeGroup: RecipeIngredientsType = {
      name: group.name,
      description: group.description ?? null,
      bakingTime: resolveBakingTime(group.bakingTime),
      innerTemperature: resolveInnerTemperature(group.innerTemperature),
      starter: group.starter === true,
      ingredients: [],
    };

    for (const raw of group.ingredients) {
      const [ingredient, resolveTest] = readJsonIngredient(raw as RawIngredient);
      recipeGroup.ingredients.push(ingredient);

      const dryPercent = ingredient.nutrients
        .filter((n) => DRY_NUTRIENTS.includes(n.type))
        .reduce((max, n) => Math.max(max, n.percent), 0);

      if (dryPercent <= 0) {
        if (!resolveTest.grams.hadValue) toBeCalculated.percent.push([ingredient, resolveTest]);
        continue;
      }
      if (resolveTest.grams.hadValue) {
        toBeCalculated.flour.amount += resolveTest.grams.value * dryPercent / 100;
      } else if (resolveTest.percent.hadValue) {
        toBeCalculated.flour.percent -= resolveTest.percent.value * 100 / dryPercent;
        toBeCalculated.percent.push([ingredient, resolveTest]);
      } else {
        throw new Error(`Unresolved item: no amount nor percent`);
      }
    }
    result.ingredients.push(recipeGroup);
  }

  if (toBeCalculated.percent.length === 0) return result;
  if (toBeCalculated.flour.amount === 0) throw new Error("No flour amount defined!");
  if (toBeCalculated.flour.percent <= 0) throw new Error(`Total flour percent in ${result.name} exceeds 100%`);

  const totalFlourAmount = 100 * toBeCalculated.flour.amount / toBeCalculated.flour.percent;
  for (const [ingredient, resolveTest] of toBeCalculated.percent) {
    ingredient.grams = Math.round(resolveTest.percent.value * totalFlourAmount / 10) / 10;
  }
  return result;
};

// ── Recipe → JSON (for export) ──────────────────────────────────────────────

const normalizeInterval = (v: NumberIntervalType): NumberIntervalType | number =>
  v.from === v.until ? v.from : { from: v.from, until: v.until };

export const recipeToJson = (recipe: RecipeType): JsonRecipe => {
  const result: JsonRecipe = {
    name: recipe.name,
    ingredients: recipe.ingredients.map((group) => {
      const g: JsonIngredients = {
        ingredients: group.ingredients.map((ing) => {
          const stdKey = ing.type && (StandardIngredients as unknown as Record<string, unknown>)[ing.type] ? ing.type : null;
          if (stdKey) return { type: stdKey, grams: ing.grams };
          return { ...ing, type: ing.type ?? "" };
        }),
      };
      if (group.name) g.name = group.name;
      if (group.description) g.description = group.description;
      if (group.starter) g.starter = true;
      if (group.bakingTime?.length) g.bakingTime = group.bakingTime.map((bt) => ({
        time: normalizeInterval(bt.time),
        temperature: normalizeInterval(bt.temperature),
        ...(bt.steam ? { steam: true } : {}),
      }));
      if (group.innerTemperature) g.innerTemperature = normalizeInterval(group.innerTemperature);
      return g;
    }),
  };
  if (recipe.amount > 1) result.amount = recipe.amount;
  if (recipe.description) result.description = recipe.description;
  if (recipe.bakingTime?.length) result.bakingTime = recipe.bakingTime.map((bt) => ({
    time: normalizeInterval(bt.time),
    temperature: normalizeInterval(bt.temperature),
    ...(bt.steam ? { steam: true } : {}),
  }));
  if (recipe.innerTemperature) result.innerTemperature = normalizeInterval(recipe.innerTemperature);
  const id = resolveJsonRecipeTypeId(result);
  if (id !== recipe.id) result.id = recipe.id;
  return result;
};
