# Deno/Fresh 2 Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the React/Vite/MUI app in-place with a Deno + Fresh 2 + Preact + Tailwind + DaisyUI app that preserves all calculation logic, fixes the milk rule, adds recipe import and URL sharing, and has a full `deno test` suite.

**Architecture:** Four Preact islands (RecipeNavigation, RecipeList, RecipeCard, EditRecipeDialog) share state via module-level Preact Signals in `lib/state.ts`. Pure calculation logic lives in `lib/` with no Preact dependencies and is tested independently with `deno test`.

**Tech Stack:** Deno, Fresh 2, Preact, Preact Signals, Tailwind CSS, DaisyUI

---

## File Map

| File | Purpose |
|---|---|
| `deno.json` | Tasks, import map, compiler options |
| `fresh.config.ts` | Fresh 2 config + Tailwind + DaisyUI |
| `main.ts` | Entry point |
| `tailwind.config.ts` | Tailwind content paths + DaisyUI plugin |
| `routes/index.tsx` | SSR shell (html/head) mounting all islands |
| `islands/RecipeNavigation.tsx` | Left drawer, checklist, language toggle |
| `islands/RecipeList.tsx` | Responsive grid of recipe cards |
| `islands/RecipeCard.tsx` | Single recipe: tables, micro nutrients, baking info |
| `islands/EditRecipeDialog.tsx` | Full-screen edit/export/import dialog |
| `components/Toast.tsx` | Signal-driven toast notification |
| `lib/types.ts` | All TypeScript types (verbatim port) |
| `lib/ingredients.ts` | Standard ingredients (verbatim port) |
| `lib/recipes.ts` | Predefined recipe JSON data (verbatim port) |
| `lib/resolution.ts` | readJsonRecipe: percent→grams resolver (verbatim port) |
| `lib/sourdough.ts` | Full levain pipeline + milk rule fix |
| `lib/baker-percent.ts` | Baker% + micro nutrients calculator (verbatim port) |
| `lib/i18n.ts` | Lightweight t() + language signal |
| `lib/url.ts` | URL sharing via btoa/atob |
| `lib/state.ts` | All Preact Signals + mutation functions + recalc |
| `locales/ee.json` | Estonian translations (moved from src/) |
| `locales/gb.json` | English translations (moved from src/) |
| `static/baker-icon.svg` | App icon |
| `tests/resolution_test.ts` | percent→grams for all 11 recipes |
| `tests/sourdough_test.ts` | Full levain split for all 11 recipes |
| `tests/baker_percent_test.ts` | Baker% + micro nutrients for all 11 recipes |
| `tests/total_weight_test.ts` | Total weights for all 11 recipes |

---

## Task 1: Scaffold Deno Fresh 2 project

**Files:**
- Create: `deno.json`
- Create: `fresh.config.ts`
- Create: `main.ts`
- Create: `tailwind.config.ts`
- Create: `routes/index.tsx`

- [ ] **Step 1: Create `deno.json`**

```json
{
  "tasks": {
    "start": "deno run -A --watch main.ts",
    "build": "deno run -A main.ts build",
    "test": "deno test --allow-read tests/"
  },
  "imports": {
    "@fresh/core": "jsr:@fresh/core@^2.0.0-alpha",
    "@fresh/plugin-tailwind": "jsr:@fresh/plugin-tailwind@^0.0.1",
    "@preact/signals": "jsr:@preact/signals@^1.3.0",
    "preact": "npm:preact@^10.24.0",
    "preact/": "npm:preact@^10.24.0/",
    "@std/assert": "jsr:@std/assert@^1.0.0"
  },
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "preact",
    "lib": ["dom", "dom.iterable", "dom.asynciterable", "deno.ns"]
  }
}
```

- [ ] **Step 2: Create `tailwind.config.ts`**

```ts
import type { Config } from "npm:tailwindcss@^3";
import daisyui from "npm:daisyui@^4";

export default {
  content: [
    "./routes/**/*.{ts,tsx}",
    "./islands/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  plugins: [daisyui],
  daisyui: {
    themes: ["light"],
  },
} satisfies Config;
```

- [ ] **Step 3: Create `fresh.config.ts`**

```ts
import { defineConfig } from "@fresh/core";
import tailwind from "@fresh/plugin-tailwind";

export default defineConfig({
  plugins: [tailwind()],
});
```

- [ ] **Step 4: Create `main.ts`**

```ts
import { App, fsRoutes, staticFiles } from "@fresh/core";
import config from "./fresh.config.ts";

const app = new App(config).use(staticFiles());

await fsRoutes(app, { dir: "./" });

if (import.meta.main) {
  await app.listen({ port: 8000 });
}
```

- [ ] **Step 5: Create placeholder `routes/index.tsx`** (will be filled in Task 11)

```tsx
export default function Home() {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Baker's Percentage Calculator</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body class="bg-base-100">
        <p>Loading…</p>
      </body>
    </html>
  );
}
```

- [ ] **Step 6: Verify server starts**

```bash
deno task start
```

Expected: server starts on port 8000, browser shows "Loading…". No TypeScript errors.

- [ ] **Step 7: Commit**

```bash
git add deno.json fresh.config.ts main.ts tailwind.config.ts routes/index.tsx
git commit -m "feat: scaffold Deno Fresh 2 project"
```

---

## Task 2: Move locales and port `lib/types.ts`

**Files:**
- Create: `locales/ee.json` (copy from `src/static/locales/ee.json`)
- Create: `locales/gb.json` (copy from `src/static/locales/gb.json`)
- Create: `lib/types.ts`

- [ ] **Step 1: Copy locale files**

```bash
mkdir -p locales lib
cp src/static/locales/ee.json locales/ee.json
cp src/static/locales/gb.json locales/gb.json
```

- [ ] **Step 2: Create `lib/types.ts`** — consolidates all types from `src/types/`

```ts
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
  name?: string;
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
  name: string;
  amount: number;
  ingredients: RecipeIngredientsType[];
} & BakingAwareType;

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
```

- [ ] **Step 3: Commit**

```bash
git add locales/ lib/types.ts
git commit -m "feat: move locales and add lib/types.ts"
```

---

## Task 3: Port `lib/ingredients.ts` and `lib/recipes.ts`

**Files:**
- Create: `lib/ingredients.ts`
- Create: `lib/recipes.ts`

- [ ] **Step 1: Create `lib/ingredients.ts`**

Port verbatim from `src/Constant/Ingredient/StandardIngredientConstant.ts`. Remove `hasValue` import and `SORT_INGREDIENTS` dependency from `StandardIngredientMethodGrams` (that export is not used in the new stack).

```ts
import {
  copyIngredientGramsType,
  IngredientGramsType,
  IngredientType,
  NutrientPercentType,
  NutritionType,
} from "./types.ts";

const createPredefined = (id: string, ...nutrients: (NutritionType | number)[]): IngredientType => {
  const _nutrients: NutrientPercentType[] = [];
  for (let i = 0; i < nutrients.length; i += 2) {
    _nutrients.push({ type: nutrients[i] as NutritionType, percent: nutrients[i + 1] as number });
  }
  return Object.freeze({
    id,
    name: `ingredient.predefined.${id}`,
    nutrients: Object.freeze(_nutrients),
  } as IngredientType);
};

export interface StandardIngredientKeys {
  SALT: IngredientType;
  SUGAR: IngredientType;
  SUGAR_BROWN: IngredientType;
  WATER: IngredientType;
  BUTTER: IngredientType;
  OIL: IngredientType;
  OLIVE_OIL: IngredientType;
  MILK: IngredientType;
  EGG: IngredientType;
  CARDAMOM: IngredientType;
  CINNAMON: IngredientType;
  WHOLE_RYE_FLOUR: IngredientType;
  WHOLE_RYE_MALT_FLOUR: IngredientType;
  WHOLE_WHEAT_FLOUR: IngredientType;
  DURUM_WHEAT: IngredientType;
  WHEAT_405_FLOUR: IngredientType;
  WHEAT_550_FLOUR: IngredientType;
  BARLEY: IngredientType;
  SEEDS: IngredientType;
}

export const StandardIngredients: StandardIngredientKeys = Object.freeze({
  SALT:               createPredefined("salt.generic",          NutritionType.salt,       100),
  SUGAR:              createPredefined("sugar.generic",         NutritionType.sugar,      100),
  SUGAR_BROWN:        createPredefined("sugar.brown",           NutritionType.sugar,      100),
  WATER:              createPredefined("water.generic",         NutritionType.water,      100),
  BUTTER:             createPredefined("butter.generic",        NutritionType.fat,         82, NutritionType.water, 18),
  OIL:                createPredefined("oil.generic",           NutritionType.fat,         82, NutritionType.fat,  100),
  OLIVE_OIL:          createPredefined("oil.olive",             NutritionType.fat,        100),
  MILK:               createPredefined("milk.generic",          NutritionType.fat,        2.8, NutritionType.water, 97.5),
  EGG:                createPredefined("egg.generic",           NutritionType.egg,        100),
  CARDAMOM:           createPredefined("spice.cardamom",        NutritionType.spice,      100),
  CINNAMON:           createPredefined("spice.cinnamon",        NutritionType.spice,      100),
  WHOLE_RYE_FLOUR:    createPredefined("flour.rye.whole_grain", NutritionType.flour,      100, NutritionType.whole_grain, 100),
  WHOLE_RYE_MALT_FLOUR: createPredefined("flour.rye.malt",     NutritionType.flour,      100, NutritionType.whole_grain, 100),
  WHOLE_WHEAT_FLOUR:  createPredefined("flour.wheat.whole_grain", NutritionType.flour,   100, NutritionType.whole_grain, 100),
  DURUM_WHEAT:        createPredefined("flour.wheat.durum",     NutritionType.flour,      100, NutritionType.whole_grain, 100),
  WHEAT_405_FLOUR:    createPredefined("flour.wheat.generic",   NutritionType.flour,      100, NutritionType.ash, 405),
  WHEAT_550_FLOUR:    createPredefined("flour.wheat.generic",   NutritionType.flour,      100, NutritionType.ash, 550),
  BARLEY:             createPredefined("flour.barley.generic",  NutritionType.dry,        100),
  SEEDS:              createPredefined("flour.seeds.generic",   NutritionType.dry,        100),
} as StandardIngredientKeys);

type IngredientFactory = (grams: number) => IngredientGramsType;
type IngredientFactories = { [K in keyof StandardIngredientKeys]: IngredientFactory };

export const StandardIngredientMethods: IngredientFactories = Object.freeze(
  Object.entries(StandardIngredients).reduce((obj, [key, value]) => {
    const id = `${key}_${value.id}`;
    obj[key as keyof StandardIngredientKeys] = (grams: number) =>
      copyIngredientGramsType({ ...value, grams, type: key, id });
    return obj;
  }, {} as IngredientFactories),
) as IngredientFactories;

export const getIngredientGrams = (key: string, grams: number): IngredientGramsType | undefined => {
  const factory = StandardIngredientMethods[key as keyof StandardIngredientKeys];
  return factory ? factory(grams) : undefined;
};

export const getCustomIngredient = (
  id: string, name: string, grams: number,
  nutrients?: NutrientPercentType[], type?: string,
): IngredientGramsType => ({ id, name, grams, type, nutrients: nutrients ? nutrients.map(n => ({ ...n })) : [] });
```

