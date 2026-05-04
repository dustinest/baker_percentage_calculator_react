# Baker's Percentage Calculator — Project Document

## What the App Does

A client-side bread-baking tool that helps bakers manage recipes and calculate **baker's percentages** (the standard professional method of expressing ingredient quantities as a percentage of the total flour weight).

The app is entirely frontend — no server, no database. All data lives in memory during a session. There is no persistence between sessions.

---

## Core Features

### 1. Recipe List & Navigation
- A left-side drawer lists all available recipes
- User selects which recipes to display (multi-select with check/uncheck all)
- Selected recipes are shown as cards in the main area
- Badge on the drawer button shows how many recipes are currently visible

### 2. Baker's Percentage Calculation
- Each ingredient is expressed as grams **and** as a percentage of total dry ingredients (flour + dry)
- Percentages update live when ingredients change
- Separate percentage tables per ingredient group

### 3. Micro Nutrients Summary
- Aggregate totals per recipe: water, salt, sugar, fat, flour, whole grain, etc.
- Displayed as grams and % of dry weight

### 4. Sourdough Levain Auto-Calculator

The most complex feature. When a recipe has an ingredient group flagged as `starter: true`, the app automatically splits the ingredients into a minimal 2-step process: **Step 1 — build the levain**, **Step 2 — mix the final dough**. The levain numbers are designed to be practical whole integers (no fractional grams).

#### Full algorithm pipeline

**Step A — Resolve percent-based ingredients to grams** (`readJsonRecipe`)

Ingredients can be defined as baker's percentages rather than absolute grams. They are converted:
```
grams = Math.round(percent_value × total_flour_grams / 10) / 10
```
This gives 1-decimal precision. Example: WATER at 82% with 462g flour → `Math.round(82 × 462 / 10) / 10 = 378.8g`.

**Step B — Split all ingredients into flour / liquid / other** (`calculateDryAndLiquid`)

- **Flour bucket**: ingredients whose `nutrients` include `NutritionType.flour`. Total is normalised to 100% flour content.
- **Liquid bucket**: ingredients whose `nutrients` include `NutritionType.water`. Total is normalised to pure-water equivalent.
- **Other bucket**: everything else (salt, sugar, eggs, fat-only ingredients, spices).

**Step C — Decide levain amounts** (`calculateSourDoughStarter`)

```
fridge_culture = min(floor(total_flour × 2%), 11g)   // seed kept in the fridge, capped at 11g
```

Then choose how much flour goes into the levain (four cases, checked in order):

| Condition | Levain flour amount |
|---|---|
| `liquid / flour < 30%` (very stiff dough) | `floor(liquid)` — use all liquid |
| `10% < water / flour < 40%` (small water fraction) | `floor(water)` |
| Whole grain flour detected | `floor(flour × 50%)` |
| Default (normal white-flour hydration) | `floor(flour × 26%)` |

```
levain_flour_amount = result_above − fridge_culture
levain_liquid_amount = levain_flour_amount          // 1:1 ratio (white flour)

// Exception for whole grain:
levain_liquid_amount = floor(liquid × 62%)          // slightly less water
```

The 1:1 flour-to-water ratio in the levain means the levain itself is always 100% hydration. The percentages (26%, 50%, 62%) were chosen empirically so that for typical recipe sizes the levain amounts come out as practical whole numbers without awkward digits.

**Step D — Assign ingredients to levain vs dough** (`splitStarterAndDough`)

The levain group always starts with the fridge culture entry:
```
sourdough_starter ingredient: grams = fridge_flour + fridge_liquid,
                               nutrients = [50% flour, 50% water]
```

Then flour ingredients are assigned to the levain first (up to `levain_flour_amount`), then liquid ingredients (up to `levain_liquid_amount`). Any remainder stays in the dough group. "Other" ingredients (salt, etc.) always go into the dough group.

**Step E — Sort ingredient order** (`IngredientsSort`)

Within each group, ingredients are sorted by nutrition type priority: flour → water → fat → salt → sugar.

