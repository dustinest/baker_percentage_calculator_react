# Baker Percentage Calculator — Project Context

## Overview

A sourdough / baker's percentage calculator for a home baker (Margus). Built with **Vite + Preact SPA**, Preact signals, DaisyUI v5, Tailwind CSS v4. Deployed to Cloudflare Pages. All UI strings go through `t()` — never hardcoded Estonian/English inline.

## Architecture

- **`lib/types.ts`** — core types: `RecipeType`, `RecipeIngredientsType`, `BakingTimeType`, `NumberIntervalType`, etc. `bakingTime`/`innerTemperature` live directly on `RecipeType` only (not on groups).
- **`lib/recipes.ts`** — `PREDEFINED_RECIPES` as `JsonRecipe[]`. `JsonIngredients` has no baking fields (group-level baking was removed).
- **`lib/resolution.ts`** — `readJsonRecipe` parses JSON → `RecipeType`; `recipeToJson` serialises back.
- **`lib/sourdough.ts`** — `calculateSourDoughStarter` + `splitStarterAndDough`. Fridge amount is floored at 5g per side when ingredients allow (prevents < 10g fridge on small recipes). Leftover filter uses `e.grams > 0` (not `Math.floor > 0`) to avoid silently dropping sub-1g remainders.
- **`lib/baker-percent.ts`** — `recalculateBakerPercentage` computes baker % from split groups.
- **`lib/state.ts`** — Preact signals for app state. `editingRecipe`, `allRecipes`, `selectedIds`, `language`. `bakerResults` is debounced 300ms. Macros computed from the **post-split** recipe (`splitStarterAndDough` → `recalculateBakerPercentage`), not from the base JSON.
- **`lib/i18n.ts`** — `t()` function + `language` signal. Reads `locales/ee.json` / `locales/gb.json`.
- **`lib/url.ts`** — URL sync: selected recipe IDs are base64-encoded in the `?r=` query param.
- **`components/RecipePreview.tsx`** — shared read-only recipe preview (used by RecipeCard and EditRecipeDialog preview tab).
- **`islands/RecipeCard.tsx`** — recipe card with edit/copy buttons; renders baking time + inner temperature below ingredients.
- **`islands/EditRecipeDialog.tsx`** — full recipe editor modal. Sticky footer with save/cancel. `canSave` requires fridge starter ≥ 10g. Tabs: edit / JSON / import. Edit tab has: name, amount, ingredient groups, baking time editor, live preview. First ingredient group has a `starter` checkbox (self-describing label via `edit.enforce_starter.button`); handler is `setStarter(gi, bool)`.
- **`locales/ee.json` / `locales/gb.json`** — all UI strings; `edit.baking.*` keys for the baking editor.

Note: `islands/` and `components/` are both plain Preact components — the distinction is historical (migrated from Fresh 2).

## Entry Points

- **`index.html`** — Vite HTML entry; no CSS link (CSS imported in `main.tsx`)
- **`main.tsx`** — renders `<App />` into `#app`, imports `styles.css`
- **`App.tsx`** — page layout (DaisyUI drawer, navbar, RecipeList, RecipeNavigation, Toast)
- **`styles.css`** — Tailwind v4 entry (`@import "tailwindcss"` + `@plugin "daisyui"`)
- **`public/logo.svg`** — served as `/logo.svg`

## Current State

- Framework migrated from Deno/Fresh 2 → Vite + Preact SPA (branch: `refactor`, not yet merged to master)
- Baking time editor fully implemented in `EditRecipeDialog`: add/remove steps, time from–until, temperature from–until, steam checkbox, optional bilingual label, inner temperature toggle.
- All 23 tests passing (`npm test`)
- All 11 fixture files present in `tests/fixtures/` and exercised
- CI: GitHub Actions runs `npm ci && npm test` on all branches, deploys to Cloudflare Pages on master push (requires `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` secrets + `YOUR_PROJECT_NAME` filled in `.github/workflows/deploy.yml`)

## Fixtures (`tests/fixtures/*.json`)

Each fixture has: `recipe`, `amount`, `levainAlgorithm`, `groups` (split output with `key`/`grams`/`bakerPercent` per ingredient), `microNutrients` (dryTotal + per-nutrient grams/percent), `totalWeight` (dough/others/total). Values must match the code's actual computed output. Tolerances: 0.1g for nutrient grams/percent, 0.5g for totalWeight.

**Fixture tests:**
- `sourdough_test.ts` — checks split group structure and ingredient grams
- `baker_percent_test.ts` — checks microNutrients and per-ingredient bakerPercent
- `total_weight_test.ts` — checks totalWeight.dough/others/total
- `grams_consistency_test.ts` — checks split = baker% = summary = fixture total

Tests use a local `assertClose(actual, expected, delta, msg?)` helper (not a library) based on `expect(Math.abs(actual - expected)).toBeLessThan(delta)`.

## Conventions

- `updateDraft((c) => { ... })` pattern for all draft mutations — always copies via `copyRecipeType`.
- `nameStr(recipe.name)` for string comparison; `nameForLang(name, lang)` for display.
- `calculateSourDoughStarter` takes a single `RecipeIngredientsType` (first group).
- Ingredient groups no longer carry baking data; only `RecipeType` has `bakingTime` and `innerTemperature`.
- Split conserves mass: pre-split total = post-split total for all recipes.

## Known Issues / Next Steps

- `edit.description` locale key exists but description field was removed from the data model (locale key is stale).
- Fixture `bakingTime`/`innerTemperature` fields inside groups are stale (group-level baking was removed). Fixture tests don't read these fields so they don't fail, but the fixture JSON is misleading.
- Cloudflare Pages deployment not yet live — needs `YOUR_PROJECT_NAME` replaced in `deploy.yml` and secrets configured, then merge `refactor` → `master`.
