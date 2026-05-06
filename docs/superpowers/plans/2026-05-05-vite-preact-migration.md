# Vite + Preact Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Deno/Fresh 2 framework with Vite + Preact SPA so the app deploys to Cloudflare Pages as a static build.

**Architecture:** All `lib/` code is pure TypeScript and moves unchanged. The Fresh routing layer is replaced by a single `index.html` + `main.tsx` entry. The `islands/` and `components/` directories stay in place — islands become regular Preact components (no hydration boundary needed in an SPA). Tests migrate from Deno test runner + `@std/assert` to Vitest + Node `fs`.

**Tech Stack:** Vite 6, Preact 10, @preact/signals 2, Tailwind CSS v4, DaisyUI v5, sortablejs, Vitest 3, TypeScript 5

---

## File map

| Action | Path | Purpose |
|--------|------|---------|
| Create | `package.json` | npm scripts + deps |
| Create | `vite.config.ts` | Vite + Vitest config |
| Create | `tsconfig.json` | TS config for bundler mode |
| Create | `index.html` | Vite HTML entry |
| Create | `main.tsx` | Preact render entry (replaces Fresh `main.ts`) |
| Create | `App.tsx` | Page layout (replaces `routes/index.tsx`) |
| Move | `static/styles.css` → `styles.css` | Imported by `main.tsx` |
| Move | `static/logo.svg` → `public/logo.svg` | Served as `/logo.svg` |
| Modify | `lib/i18n.ts` | Remove `with { type: "json" }` (Deno syntax) |
| Modify | `tests/*.ts` (7 files) | `Deno.test` → `test`, `@std/assert` → vitest `expect` |
| Modify | `.github/workflows/run.yml` | Node CI |
| Modify | `.github/workflows/deploy.yml` | Cloudflare Pages deploy |
| Modify | `.gitignore` | `_fresh/` → `dist/` |
| Modify | `README.md` | Update deploy instructions |
| Delete | `deno.json`, `deno.lock`, `dev.ts`, `main.ts`, `routes/` | Deno artifacts |

---

## Task 1: Project config files

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "baker_percentage",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "engines": {
    "node": ">=20.19.0",
    "npm": ">=10.0.0"
  },
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run"
  },
  "dependencies": {
    "@preact/signals": "^2.9.0",
    "preact": "^10.29.1",
    "sortablejs": "^1.15.3"
  },
  "devDependencies": {
    "@preact/preset-vite": "^2.9.0",
    "@tailwindcss/vite": "^4.0.0",
    "@types/sortablejs": "^1.15.9",
    "daisyui": "^5.0.0",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.7.0",
    "vite": "^6.0.0",
    "vitest": "^3.0.0"
  }
}
```

- [ ] **Step 2: Create `vite.config.ts`**

```typescript
/// <reference types="vitest" />
import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    preact(),
    tailwindcss(),
  ],
  test: {
    include: ["tests/**/*_test.ts"],
    environment: "node",
  },
});
```

- [ ] **Step 3: Create `tsconfig.json`**

`allowImportingTsExtensions` preserves all existing `.ts`/`.tsx` import paths without touching them.

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "jsxImportSource": "preact",
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 4: Remove old node_modules (Deno-managed) and install via npm**

```bash
rm -rf node_modules && npm install
```

Expected: packages installed, no errors.

- [ ] **Step 5: Commit**

```bash
git add package.json vite.config.ts tsconfig.json
git commit -m "chore: add Vite + Preact project config"
```

---

## Task 2: App entry point

**Files:**
- Create: `index.html`
- Create: `main.tsx`
- Create: `App.tsx`
- Move: `static/styles.css` → `styles.css`
- Move: `static/logo.svg` → `public/logo.svg`
- Delete: `routes/index.tsx`, `static/` dir, `main.ts` (Fresh server), `dev.ts`, `deno.json`, `deno.lock`

- [ ] **Step 1: Create `index.html`**

Vite reads this as the entry. No `<link rel="stylesheet">` — CSS is imported in `main.tsx` so Vite processes Tailwind.

```html
<!DOCTYPE html>
<html lang="et">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Juuretise kalkulaator / Sourdough calculator</title>
    <meta name="keywords" content="juuretis, pagari protsent, sourdough, baker's percentage, leib, retsept" />
    <link rel="icon" href="/logo.svg" type="image/svg+xml" />
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 2: Create `main.tsx`**