- [ ] **Step 2: Create `lib/recipes.ts`**

Port verbatim from `src/service/PredefinedRecipeService/data/PredefinedRecipes.ts`. The `JsonRecipe` type is defined inline here to avoid extra files.

```ts
import { NumberIntervalType } from "./types.ts";

type JsonNumberInterval = NumberIntervalType | number;

interface JsonBakingTime {
  time: JsonNumberInterval;
  temperature: JsonNumberInterval;
  steam?: boolean;
}

interface JsonIngredientsIngredient {
  type: string;
  grams?: number;
  percent?: number;
  name?: string;
  id?: string;
  nutrients?: Array<{ type: string; percent: number }>;
}

export interface JsonIngredients {
  name?: string;
  ingredients: JsonIngredientsIngredient[];
  bakingTime?: JsonBakingTime[];
  innerTemperature?: JsonNumberInterval;
  description?: string;
  starter?: boolean;
}

export interface JsonRecipe {
  id?: string;
  name: string;
  amount?: number;
  bakingTime?: JsonBakingTime[];
  innerTemperature?: JsonNumberInterval;
  ingredients: JsonIngredients[];
  description?: string;
}

export const PREDEFINED_RECIPES: JsonRecipe[] = [
  {
    name: "Täisteraleib",
    bakingTime: [
      { time: 20, temperature: 240, steam: true },
      { time: 40, temperature: 240 },
    ],
    innerTemperature: { from: 88, until: 99 },
    ingredients: [{
      ingredients: [
        { type: "WHOLE_RYE_FLOUR", grams: 405 },
        { type: "WHOLE_RYE_MALT_FLOUR", grams: 20 },
        { type: "WATER", percent: 100 },
        { type: "SALT", percent: 1.76 },
      ],
    }],
  },
  {
    name: "Sai",
    description: "Kukkel küpseta 25 minutit 180℃",
    bakingTime: [
      { time: 20, temperature: 240, steam: true },
      { time: 20, temperature: 240 },
    ],
    innerTemperature: { from: 88, until: 99 },
    ingredients: [{
      ingredients: [
        { type: "WHEAT_550_FLOUR", grams: 462 },
        { type: "WATER", percent: 82 },
        { type: "SALT", percent: 1.62 },
      ],
    }],
  },
  {
    name: "Sai seemnete ja kaerahelvestega",
    bakingTime: [
      { time: 20, temperature: 240, steam: true },
      { time: 20, temperature: 240 },
    ],
    innerTemperature: { from: 88, until: 99 },
    ingredients: [{
      ingredients: [
        { type: "WHEAT_550_FLOUR", grams: 462 },
        { type: "BARLEY", grams: 10 },
        { type: "SEEDS", grams: 12 },
        { type: "WATER", percent: 73.76 },
        { type: "SALT", percent: 1.55 },
      ],
    }],
  },
  {
    name: "Croissant",
    bakingTime: [{ time: { from: 20, until: 30 }, temperature: 210 }],
    innerTemperature: { from: 82, until: 88 },
    ingredients: [
      {
        ingredients: [
          { type: "WHEAT_550_FLOUR", grams: 500 },
          { type: "WATER", grams: 140 },
          { type: "MILK", grams: 140 },
          { type: "SUGAR", percent: 11 },
          { type: "BUTTER", grams: 40 },
          { type: "SALT", percent: 2.4 },
        ],
      },
      {
        name: "Kihistamiseks",
        ingredients: [{ type: "BUTTER", grams: 280 }],
      },
    ],
  },
  {
    name: "Pannkook",
    ingredients: [
      {
        starter: true,
        ingredients: [
          { type: "WHEAT_550_FLOUR", grams: 362 },
          { type: "WATER", grams: 129.5 },
          { type: "MILK", grams: 454 },
        ],
      },
      {
        ingredients: [
          { type: "BUTTER", grams: 50 },
          { type: "SALT", grams: 7.5 },
          { type: "SUGAR", grams: 14 },
          { type: "EGG", grams: 256 },
        ],
      },
    ],
  },
  {
    name: "Pizza",
    amount: 3,
    bakingTime: [{ time: { from: 18, until: 30 }, temperature: 210 }],
    ingredients: [{
      ingredients: [
        { type: "DURUM_WHEAT", grams: 515 },
        { type: "WATER", grams: 340 },
        { type: "OLIVE_OIL", grams: 27.44 },
        { type: "SALT", grams: 7.5 },
      ],
    }],
  },
  {
    name: "Vastlakuklid",
    amount: 18,
    bakingTime: [{ time: { from: 20, until: 25 }, temperature: 180 }],
    innerTemperature: { from: 82, until: 88 },
    ingredients: [{
      ingredients: [
        { type: "WHEAT_405_FLOUR", grams: 483 },
        { type: "WATER", grams: 83 },
        { type: "MILK", grams: 210 },
        { type: "BUTTER", grams: 75 },
        { type: "SALT", grams: 5 },
        { type: "SUGAR_BROWN", grams: 50 },
        { type: "CARDAMOM", percent: 0.2 },
      ],
    }],
  },
  {
    name: "Kaneelirullid",
    bakingTime: [{ time: { from: 20, until: 25 }, temperature: 210 }],
    innerTemperature: { from: 82, until: 88 },
    ingredients: [
      {
        ingredients: [
          { type: "WHEAT_405_FLOUR", grams: 483 },
          { type: "WATER", grams: 83 },
          { type: "MILK", grams: 210 },
          { type: "BUTTER", grams: 75 },
          { type: "SALT", grams: 5 },
          { type: "SUGAR_BROWN", grams: 50 },
          { type: "CARDAMOM", percent: 0.2 },
        ],
      },
      {
        name: "Kaanelikiht",
        ingredients: [
          { type: "CINNAMON", percent: 3.28 },
          { type: "BUTTER", grams: 112 },
          { type: "SALT", grams: 1 },
          { type: "SUGAR", grams: 95 },
        ],
      },
    ],
  },
  {
    name: "Plaadikook",
    description: "Pirukad küpseta umbes 30 - 40 minutit 180℃",
    bakingTime: [{ time: { from: 20, until: 30 }, temperature: 210 }],
    innerTemperature: { from: 82, until: 88 },
    ingredients: [{
      ingredients: [
        { type: "WHEAT_550_FLOUR", grams: 808 },
        { type: "WATER", grams: 123 },
        { type: "MILK", grams: 385 },
        { type: "BUTTER", grams: 200 },
        { type: "SALT", grams: 7.5 },
      ],
    }],
  },
  {
    name: "Pikk sai",
    amount: 2,
    bakingTime: [
      { time: 10, temperature: 180, steam: true },
      { time: { from: 15, until: 20 }, temperature: 180 },
    ],
    innerTemperature: { from: 82, until: 88 },
    ingredients: [{
      ingredients: [
        { type: "WHEAT_550_FLOUR", grams: 340 },
        { type: "WATER", grams: 142 },
        { type: "MILK", grams: 85 },
        { type: "SALT", grams: 6 },
      ],
    }],
  },
  {
    name: "Moskva saiakesed",
    bakingTime: [{ time: { from: 20, until: 25 }, temperature: 180 }],
    innerTemperature: { from: 82, until: 88 },
    ingredients: [
      {
        ingredients: [
          { type: "WHEAT_405_FLOUR", grams: 408 },
          { type: "WATER", grams: 130 },
          { type: "MILK", grams: 140 },
          { type: "SUGAR_BROWN", grams: 16 },
          { type: "BUTTER", grams: 50 },
          { type: "SALT", grams: 2 },
        ],
      },
      {
        name: "Kihistamiseks",
        ingredients: [{ type: "BUTTER", grams: 100 }],
      },
    ],
  },
];
```

- [ ] **Step 3: Commit**

```bash
git add lib/ingredients.ts lib/recipes.ts
git commit -m "feat: add lib/ingredients and lib/recipes"
```

---

## Task 4: Port `lib/resolution.ts`

**Files:**
- Create: `lib/resolution.ts`

Ports `readJsonRecipe.ts`, `readJsonIngredient.ts`, `JsonRecepyIdGenerator.ts`. Replaces `hasValue` with `!= null`, replaces `Buffer.from(...).toString('base64')` with `btoa` + TextEncoder for UTF-8 safety.

- [ ] **Step 1: Create `lib/resolution.ts`**

