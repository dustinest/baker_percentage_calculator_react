# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # dev server at http://localhost:5173
npm test           # run all tests (Vitest)
npm run lint       # ESLint, --max-warnings=2 (CI fails on any error or >2 warnings)
npm run build      # tsc -b + vite build into dist/
npm run preview    # serve dist/ locally

# Run a single test file
npx vitest run tests/sourdough_test.ts

# Type-check
npx tsc --noEmit
```

CI (`.github/workflows/test.yml`) runs `npm ci && npm run lint && npm test` on every branch. Lint runs first, so a lint error fails CI before tests run.

## Architecture

Vite + Preact SPA. All state lives in Preact signals in `lib/state.ts`: no prop drilling, no server-side rendering. The `islands/` and `components/` directories are both just Preact components; the distinction is historical (migrated from Fresh).

**Data flow for a recipe:**

1. `lib/recipes.ts`: predefined recipes as `JsonRecipe[]` (compact JSON format with `percent`/`grams` fields and optional `JsonNumberInterval` for baking times).
2. `lib/json_recipe/`: `readJsonRecipe` (`read.ts`) resolves `JsonRecipe` → `RecipeType` (normalises intervals, resolves percent-based grams against total flour). `recipeToJson` (`write.ts`) goes the other way. Import from `lib/json_recipe/index.ts`.
3. `lib/sourdough.ts`: `splitStarterAndDough` splits each ingredient group into a levain group + dough group. `calculateSourDoughStarter` computes how much to take from the fridge. Fridge amount is floored at 5g per side (10g min total) when the group has enough flour + liquid.
4. `lib/baker-percent.ts`: `recalculateBakerPercentage` takes the split groups and returns `BakerPercentageResult` with per-ingredient baker percentages and micro-nutrients. `lib/summary-weights.ts` derives dough/others/total weights from that result.
5. `lib/state.ts`: `bakerResults` signal runs 3+4 reactively (debounced 300ms). `allRecipes`, `selectedIds`, `editingRecipe`, `language` are the other core signals; `showPercent` and `compactMode` are view toggles.

Selected recipe IDs sync to the URL as base64 in the `?r=` query param (`lib/url.ts`), so shared links reopen the same selection.

**Key types (`lib/types.ts`):**

- `RecipeType`: the internal recipe: `ingredients: RecipeIngredientsType[]`, `bakingTime: BakingTimeType[]`, `innerTemperature: NumberIntervalType | null`. Baking fields live only here, not on groups.
- `RecipeIngredientsType`: a group: `name`, `ingredients: IngredientGramsType[]`, `starter?`.
- `BakerPercentageAwareRecipe`: `RecipeType & { bakerPercentage: BakerPercentageResult | null }`, which is what `RecipeCard` receives.
- `NumberIntervalType`: `{ from, until }` used for time and temperature ranges.

**Editing pattern (`islands/EditRecipeDialog.tsx`):**

All edits go through `updateDraft((c: RecipeType) => { ... })`, which deep-copies via `copyRecipeType` before mutating. `canSave` checks that fridge starter ≥ 10g via `calculateSourDoughStarter`.

**i18n:** `t("dot.separated.key")` and optionally `t("key", { var: value })` for interpolation. Keys are in `locales/ee.json` (Estonian) and `locales/gb.json` (English). Never hardcode UI strings. Language is auto-detected from `navigator.language` (`lib/i18n.ts`); it is not part of the URL.

**Ingredient lookup:** `lib/ingredients.ts` exports `StandardIngredients` (keyed by type string like `"WHEAT_550_FLOUR"`) and `getIngredientGrams(key, grams)` which returns a fully-formed `IngredientGramsType`.

## Share headers and deployment

- App name: "Juuretiseköök / Sourdough Kitchen" (`navigation.title` in locales, `<title>` in `index.html`).
- Open Graph / Twitter / canonical tags are static in `index.html` and use `%VITE_SITE_URL%`, which Vite replaces at build time. If the variable is unset, the placeholder ships literally and share previews break silently.
- `VITE_SITE_URL` comes from `.env` locally (gitignored; template in `.env.example`). Live site: `https://juuretis-app.foxjunior.com`.
- Production is built by Cloudflare Pages' own Git integration, so `VITE_SITE_URL` must be set in the Cloudflare project's Variables and Secrets (then redeploy). `.github/workflows/deploy.yml` is a separate GitHub Actions deploy that is not what publishes the site.
- `public/og_card.png` is the 1200×630 share image. Regenerate it from `tools/og-card/template.html` with `npm run og-card` (see `tools/og-card/README.md`).

## Tests

Tests are in `tests/` and cover pure calculation logic only (no UI). Fixture-based tests read from `tests/fixtures/*.json` using Node `fs.readFileSync`; paths resolve from the project root.

Each fixture has `recipe`, `amount`, `groups` (expected split output), `microNutrients` and `totalWeight`. Expected values must match the code's actual computed output.

`nameStr(recipe.name)` must be used instead of `recipe.name` for string comparison since names are `string | Record<string, string>`.

Test files use `assertClose` (a local helper) instead of a tolerance-based assert library:
```typescript
const assertClose = (actual: number, expected: number, delta: number, msg?: string) =>
  expect(Math.abs(actual - expected), msg).toBeLessThan(delta);
```