```tsx
import { render } from "preact";
import App from "./App";
import "./styles.css";

render(<App />, document.getElementById("app")!);
```

- [ ] **Step 3: Create `App.tsx`**

Content extracted from `routes/index.tsx` minus the `<html>`/`<head>` boilerplate (those live in `index.html` now). `<Toast />` moves inside the layout div so it renders in the same tree.

```tsx
import RecipeNavigation from "./islands/RecipeNavigation";
import RecipeList from "./islands/RecipeList";
import Toast from "./components/Toast";

export default function App() {
  return (
    <div class="bg-base-100 min-h-screen">
      <div class="drawer lg:drawer-open">
        <input id="nav-drawer" type="checkbox" class="drawer-toggle" />
        <div class="drawer-content flex flex-col">
          <div class="navbar bg-base-200 lg:hidden print:hidden">
            <label for="nav-drawer" class="btn btn-ghost drawer-button">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </label>
            <img src="/logo.svg" class="h-7 w-7" alt="" />
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
    </div>
  );
}
```

- [ ] **Step 4: Move static assets**

```bash
mv static/styles.css styles.css
mkdir -p public
mv static/logo.svg public/logo.svg
rmdir static
```

- [ ] **Step 5: Remove Deno artifacts**

```bash
git rm routes/index.tsx
git rm main.ts dev.ts deno.json deno.lock
```

- [ ] **Step 6: Verify dev server starts**

```bash
npm run dev
```

Open http://localhost:5173 — recipes should appear, language toggle should work, edit dialog should open.

- [ ] **Step 7: Commit**

```bash
git add index.html main.tsx App.tsx styles.css public/logo.svg
git rm -r static/ routes/ main.ts dev.ts deno.json deno.lock
git commit -m "feat: replace Fresh entry with Vite SPA"
```

---

## Task 3: Fix Deno-specific syntax in lib/

Only one file uses Deno-specific syntax: the JSON import assertion in `lib/i18n.ts`.

**Files:**
- Modify: `lib/i18n.ts` lines 2–3

- [ ] **Step 1: Remove `with { type: "json" }` from `lib/i18n.ts`**

Old:
```typescript
import ee from "../locales/ee.json" with { type: "json" };
import gb from "../locales/gb.json" with { type: "json" };
```

New:
```typescript
import ee from "../locales/ee.json";
import gb from "../locales/gb.json";
```

- [ ] **Step 2: Verify no type errors**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/i18n.ts
git commit -m "fix: remove Deno JSON import assertion"
```

---

## Task 4: Migrate tests to Vitest

All 7 test files use `Deno.test`, `Deno.readTextFile`, and `@std/assert`. The migration pattern is identical in every file:

- `import { assertEquals, assertAlmostEquals, assertNotEquals } from "@std/assert"` → `import { test, expect } from "vitest"` + local `assertClose` helper
- `Deno.test("name", fn)` → `test("name", fn)`
- `await Deno.readTextFile(path)` → `readFileSync(path, "utf-8")`
- `assertEquals(a, b, msg?)` → `expect(a, msg).toEqual(b)`
- `assertAlmostEquals(a, b, delta, msg?)` → `assertClose(a, b, delta, msg)`
- `assertNotEquals(a, b, msg?)` → `expect(a, msg).not.toEqual(b)`

The `assertClose` helper (add at top of each file that uses `assertAlmostEquals`):
```typescript
const assertClose = (actual: number, expected: number, delta: number, msg?: string) =>
  expect(Math.abs(actual - expected), msg).toBeLessThan(delta);
```

Fixture files are read with:
```typescript
import { readFileSync } from "node:fs";
// ...
fixture = JSON.parse(readFileSync(fixtureFile(nameStr(recipe.name)), "utf-8"));
```

Paths like `"tests/fixtures/foo.json"` resolve from CWD (project root) — same as Deno's behaviour.

---

### Task 4a: Migrate `tests/resolution_test.ts`

- [ ] **Step 1: Replace the file**

```typescript
import { test, expect } from "vitest";
import { readJsonRecipe } from "../lib/resolution.ts";
import { PREDEFINED_RECIPES } from "../lib/recipes.ts";
import { nameStr } from "../lib/types.ts";