```ts
import {
  BakingTimeType,
  copyIngredientGramsType,
  DRY_NUTRIENTS,
  GramsAmountType,
  IngredientGramsType,
  IngredientType,
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

export const resolveJsonRecipeTypeId = (value: { name: string; id?: string; amount?: number }): string => {
  if (value.id) return value.id;
  return base64Encode("json", "ingredient", value.name, value.amount || 1);
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

const resolveBakingTime = (bakingTimes?: Array<{ time: NumberIntervalType | number; temperature: NumberIntervalType | number; steam?: boolean }>): BakingTimeType[] => {
  if (!bakingTimes) return [];
  return bakingTimes.map((bt) => ({
    time: resolveNumberIntervalType(bt.time),
    temperature: resolveNumberIntervalType(bt.temperature),
    steam: bt.steam === true,
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
          const stdKey = ing.type && (StandardIngredients as Record<string, unknown>)[ing.type] ? ing.type : null;
          if (stdKey) return { type: stdKey, grams: ing.grams };
          return { ...ing };
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
```

- [ ] **Step 2: Commit**

```bash
git add lib/resolution.ts
git commit -m "feat: add lib/resolution.ts (percent→grams resolver)"
```

---

## Task 5: Write `tests/resolution_test.ts` and verify

**Files:**
- Create: `tests/resolution_test.ts`

- [ ] **Step 1: Create `tests/resolution_test.ts`**

```ts
import { assertEquals, assertAlmostEquals } from "@std/assert";
import { readJsonRecipe } from "../lib/resolution.ts";
import { PREDEFINED_RECIPES } from "../lib/recipes.ts";

// Expected resolved grams for percent-based ingredients per recipe
const EXPECTED: Record<string, Record<string, number>> = {
  "Täisteraleib":   { WATER: 425, SALT: 7.5 },
  "Sai":            { WATER: 378.8, SALT: 7.5 },
  "Sai seemnete ja kaerahelvestega": { WATER: 357, SALT: 7.5 },
  "Croissant":      { SUGAR: 55, SALT: 12 },
  "Vastlakuklid":   { CARDAMOM: 1 },
  "Kaneelirullid":  { CARDAMOM: 1, CINNAMON: 15.8 },
};

Deno.test("resolution: percent-based ingredients resolve to correct grams", () => {
  for (const jsonRecipe of PREDEFINED_RECIPES) {
    const recipe = readJsonRecipe(jsonRecipe);
    const expected = EXPECTED[recipe.name];
    if (!expected) continue;

    const allIngredients = recipe.ingredients.flatMap((g) => g.ingredients);
    for (const [key, expectedGrams] of Object.entries(expected)) {
      const found = allIngredients.find((i) => i.type === key);
      if (!found) throw new Error(`${recipe.name}: ingredient ${key} not found`);
      assertAlmostEquals(
        found.grams, expectedGrams, 0.1,
        `${recipe.name} ${key}: expected ${expectedGrams}g, got ${found.grams}g`,
      );
    }
  }
});

Deno.test("resolution: grams-based ingredients pass through unchanged", () => {
  const sai = readJsonRecipe(PREDEFINED_RECIPES.find((r) => r.name === "Sai")!);
  const flour = sai.ingredients[0].ingredients.find((i) => i.type === "WHEAT_550_FLOUR");
  assertEquals(flour?.grams, 462);
});

Deno.test("resolution: all 11 recipes resolve without error", () => {
  assertEquals(PREDEFINED_RECIPES.length, 11);
  for (const r of PREDEFINED_RECIPES) {
    readJsonRecipe(r); // must not throw
  }
});
```

- [ ] **Step 2: Run tests**

```bash
deno task test tests/resolution_test.ts
```

Expected: all 3 tests pass.

- [ ] **Step 3: Commit**

```bash
git add tests/resolution_test.ts
git commit -m "test: resolution_test — percent→grams for all recipes"
```

---

## Task 6: Port `lib/sourdough.ts` (verbatim, no milk rule yet)

**Files:**
- Create: `lib/sourdough.ts`

Ports `calculateDryAndLiquid.ts`, `SourDoughStarterCalculator.ts`, `IngredientsSort.ts`, `IngredientStarterService.ts`. Sort bug (`flour===50 && flour===50`) is preserved verbatim — it produces correct output accidentally.

- [ ] **Step 1: Create `lib/sourdough.ts`**

```ts
import {
  copyIngredientGramsType,
  copyRecipeIngredientsType,
  IngredientGramsType,
  NutrientPercentType,
  NutritionType,
  RecipeIngredientsType,
} from "./types.ts";

// ── A: Classify ingredients into flour / liquid / other ─────────────────────

interface DryAndLiquidResult {
  ingredients: {
    flour: IngredientGramsType[];
    liquid: IngredientGramsType[];
    other: IngredientGramsType[];
  };
  totals: { flour: number; liquid: number; water: number };
}

const calculateDryAndLiquid = async (ingredients: IngredientGramsType[]): Promise<DryAndLiquidResult> => {
  if (!ingredients) throw new Error("No ingredients defined!");
  const result: DryAndLiquidResult = {
    ingredients: { flour: [], liquid: [], other: [] },
    totals: { flour: 0, liquid: 0, water: 0 },
  };

  for (const ingredient of ingredients) {
    const pct = ingredient.nutrients.reduce(
      (acc, n) => {
        if (n.type === NutritionType.flour) acc.flour += n.percent;
        if (n.type === NutritionType.water) acc.water += n.percent;
        return acc;
      },
      { flour: 0, water: 0 },
    );

    if (pct.flour > 0) {
      result.ingredients.flour.push(ingredient);
      result.totals.flour += ingredient.grams * 100 / pct.flour;
    }
    if (pct.water > 0) {
      const grams = ingredient.grams * 100 / pct.water;
      result.ingredients.liquid.push(ingredient);
      result.totals.liquid += grams;
      if (pct.water === 100) result.totals.water += grams;
    }
    if (pct.flour === 0 && pct.water === 0) result.ingredients.other.push(ingredient);
  }
  return result;
};

// ── B: Decide levain amounts ─────────────────────────────────────────────────

export interface StarterIngredients {
  fridge: number;
  amount: number;
}

export type StarterCalculationResult = {
  starter: { flour: StarterIngredients; liquid: StarterIngredients };
  ingredients: { flour: IngredientGramsType[]; liquid: IngredientGramsType[]; other: IngredientGramsType[] };
};

const calculateStarterFlour = (totalFlour: number): number => {
  const result = Math.floor(totalFlour * 0.02);
  return result > 11 ? 11 : result;
};

export const calculateSourDoughStarter = async (group: RecipeIngredientsType): Promise<StarterCalculationResult> => {
  const dal = await calculateDryAndLiquid(group.ingredients.map(copyIngredientGramsType));
  const flour = Math.floor(dal.totals.flour);
  const water = Math.floor(dal.totals.water);
  const liquid = Math.floor(dal.totals.liquid);
  const fridgeAmt = calculateStarterFlour(dal.totals.flour);

  const result: StarterCalculationResult = {
    starter: {
      flour: { fridge: fridgeAmt, amount: 0 },
      liquid: { fridge: fridgeAmt, amount: 0 },
    },
    ingredients: dal.ingredients,
  };

  if (liquid * 100 / flour < 30) {
    result.starter.flour.amount = Math.floor(liquid);
  } else if (water * 100 / flour > 10 && water * 100 / flour < 40) {
    result.starter.flour.amount = Math.floor(water);
  } else {
    result.starter.flour.amount = Math.floor(flour * 26 / 100);
  }
  result.starter.flour.amount -= fridgeAmt;
  result.starter.liquid.amount = result.starter.flour.amount;

  const hasWholeGrain = dal.ingredients.flour.some((f) =>
    f.nutrients.some((n) => n.type === NutritionType.whole_grain)
  );
  if (hasWholeGrain) {
    result.starter.flour.amount = Math.floor(flour * 50 / 100);
    result.starter.liquid.amount = Math.floor(liquid * 62 / 100);
  }
  return result;
};

// ── C: Sort ingredients ─────────────────────────────────────────────────────

const DISPLAY_ORDER = [
  NutritionType.water,
  NutritionType.flour,
  NutritionType.fat,
  NutritionType.salt,
  NutritionType.sugar,
];

const sortScore = (nutrients: NutrientPercentType[]): number => {
  const maximum = (100 / DISPLAY_ORDER.length) - 2; // 18
  const calc = DISPLAY_ORDER.reduce((acc, t) => { acc[t] = 0; return acc; }, {} as Record<string, number>);
  nutrients.forEach((n) => { if (calc[n.type] !== undefined) calc[n.type] += n.percent; });

  // Preserved verbatim: bug checks flour===50 twice (should check water), but produces correct result
  if (calc[NutritionType.flour] === 50 && calc[NutritionType.flour] === 50) return 0;

  for (let i = 0; i < DISPLAY_ORDER.length; i++) {
    const val = calc[DISPLAY_ORDER[i]];
    if (val > 80) return (val / 100) * (maximum * i);
  }
  return 100;
};

const sortIngredients = (items: IngredientGramsType[]): IngredientGramsType[] =>
  [...items].sort((a, b) => sortScore(a.nutrients) - sortScore(b.nutrients));

const sortGroups = (groups: RecipeIngredientsType[]): RecipeIngredientsType[] =>
  groups.map((g) => ({ ...g, ingredients: sortIngredients(g.ingredients) }));

// ── D: Assign ingredients to levain vs dough ─────────────────────────────────

const remapIngredient = (ing: IngredientGramsType, grams?: number): IngredientGramsType =>
  copyIngredientGramsType(grams !== undefined ? { ...ing, grams } : ing);

const fillSlot = (
  container: IngredientGramsType[],
  starterOut: IngredientGramsType[],
  leftoversOut: IngredientGramsType[],
  slot: StarterIngredients,
): void => {
  let counted = 0;
  for (const ingredient of container) {
    const remaining = slot.amount - counted;
    if (remaining <= 0) {
      leftoversOut.push(remapIngredient(ingredient));
    } else if (remaining <= ingredient.grams) {
      starterOut.push(remapIngredient(ingredient, remaining));
      counted += remaining;
      if (remaining < ingredient.grams) {
        leftoversOut.push(remapIngredient(ingredient, ingredient.grams - remaining - slot.fridge));
      }
    } else {
      starterOut.push(remapIngredient(ingredient, remaining));
      leftoversOut.push(remapIngredient(ingredient, ingredient.grams - remaining));
    }
  }
};

export const splitStarterAndDough = async (
  recipeIngredients: RecipeIngredientsType[],
): Promise<RecipeIngredientsType[]> => {
  if (recipeIngredients.length === 0) return [];
  const cal = await calculateSourDoughStarter(recipeIngredients[0]);
  if (!cal) return [];

  const starterIngredients: IngredientGramsType[] = [{
    id: "starter_from_fridge",
    name: "ingredient.sourdough_starter.name",
    grams: cal.starter.flour.fridge + cal.starter.liquid.fridge,
    nutrients: [
      { type: NutritionType.water, percent: 50 },
      { type: NutritionType.flour, percent: 50 },
    ],
  }];
  const leftovers: IngredientGramsType[] = [];

  fillSlot(cal.ingredients.flour, starterIngredients, leftovers, cal.starter.flour);
  fillSlot(cal.ingredients.liquid, starterIngredients, leftovers, cal.starter.liquid);

  // ── MILK RULE (Task 7 adds this) ───────────────────────────────────────────
  // After filling the liquid slot, if no pure water remains for the dough,
  // all MILK ingredients move from leftovers into the levain.
  // (Implemented in Task 7 after fixtures are updated.)

  const result: RecipeIngredientsType[] = [];
  recipeIngredients.forEach((group, index) => {
    if (index > 0) {
      result.push(copyRecipeIngredientsType(group));
      return;
    }
    const nonStarter: IngredientGramsType[] = [
      ...leftovers.filter((e) => Math.floor(e.grams) > 0),
      ...cal.ingredients.other.filter((e) => Math.floor(e.grams) > 0).map(remapIngredient),
    ];

    if (group.starter) {
      // starter:true path — all ingredients stay together (Pannkook)
      const toAdd = starterIngredients.filter((e) => !nonStarter.find((o) => o.id === e.id));
      const others = group.ingredients
        .map((o) => {
          const inToAdd = toAdd.find((e) => e.id === o.id);
          if (inToAdd) return undefined;
          const inStarter = starterIngredients.find((e) => e.id === o.id);
          if (!inStarter) return remapIngredient(o);
          return remapIngredient(o, o.grams - cal.starter.flour.fridge);
        })
        .filter((x): x is IngredientGramsType => x != null);

      result.push(copyRecipeIngredientsType({
        name: group.name || "ingredients.title.sourdough_starter_dough",
        ingredients: others.length > 0 ? [...toAdd, ...others] : [...toAdd],
        bakingTime: [],
        innerTemperature: null,
        description: null,
        starter: group.starter,
      }));
      return;
    }

    result.push(copyRecipeIngredientsType({
      name: "ingredients.title.sourdough_starter_dough",
      ingredients: starterIngredients,
      bakingTime: [],
      innerTemperature: null,
      description: null,
    }));
    result.push(copyRecipeIngredientsType({
      name: group.name || "ingredients.title.dough",
      ingredients: nonStarter,
      bakingTime: group.bakingTime,
      innerTemperature: group.innerTemperature,
      description: group.description,
    }));
  });

  return sortGroups(result);
};
```