### 5. Recipe Editing (full CRUD)
- **Edit existing recipe**: name, each ingredient (grams), ingredient group name, description
- **Copy recipe**: duplicates a recipe as a new editable entry
- **Create new recipe**: empty template with one ingredient group
- **Baking time editor**: multiple phases, each with time (fixed or range), temperature, steam flag
- **Inner temperature**: target range (from / until)
- **Scale amount**: change the portion count and optionally recalculate all ingredient grams proportionally
- **Add ingredient group**: recipes can have multiple groups (e.g., dough + lamination)
- **Sourdough starter flag**: mark a group as the pre-dough

### 6. Print View
- Browser print (`window.print()`) produces A4-formatted output
- Navigation, drawers, and action buttons are hidden in print mode
- Each recipe card gets its own page break
- Print button is only enabled when at least one recipe is selected

### 7. JSON Export
- Inside the edit dialog, an expandable accordion shows the recipe serialised as JSON
- Useful for copying a recipe back into the predefined dataset

### 8. Internationalisation
- Two languages: **Estonian** (`ee`) and **English** (`gb`)
- Language switcher in the navigation drawer
- Ingredient names, recipe names, UI labels all translated
- Translation keys follow i18next nested key format

---

## Data Model

```
RecipeType
  id: string
  name: string                        // displayed via translation key if available
  amount: number                      // how many portions / loaves
  description?: string
  bakingTime: BakingTimeType[]
  innerTemperature?: NumberInterval   // { from, until } in °C
  ingredients: RecipeIngredientsType[]

RecipeIngredientsType
  name?: string                       // optional group name (e.g. "Lamination")
  starter: boolean                    // marks this group as sourdough pre-dough
  description?: string
  bakingTime: BakingTimeType[]        // per-group baking time (rarely used)
  innerTemperature?: NumberInterval
  ingredients: IngredientGramsType[]

IngredientGramsType
  id: string
  name: string                        // translation key, e.g. "ingredient.predefined.flour.wheat.generic"
  grams: number
  nutrients: NutrientPercentType[]    // e.g. [{ type: "flour", percent: 100 }]

BakingTimeType
  time: number | { from, until }      // minutes
  temperature: number                 // °C
  steam?: boolean

NutritionType (enum)
  flour | dry | water | salt | sugar | fat | spice | egg | other | whole_grain | ash
```

---

## Predefined Recipes

11 hardcoded recipes in Estonian (names translated in the `gb` locale):

| Estonian | English |
|---|---|
| Täisteraleib | Whole grain rye bread |
| Sai | Wheat bread |
| Sai seemnete ja kaerahelvestega | Bread with seeds and barley |
| Croissant | Croissant |
| Pannkook | Pancake |
| Pizza | Pizza |
| Vastlakuklid | Semla |
| Kaneelirullid | Cinnamon rolls |
| Plaadikook | Pie dough |
| Pikk sai | Baguette |
| Moskva saiakesed | Moscow pastries |

Recipes are defined in TypeScript source code as `PREDEFINED_RECIPES` — they are not loaded from a file or API.

---

## Standard Ingredients

16 predefined ingredients with nutrition profiles:

| Key | Name | Nutrition |
|---|---|---|
| SALT | Salt | 100% salt |
| SUGAR / SUGAR_BROWN | Sugar | 100% sugar |
| WATER | Water | 100% water |
| BUTTER | Butter | 82% fat, 18% water |
| OIL / OLIVE_OIL | Oil | 100% fat |
| MILK | Milk | 2.8% fat, 97.5% water |
| EGG | Egg | 100% egg |
| CARDAMOM / CINNAMON | Spices | 100% spice |
| WHEAT_405_FLOUR | Wheat flour (405) | 100% flour, ash 405 |
| WHEAT_550_FLOUR | Wheat flour (550) | 100% flour, ash 550 |
| WHOLE_RYE_FLOUR | Whole rye flour | 100% flour, 100% whole_grain |
| WHOLE_RYE_MALT_FLOUR | Rye malt flour | 100% flour, 100% whole_grain |
| WHOLE_WHEAT_FLOUR | Whole wheat flour | 100% flour, 100% whole_grain |
| DURUM_WHEAT | Durum flour | 100% flour, 100% whole_grain |
| BARLEY | Barley | 100% dry |
| SEEDS | Seeds | 100% dry |