const assertClose = (actual: number, expected: number, delta: number, msg?: string) =>
  expect(Math.abs(actual - expected), msg).toBeLessThan(delta);

const EXPECTED: Record<string, Record<string, number>> = {
  "Täisteraleib":   { WATER: 425, SALT: 7.5 },
  "Sai":            { WATER: 378.8, SALT: 7.5 },
  "Sai seemnete ja kaerahelvestega": { WATER: 357, SALT: 7.5 },
  "Croissant":      { SUGAR: 55, SALT: 12 },
  "Vastlakuklid":   { CARDAMOM: 1 },
  "Kaneelirullid":  { CARDAMOM: 1, CINNAMON: 15.8 },
};

test("resolution: percent-based ingredients resolve to correct grams", () => {
  for (const jsonRecipe of PREDEFINED_RECIPES) {
    const recipe = readJsonRecipe(jsonRecipe);
    const expected = EXPECTED[nameStr(recipe.name)];
    if (!expected) continue;
    const allIngredients = recipe.ingredients.flatMap((g) => g.ingredients);
    for (const [key, expectedGrams] of Object.entries(expected)) {
      const found = allIngredients.find((i) => i.type === key);
      if (!found) throw new Error(`${recipe.name}: ingredient ${key} not found`);
      assertClose(found.grams, expectedGrams, 0.1, `${recipe.name} ${key}: expected ${expectedGrams}g, got ${found.grams}g`);
    }
  }
});

test("resolution: grams-based ingredients pass through unchanged", () => {
  const sai = readJsonRecipe(PREDEFINED_RECIPES.find((r) => nameStr(r.name) === "Sai")!);
  const flour = sai.ingredients[0].ingredients.find((i) => i.type === "WHEAT_550_FLOUR");
  expect(flour?.grams).toEqual(462);
});

test("resolution: all 11 recipes resolve without error", () => {
  expect(PREDEFINED_RECIPES.length).toEqual(11);
  for (const r of PREDEFINED_RECIPES) {
    readJsonRecipe(r);
  }
});
```

- [ ] **Step 2: Run this test in isolation**

```bash
npx vitest run tests/resolution_test.ts
```

Expected: 3 passed.

---

### Task 4b: Migrate `tests/sourdough_split_bugs_test.ts`

- [ ] **Step 1: Replace the file**

```typescript
import { test, expect } from "vitest";
import { readJsonRecipe } from "../lib/resolution.ts";
import { splitStarterAndDough } from "../lib/sourdough.ts";
import { PREDEFINED_RECIPES } from "../lib/recipes.ts";
import { nameStr } from "../lib/types.ts";

const recipe = (et: string) =>
  readJsonRecipe(PREDEFINED_RECIPES.find((r) => nameStr(r.name) === et)!);

const hasMilk = (group: ReturnType<typeof splitStarterAndDough>[0]) =>
  group.ingredients.some((i) => i.type === "MILK_25");

test("Bug 1: Vastlakuklid — milk stays in Taigen, not Eeltaigen", () => {
  const split = splitStarterAndDough(recipe("Vastlakuklid").ingredients);
  expect(hasMilk(split[0]), "milk must not be in Eeltaigen").toBe(false);
  expect(hasMilk(split[1]), "milk must be in Taigen").toBe(true);
});

test("Bug 1: Kaneelirullid — milk stays in Taigen, not Eeltaigen", () => {
  const split = splitStarterAndDough(recipe("Kaneelirullid").ingredients);
  expect(hasMilk(split[0]), "milk must not be in Eeltaigen").toBe(false);
  expect(hasMilk(split[1]), "milk must be in Taigen").toBe(true);
});

test("Bug 1: Plaadikook — milk stays in Taigen, not Eeltaigen", () => {
  const split = splitStarterAndDough(recipe("Plaadikook").ingredients);
  expect(hasMilk(split[0]), "milk must not be in Eeltaigen").toBe(false);
  expect(hasMilk(split[1]), "milk must be in Taigen").toBe(true);
});

test("Bug 1: Moskva saiakesed — milk stays in Taigen, not Eeltaigen", () => {
  const split = splitStarterAndDough(recipe("Moskva saiakesed").ingredients);
  expect(hasMilk(split[0]), "milk must not be in Eeltaigen").toBe(false);
  expect(hasMilk(split[1]), "milk must be in Taigen").toBe(true);
});

