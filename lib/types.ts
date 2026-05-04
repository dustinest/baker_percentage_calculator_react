// ── Nutrition ──────────────────────────────────────────────────────────────

export enum NutritionType {
  flour = "flour",
  dry = "dry",
  water = "water",
  salt = "salt",
  sugar = "sugar",
  fat = "fat",
  spice = "spice",
  egg = "egg",
  other = "other",
  whole_grain = "whole_grain",
  ash = "ash",
}

export const DISPLAYABLE_NUTRIENTS_TYPE_ARRAY = [
  NutritionType.water,
  NutritionType.salt,
  NutritionType.sugar,
  NutritionType.fat,
  NutritionType.other,
];

export const DRY_NUTRIENTS = [NutritionType.flour, NutritionType.dry];

// ── Primitives ──────────────────────────────────────────────────────────────

export type PercentAmountType = { percent: number };
export type GramsAmountType = { grams: number };

export interface NumberIntervalType {
  from: number;
  until: number;
}

// ── Nutrients ───────────────────────────────────────────────────────────────

export type NutrientPercentType = { type: NutritionType } & PercentAmountType;

export const copyNutrientPercentType = (v: NutrientPercentType): NutrientPercentType =>
  ({ type: v.type, percent: v.percent });

// ── Ingredients ─────────────────────────────────────────────────────────────

export type IngredientType = {
  id: string;
  name: string;
  type?: string;
  nutrients: NutrientPercentType[];
};

export type IngredientGramsType = IngredientType & GramsAmountType;
export type IngredientPercentType = IngredientType & PercentAmountType;

export const copyIngredientGramsType = (v: IngredientGramsType): IngredientGramsType => ({
  grams: v.grams,
  name: v.name,
  type: v.type,
  id: v.id,
  nutrients: v.nutrients.map(copyNutrientPercentType),
});

export const copyIngredientPercentType = (v: IngredientPercentType): IngredientPercentType => ({
  percent: v.percent,
  name: v.name,
  type: v.type,
  id: v.id,
  nutrients: v.nutrients.map(copyNutrientPercentType),
});

// ── Baking ──────────────────────────────────────────────────────────────────

export type BakingTimeType = {
  time: NumberIntervalType;
  temperature: NumberIntervalType;
  steam: boolean;
  label?: Record<string, string>;
};

export type BakingAwareType = {
  innerTemperature: NumberIntervalType | null;
  bakingTime: BakingTimeType[];
  description: string | null;
};

export const copyNumberIntervalType = (v: NumberIntervalType): NumberIntervalType =>
  ({ from: v.from, until: v.until });

export const copyBakingTimeType = (v: BakingTimeType): BakingTimeType => ({
  time: copyNumberIntervalType(v.time),
  temperature: copyNumberIntervalType(v.temperature),
  steam: v.steam,
  label: v.label,
});

export const numberIntervalTypeEquals = (a: NumberIntervalType | null, b: NumberIntervalType | null): boolean => {
  if (a == null && b == null) return true;
  if (a == null || b == null) return false;
  return a.from === b.from && a.until === b.until;
};

export const bakingTimeEquals = (a: BakingTimeType, b: BakingTimeType): boolean =>
  a.steam === b.steam &&
  numberIntervalTypeEquals(a.time, b.time) &&
  numberIntervalTypeEquals(a.temperature, b.temperature);

// ── Recipe groups ───────────────────────────────────────────────────────────

export type RecipeIngredientsType = {
  name?: string | Record<string, string>;
  ingredients: IngredientGramsType[];
  starter?: boolean;
} & BakingAwareType;

export const copyRecipeIngredientsType = (v: RecipeIngredientsType): RecipeIngredientsType => ({
  ingredients: v.ingredients.map(copyIngredientGramsType),
  name: v.name,
  description: v.description,
  bakingTime: v.bakingTime.map(copyBakingTimeType),
  starter: v.starter,
  innerTemperature: v.innerTemperature ? copyNumberIntervalType(v.innerTemperature) : null,
});

// ── Recipe ──────────────────────────────────────────────────────────────────

export type RecipeType = {
  id: string;
  name: string | Record<string, string>;
  amount: number;
  ingredients: RecipeIngredientsType[];
} & BakingAwareType;

export const nameStr = (name: string | Record<string, string>): string =>
  typeof name === "string" ? name : (name["et"] ?? name["en"] ?? "");

export const nameForLang = (name: string | Record<string, string>, lang: string): string =>
  typeof name === "string" ? name : (lang === "ee" ? (name["et"] ?? name["en"]) : (name["en"] ?? name["et"])) ?? "";

export const copyRecipeType = (v: RecipeType): RecipeType => ({
  innerTemperature: v.innerTemperature ? copyNumberIntervalType(v.innerTemperature) : null,
  bakingTime: v.bakingTime.map(copyBakingTimeType),
  description: v.description,
  amount: v.amount,
  name: v.name,
  ingredients: v.ingredients.map(copyRecipeIngredientsType),
  id: v.id,
});

// ── Baker percentage result types ───────────────────────────────────────────

export type MicroNutrientsValueType = {
  type: NutritionType;
  grams: number;
  percent: number;
};

export type MicroNutrientsResultType = {
  nutrients: Partial<Record<NutritionType, MicroNutrientsValueType>>;
  dry_total: number;
};

export type IngredientWithPercentType = IngredientPercentType & IngredientGramsType;

export type RecipeIngredientsWithPercentType = {
  ingredientWithPercent: IngredientWithPercentType[];
} & RecipeIngredientsType;

export type BakerPercentageResult = {
  microNutrients: MicroNutrientsResultType;
  ingredients: RecipeIngredientsWithPercentType[];
};

export type BakerPercentageAwareRecipe = {
  bakerPercentage: BakerPercentageResult | null;
} & RecipeType;
