# Baker Percentage Calculator — Project Context

## Overview

A sourdough / baker's percentage calculator for a home baker (Margus). Built with Deno + Fresh 2, Preact signals, DaisyUI v5, Tailwind CSS v4. All UI strings go through `t()` — never hardcoded Estonian/English inline.

## Architecture

- **`lib/types.ts`** — core types: `RecipeType`, `RecipeIngredientsType`, `BakingTimeType`, `NumberIntervalType`, etc. `BakingAwareType` was removed; `bakingTime`/`innerTemperature` live directly on `RecipeType` only (not on groups).
- **`lib/recipes.ts`** — `PREDEFINED_RECIPES` as `JsonRecipe[]`. `JsonIngredients` has no baking fields (group-level baking was removed).
- **`lib/resolution.ts`** — `readJsonRecipe` parses JSON → `RecipeType`; `recipeToJson` serialises back.
- **`lib/sourdough.ts`** — `calculateSourDoughStarter` + `splitStarterAndDough`. Fridge amount is floored at 5g per side when ingredients allow (prevents < 10g fridge on small recipes). Leftover filter uses `e.grams > 0` (not `Math.floor > 0`) to avoid silently dropping sub-1g remainders.
- **`lib/baker-percent.ts`** — `recalculateBakerPercentage` computes baker % from split groups.
- **`lib/state.ts`** — Preact signals for app state. `editingRecipe`, `allRecipes`, `selectedIds`, `language`. Macros are computed from the **post-split** recipe (`splitStarterAndDough` → `recalculateBakerPercentage`), not from the base JSON.
- **`components/RecipePreview.tsx`** — shared read-only recipe preview (used by RecipeCard and EditRecipeDialog preview tab).
- **`islands/RecipeCard.tsx`** — recipe card with edit/copy buttons; renders baking time + inner temperature below ingredients.
- **`islands/EditRecipeDialog.tsx`** — full recipe editor modal. Sticky footer with save/cancel. `canSave` requires fridge starter ≥ 10g. Tabs: edit / JSON / import. Edit tab has: name, amount, ingredient groups, baking time editor, live preview. First ingredient group has a `starter` checkbox (self-describing label via `edit.enforce_starter.button`); handler is `setStarter(gi, bool)`.
- **`locales/ee.json` / `locales/gb.json`** — all UI strings; `edit.baking.*` keys added for the baking editor. `edit.enforce_starter.button` is the self-describing checkbox label (no `legend` key — label is long enough to be self-explanatory).

## Current State

- Baking time editor fully implemented in `EditRecipeDialog`: add/remove steps, time from–until, temperature from–until, steam checkbox, optional bilingual label, inner temperature toggle.
- Group-level `bakingTime`/`innerTemperature` removed from all types, JSON schema, resolution, sourdough split, baker-percent, state, and tests.
- All 23 tests passing (`deno task test`).
- All 11 fixture files present in `tests/fixtures/` and exercised by fixture-based tests.
- Current branch: `refactor`.

## Fixtures (`tests/fixtures/*.json`)

Each fixture has: `recipe`, `amount`, `levainAlgorithm`, `groups` (split output with `key`/`grams`/`bakerPercent` per ingredient), `microNutrients` (dryTotal + per-nutrient grams/percent), `totalWeight` (dough/others/total). Values must match the code's actual computed output. The fixture tests use tolerances: 0.1g for nutrient grams/percent, 0.5g for totalWeight.

**Fixture tests:**
- `sourdough_test.ts` — checks split group structure and ingredient grams
- `baker_percent_test.ts` — checks microNutrients and per-ingredient bakerPercent
- `total_weight_test.ts` — checks totalWeight.dough/others/total
- `grams_consistency_test.ts` — checks split = baker% = summary = fixture total

**Note:** `deno task test` passes `--allow-read=.`; running `deno test tests/` without that flag causes fixture reads to silently fail (caught by try/catch → skip).

## Conventions

- `updateDraft((c) => { ... })` pattern for all draft mutations — always copies via `copyRecipeType`.
- `nameStr(recipe.name)` for string comparison; `nameForLang(name, lang)` for display.
- `calculateSourDoughStarter` takes a single `RecipeIngredientsType` (first group).
- Ingredient groups no longer carry baking data; only `RecipeType` has `bakingTime` and `innerTemperature`.
- Split conserves mass: pre-split total = post-split total for all recipes.

## Known Issues / Next Steps

- `edit.description` locale key exists but description field was removed from the data model (locale key is stale).
- Fixture `bakingTime`/`innerTemperature` fields inside groups are stale (group-level baking was removed from the model). Fixture tests don't read these fields so they don't fail, but the fixture JSON is misleading.
- `grams_consistency_test.ts` exists in `tests/` but is not yet wired into any test suite run.