test("Bug 1: Croissant — milk stays in Taigen, not Eeltaigen", () => {
  const split = splitStarterAndDough(recipe("Croissant").ingredients);
  expect(hasMilk(split[0]), "milk must not be in Eeltaigen").toBe(false);
  expect(hasMilk(split[1]), "milk must be in Taigen").toBe(true);
});

test("Bug 1 (sanity): Pikk sai — milk already stays in Taigen (not broken)", () => {
  const split = splitStarterAndDough(recipe("Pikk sai").ingredients);
  expect(hasMilk(split[0]), "milk must not be in Eeltaigen").toBe(false);
  expect(hasMilk(split[1]), "milk must be in Taigen").toBe(true);
});

test("Bug 2: Pannkook — produces 2 groups and second group has a name", () => {
  const split = splitStarterAndDough(recipe("Pannkook").ingredients);
  expect(split.length, "should have 2 groups").toEqual(2);
  expect(split[1].name, "second group must have a name for its Taigen header").not.toBeUndefined();
  expect(split[1].name, "second group name must not be null").not.toBeNull();
});
```

- [ ] **Step 2: Run this test**

```bash
npx vitest run tests/sourdough_split_bugs_test.ts
```

Expected: 7 passed.

---

### Task 4c: Migrate `tests/summary_weights_test.ts`

- [ ] **Step 1: Replace the file**

```typescript
import { test, expect } from "vitest";
import { readJsonRecipe } from "../lib/resolution.ts";
import { splitStarterAndDough } from "../lib/sourdough.ts";
import { recalculateBakerPercentage } from "../lib/baker-percent.ts";
import { computeSummaryWeights } from "../lib/summary-weights.ts";
import { PREDEFINED_RECIPES } from "../lib/recipes.ts";
import { nameStr } from "../lib/types.ts";

const assertClose = (actual: number, expected: number, delta: number, msg?: string) =>
  expect(Math.abs(actual - expected), msg).toBeLessThan(delta);

const bp = (et: string) => {
  const r = readJsonRecipe(PREDEFINED_RECIPES.find((r) => nameStr(r.name) === et)!);
  return recalculateBakerPercentage(splitStarterAndDough(r.ingredients));
};

test("Bug 4: Croissant — doughGrams includes Eeltaigen (887g, not 467g)", () => {
  const { doughGrams, customGroups, totalGrams } = computeSummaryWeights(bp("Croissant"));
  const customTotal = customGroups.reduce((s, g) => s + g.grams, 0);
  assertClose(doughGrams, 887, 1, "dough weight (Eeltaigen + Taigen) should be 887g");
  assertClose(doughGrams + customTotal, totalGrams, 1, "doughGrams + Kihistamiseks must equal Kokku");
});

test("Bug 4: Kaneelirullid — doughGrams includes Eeltaigen (907g, not 531g)", () => {
  const { doughGrams, customGroups, totalGrams } = computeSummaryWeights(bp("Kaneelirullid"));
  const customTotal = customGroups.reduce((s, g) => s + g.grams, 0);
  assertClose(doughGrams, 907, 1, "dough weight (Eeltaigen + Taigen) should be 907g");
  assertClose(doughGrams + customTotal, totalGrams, 1, "doughGrams + Kaanelikiht must equal Kokku");
});

test("Bug 4: Moskva saiakesed — doughGrams includes Eeltaigen (746g, not 346g)", () => {
  const { doughGrams, customGroups, totalGrams } = computeSummaryWeights(bp("Moskva saiakesed"));
  const customTotal = customGroups.reduce((s, g) => s + g.grams, 0);
  assertClose(doughGrams, 746, 1, "dough weight (Eeltaigen + Taigen) should be 746g");
  assertClose(doughGrams + customTotal, totalGrams, 1, "doughGrams + Kihistamiseks must equal Kokku");
});