- [ ] **Step 2: Commit**

```bash
git add lib/sourdough.ts
git commit -m "feat: add lib/sourdough.ts (verbatim port, milk rule pending)"
```

---

## Task 7: Update milk-rule fixtures, add milk rule, write sourdough tests

**Files:**
- Modify: `tests/fixtures/croissant.json`
- Modify: `tests/fixtures/vastlakuklid.json`
- Modify: `tests/fixtures/kaneelirullid.json`
- Modify: `tests/fixtures/plaadikook.json`
- Modify: `tests/fixtures/moskva_saiakesed.json`
- Modify: `lib/sourdough.ts` (add milk rule)
- Create: `tests/sourdough_test.ts`

### Why the fixtures change (not the numbers)

For all 5 milk-rule recipes, `microNutrients` and `totalWeight` are **unchanged** — both are computed across all groups flattened, so moving MILK between groups doesn't affect totals. Only the `groups` section changes: MILK moves from the dough group into the levain group. The new levain sort order (stable sort, all water-dominant ingredients score 0, flour scores 18) is:

`Juuretis(0) → WATER(0) → MILK(0) → WHEAT_FLOUR(18)`

- [ ] **Step 1: Update `tests/fixtures/croissant.json`**

Replace the entire file:

```json
{
  "recipe": "Croissant",
  "amount": 1,
  "levainAlgorithm": {
    "condition": "water_10_to_40pct",
    "fridge": 10,
    "flourAmount": 130,
    "liquidAmount": 130
  },
  "groups": [
    {
      "translationKey": "ingredients.title.sourdough_starter_dough",
      "ingredients": [
        { "key": "SOURDOUGH_STARTER",  "grams": 20,  "bakerPercent": 4.00 },
        { "key": "WATER",              "grams": 130, "bakerPercent": 26.00 },
        { "key": "MILK",               "grams": 140, "bakerPercent": 28.00 },
        { "key": "WHEAT_550_FLOUR",    "grams": 130, "bakerPercent": 26.00 }
      ]
    },
    {
      "translationKey": "ingredients.title.dough",
      "ingredients": [
        { "key": "WHEAT_550_FLOUR", "grams": 360, "bakerPercent": 72.00 },
        { "key": "BUTTER",          "grams": 40,  "bakerPercent": 8.00 },
        { "key": "SALT",            "grams": 12,  "bakerPercent": 2.40 },
        { "key": "SUGAR",           "grams": 55,  "bakerPercent": 11.00 }
      ]
    },
    {
      "translationKey": "Kihistamiseks",
      "ingredients": [
        { "key": "BUTTER", "grams": 280, "bakerPercent": 56.00 }
      ]
    }
  ],
  "microNutrients": {
    "dryTotal": 500,
    "water": { "grams": 334.1,  "percent": 66.82 },
    "salt":  { "grams": 12,     "percent": 2.40 },
    "sugar": { "grams": 55,     "percent": 11.00 },
    "fat":   { "grams": 266.3,  "percent": 53.26 }
  },
  "totalWeight": { "dough": 887, "others": 280, "total": 1167 }
}
```

- [ ] **Step 2: Update `tests/fixtures/vastlakuklid.json`**

```json
{
  "recipe": "Vastlakuklid",
  "amount": 18,
  "levainAlgorithm": {
    "condition": "water_10_to_40pct",
    "fridge": 9,
    "flourAmount": 74,
    "liquidAmount": 74
  },
  "groups": [
    {
      "translationKey": "ingredients.title.sourdough_starter_dough",
      "ingredients": [
        { "key": "SOURDOUGH_STARTER", "grams": 18,  "bakerPercent": 3.73 },
        { "key": "WATER",             "grams": 74,  "bakerPercent": 15.32 },
        { "key": "MILK",              "grams": 210, "bakerPercent": 43.48 },
        { "key": "WHEAT_405_FLOUR",   "grams": 74,  "bakerPercent": 15.32 }
      ]
    },
    {
      "translationKey": "ingredients.title.dough",
      "bakingTime": [
        { "steam": false, "time": { "from": 20, "until": 25 }, "temperature": { "from": 180, "until": 180 } }
      ],
      "innerTemperature": { "from": 82, "until": 88 },
      "ingredients": [
        { "key": "WHEAT_405_FLOUR", "grams": 400, "bakerPercent": 82.82 },
        { "key": "BUTTER",          "grams": 75,  "bakerPercent": 15.53 },
        { "key": "SALT",            "grams": 5,   "bakerPercent": 1.04 },
        { "key": "SUGAR_BROWN",     "grams": 50,  "bakerPercent": 10.35 },
        { "key": "CARDAMOM",        "grams": 1,   "bakerPercent": 0.21 }
      ]
    }
  ],
  "microNutrients": {
    "dryTotal": 483,
    "water":  { "grams": 301.25, "percent": 62.37 },
    "salt":   { "grams": 5,      "percent": 1.04 },
    "sugar":  { "grams": 50,     "percent": 10.35 },
    "fat":    { "grams": 67.38,  "percent": 13.95 }
  },
  "totalWeight": { "dough": 907, "others": 0, "total": 907 }
}
```

- [ ] **Step 3: Update `tests/fixtures/kaneelirullid.json`**

```json
{
  "recipe": "Kaneelirullid",
  "amount": 1,
  "levainAlgorithm": {
    "condition": "water_10_to_40pct",
    "fridge": 9,
    "flourAmount": 74,
    "liquidAmount": 74
  },
  "groups": [
    {
      "translationKey": "ingredients.title.sourdough_starter_dough",
      "ingredients": [
        { "key": "SOURDOUGH_STARTER", "grams": 18,  "bakerPercent": 3.73 },
        { "key": "WATER",             "grams": 74,  "bakerPercent": 15.32 },
        { "key": "MILK",              "grams": 210, "bakerPercent": 43.48 },
        { "key": "WHEAT_405_FLOUR",   "grams": 74,  "bakerPercent": 15.32 }
      ]
    },
    {
      "translationKey": "ingredients.title.dough",
      "bakingTime": [
        { "steam": false, "time": { "from": 20, "until": 25 }, "temperature": { "from": 210, "until": 210 } }
      ],
      "innerTemperature": { "from": 82, "until": 88 },
      "ingredients": [
        { "key": "WHEAT_405_FLOUR", "grams": 400, "bakerPercent": 82.82 },
        { "key": "BUTTER",          "grams": 75,  "bakerPercent": 15.53 },
        { "key": "SALT",            "grams": 5,   "bakerPercent": 1.04 },
        { "key": "SUGAR_BROWN",     "grams": 50,  "bakerPercent": 10.35 },
        { "key": "CARDAMOM",        "grams": 1,   "bakerPercent": 0.21 }
      ]
    },
    {
      "translationKey": "Kaanelikiht",
      "ingredients": [
        { "key": "CINNAMON",  "grams": 15.8, "bakerPercent": 3.27 },
        { "key": "BUTTER",    "grams": 112,  "bakerPercent": 23.19 },
        { "key": "SALT",      "grams": 1,    "bakerPercent": 0.21 },
        { "key": "SUGAR",     "grams": 95,   "bakerPercent": 19.67 }
      ]
    }
  ],
  "microNutrients": {
    "dryTotal": 483,
    "water":  { "grams": 321.41, "percent": 66.54 },
    "salt":   { "grams": 6,      "percent": 1.24 },
    "sugar":  { "grams": 145,    "percent": 30.02 },
    "fat":    { "grams": 159.22, "percent": 32.96 }
  },
  "totalWeight": { "dough": 907, "others": 223.8, "total": 1130.8 }
}
```

