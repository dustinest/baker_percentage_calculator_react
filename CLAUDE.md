# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # dev server at http://localhost:5173
npm test           # run all tests (Vitest)
npm run build      # type-check + compile into dist/
npm run preview    # serve dist/ locally

# Run a single test file
npx vitest run tests/sourdough_test.ts

# Type-check
npx tsc --noEmit
```

## Architecture

Vite + Preact SPA. All state lives in Preact signals in `lib/state.ts` — no prop drilling, no server-side rendering. The `islands/` and `components/` directories are both just Preact components; the distinction is historical (migrated from Fresh).

**Data flow for a recipe:**

1. `lib/recipes.ts` — predefined recipes as `JsonRecipe[]` (compact JSON format with `percent`/`grams` fields and optional `JsonNumberInterval` for baking times)
2. `lib/resolution.ts` — `readJsonRecipe` resolves `JsonRecipe` → `RecipeType` (normalises intervals, resolves percent-based grams against total flour). `recipeToJson` goes the other way.
3. `lib/sourdough.ts` — `splitStarterAndDough` splits each ingredient group into a levain group + dough group. `calculateSourDoughStarter` computes how much to take from the fridge. Fridge amount is floored at 5g per side (10g min total) when the group has enough flour + liquid.
4. `lib/baker-percent.ts` — `recalculateBakerPercentage` takes the split groups and returns `BakerPercentageResult` with per-ingredient baker percentages and micro-nutrients.
5. `lib/state.ts` — `bakerResults` signal runs 3+4 reactively (debounced 300ms). `allRecipes`, `selectedIds`, `editingRecipe`, `language` are the other core signals.

**Key types (`lib/types.ts`):**

- `RecipeType` — the internal recipe: `ingredients: RecipeIngredientsType[]`, `bakingTime: BakingTimeType[]`, `innerTemperature: NumberIntervalType | null`. Baking fields live only here, not on groups.
- `RecipeIngredientsType` — a group: `name`, `ingredients: IngredientGramsType[]`, `starter?`.
- `BakerPercentageAwareRecipe` — `RecipeType & { bakerPercentage: BakerPercentageResult | null }` — what `RecipeCard` receives.
- `NumberIntervalType` — `{ from, until }` used for time and temperature ranges.

**Editing pattern (`islands/EditRecipeDialog.tsx`):**

All edits go through `updateDraft((c: RecipeType) => { ... })`, which deep-copies via `copyRecipeType` before mutating. `canSave` checks that fridge starter ≥ 10g via `calculateSourDoughStarter`.

**i18n:** `t("dot.separated.key")` and optionally `t("key", { var: value })` for interpolation. Keys are in `locales/ee.json` (Estonian) and `locales/gb.json` (English). Never hardcode UI strings.

**Ingredient lookup:** `lib/ingredients.ts` exports `StandardIngredients` (keyed by type string like `"WHEAT_550_FLOUR"`) and `getIngredientGrams(key, grams)` which returns a fully-formed `IngredientGramsType`.

## Tests

Tests are in `tests/` and cover pure calculation logic only (no UI). Fixture-based tests read from `tests/fixtures/*.json` using Node `fs.readFileSync` — paths resolve from the project root. All 11 fixture files exist and all 23 tests pass.

`nameStr(recipe.name)` must be used instead of `recipe.name` for string comparison since names are `string | Record<string, string>`.

Test files use `assertClose` (a local helper) instead of a tolerance-based assert library:
```typescript
const assertClose = (actual: number, expected: number, delta: number, msg?: string) =>
  expect(Math.abs(actual - expected), msg).toBeLessThan(delta);
```