test("Bug 4 (sanity): Vastlakuklid — no extra groups, doughGrams = totalGrams", () => {
  const { doughGrams, customGroups, totalGrams } = computeSummaryWeights(bp("Vastlakuklid"));
  assertClose(doughGrams + customGroups.reduce((s, g) => s + g.grams, 0), totalGrams, 1);
});
```

- [ ] **Step 2: Run this test**

```bash
npx vitest run tests/summary_weights_test.ts
```

Expected: 4 passed.

---

### Task 4d: Migrate `tests/sourdough_test.ts`

- [ ] **Step 1: Replace the file**

```typescript
import { test, expect } from "vitest";
import { readFileSync } from "node:fs";
import { readJsonRecipe } from "../lib/resolution.ts";
import { calculateSourDoughStarter, splitStarterAndDough } from "../lib/sourdough.ts";
import { PREDEFINED_RECIPES } from "../lib/recipes.ts";
import { nameStr, NutritionType, RecipeIngredientsType } from "../lib/types.ts";

const assertClose = (actual: number, expected: number, delta: number, msg?: string) =>
  expect(Math.abs(actual - expected), msg).toBeLessThan(delta);

const makeGroup = (flourGrams: number, waterGrams: number): RecipeIngredientsType => ({
  ingredients: [
    ...(flourGrams > 0 ? [{ id: "f", name: "flour", grams: flourGrams, nutrients: [{ type: NutritionType.flour, percent: 100 }] }] : []),
    ...(waterGrams > 0 ? [{ id: "w", name: "water", grams: waterGrams, nutrients: [{ type: NutritionType.water, percent: 100 }] }] : []),
  ],
});

test("calculateSourDoughStarter: 20g flour + 20g water → fridge bumped to 10g", () => {
  const cal = calculateSourDoughStarter(makeGroup(20, 20));
  expect(cal.starter.flour.fridge + cal.starter.liquid.fridge).toEqual(10);
});

test("calculateSourDoughStarter: 5g flour + 5g water → fridge bumped to 10g", () => {
  const cal = calculateSourDoughStarter(makeGroup(5, 5));
  expect(cal.starter.flour.fridge + cal.starter.liquid.fridge).toEqual(10);
});

test("calculateSourDoughStarter: 100g flour + 4g water → fridge not bumped (liquid < 5g)", () => {
  const cal = calculateSourDoughStarter(makeGroup(100, 4));
  expect(cal.starter.flour.fridge + cal.starter.liquid.fridge).toEqual(4);
});

test("calculateSourDoughStarter: 500g flour + 200g water → normal fridge amount", () => {
  const cal = calculateSourDoughStarter(makeGroup(500, 200));
  expect(cal.starter.flour.fridge + cal.starter.liquid.fridge).toEqual(20);
});

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

test("sourdough: split matches fixtures for all 11 recipes", () => {
  for (const jsonRecipe of PREDEFINED_RECIPES) {
    const recipe = readJsonRecipe(jsonRecipe);
    const fixturePath = `${FIXTURES_DIR}/${nameStr(recipe.name)
      .toLowerCase()
      .replace(/ä/g, "a").replace(/ö/g, "o").replace(/ü/g, "u").replace(/õ/g, "o")
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "")
      .replace(/_ja_kaerahelvestega$/, "")}.json`;

    let fixture: Fixture;
    try {
      fixture = JSON.parse(readFileSync(fixturePath, "utf-8"));
    } catch {
      console.warn(`Fixture not found: ${fixturePath}, skipping`);
      continue;
    }

    const split = splitStarterAndDough(recipe.ingredients);

    expect(split.length, `${recipe.name}: group count`).toEqual(fixture.groups.length);

    for (let gi = 0; gi < fixture.groups.length; gi++) {
      const fixtureGroup = fixture.groups[gi];
      const splitGroup = split[gi];

      expect(splitGroup.ingredients.length, `${recipe.name} group[${gi}]: ingredient count`).toEqual(fixtureGroup.ingredients.length);

      for (let ii = 0; ii < fixtureGroup.ingredients.length; ii++) {
        const fi = fixtureGroup.ingredients[ii];
        const si = splitGroup.ingredients[ii];
        const key = ingredientKey(si);

        expect(key, `${recipe.name} group[${gi}][${ii}]: key mismatch`).toEqual(fi.key);
        assertClose(si.grams, fi.grams, 0.1, `${recipe.name} ${fi.key}: expected ${fi.grams}g, got ${si.grams}g`);
      }
    }
  }
});
```

- [ ] **Step 2: Run this test**

```bash
npx vitest run tests/sourdough_test.ts
```

Expected: 5 passed.

---

### Task 4e: Migrate `tests/baker_percent_test.ts`

- [ ] **Step 1: Replace the file**

```typescript
import { test, expect } from "vitest";
import { readFileSync } from "node:fs";
import { readJsonRecipe } from "../lib/resolution.ts";
import { splitStarterAndDough } from "../lib/sourdough.ts";
import { recalculateBakerPercentage } from "../lib/baker-percent.ts";
import { PREDEFINED_RECIPES } from "../lib/recipes.ts";
import { nameStr, NutritionType } from "../lib/types.ts";