- [ ] **Step 4: Update `tests/fixtures/plaadikook.json`**

```json
{
  "recipe": "Plaadikook",
  "amount": 1,
  "levainAlgorithm": {
    "condition": "water_10_to_40pct",
    "fridge": 11,
    "flourAmount": 112,
    "liquidAmount": 112
  },
  "groups": [
    {
      "translationKey": "ingredients.title.sourdough_starter_dough",
      "ingredients": [
        { "key": "SOURDOUGH_STARTER", "grams": 22,  "bakerPercent": 2.72 },
        { "key": "WATER",             "grams": 112, "bakerPercent": 13.86 },
        { "key": "MILK",              "grams": 385, "bakerPercent": 47.65 },
        { "key": "WHEAT_550_FLOUR",   "grams": 112, "bakerPercent": 13.86 }
      ]
    },
    {
      "translationKey": "ingredients.title.dough",
      "bakingTime": [
        { "steam": false, "time": { "from": 20, "until": 30 }, "temperature": { "from": 210, "until": 210 } }
      ],
      "innerTemperature": { "from": 82, "until": 88 },
      "ingredients": [
        { "key": "WHEAT_550_FLOUR", "grams": 685, "bakerPercent": 84.78 },
        { "key": "BUTTER",          "grams": 200, "bakerPercent": 24.75 },
        { "key": "SALT",            "grams": 7.5, "bakerPercent": 0.93 }
      ]
    }
  ],
  "microNutrients": {
    "dryTotal": 808,
    "water":  { "grams": 534.375, "percent": 66.14 },
    "salt":   { "grams": 7.5,     "percent": 0.93 },
    "fat":    { "grams": 174.78,  "percent": 21.63 }
  },
  "totalWeight": { "dough": 1523.5, "others": 0, "total": 1523.5 }
}
```

- [ ] **Step 5: Update `tests/fixtures/moskva_saiakesed.json`**

```json
{
  "recipe": "Moskva saiakesed",
  "amount": 1,
  "levainAlgorithm": {
    "condition": "water_10_to_40pct",
    "fridge": 8,
    "flourAmount": 122,
    "liquidAmount": 122
  },
  "groups": [
    {
      "translationKey": "ingredients.title.sourdough_starter_dough",
      "ingredients": [
        { "key": "SOURDOUGH_STARTER", "grams": 16,  "bakerPercent": 3.92 },
        { "key": "WATER",             "grams": 122, "bakerPercent": 29.90 },
        { "key": "MILK",              "grams": 140, "bakerPercent": 34.31 },
        { "key": "WHEAT_405_FLOUR",   "grams": 122, "bakerPercent": 29.90 }
      ]
    },
    {
      "translationKey": "ingredients.title.dough",
      "bakingTime": [
        { "steam": false, "time": { "from": 20, "until": 25 }, "temperature": { "from": 180, "until": 180 } }
      ],
      "innerTemperature": { "from": 82, "until": 88 },
      "ingredients": [
        { "key": "WHEAT_405_FLOUR", "grams": 278, "bakerPercent": 68.14 },
        { "key": "BUTTER",          "grams": 50,  "bakerPercent": 12.25 },
        { "key": "SALT",            "grams": 2,   "bakerPercent": 0.49 },
        { "key": "SUGAR_BROWN",     "grams": 16,  "bakerPercent": 3.92 }
      ]
    },
    {
      "translationKey": "Kihistamiseks",
      "ingredients": [
        { "key": "BUTTER", "grams": 100, "bakerPercent": 24.51 }
      ]
    }
  ],
  "microNutrients": {
    "dryTotal": 408,
    "water":  { "grams": 293.5,  "percent": 71.94 },
    "salt":   { "grams": 2,      "percent": 0.49 },
    "sugar":  { "grams": 16,     "percent": 3.92 },
    "fat":    { "grams": 126.92, "percent": 31.11 }
  },
  "totalWeight": { "dough": 746, "others": 100, "total": 846 }
}
```

- [ ] **Step 6: Add milk rule to `lib/sourdough.ts`**

Find the comment `// ── MILK RULE (Task 7 adds this) ───` in `splitStarterAndDough` and replace the comment block with:

```ts
  // Milk rule: if all pure WATER was consumed (leftover = 0), move MILK to levain
  const waterIngredients = cal.ingredients.liquid.filter((i) =>
    i.nutrients.every((n) => n.type !== NutritionType.flour) &&
    i.nutrients.some((n) => n.type === NutritionType.water && n.percent === 100)
  );
  const milkIngredients = cal.ingredients.liquid.filter((i) =>
    i.nutrients.some((n) => n.type === NutritionType.water && n.percent < 100 && n.percent > 50)
  );
  const waterConsumedFully = waterIngredients.some((waterIng) => {
    // leftover = grams - liquidSlotAmount - fridge = 0
    return Math.floor(waterIng.grams - cal.starter.liquid.amount - cal.starter.liquid.fridge) === 0;
  });
  if (waterConsumedFully && milkIngredients.length > 0 && !recipeIngredients[0].starter) {
    for (const milkIng of milkIngredients) {
      const idx = leftovers.findIndex((l) => l.id === milkIng.id);
      if (idx !== -1) {
        starterIngredients.push(leftovers.splice(idx, 1)[0]);
      }
    }
  }
```

- [ ] **Step 7: Create `tests/sourdough_test.ts`**

```ts
import { assertEquals, assertAlmostEquals } from "@std/assert";
import { readJsonRecipe } from "../lib/resolution.ts";
import { splitStarterAndDough } from "../lib/sourdough.ts";
import { PREDEFINED_RECIPES } from "../lib/recipes.ts";

interface FixtureIngredient { key: string; grams: number; bakerPercent: number }
interface FixtureGroup { translationKey: string; ingredients: FixtureIngredient[] }
interface Fixture {
  recipe: string;
  levainAlgorithm: { condition: string; fridge: number; flourAmount: number; liquidAmount: number };
  groups: FixtureGroup[];
}

const FIXTURES_DIR = "tests/fixtures";

const ingredientKey = (ing: { id: string; type?: string }): string =>
  ing.id === "starter_from_fridge" ? "SOURDOUGH_STARTER" : (ing.type ?? ing.id);

Deno.test("sourdough: split matches fixtures for all 11 recipes", async () => {
  for (const jsonRecipe of PREDEFINED_RECIPES) {
    const recipe = readJsonRecipe(jsonRecipe);
    const fixturePath = `${FIXTURES_DIR}/${recipe.name
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "")}.json`;

    let fixture: Fixture;
    try {
      fixture = JSON.parse(await Deno.readTextFile(fixturePath));
    } catch {
      console.warn(`Fixture not found: ${fixturePath}, skipping`);
      continue;
    }

    const split = await splitStarterAndDough(recipe.ingredients);

    assertEquals(
      split.length, fixture.groups.length,
      `${recipe.name}: expected ${fixture.groups.length} groups, got ${split.length}`,
    );

    for (let gi = 0; gi < fixture.groups.length; gi++) {
      const fixtureGroup = fixture.groups[gi];
      const splitGroup = split[gi];

      assertEquals(
        splitGroup.ingredients.length, fixtureGroup.ingredients.length,
        `${recipe.name} group[${gi}]: expected ${fixtureGroup.ingredients.length} ingredients, got ${splitGroup.ingredients.length}`,
      );

      for (let ii = 0; ii < fixtureGroup.ingredients.length; ii++) {
        const fi = fixtureGroup.ingredients[ii];
        const si = splitGroup.ingredients[ii];
        const key = ingredientKey(si);

        assertEquals(key, fi.key, `${recipe.name} group[${gi}][${ii}]: key mismatch`);
        assertAlmostEquals(
          si.grams, fi.grams, 0.1,
          `${recipe.name} ${fi.key}: expected ${fi.grams}g, got ${si.grams}g`,
        );
      }
    }
  }
});
```

- [ ] **Step 8: Run sourdough tests**

```bash
deno task test tests/sourdough_test.ts
```

Expected: all pass. If a fixture filename doesn't match, check the name normalization logic.

- [ ] **Step 9: Commit**

```bash
git add tests/fixtures/ lib/sourdough.ts tests/sourdough_test.ts
git commit -m "feat: implement milk rule in sourdough.ts, update 5 fixtures, add sourdough tests"
```

---

## Task 8: Port `lib/baker-percent.ts` and write remaining tests

**Files:**
- Create: `lib/baker-percent.ts`
- Create: `tests/baker_percent_test.ts`
- Create: `tests/total_weight_test.ts`

- [ ] **Step 1: Create `lib/baker-percent.ts`**

