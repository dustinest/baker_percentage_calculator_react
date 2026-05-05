# Baker Percentage Calculator — Project Context

## Overview

A sourdough / baker's percentage calculator for a home baker (Margus). Built with Deno + Fresh 2, Preact signals, DaisyUI v5, Tailwind CSS v4. All UI strings go through `t()` — never hardcoded Estonian/English inline.

## Architecture

- **`lib/types.ts`** — core types: `RecipeType`, `RecipeIngredientsType`, `BakingTimeType`, `NumberIntervalType`, etc. `BakingAwareType` was removed; `bakingTime`/`innerTemperature` live directly on `RecipeType` only (not on groups).
- **`lib/recipes.ts`** — `PREDEFINED_RECIPES` as `JsonRecipe[]`. `JsonIngredients` has no baking fields (group-level baking was removed).
- **`lib/resolution.ts`** — `readJsonRecipe` parses JSON → `RecipeType`; `recipeToJson` serialises back.
- **`lib/sourdough.ts`** — `calculateSourDoughStarter` + `splitStarterAndDough`. Fridge amount is floored at 5g per side when ingredients allow (prevents < 10g fridge on small recipes).
- **`lib/baker-percent.ts`** — `recalculateBakerPercentage` computes baker % from split groups.
- **`lib/state.ts`** — Preact signals for app state. `editingRecipe`, `allRecipes`, `selectedIds`, `language`.
- **`components/RecipePreview.tsx`** — shared read-only recipe preview (used by RecipeCard and EditRecipeDialog preview tab).
- **`islands/RecipeCard.tsx`** — recipe card with edit/copy buttons; renders baking time + inner temperature below ingredients.
- **`islands/EditRecipeDialog.tsx`** — full recipe editor modal. Sticky footer with save/cancel. `canSave` requires fridge starter ≥ 10g. Tabs: edit / JSON / import. Edit tab has: name, amount, ingredient groups, baking time editor, live preview.
- **`locales/ee.json` / `locales/gb.json`** — all UI strings; `edit.baking.*` keys added for the baking editor.

## Current State

- Baking time editor fully implemented in `EditRecipeDialog`: add/remove steps, time from–until, temperature from–until, steam checkbox, optional bilingual label, inner temperature toggle.
- Group-level `bakingTime`/`innerTemperature` removed from all types, JSON schema, resolution, sourdough split, baker-percent, state, and tests.
- All 11 tests passing (`deno test tests/`).
- Current branch: `refactor`.

## Conventions

- `updateDraft((c) => { ... })` pattern for all draft mutations — always copies via `copyRecipeType`.
- `nameStr(recipe.name)` for string comparison; `nameForLang(name, lang)` for display.
- `calculateSourDoughStarter` takes a single `RecipeIngredientsType` (first group).
- Ingredient groups no longer carry baking data; only `RecipeType` has `bakingTime` and `innerTemperature`.

## Known Issues / Next Steps

- Sourdough fixture files (`tests/fixtures/*.json`) are all missing — fixture-based split tests are skipped.
- `edit.description` locale key exists but description field was removed from the data model (locale key is stale).