const assertClose = (actual: number, expected: number, delta: number, msg?: string) =>
  expect(Math.abs(actual - expected), msg).toBeLessThan(delta);

interface FixtureMicro {
  dryTotal: number;
  water?: { grams: number; percent: number };
  salt?: { grams: number; percent: number };
  sugar?: { grams: number; percent: number };
  fat?: { grams: number; percent: number };
  protein?: { grams: number; percent: number };
  carbs?: { grams: number; percent: number };
  fiber?: { grams: number; percent: number };
}
interface Fixture { recipe: string; microNutrients: FixtureMicro }

const FIXTURES_DIR = "tests/fixtures";

const fixtureFile = (name: string) =>
  `${FIXTURES_DIR}/${name
    .toLowerCase()
    .replace(/ä/g, "a").replace(/ö/g, "o").replace(/ü/g, "u").replace(/õ/g, "o")
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "")
    .replace(/_ja_kaerahelvestega$/, "")}.json`;

test("baker-percent: micro nutrients match fixtures for all 11 recipes", () => {
  for (const jsonRecipe of PREDEFINED_RECIPES) {
    const recipe = readJsonRecipe(jsonRecipe);
    let fixture: Fixture;
    try {
      fixture = JSON.parse(readFileSync(fixtureFile(nameStr(recipe.name)), "utf-8"));
    } catch { continue; }

    const split = splitStarterAndDough(recipe.ingredients);
    const result = recalculateBakerPercentage(split);
    const mn = result.microNutrients;
    const fm = fixture.microNutrients;

    assertClose(mn.dry_total, fm.dryTotal, 0.5, `${recipe.name}: dryTotal`);

    const check = (type: NutritionType, expected?: { grams: number; percent: number }) => {
      if (!expected) return;
      const actual = mn.nutrients[type];
      if (!actual) throw new Error(`${recipe.name}: missing ${type} in microNutrients`);
      assertClose(actual.grams, expected.grams, 0.1, `${recipe.name} ${type}.grams`);
      assertClose(actual.percent, expected.percent, 0.1, `${recipe.name} ${type}.percent`);
    };

    check(NutritionType.water, fm.water);
    check(NutritionType.salt, fm.salt);
    check(NutritionType.sugar, fm.sugar);
    check(NutritionType.fat, fm.fat);
    check(NutritionType.protein, fm.protein);
    check(NutritionType.carbs, fm.carbs);
    check(NutritionType.fiber, fm.fiber);
  }
});

test("baker-percent: ingredient baker% matches fixtures", () => {
  for (const jsonRecipe of PREDEFINED_RECIPES) {
    const recipe = readJsonRecipe(jsonRecipe);
    let fixture: { recipe: string; groups: Array<{ ingredients: Array<{ key: string; bakerPercent: number }> }> };
    try {
      fixture = JSON.parse(readFileSync(fixtureFile(nameStr(recipe.name)), "utf-8"));
    } catch { continue; }

    const split = splitStarterAndDough(recipe.ingredients);
    const result = recalculateBakerPercentage(split);

    for (let gi = 0; gi < fixture.groups.length; gi++) {
      for (let ii = 0; ii < fixture.groups[gi].ingredients.length; ii++) {
        const fi = fixture.groups[gi].ingredients[ii];
        const si = result.ingredients[gi]?.ingredientWithPercent[ii];
        if (!si) continue;
        assertClose(si.percent, fi.bakerPercent, 0.1,
          `${recipe.name} group[${gi}][${ii}] ${fi.key}: expected ${fi.bakerPercent}%, got ${si.percent}%`);
      }
    }
  }
});
```

- [ ] **Step 2: Run this test**

```bash
npx vitest run tests/baker_percent_test.ts
```

Expected: 2 passed.

---

### Task 4f: Migrate `tests/total_weight_test.ts`

- [ ] **Step 1: Replace the file**

```typescript
import { test, expect } from "vitest";
import { readFileSync } from "node:fs";
import { readJsonRecipe } from "../lib/resolution.ts";
import { splitStarterAndDough } from "../lib/sourdough.ts";
import { PREDEFINED_RECIPES } from "../lib/recipes.ts";
import { nameStr } from "../lib/types.ts";

