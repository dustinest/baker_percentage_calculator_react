# Baker's Percentage Calculator — Deno/Fresh 2 Rebuild Design

Date: 2026-05-04  
Branch: refactor  
Status: Approved

---

## Overview

Full in-place rebuild of the baker's percentage calculator from React 18 + Vite + MUI to Deno + Fresh 2 + Preact + Tailwind CSS + DaisyUI. All calculation logic ported verbatim; milk rule implemented; recipe import and URL sharing added. Tests isolated to pure calculation functions using `deno test`.

---

## Scope

**In scope:**
- Delete all React/Vite/npm files (`src/`, `node_modules/`, `package.json`, `package-lock.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `public/`)
- Scaffold Deno Fresh 2 project structure
- Port all calculation logic verbatim to `lib/`
- Fix the milk rule in `sourdough.ts`
- Wire up full UI with 4 Preact islands + DaisyUI
- Recipe import from JSON (new)
- URL sharing via `?r=` query param (new)
- Full test suite with `deno test`

**Out of scope (later):**
- localStorage persistence
- Custom ingredient creation UI

**Kept as-is:**
- `PROJECT.md`, `README.md`
- `tests/fixtures/` (11 JSON files)
- `Sourdough baker percentages.pdf`
- `Sourdough baker percentages.html`

---

## Technology Stack

| Layer | Choice |
|---|---|
| Runtime | Deno |
| Framework | Fresh 2 |
| UI components | Preact + DaisyUI (Tailwind plugin) |
| Styling | Tailwind CSS |
| State | Preact Signals |
| i18n | Custom `t()` (~30 lines) |
| Notifications | Signal-driven Toast component |
| Testing | `deno test --allow-read` |
| Language flags | 🇪🇪 🇬🇧 emoji (no SVG files) |

**Replaced dependencies:**

| Old | New |
|---|---|
| React Context + useReducer | Preact Signals |
| i18next + react-i18next | Custom `t()` in `lib/i18n.ts` |
| notistack | Signal-driven Toast component |
| react-useasync-hooks | `useEffect` + signal |
| typescript-blocking-queue | 300ms `setTimeout` debounce |
| typescript-async-timeouts | `setTimeout` directly |
| typescript-nullsafe | Native `!= null` checks |
| buffer (base64 polyfill) | Native `btoa()` / `atob()` |
| MUI + Emotion | Tailwind CSS + DaisyUI |

---

## Project Structure

```
/
├── deno.json                  ← tasks, import map, compiler options
├── fresh.config.ts            ← Fresh 2 config + Tailwind + DaisyUI plugin
├── main.ts                    ← entry point
├── routes/
│   └── index.tsx              ← SSR shell: <html>, <head>, mounts islands
├── islands/
│   ├── RecipeNavigation.tsx   ← left drawer, recipe checklist, language toggle
│   ├── RecipeList.tsx         ← responsive grid of recipe cards
│   ├── RecipeCard.tsx         ← single recipe: tables, micro nutrients, baking info
│   └── EditRecipeDialog.tsx   ← full-screen edit + JSON export + JSON import
├── components/
│   └── Toast.tsx              ← signal-driven toast, print:hidden
├── lib/
│   ├── types.ts               ← all types (verbatim from src/types/)
│   ├── ingredients.ts         ← StandardIngredientConstant (verbatim)
│   ├── recipes.ts             ← PREDEFINED_RECIPES (verbatim)
│   ├── resolution.ts          ← readJsonRecipe percent→grams (verbatim, no hasValue)
│   ├── sourdough.ts           ← full levain pipeline (verbatim + milk rule fixed)
│   ├── baker-percent.ts       ← recalculateBakerPercentage (verbatim)
│   ├── state.ts               ← ALL Preact Signals + mutation functions
│   ├── i18n.ts                ← t() function + language signal
│   └── url.ts                 ← btoa/atob URL sharing helpers
├── locales/
│   ├── ee.json                ← kept as-is
│   └── gb.json                ← kept as-is
├── static/
│   └── baker-icon.svg
├── tests/
│   ├── fixtures/              ← kept as-is (11 JSON files)
│   ├── resolution_test.ts
│   ├── sourdough_test.ts
│   ├── baker_percent_test.ts
│   └── total_weight_test.ts
├── PROJECT.md                 ← kept as-is
└── README.md                  ← kept as-is
```

---

## State Architecture (`lib/state.ts`)

All shared state as module-level Preact Signals — islands import directly, no prop drilling across island boundaries:

```ts
export const selectedIds   = signal<Set<string>>(new Set())
export const allRecipes    = signal<RecipeType[]>(PREDEFINED_RECIPES_RESOLVED)
export const editingRecipe = signal<RecipeType | null>(null)
export const bakerResults  = signal<Map<string, BakerPercentageAwareRecipe>>(new Map())
export const language      = signal<"ee" | "gb">("ee")
export const toast         = signal<{ msg: string; key: number } | null>(null)
```

Recipe mutations (add, remove, edit grams, rename, copy, scale by portions, hydration) are plain functions in `lib/state.ts` that update `allRecipes` and trigger recalculation.

Recalculation: a `signal.effect` watches `allRecipes`, debounced 300ms via `setTimeout`, runs `splitStarterAndDough()` + `recalculateBakerPercentage()` for each selected recipe, writes to `bakerResults`.

---

## Islands

### RecipeNavigation
- DaisyUI `drawer` component, fixed left panel
- Recipe checklist with check-all toggle
- Selected-count badge on hamburger button
- 🇪🇪/🇬🇧 toggle writes to `language` signal
- Responsive: overlay on mobile, always-visible on desktop

### RecipeList
- Reads `selectedIds` + `bakerResults`
- Responsive DaisyUI grid of RecipeCard instances
- Empty state message when nothing selected

### RecipeCard
- Reads one entry from `bakerResults`
- Recipe name + portions header
- One DaisyUI `table` per ingredient group (levain / dough / lamination / etc.)
- Columns: ingredient name | grams | baker%
- Micro nutrients summary row
- Baking time phases + inner temperature range
- Print: `print:break-after-page print:break-inside-avoid`
- Edit and Copy action buttons

### EditRecipeDialog
- DaisyUI `modal` full-screen
- Three DaisyUI `tabs`: **Edit** | **JSON** | **Import**
- Edit tab: ingredient gram inputs, group names, recipe name, portions/scale, baking time phases, inner temp, hydration % per group, starter flag per group
- JSON tab: read-only `<pre>` with formatted JSON (DaisyUI `collapse` / `<details>`)
- Import tab: `<textarea>` for pasting JSON → parse → validate shape → append to `allRecipes` → toast

---

## Data Flow

```
app load
  → resolve percent-based ingredients (resolution.ts)
  → initialise allRecipes signal
  → parse ?r= query param → restore selectedIds
  → run pipeline for each selected recipe → populate bakerResults

user edit
  → mutate allRecipes signal
  → 300ms debounce
  → splitStarterAndDough() + recalculateBakerPercentage() per selected recipe
  → bakerResults updated → RecipeCard re-renders

URL sharing
  → effect: selectedIds changes → encode to ?r=<btoa(ids.join(","))>
  → on load: parse ?r= → set selectedIds

recipe import
  → paste JSON → parse → validate RecipeType shape
  → append to allRecipes → toast "Recipe imported"
```

---

## Milk Rule Fix (`lib/sourdough.ts`)

After filling the levain liquid slot from WATER ingredients:

```
waterLeftover = ingredient_water_grams − levain_liquid_amount − fridge
if (waterLeftover === 0) → move ALL MILK ingredients from dough to levain
```

Fires for: Croissant, Vastlakuklid, Kaneelirullid, Plaadikook, Moskva saiakesed.  
Does not fire for: Pikk sai (54g water leftover), Pannkook (starter:true path).

The 5 affected test fixtures must be updated to reflect correct post-fix values before asserting.

---

## i18n (`lib/i18n.ts`)

```ts
import { signal } from "@preact/signals";
import gb from "../locales/gb.json" with { type: "json" };
import ee from "../locales/ee.json" with { type: "json" };

export const language = signal<"ee" | "gb">("ee");

export const t = (key: string, vars?: Record<string, string | number>): string => {
  const parts = key.split(".");
  let node: unknown = language.value === "ee" ? ee : gb;
  for (const part of parts) node = (node as Record<string, unknown>)?.[part];
  let out = typeof node === "string" ? node : key;
  if (vars) for (const [k, v] of Object.entries(vars)) out = out.replace(`{{${k}}}`, String(v));
  return out;
};
```

---

## Testing

All calculation functions in `lib/` have zero Preact/island dependencies — tested as pure TypeScript with `deno test --allow-read`.

```
tests/
  fixtures/             ← 11 JSON files (kept, 5 updated for milk rule)
  resolution_test.ts    ← percent→grams for all 11 recipes
  sourdough_test.ts     ← full levain split: condition, fridge, amounts, group assignment
  baker_percent_test.ts ← baker% per ingredient + micro nutrients
  total_weight_test.ts  ← dough/others/total weights
```

Each test file iterates all fixture files. The 5 milk-rule fixtures are updated first; tests assert against updated values.

`deno.json` task: `"test": "deno test --allow-read tests/"`.

---

## What Is Ported Verbatim

- `BakerPercentageCalulation.ts` → `lib/baker-percent.ts`
- `MicroNutrientsCalculator.ts` → merged into `lib/baker-percent.ts`
- `calculateDryAndLiquid.ts` → `lib/sourdough.ts`
- `SourDoughStarterCalculator.ts` → `lib/sourdough.ts`
- `IngredientsSort.ts` → `lib/sourdough.ts` (sort bug preserved — produces correct output)
- `StandardIngredientConstant.ts` → `lib/ingredients.ts`
- `PredefinedRecipes.ts` → `lib/recipes.ts`
- `readJsonRecipe.ts` → `lib/resolution.ts` (drop `hasValue`)
- All `types/*.d.ts` → `lib/types.ts`
- `locales/ee.json`, `locales/gb.json` → `locales/`

## What Is Rewritten

- `IngredientStarterService.ts` → `lib/sourdough.ts` (+ milk rule)
- All React components → Preact islands
- All Context/useReducer → Preact Signals in `lib/state.ts`
- `EditRecipeReducerService.ts` → plain functions in `lib/state.ts`
- `RecipeEditService.ts` → plain functions + debounce in `lib/state.ts`