```ts
import {
  BakerPercentageResult,
  copyBakingTimeType,
  copyIngredientGramsType,
  copyNutrientPercentType,
  copyNumberIntervalType,
  DISPLAYABLE_NUTRIENTS_TYPE_ARRAY,
  DRY_NUTRIENTS,
  IngredientWithPercentType,
  MicroNutrientsResultType,
  MicroNutrientsValueType,
  NutritionType,
  RecipeIngredientsType,
  RecipeIngredientsWithPercentType,
} from "./types.ts";

export const calculateMicroNutrients = (recipeIngredients: RecipeIngredientsType[]): MicroNutrientsResultType => {
  const result = recipeIngredients
    .flatMap((g) => g.ingredients)
    .reduce(
      (total, ingredient) => {
        total.dry_total += ingredient.nutrients.reduce((maxDry, nutrient) => {
          const grams = nutrient.percent > 0 && ingredient.grams > 0
            ? ingredient.grams * nutrient.percent / 100
            : 0;
          if (grams <= 0) return maxDry;

          const existing = total.nutrients[nutrient.type];
          total.nutrients[nutrient.type] = {
            grams: (existing?.grams ?? 0) + grams,
            percent: 0,
            type: nutrient.type,
          } as MicroNutrientsValueType;

          return DRY_NUTRIENTS.includes(nutrient.type) ? Math.max(grams, maxDry) : maxDry;
        }, 0);
        return total;
      },
      { dry_total: 0, nutrients: {} } as MicroNutrientsResultType,
    );

  if (result.dry_total > 0) {
    for (const nutrient of Object.values(result.nutrients) as MicroNutrientsValueType[]) {
      nutrient.percent = nutrient.grams * 100 / result.dry_total;
    }
  }
  return result;
};

export const recalculateBakerPercentage = (ingredients: RecipeIngredientsType[]): BakerPercentageResult => {
  const microNutrients = calculateMicroNutrients(ingredients);
  const percentages: RecipeIngredientsWithPercentType[] = ingredients.map((group) => {
    const ingredientWithPercent: IngredientWithPercentType[] = group.ingredients.map((ing) => ({
      id: ing.id,
      name: ing.name,
      type: ing.type,
      nutrients: ing.nutrients.map(copyNutrientPercentType),
      grams: ing.grams,
      percent: microNutrients.dry_total > 0 && ing.grams > 0
        ? ing.grams * 100 / microNutrients.dry_total
        : 0,
    }));
    return {
      name: group.name,
      starter: group.starter,
      description: group.description,
      ingredients: group.ingredients.map(copyIngredientGramsType),
      bakingTime: group.bakingTime.map(copyBakingTimeType),
      innerTemperature: group.innerTemperature ? copyNumberIntervalType(group.innerTemperature) : null,
      ingredientWithPercent,
    } as RecipeIngredientsWithPercentType;
  });
  return { microNutrients, ingredients: percentages };
};

export const DISPLAYABLE_NUTRIENTS = DISPLAYABLE_NUTRIENTS_TYPE_ARRAY;
```

- [ ] **Step 2: Create `tests/baker_percent_test.ts`**

```ts
import { assertAlmostEquals } from "@std/assert";
import { readJsonRecipe } from "../lib/resolution.ts";
import { splitStarterAndDough } from "../lib/sourdough.ts";
import { recalculateBakerPercentage } from "../lib/baker-percent.ts";
import { PREDEFINED_RECIPES } from "../lib/recipes.ts";
import { NutritionType } from "../lib/types.ts";

interface FixtureMicro {
  dryTotal: number;
  water?: { grams: number; percent: number };
  salt?: { grams: number; percent: number };
  sugar?: { grams: number; percent: number };
  fat?: { grams: number; percent: number };
}
interface Fixture { recipe: string; microNutrients: FixtureMicro }

const fixtureFile = (name: string) =>
  `tests/fixtures/${name.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "")}.json`;

Deno.test("baker-percent: micro nutrients match fixtures for all 11 recipes", async () => {
  for (const jsonRecipe of PREDEFINED_RECIPES) {
    const recipe = readJsonRecipe(jsonRecipe);
    let fixture: Fixture;
    try {
      fixture = JSON.parse(await Deno.readTextFile(fixtureFile(recipe.name)));
    } catch { continue; }

    const split = await splitStarterAndDough(recipe.ingredients);
    const result = recalculateBakerPercentage(split);
    const mn = result.microNutrients;
    const fm = fixture.microNutrients;

    assertAlmostEquals(mn.dry_total, fm.dryTotal, 0.5, `${recipe.name}: dryTotal`);

    const check = (type: NutritionType, expected?: { grams: number; percent: number }) => {
      if (!expected) return;
      const actual = mn.nutrients[type];
      if (!actual) throw new Error(`${recipe.name}: missing ${type} in microNutrients`);
      assertAlmostEquals(actual.grams, expected.grams, 0.1, `${recipe.name} ${type}.grams`);
      assertAlmostEquals(actual.percent, expected.percent, 0.1, `${recipe.name} ${type}.percent`);
    };

    check(NutritionType.water, fm.water);
    check(NutritionType.salt, fm.salt);
    check(NutritionType.sugar, fm.sugar);
    check(NutritionType.fat, fm.fat);
  }
});

Deno.test("baker-percent: ingredient baker% matches fixtures", async () => {
  for (const jsonRecipe of PREDEFINED_RECIPES) {
    const recipe = readJsonRecipe(jsonRecipe);
    let fixture: { recipe: string; groups: Array<{ ingredients: Array<{ key: string; bakerPercent: number }> }> };
    try {
      fixture = JSON.parse(await Deno.readTextFile(fixtureFile(recipe.name)));
    } catch { continue; }

    const split = await splitStarterAndDough(recipe.ingredients);
    const result = recalculateBakerPercentage(split);

    for (let gi = 0; gi < fixture.groups.length; gi++) {
      for (let ii = 0; ii < fixture.groups[gi].ingredients.length; ii++) {
        const fi = fixture.groups[gi].ingredients[ii];
        const si = result.ingredients[gi]?.ingredientWithPercent[ii];
        if (!si) continue;
        assertAlmostEquals(
          si.percent, fi.bakerPercent, 0.1,
          `${recipe.name} group[${gi}][${ii}] ${fi.key}: expected ${fi.bakerPercent}%, got ${si.percent}%`,
        );
      }
    }
  }
});
```

- [ ] **Step 3: Create `tests/total_weight_test.ts`**

```ts
import { assertAlmostEquals } from "@std/assert";
import { readJsonRecipe } from "../lib/resolution.ts";
import { splitStarterAndDough } from "../lib/sourdough.ts";
import { PREDEFINED_RECIPES } from "../lib/recipes.ts";

interface Fixture { recipe: string; totalWeight: { dough: number; others: number; total: number } }

const fixtureFile = (name: string) =>
  `tests/fixtures/${name.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "")}.json`;

Deno.test("total-weight: dough/others/total match fixtures", async () => {
  for (const jsonRecipe of PREDEFINED_RECIPES) {
    const recipe = readJsonRecipe(jsonRecipe);
    let fixture: Fixture;
    try {
      fixture = JSON.parse(await Deno.readTextFile(fixtureFile(recipe.name)));
    } catch { continue; }

    const split = await splitStarterAndDough(recipe.ingredients);

    // groups[0] and groups[1] are the levain + dough from splitting the first recipe group
    // groups[2+] are secondary groups (lamination etc.) → "others"
    const doughGroups = split.slice(0, recipe.ingredients[0].starter ? 1 : 2);
    const otherGroups = split.slice(recipe.ingredients[0].starter ? 1 : 2);

    const sumGrams = (groups: typeof split) =>
      groups.flatMap((g) => g.ingredients).reduce((s, i) => s + i.grams, 0);

    const doughWeight = sumGrams(doughGroups);
    const othersWeight = sumGrams(otherGroups);
    const totalWeight = doughWeight + othersWeight;

    assertAlmostEquals(doughWeight, fixture.totalWeight.dough, 0.5, `${recipe.name}: dough weight`);
    assertAlmostEquals(othersWeight, fixture.totalWeight.others, 0.5, `${recipe.name}: others weight`);
    assertAlmostEquals(totalWeight, fixture.totalWeight.total, 0.5, `${recipe.name}: total weight`);
  }
});
```

- [ ] **Step 4: Run all tests**

```bash
deno task test
```

Expected: all tests in resolution_test, sourdough_test, baker_percent_test, total_weight_test pass.

- [ ] **Step 5: Commit**

```bash
git add lib/baker-percent.ts tests/baker_percent_test.ts tests/total_weight_test.ts
git commit -m "feat: add lib/baker-percent.ts and full test suite"
```

---

## Task 9: Implement `lib/i18n.ts` and `lib/url.ts`

**Files:**
- Create: `lib/i18n.ts`
- Create: `lib/url.ts`

- [ ] **Step 1: Create `lib/i18n.ts`**

```ts
import { signal } from "@preact/signals";
import ee from "../locales/ee.json" with { type: "json" };
import gb from "../locales/gb.json" with { type: "json" };

export type Language = "ee" | "gb";

export const language = signal<Language>("ee");

export const t = (key: string, vars?: Record<string, string | number>): string => {
  const parts = key.split(".");
  let node: unknown = language.value === "ee" ? ee : gb;
  for (const part of parts) node = (node as Record<string, unknown>)?.[part];
  let out = typeof node === "string" ? node : key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      out = out.replace(`{{${k}}}`, String(v));
    }
  }
  return out;
};
```

- [ ] **Step 2: Create `lib/url.ts`**

```ts
import { signal, effect } from "@preact/signals";

const PARAM = "r";

export const parseUrlIds = (): Set<string> => {
  if (typeof globalThis.location === "undefined") return new Set();
  const raw = new URLSearchParams(globalThis.location.search).get(PARAM);
  if (!raw) return new Set();
  try {
    const decoded = atob(raw);
    return new Set(decoded.split(",").filter(Boolean));
  } catch {
    return new Set();
  }
};

export const encodeIds = (ids: Set<string>): string => btoa([...ids].join(","));

export const syncUrlEffect = (selectedIds: ReturnType<typeof signal<Set<string>>>) => {
  effect(() => {
    if (typeof globalThis.history === "undefined") return;
    const ids = selectedIds.value;
    const url = new URL(globalThis.location.href);
    if (ids.size === 0) {
      url.searchParams.delete(PARAM);
    } else {
      url.searchParams.set(PARAM, encodeIds(ids));
    }
    globalThis.history.replaceState(null, "", url.toString());
  });
};
```