---

## Current Technology Stack

| Layer | Technology | Version |
|---|---|---|
| Language | TypeScript | 4.9.x |
| Framework | React | 18.3 |
| Build tool | Vite | 7.x |
| Package manager | npm | ≥10 |
| UI library | MUI (Material UI) | 6.x + Emotion |
| i18n | i18next + react-i18next | 23.x |
| Notifications | notistack | 3.x |
| State | React Context + useReducer | — |
| Async hooks | react-useasync-hooks | 1.x |
| Utilities | typescript-nullsafe, typescript-async-timeouts, typescript-blocking-queue | 1.x |
| Base64 | buffer (Node.js polyfill) | 6.x |
| Testing | Jest + @testing-library | — |
| Deployment | DigitalOcean (static) | — |

### Pain Points
- Requires Node.js ≥ 20 + npm to build or develop
- MUI is ~500 KB gzipped — very heavy for this level of UI
- `buffer` polyfill is unnecessary (Web Crypto / `btoa` is universally available)
- Multiple one-person utility packages (`react-useasync-hooks`, `typescript-blocking-queue`, etc.)
- No data persistence — all edits are lost on page reload
- Recipes are hardcoded in TypeScript — adding new ones requires a code change and rebuild
- No routing — the whole app is a single "page" with dialog-based editing
- TypeScript version is stuck at 4.9 (latest is 5.x)

---

## Rebuild Plan: Modern Serverless Stack

### Goals
- **No npm** — no Node.js toolchain at all
- **Fully serverless** — deployable to edge/serverless platforms (Deno Deploy, Cloudflare Pages, Vercel)
- **No build step required to run** (or a minimal, self-contained one)
- Preserve all existing functionality exactly
- Add local persistence (localStorage) that was originally commented out

---

### Recommended Stack

| Layer | Choice | Reason |
|---|---|---|
| Runtime | **Deno** | Native TypeScript, no npm, imports from URLs, has `deno fmt` / `deno lint` / `deno test` built in |
| Framework | **Fresh 2** (Deno) | Islands architecture, SSR by default, Preact, no bundler needed in dev, deploys to Deno Deploy as serverless |
| UI | **Preact** (ships with Fresh) | Drop-in React replacement, ~3 KB, compatible with JSX |
| Styling | **Tailwind CSS** (Deno-native via Fresh plugin) | No PostCSS/webpack, utility-first, print variants built in |
| i18n | Custom signal-based, or `@preact/signals` store | Remove i18next entirely — the translation files are small enough to inline |
| State | **Preact Signals** (`@preact/signals`) | Simpler than Context + useReducer, reactive, no boilerplate |
| Persistence | `localStorage` | Restore the commented-out code; serialize recipes as JSON |
| Testing | `deno test` | Built in, no jest config needed |
| Deployment | **Deno Deploy** | Free tier, edge-deployed, zero config, works directly from a GitHub repo |

---

### Architecture Overview

```
fresh-baker/
├── deno.json              # tasks, import map, compiler options
├── main.ts                # Deno entry point (Fresh server)
├── fresh.config.ts        # Fresh configuration
├── islands/               # Interactive Preact components (client-side hydrated)
│   ├── RecipeNavigation.tsx
│   ├── RecipeList.tsx
│   ├── EditRecipeDialog.tsx
│   └── RecipeCard.tsx
├── components/            # Static server-rendered components (no JS sent to browser)
│   ├── Layout.tsx
│   └── PrintPage.tsx
├── routes/
│   └── index.tsx          # Main page route
├── lib/
│   ├── ingredients.ts     # StandardIngredients constant (same logic)
│   ├── baker-percentage.ts # BakerPercentageCalculation (same logic)
│   ├── sourdough.ts       # SourdoughStarterCalculator (same logic)
│   ├── recipes.ts         # Predefined recipes data
│   ├── i18n.ts            # Lightweight translation (signal-based)
│   └── storage.ts         # localStorage persistence layer
├── static/
│   ├── flags/ee.svg
│   └── flags/gb.svg
└── locales/
    ├── ee.json
    └── gb.json
```