const assertClose = (actual: number, expected: number, delta: number, msg?: string) =>
  expect(Math.abs(actual - expected), msg).toBeLessThan(delta);

interface Fixture { recipe: string; totalWeight: { dough: number; others: number; total: number } }

const FIXTURES_DIR = "tests/fixtures";

const fixtureFile = (name: string) =>
  `${FIXTURES_DIR}/${name
    .toLowerCase()
    .replace(/ä/g, "a").replace(/ö/g, "o").replace(/ü/g, "u").replace(/õ/g, "o")
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "")
    .replace(/_ja_kaerahelvestega$/, "")}.json`;

test("total-weight: dough/others/total match fixtures", () => {
  for (const jsonRecipe of PREDEFINED_RECIPES) {
    const recipe = readJsonRecipe(jsonRecipe);
    let fixture: Fixture;
    try {
      fixture = JSON.parse(readFileSync(fixtureFile(nameStr(recipe.name)), "utf-8"));
    } catch { continue; }

    const split = splitStarterAndDough(recipe.ingredients);
    const doughGroups = split.slice(0, 2);
    const otherGroups = split.slice(2);

    const sumGrams = (groups: typeof split) =>
      groups.flatMap((g) => g.ingredients).reduce((s, i) => s + i.grams, 0);

    const doughWeight = sumGrams(doughGroups);
    const othersWeight = sumGrams(otherGroups);
    const totalWeight = doughWeight + othersWeight;

    assertClose(doughWeight, fixture.totalWeight.dough, 0.5, `${nameStr(recipe.name)}: dough weight`);
    assertClose(othersWeight, fixture.totalWeight.others, 0.5, `${nameStr(recipe.name)}: others weight`);
    assertClose(totalWeight, fixture.totalWeight.total, 0.5, `${nameStr(recipe.name)}: total weight`);
  }
});
```

- [ ] **Step 2: Run this test**

```bash
npx vitest run tests/total_weight_test.ts
```

Expected: 1 passed.

---

### Task 4g: Migrate `tests/grams_consistency_test.ts`

- [ ] **Step 1: Replace the file**

```typescript
import { test, expect } from "vitest";
import { readFileSync } from "node:fs";
import { readJsonRecipe } from "../lib/resolution.ts";
import { splitStarterAndDough } from "../lib/sourdough.ts";
import { recalculateBakerPercentage } from "../lib/baker-percent.ts";
import { computeSummaryWeights } from "../lib/summary-weights.ts";
import { PREDEFINED_RECIPES } from "../lib/recipes.ts";
import { nameStr } from "../lib/types.ts";

const assertClose = (actual: number, expected: number, delta: number, msg?: string) =>
  expect(Math.abs(actual - expected), msg).toBeLessThan(delta);

interface Fixture { recipe: string; totalWeight: { dough: number; others: number; total: number } }

const FIXTURES_DIR = "tests/fixtures";

const fixtureFile = (name: string) =>
  `${FIXTURES_DIR}/${name
    .toLowerCase()
    .replace(/ä/g, "a").replace(/ö/g, "o").replace(/ü/g, "u").replace(/õ/g, "o")
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "")
    .replace(/_ja_kaerahelvestega$/, "")}.json`;