- [ ] **Step 3: Commit**

```bash
git add lib/i18n.ts lib/url.ts
git commit -m "feat: add lib/i18n.ts and lib/url.ts"
```

---

## Task 10: Implement `lib/state.ts`

**Files:**
- Create: `lib/state.ts`

- [ ] **Step 1: Create `lib/state.ts`**

```ts
import { computed, effect, signal } from "@preact/signals";
import {
  BakerPercentageAwareRecipe,
  copyRecipeType,
  RecipeIngredientsType,
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
  copied.name = `Koopia — ${recipe.name}`;
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
  if (!recipe || recipe.name === name) return;
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
    // Default: select first recipe
    const first = allRecipes.value[0];
    if (first) selectedIds.value = new Set([first.id]);
  }
  syncUrlEffect(selectedIds);
};

export const recipeToJsonExport = recipeToJson;
```

- [ ] **Step 2: Commit**

```bash
git add lib/state.ts
git commit -m "feat: add lib/state.ts with Preact Signals"
```

---

## Task 11: Build `routes/index.tsx` and `components/Toast.tsx`

**Files:**
- Modify: `routes/index.tsx`
- Create: `components/Toast.tsx`

- [ ] **Step 1: Create `components/Toast.tsx`**

```tsx
import { useSignal, useSignalEffect } from "@preact/signals";
import { toast } from "../lib/state.ts";

export default function Toast() {
  const visible = useSignal(false);
  const msg = useSignal("");

  useSignalEffect(() => {
    const t = toast.value;
    if (!t) return;
    msg.value = t.msg;
    visible.value = true;
    const timer = setTimeout(() => { visible.value = false; }, 3000);
    return () => clearTimeout(timer);
  });

  return (
    <div
      class={`toast toast-bottom toast-center transition-opacity duration-300 print:hidden ${
        visible.value ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div class="alert alert-success">
        <span>{msg.value}</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Update `routes/index.tsx`**

```tsx
import RecipeNavigation from "../islands/RecipeNavigation.tsx";
import RecipeList from "../islands/RecipeList.tsx";
import Toast from "../components/Toast.tsx";

export default function Home() {
  return (
    <html lang="et">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Pagari protsendi kalkulaator</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body class="bg-base-100 min-h-screen">
        <div class="drawer lg:drawer-open">
          <input id="nav-drawer" type="checkbox" class="drawer-toggle" />
          <div class="drawer-content flex flex-col">
            {/* Mobile nav toggle */}
            <div class="navbar bg-base-200 lg:hidden print:hidden">
              <label for="nav-drawer" class="btn btn-ghost drawer-button">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </label>
              <span class="text-lg font-semibold">Pagari %</span>
            </div>
            <main class="p-4">
              <RecipeList />
            </main>
          </div>
          <div class="drawer-side print:hidden">
            <label for="nav-drawer" class="drawer-overlay"></label>
            <RecipeNavigation />
          </div>
        </div>
        <Toast />
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add routes/index.tsx components/Toast.tsx
git commit -m "feat: add routes/index.tsx shell and Toast component"
```

---

## Task 12: Build `islands/RecipeNavigation.tsx`

**Files:**
- Create: `islands/RecipeNavigation.tsx`

- [ ] **Step 1: Create `islands/RecipeNavigation.tsx`**

```tsx
import { useSignal } from "@preact/signals";
import {
  allRecipes,
  initUrlSync,
  language,
  selectAll,
  selectNone,
  selectedIds,
  toggleSelected,
} from "../lib/state.ts";
import { t } from "../lib/i18n.ts";
import { useEffect } from "preact/hooks";

export default function RecipeNavigation() {
  useEffect(() => {
    initUrlSync();
  }, []);

  const allSelected = allRecipes.value.every((r) => selectedIds.value.has(r.id));
  const selectedCount = selectedIds.value.size;

  return (
    <ul class="menu bg-base-200 min-h-full w-64 p-4 gap-1">
      <li class="menu-title flex flex-row justify-between items-center">
        <span class="text-lg font-bold">🍞 Pagari %</span>
        <div class="flex gap-1">
          <button
            class={`btn btn-xs ${language.value === "ee" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => { language.value = "ee"; }}
          >
            🇪🇪
          </button>
          <button
            class={`btn btn-xs ${language.value === "gb" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => { language.value = "gb"; }}
          >
            🇬🇧
          </button>
        </div>
      </li>

      <li>
        <label class="cursor-pointer flex items-center gap-2">
          <input
            type="checkbox"
            class="checkbox checkbox-sm"
            checked={allSelected}
            onChange={() => allSelected ? selectNone() : selectAll()}
          />
          <span class="text-sm font-medium">
            {selectedCount > 0 ? `${selectedCount} valitud` : "Vali kõik"}
          </span>
        </label>
      </li>

      <div class="divider my-1" />

      {allRecipes.value.map((recipe) => (
        <li key={recipe.id}>
          <label class="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              class="checkbox checkbox-sm"
              checked={selectedIds.value.has(recipe.id)}
              onChange={() => toggleSelected(recipe.id)}
            />
            <span class="text-sm">
              {t(recipe.name) !== recipe.name ? t(recipe.name) : recipe.name}
              {recipe.amount > 1 && <span class="text-xs text-base-content/60 ml-1">×{recipe.amount}</span>}
            </span>
          </label>
        </li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add islands/RecipeNavigation.tsx
git commit -m "feat: add RecipeNavigation island"
```

---

## Task 13: Build `islands/RecipeCard.tsx` and `islands/RecipeList.tsx`

**Files:**
- Create: `islands/RecipeCard.tsx`
- Create: `islands/RecipeList.tsx`

- [ ] **Step 1: Create `islands/RecipeCard.tsx`**

```tsx
import { BakerPercentageAwareRecipe, DISPLAYABLE_NUTRIENTS_TYPE_ARRAY, NutritionType } from "../lib/types.ts";
import { t } from "../lib/i18n.ts";
import { copyRecipe, editingRecipe } from "../lib/state.ts";
import EditRecipeDialog from "./EditRecipeDialog.tsx";

const fmt = (n: number) => Math.round(n);
const fmtPct = (n: number) => n.toFixed(2);

const intervalStr = (iv: { from: number; until: number }) =>
  iv.from === iv.until ? `${iv.from}` : `${iv.from}–${iv.until}`;

type Props = { recipe: BakerPercentageAwareRecipe };

export default function RecipeCard({ recipe }: Props) {
  const bp = recipe.bakerPercentage;
  const isEditing = editingRecipe.value?.id === recipe.id;

  return (
    <div class="card card-bordered bg-base-100 shadow-sm print:break-inside-avoid print:break-after-page">
      {/* Header */}
      <div class="card-body pb-2 pt-4">
        <div class="flex justify-between items-start">
          <div>
            <h2 class="card-title text-lg">{recipe.name}</h2>
            {recipe.amount > 1 && (
              <p class="text-sm text-base-content/60">×{recipe.amount} portsjonit</p>
            )}
            {recipe.description && (
              <p class="text-sm text-base-content/70 mt-1">{recipe.description}</p>
            )}
          </div>
          <div class="flex gap-1 print:hidden">
            <button
              class="btn btn-sm btn-outline"
              onClick={() => { editingRecipe.value = recipe; }}
            >
              {t("edit.edit")}
            </button>
            <button
              class="btn btn-sm btn-ghost"
              onClick={() => copyRecipe(recipe)}
            >
              {t("edit.copyOf")}
            </button>
          </div>
        </div>
      </div>

      {/* Ingredient groups */}
      {bp && bp.ingredients.map((group, gi) => (
        <div key={gi} class="px-4 pb-3">
          {group.name && (
            <p class="text-xs font-semibold uppercase tracking-wide text-base-content/50 mb-1">
              {t(group.name) !== group.name ? t(group.name) : group.name}
            </p>
          )}
          <table class="table table-xs w-full">
            <thead>
              <tr>
                <th>{t("ingredients.title.baker_percentage")}</th>
                <th class="text-right">g</th>
                <th class="text-right">%</th>
              </tr>
            </thead>
            <tbody>
              {group.ingredientWithPercent.map((ing, ii) => (
                <tr key={ii}>
                  <td>{t(ing.name) !== ing.name ? t(ing.name) : ing.name}</td>
                  <td class="text-right tabular-nums">{fmt(ing.grams)}</td>
                  <td class="text-right tabular-nums">{fmtPct(ing.percent)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {/* Micro nutrients */}
      {bp && (
        <div class="px-4 pb-3">
          <div class="divider my-1 text-xs">Mikro</div>
          <div class="flex flex-wrap gap-2 text-xs">
            <span class="badge badge-outline">Kuiv {fmt(bp.microNutrients.dry_total)}g</span>
            {DISPLAYABLE_NUTRIENTS_TYPE_ARRAY.map((type) => {
              const n = bp.microNutrients.nutrients[type];
              if (!n || n.grams < 0.1) return null;
              return (
                <span key={type} class="badge badge-outline">
                  {t(`ingredients.title.${type}`) || type} {fmt(n.grams)}g ({fmtPct(n.percent)}%)
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Baking info */}
      {(recipe.bakingTime.length > 0 || recipe.innerTemperature) && (
        <div class="px-4 pb-4">
          <div class="divider my-1 text-xs">Küpsetamine</div>
          <div class="text-sm space-y-1">
            {recipe.bakingTime.map((bt, i) => (
              <p key={i}>
                {bt.steam ? t("baking_instructions.steam", {
                  minutes: intervalStr(bt.time),
                  temperature: intervalStr(bt.temperature),
                }) : t("baking_instructions.bake", {
                  minutes: intervalStr(bt.time),
                  temperature: intervalStr(bt.temperature),
                })}
              </p>
            ))}
            {recipe.innerTemperature && (
              <p class="text-base-content/70">
                {t("baking_instructions.inner_temperature", {
                  temperature: intervalStr(recipe.innerTemperature),
                })}
              </p>
            )}
          </div>
        </div>
      )}

      {isEditing && <EditRecipeDialog recipe={recipe} />}
    </div>
  );
}
```

- [ ] **Step 2: Create `islands/RecipeList.tsx`**

```tsx
import { bakerResults, selectedIds } from "../lib/state.ts";
import { allRecipes } from "../lib/state.ts";
import RecipeCard from "./RecipeCard.tsx";

export default function RecipeList() {
  const selected = allRecipes.value.filter((r) => selectedIds.value.has(r.id));

  if (selected.length === 0) {
    return (
      <div class="flex items-center justify-center h-64 text-base-content/40">
        <p>Vali vasakult retsept, mida kuvada</p>
      </div>
    );
  }

  return (
    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      {selected.map((recipe) => {
        const result = bakerResults.value.get(recipe.id);
        if (!result) return null;
        return <RecipeCard key={recipe.id} recipe={result} />;
      })}
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add islands/RecipeCard.tsx islands/RecipeList.tsx
git commit -m "feat: add RecipeCard and RecipeList islands"
```

---

## Task 14: Build `islands/EditRecipeDialog.tsx`

**Files:**
- Create: `islands/EditRecipeDialog.tsx`

- [ ] **Step 1: Create `islands/EditRecipeDialog.tsx`**

```tsx
import { useSignal } from "@preact/signals";
import { BakerPercentageAwareRecipe, copyRecipeType, RecipeType } from "../lib/types.ts";
import {
  addImportedRecipe,
  editingRecipe,
  recipeToJsonExport,
  setIngredientGrams,
  setRecipeAmount,
  setRecipeName,
} from "../lib/state.ts";
import { readJsonRecipe } from "../lib/resolution.ts";
import { t } from "../lib/i18n.ts";

type Tab = "edit" | "json" | "import";

type Props = { recipe: BakerPercentageAwareRecipe };

export default function EditRecipeDialog({ recipe }: Props) {
  const activeTab = useSignal<Tab>("edit");
  const importText = useSignal("");
  const importError = useSignal("");

  const close = () => { editingRecipe.value = null; };

  const handleImport = () => {
    importError.value = "";
    try {
      const parsed = JSON.parse(importText.value);
      if (!parsed.name || !Array.isArray(parsed.ingredients)) {
        importError.value = "Vigane JSON formaat — name ja ingredients on kohustuslikud";
        return;
      }
      const resolved = readJsonRecipe(parsed);
      addImportedRecipe(resolved);
      close();
    } catch (e) {
      importError.value = `JSON viga: ${e instanceof Error ? e.message : String(e)}`;
    }
  };

  return (
    <dialog class="modal modal-open" onClick={(e) => e.target === e.currentTarget && close()}>
      <div class="modal-box max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-bold text-lg">{recipe.name}</h3>
          <button class="btn btn-sm btn-circle btn-ghost" onClick={close}>✕</button>
        </div>

        {/* Tabs */}
        <div role="tablist" class="tabs tabs-bordered mb-4">
          {(["edit", "json", "import"] as Tab[]).map((tab) => (
            <button
              key={tab}
              role="tab"
              class={`tab ${activeTab.value === tab ? "tab-active" : ""}`}
              onClick={() => { activeTab.value = tab; }}
            >
              {tab === "edit" ? t("edit.edit") : tab === "json" ? "JSON" : "Import"}
            </button>
          ))}
        </div>

        {/* Edit tab */}
        {activeTab.value === "edit" && (
          <div class="space-y-4">
            <div class="form-control">
              <label class="label"><span class="label-text">Nimi</span></label>
              <input
                class="input input-bordered input-sm"
                value={recipe.name}
                onInput={(e) => setRecipeName(recipe.id, (e.target as HTMLInputElement).value)}
              />
            </div>
            <div class="form-control">
              <label class="label"><span class="label-text">{t("edit.amount.title")}</span></label>
              <input
                type="number"
                class="input input-bordered input-sm w-24"
                value={recipe.amount}
                min={1}
                onInput={(e) => setRecipeAmount(recipe.id, Number((e.target as HTMLInputElement).value))}
              />
            </div>

            {recipe.ingredients.map((group, gi) => (
              <div key={gi} class="border border-base-300 rounded-lg p-3">
                {group.name && (
                  <p class="text-xs font-semibold uppercase text-base-content/50 mb-2">
                    {t(group.name) || group.name}
                  </p>
                )}
                <table class="table table-xs w-full">
                  <thead>
                    <tr>
                      <th>Koostisosa</th>
                      <th class="text-right">Gramm</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.ingredients.map((ing, ii) => (
                      <tr key={ii}>
                        <td>{t(ing.name) !== ing.name ? t(ing.name) : ing.name}</td>
                        <td class="text-right">
                          <input
                            type="number"
                            class="input input-bordered input-xs w-20 text-right"
                            value={ing.grams}
                            min={0}
                            step={0.5}
                            onInput={(e) =>
                              setIngredientGrams(
                                recipe.id, gi, ii,
                                Number((e.target as HTMLInputElement).value),
                              )}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}

        {/* JSON export tab */}
        {activeTab.value === "json" && (
          <div>
            <details class="collapse collapse-arrow border border-base-300">
              <summary class="collapse-title text-sm font-medium">
                Retsept JSON formaadis
              </summary>
              <div class="collapse-content">
                <pre class="text-xs overflow-auto max-h-96 bg-base-200 p-3 rounded">
                  {JSON.stringify(recipeToJsonExport(recipe), null, 2)}
                </pre>
              </div>
            </details>
          </div>
        )}

        {/* Import tab */}
        {activeTab.value === "import" && (
          <div class="space-y-3">
            <p class="text-sm text-base-content/70">
              Kleebi JSON retsept alla ja vajuta "Impordi".
            </p>
            <textarea
              class="textarea textarea-bordered w-full h-48 font-mono text-xs"
              placeholder='{ "name": "Minu retsept", "ingredients": [...] }'
              value={importText.value}
              onInput={(e) => { importText.value = (e.target as HTMLTextAreaElement).value; }}
            />
            {importError.value && (
              <div class="alert alert-error text-sm">
                <span>{importError.value}</span>
              </div>
            )}
            <button class="btn btn-primary btn-sm" onClick={handleImport}>
              Impordi
            </button>
          </div>
        )}

        <div class="modal-action">
          <button class="btn btn-ghost btn-sm" onClick={close}>Sulge</button>
        </div>
      </div>
    </dialog>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add islands/EditRecipeDialog.tsx
git commit -m "feat: add EditRecipeDialog island with edit/json/import tabs"
```

---

## Task 15: Delete React/npm files and final cleanup

**Files:**
- Delete: `src/`
- Delete: `node_modules/`
- Delete: `package.json`
- Delete: `package-lock.json`
- Delete: `vite.config.ts`
- Delete: `tsconfig.json`
- Delete: `index.html`
- Delete: `public/`
- Modify: `.gitignore` (update for Deno)
- Create: `static/baker-icon.svg` (copy from src/)

- [ ] **Step 1: Copy the baker SVG icon to static/**

```bash
mkdir -p static
cp src/Constant/Graphics/baker-svgrepo-com.svg static/baker-icon.svg
```

- [ ] **Step 2: Delete React/npm artifacts**

```bash
rm -rf src node_modules package.json package-lock.json vite.config.ts tsconfig.json index.html public
```

- [ ] **Step 3: Update `.gitignore`**

Replace the existing `.gitignore` content with:

```
# Deno
.deno/

# Fresh build output
_fresh/

# macOS
.DS_Store
```

- [ ] **Step 4: Run full test suite to confirm nothing broke**

```bash
deno task test
```

Expected: all tests pass.

- [ ] **Step 5: Start dev server and verify UI**

```bash
deno task start
```

Open http://localhost:8000. Verify:
- Left drawer shows all 11 recipes with checkboxes
- First recipe is pre-selected (from URL default)
- Language toggle 🇪🇪/🇬🇧 switches UI text
- Recipe card shows levain group + dough group + baker% tables
- Edit button opens dialog with gram inputs
- Import tab accepts pasted JSON and adds recipe to list
- Selecting recipe updates ?r= query param in URL bar
- `window.print()` produces A4-style layout

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "feat: complete Deno/Fresh 2 rebuild — remove React/npm stack"
```

---

## Self-Review

**Spec coverage:**
- ✅ Delete React/Vite/npm files → Task 15
- ✅ Scaffold Deno Fresh 2 → Task 1
- ✅ Port calculation logic verbatim → Tasks 3, 4, 6, 8
- ✅ Milk rule fix → Task 7
- ✅ Full UI with 4 islands → Tasks 12, 13, 14
- ✅ DaisyUI → Task 1 (tailwind.config.ts)
- ✅ 🇪🇪/🇬🇧 emoji flags → Task 12
- ✅ Recipe import from JSON → Task 14
- ✅ URL sharing → Tasks 9, 10
- ✅ Tests with `deno test` → Tasks 5, 7, 8
- ✅ Keep PROJECT.md, fixtures, locales, PDF/HTML → Tasks 2, 15

**Type consistency:** `BakerPercentageAwareRecipe` defined in Task 2 (`lib/types.ts`), used in Tasks 10, 13, 14. `recipeToJson` → `recipeToJsonExport` re-export in `lib/state.ts` used in Task 14. `splitStarterAndDough` returns `Promise<RecipeIngredientsType[]>` — tests and state both `await` it. ✅

**Placeholder scan:** No TBDs. All code blocks are complete.