---

### Migration Steps

#### Step 1 — Bootstrap Deno Fresh project
```bash
deno run -A jsr:@fresh/init fresh-baker
```
No npm needed. Deno and Fresh are the only prerequisites.

#### Step 2 — Port the pure calculation logic (no UI dependencies)
These files contain no React and can be copied almost verbatim:
- `BakerPercentageCalulation.ts` → `lib/baker-percentage.ts`
- `MicroNutrientsCalculator.ts` → `lib/baker-percentage.ts`
- `SourDoughStarterCalculator.ts` → `lib/sourdough.ts`
- `StandardIngredientConstant.ts` → `lib/ingredients.ts`
- `PredefinedRecipes.ts` → `lib/recipes.ts`
- `NutritionType.ts`, all `types/*.d.ts` → `lib/types.ts`
- Remove `buffer` dependency — replace `base64Encode` with native `btoa()`

#### Step 3 — Port state management
Replace React Context + useReducer with Preact Signals:
```ts
// lib/state.ts
import { signal, computed } from "@preact/signals";
import { RecipeType } from "./types.ts";

export const allRecipes = signal<RecipeType[]>([]);
export const selectedIds = signal<string[]>([]);
export const editedRecipe = signal<RecipeType | null>(null);
export const language = signal<"ee" | "gb">("ee");

export const visibleRecipes = computed(() =>
  allRecipes.value.filter(r => selectedIds.value.includes(r.id))
);
```

#### Step 4 — Port UI components
- Replace `@mui/material` components with Tailwind utility classes
- Map MUI components to equivalents:
  - `Card` → `<div class="border rounded-lg p-4">`
  - `Dialog fullScreen` → `<div class="fixed inset-0 z-50 bg-white overflow-auto">`
  - `Drawer` → `<div class="fixed left-0 top-0 h-full w-64 bg-white shadow-lg">`
  - `Table/TableRow/TableCell` → `<table class="w-full text-sm">`
  - `CircularProgress` → CSS spinner
  - `Accordion` → `<details>/<summary>`
  - `Snackbar` → toast via CSS transition + signal
- Keep the same component decomposition (RecipeCard, IngredientsTable, EditDialog, etc.)
- Use Preact's `useSignal` inside island components

#### Step 5 — Port i18n
Replace i18next with a signal-based lookup:
```ts
// lib/i18n.ts
import { language } from "./state.ts";
import gbTranslations from "../locales/gb.json" assert { type: "json" };
import eeTranslations from "../locales/ee.json" assert { type: "json" };

const translations = { gb: gbTranslations, ee: eeTranslations };

export const t = (key: string, vars?: Record<string, unknown>): string => {
  const parts = key.split(".");
  let current: unknown = translations[language.value];
  for (const part of parts) {
    current = (current as Record<string, unknown>)?.[part];
  }
  let result = (typeof current === "string" ? current : key);
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      result = result.replace(`{{${k}}}`, String(v));
    }
  }
  return result;
};
```

#### Step 6 — Add localStorage persistence
```ts
// lib/storage.ts
import { allRecipes } from "./state.ts";
import { RecipeType } from "./types.ts";

const KEY = "baker_recipes_v1";

export const loadFromStorage = (): RecipeType[] => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
};

export const saveToStorage = (recipes: RecipeType[]) => {
  localStorage.setItem(KEY, JSON.stringify(recipes));
};
```
Wire `saveToStorage` into the signal effect so it auto-saves on every change.