test("grams-consistency: split = baker% = summary = fixture for all 11 recipes", () => {
  for (const jsonRecipe of PREDEFINED_RECIPES) {
    const recipe = readJsonRecipe(jsonRecipe);
    const name = nameStr(recipe.name);
    let fixture: Fixture;
    try {
      fixture = JSON.parse(readFileSync(fixtureFile(name), "utf-8"));
    } catch { continue; }

    const split = splitStarterAndDough(recipe.ingredients);
    const bp = recalculateBakerPercentage(split);
    const summary = computeSummaryWeights(bp);

    const splitTotal = split.flatMap((g) => g.ingredients).reduce((s, i) => s + i.grams, 0);
    const bpTotal = bp.ingredients.flatMap((g) => g.ingredientWithPercent).reduce((s, i) => s + i.grams, 0);

    assertClose(bpTotal, splitTotal, 0.01, `${name}: baker% total !== split total`);
    assertClose(summary.totalGrams, bpTotal, 0.01, `${name}: summary.totalGrams !== baker% total`);
    assertClose(summary.totalGrams, fixture.totalWeight.total, 0.5, `${name}: totalGrams !== fixture`);
  }
});
```

- [ ] **Step 2: Run all tests**

```bash
npm test
```

Expected: 23 passed, 0 failed.

- [ ] **Step 3: Commit**

```bash
git add tests/
git commit -m "test: migrate from Deno test runner to Vitest"
```

---

## Task 5: Update CI and deployment

**Files:**
- Modify: `.github/workflows/run.yml`
- Modify: `.github/workflows/deploy.yml`
- Modify: `.gitignore`
- Modify: `README.md`

- [ ] **Step 1: Update `.github/workflows/run.yml`**

```yaml
name: Test

on:
  push:
    branches:
      - '**'

jobs:
  test:
    name: Test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm test
```

- [ ] **Step 2: Update `.github/workflows/deploy.yml`**

Cloudflare Pages: push to master triggers a build; the `dist/` output is deployed automatically once the project is linked in the Cloudflare Pages dashboard.

```yaml
name: Deploy

on:
  push:
    branches:
      - master

jobs:
  deploy:
    name: Build and deploy to Cloudflare Pages
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy dist --project-name=YOUR_PROJECT_NAME
```

> **One-time setup required:** In the Cloudflare Pages dashboard, create the project. Then add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` as GitHub Actions secrets.
> Alternatively, connect the repo directly in Cloudflare Pages (no GitHub Actions needed) and set: build command = `npm run build`, output directory = `dist`.

- [ ] **Step 3: Update `.gitignore`**

Replace `_fresh/` with `dist/`:

```
# Deno
.deno/
node_modules/

# Vite build output
dist/

# IDE
.idea/

# macOS
.DS_Store

# Local tools
.myollamaenhancer/

docs/superpowers
```

- [ ] **Step 4: Update README deploy section**

Replace the Deno Deploy section with:

```markdown
## Deploy to Cloudflare Pages

### Option A: Connect via Cloudflare dashboard (simplest)

1. Push to GitHub.
2. In [Cloudflare Pages](https://pages.cloudflare.com/), create a project linked to this repo.
3. Set: **Build command** = `npm run build`, **Build output directory** = `dist`.
4. Every push to `master` deploys automatically.

### Option B: GitHub Actions with Wrangler

Set `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` as GitHub secrets, then replace `YOUR_PROJECT_NAME` in `.github/workflows/deploy.yml` with your project name.
```

- [ ] **Step 5: Run build to verify**

```bash
npm run build
```

Expected: `dist/` created, no errors.

- [ ] **Step 6: Commit**

```bash
git add .github/workflows/run.yml .github/workflows/deploy.yml .gitignore README.md
git commit -m "ci: switch to Node/npm + Cloudflare Pages deploy"
```

---

## Task 6: Merge to master and deploy

- [ ] **Step 1: Merge refactor → master**

```bash
git checkout master
git merge refactor
git push
```

- [ ] **Step 2: Verify CI passes**

Check GitHub Actions: both Test and Deploy jobs should pass.

- [ ] **Step 3: Verify Cloudflare Pages deployment**

Your site should be live at `https://<project>.pages.dev`.

---

## Self-review checklist

- [x] All `lib/` code: no changes needed (pure TS, no Deno APIs)
- [x] `lib/i18n.ts`: JSON import assertion removed
- [x] `islands/` → regular Preact components (no Fresh-specific API used)
- [x] `components/` → unchanged
- [x] `static/` → `public/` for static assets (logo accessible at `/logo.svg`)
- [x] CSS imported in `main.tsx` so Tailwind v4 processes it via `@tailwindcss/vite`
- [x] All 7 test files migrated with exact code shown
- [x] `assertAlmostEquals(a, b, delta)` → `assertClose` helper using `toBeLessThan(delta)` (same semantics)
- [x] Fixture paths: `readFileSync("tests/fixtures/...")` resolves from project root (same as Deno)
- [x] CI: Node 20 + npm ci + test
- [x] Deploy: two options documented (dashboard vs Wrangler action)
- [x] `.gitignore`: `_fresh/` → `dist/`