#### Step 7 — Print support
Tailwind's `print:` variant covers everything in the current `Print.css`:
```html
<div class="print:break-after-page print:break-inside-avoid recipe-card">
```
Add `print:hidden` to navigation, dialogs, and action buttons.

#### Step 8 — Deploy
```bash
# Push to GitHub, connect repo to Deno Deploy
# Or deploy directly:
deployctl deploy --project=baker-percentage main.ts
```
Zero config. Runs on Deno Deploy's serverless edge network.

---

### What Does NOT Need to Change

The following logic is framework-independent and can be ported nearly verbatim:

- Baker's percentage formula
- Micro nutrients aggregation
- Sourdough starter calculation algorithm
- Ingredient sort order
- All predefined ingredient definitions and their nutrition profiles
- All predefined recipe data
- Both translation files (`ee.json`, `gb.json`)
- The JSON serialisation/deserialisation of recipes
- The "copy recipe" and "scale amount" logic

---

### Feature Additions Worth Including in the Rebuild

These were commented out or missing from the current codebase:

1. **LocalStorage persistence** — recipes survive page reload (already scaffolded in commented code)
2. **Import recipe from JSON** — paste the JSON output back in to add a recipe (the JSON export already exists, the import doesn't)
3. **Custom ingredient creation** — the `CustomIngredient.ts` file exists but is not wired into the UI
4. **URL sharing** — encode selected recipe IDs or a custom recipe in the URL as a base64 query param (infrastructure already exists via `Base64.ts`)

---

### What to Skip / Simplify

- `react-useasync-hooks` — replace with `useSignal` + `useEffect` in Preact; the async loading pattern is trivial
- `typescript-blocking-queue` — only used for debouncing input; replace with a 300 ms `setTimeout` + cleanup
- `typescript-async-timeouts` — only `runLater` is used; replace with `setTimeout`
- `typescript-nullsafe` — replace `hasValue` / `hasNoValue` with native `!= null` checks or a two-line util
- `notistack` — replace with a simple signal-driven toast component (~30 lines of Preact)
- `react-use-value-change` — not needed with Preact Signals (reactivity is built in)
- `buffer` polyfill — use native `btoa()` / `atob()`
- MUI — replace entirely with Tailwind

---

### Estimated Effort

| Area | Complexity | Notes |
|---|---|---|
| Calculation logic port | Low | Pure functions, no UI |
| State management rewrite | Medium | Context → Signals is a straightforward mental model shift |
| UI component rewrite | High | Most time will be spent here (MUI → Tailwind) |
| i18n replacement | Low | Simple key lookup, small files |
| localStorage persistence | Low | Already scaffolded |
| Print CSS | Low | Tailwind `print:` variants |
| Testing | Medium | Port existing unit tests to `deno test` |
| Deployment setup | Low | Deno Deploy is near-zero config |

**Total estimated rewrite**: medium-sized project. The calculation core is the most important and least work. The UI is the most work but the recipes are simple enough that MUI components can be replaced with clean Tailwind without losing functionality.

---

## Reference Snapshot for Regression Testing

`Sourdough baker percentages.html` in the project root is a deployed build of the current app (Vite-compiled, served via Cloudflare). It loads the same predefined recipe dataset and runs the full calculation pipeline in the browser. It serves as the **ground truth** for regression tests in the rebuild — any output the new implementation produces must match what this build produces.

### Fixture files — already created

`tests/fixtures/` contains one JSON file per recipe, derived by tracing the source code algorithm against the PDF print-out as ground truth. The PDF values were used to verify every number before writing the fixture.

| File | Recipe | Key notes |
|---|---|---|
| `taisteraleib.json` | Whole grain rye bread | Whole-grain formula: 50%/62% |
| `sai.json` | Wheat bread | Default 26% formula |
| `sai_seemnete.json` | Bread with seeds & barley | dryTotal=484 (BARLEY+SEEDS count as dry) |
| `croissant.json` | Croissant | water/flour=28%, lamination group |
| `pannkook.json` | Pancake | `starter:true` — special split path |
| `pizza.json` | Pizza (×3) | DURUM_WHEAT triggers whole-grain formula |
| `vastlakuklid.json` | Semla (×18) | BUTTER enters liquid bucket (18% water) |
| `kaneelirullid.json` | Cinnamon rolls | Cinnamon layer as index-2 group → others |
| `plaadikook.json` | Pie dough | Fridge capped at 11g (rule: max 11) |
| `pikk_sai.json` | Baguette (×2) | water/flour=41.8% — just above 40% threshold |
| `moskva_saiakesed.json` | Moscow pastries | water/flour=31.9%, lamination group |

Each fixture records:
- `levainAlgorithm` — which condition was triggered and the resulting `fridge`, `flourAmount`, `liquidAmount`
- `groups[]` — all ingredient groups after the sourdough split, in display order, with precise gram values and baker percentages
- `microNutrients` — `dryTotal` and per-nutrient `grams`/`percent` (using precise values, not display-rounded)
- `totalWeight` — `dough` (groups 0–1), `others` (groups 2+), `total`

**Precision note**: individual ingredient grams in the fixtures use the algorithmically precise values (e.g. salt = 7.5g, dough water = 258.8g), not the display-rounded integers shown in the PDF. The PDF's baker-percentage column uses the precise values too, so both can be verified against the fixture.

### What to capture as test fixtures

The following calculated outputs should be extracted from the running app (or derived by tracing the existing source) and stored as JSON fixtures before the rewrite begins:

#### 1. Ingredient gram resolution (percent → grams)

For every percent-based ingredient in every predefined recipe, the resolved gram value. Example fixture:

```json
{ "recipe": "Sai", "ingredient": "WATER", "percentInput": 82, "flourGrams": 462, "resolvedGrams": 378.8 }
{ "recipe": "Sai", "ingredient": "SALT",  "percentInput": 1.62, "flourGrams": 462, "resolvedGrams": 7.5 }
```

#### 2. Sourdough levain split — per recipe that has `starter: true`

For each recipe whose first ingredient group has `starter: true` (currently: Pannkook), the full split result:

```json
{
  "recipe": "Pannkook",
  "fridge": { "flour": 7, "liquid": 7 },
  "levain": { "flour": ..., "liquid": ... },
  "levainIngredients": [ ... ],
  "doughIngredients": [ ... ]
}
```

For all other recipes (no explicit `starter: true`), the system still auto-generates a levain — those outputs should also be captured.

#### 3. Baker's percentages — per recipe, per ingredient group

For every ingredient in every group after the full pipeline (levain split → baker % calculation):

```json
{
  "recipe": "Sai",
  "groups": [
    {
      "name": "Pre-dough",
      "ingredients": [
        { "name": "ingredient.sourdough_starter.name", "grams": 18, "percent": ... },
        { "name": "ingredient.predefined.flour.wheat.generic", "grams": 111, "percent": 100 },
        { "name": "ingredient.predefined.water.generic", "grams": 111, "percent": 100 }
      ]
    },
    {
      "name": "Dough",
      "ingredients": [ ... ]
    }
  ],
  "microNutrients": {
    "dry_total": ...,
    "nutrients": { "flour": { "grams": ..., "percent": 100 }, "water": { ... }, ... }
  }
}
```

#### 4. Total weights — per recipe

```json
{ "recipe": "Sai", "totalWeight": { "dough": ..., "others": ..., "total": ... } }
```

### Suggested test structure for the rebuild

```
tests/
  fixtures/
    sai.json
    taisteraleib.json
    croissant.json
    pannkook.json
    pizza.json
    ...
  ingredient_resolution_test.ts   // readJsonRecipe percent → grams
  sourdough_split_test.ts         // splitStarterAndDough output matches fixture
  baker_percentage_test.ts        // recalculateBakerPercentage output matches fixture
  micro_nutrients_test.ts         // calculateMicroNutrientsResult matches fixture
```

All tests run with `deno test` — no Jest, no config files.
