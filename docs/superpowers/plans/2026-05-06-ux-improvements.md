# UX Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply all 10 UX fixes identified in the review — silent save failure, cramped baking editor, accessibility, column headers, i18n gaps, badge formatting, servings stepper, sort handle, and tap targets.

**Architecture:** Targeted edits across 6 files — no new files, no logic changes. UI-only. All changes are independently testable by visual inspection; calculation tests (`npm test`) guard against regressions.

**Tech Stack:** Preact + Preact signals, DaisyUI v5, Tailwind CSS v4, Vitest

---

## Task 1: Add new locale keys to both JSON files

**Files:**
- Modify: `locales/gb.json`
- Modify: `locales/ee.json`

- [ ] **Step 1: Add keys to `locales/gb.json`**

Inside the `"edit"` object, add `"save_blocked"` at the top level and extend `"ingredients"` and add a `"tab"` section:

```json
"save_blocked": "Levain too small — need at least 10g fridge starter.",
```

Inside `"edit" > "ingredients"`, add:
```json
"baker_percent_hint": "Edit % to recalculate grams",
```

Add a new `"tab"` object inside `"edit"`:
```json
"tab": {
  "json": "JSON",
  "import": "Import"
},
```

The full `"edit"` block in `locales/gb.json` after the changes:
```json
"edit": {
  "edit": "Change",
  "name": "Name",
  "delete": "Delete",
  "copyOf": "Copy",
  "save_blocked": "Levain too small — need at least 10g fridge starter.",
  "tab": {
    "json": "JSON",
    "import": "Import"
  },
  "enforce_starter": {
    "button": "Entire group goes into the levain, not just part of it."
  },
  "ingredients": {
    "add": "Add new group",
    "ingredient": "Ingredient",
    "add_ingredient": "Add ingredient",
    "baker_percent": "Baker %",
    "baker_percent_hint": "Edit % to recalculate grams",
    "choose": "Choose ingredient",
    "custom": "Custom"
  },
  "baking_instructions": {
    "inner_temperature": "Internal temperature"
  },
  "amount": {
    "title": "Servings"
  },
  "baking": {
    "add": "Add baking step",
    "add_inner_temperature": "Add internal temperature",
    "remove_inner_temperature": "Remove internal temperature",
    "time": "Time (min)",
    "temperature": "Temperature (°C)",
    "steam": "Steam",
    "add_label": "Add label",
    "label_et": "Label (ET)",
    "label_en": "Label (EN)"
  },
  "preview_hint": "Add flour and liquid to see preview",
  "import": {
    "hint": "Paste a JSON recipe below and click \"Import\".",
    "placeholder": "{ \"name\": \"My recipe\", \"ingredients\": [...] }",
    "error_format": "Invalid JSON format — name and ingredients are required",
    "error_json": "JSON error: {{message}}"
  }
},
```

- [ ] **Step 2: Add keys to `locales/ee.json`**

Same structure, Estonian values:

```json
"save_blocked": "Eeltaigen liiga väike — vajad vähemalt 10g külmkapi juuretist.",
```

Inside `"edit" > "ingredients"`, add:
```json
"baker_percent_hint": "Muuda % grammi ümberarvutamiseks",
```

Add `"tab"` inside `"edit"`:
```json
"tab": {
  "json": "JSON",
  "import": "Impordi"
},
```

- [ ] **Step 3: Run tests to confirm no regressions**

```bash
npm test
```

Expected: all tests pass (locale files are not exercised by tests, this is a sanity check).

- [ ] **Step 4: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add locales/gb.json locales/ee.json
git commit -m "i18n: add save_blocked, baker_percent_hint, tab keys"
```

---

## Task 2: Fix micronutrient badge format in RecipePreview

**Files:**
- Modify: `components/RecipePreview.tsx:91-97`

- [ ] **Step 1: Update the badge render line**

Current (`RecipePreview.tsx:95`):
```tsx
<div key={type} class="badge badge-ghost badge-sm">{t(`ingredients.title.${type}`) || type}: {fmtG(n.grams)}g / {fmtPct(n.percent)}%</div>
```

Replace with:
```tsx
<div key={type} class="badge badge-ghost badge-sm">{t(`ingredients.title.${type}`) || type} {fmtG(n.grams)}g ({Math.round(n.percent)}%)</div>
```

Changes: drop `: ` and ` / `, wrap percent in `()`, use `Math.round` instead of `fmtPct`.

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/RecipePreview.tsx
git commit -m "ui: simplify micronutrient badge format"
```

---

## Task 3: Add column headers to preview ingredient table

**Files:**
- Modify: `components/RecipePreview.tsx:40-62`

- [ ] **Step 1: Add `<thead>` before the ingredient `<tbody>` groups**

Current (`RecipePreview.tsx:40-44`):
```tsx
<div class="px-4">
  <table class="table w-full">

{bp.ingredients.map((group, gi) => (
    <tbody key={gi}>
```

Replace with:
```tsx
<div class="px-4">
  <table class="table w-full">
    <thead class="print:hidden">
      <tr>
        <th class="font-normal text-xs text-base-content/50 px-0"></th>
        <th class="font-normal text-xs text-base-content/50 text-right">g</th>
        <th class="font-normal text-xs text-base-content/50 text-right">%</th>
      </tr>
    </thead>

{bp.ingredients.map((group, gi) => (
    <tbody key={gi}>
```

The `print:hidden` on `<thead>` keeps the print layout unchanged.

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/RecipePreview.tsx
git commit -m "ui: add g/% column headers to preview table (screen only)"
```

---

## Task 4: Add aria-label to recipe card action buttons

**Files:**
- Modify: `islands/RecipeCard.tsx:31-47`

- [ ] **Step 1: Add `aria-label` to both buttons**

Current:
```tsx
<button
  type="button"
  class="btn btn-sm btn-square"
  title={t("edit.edit")}
  onClick={() => { editingRecipe.value = recipe; }}
>
  <IconEdit />
</button>
<button
  type="button"
  class="btn btn-sm btn-square"
  title={t("edit.copyOf")}
  onClick={() => copyRecipe(recipe)}
>
  <IconCopyPlus />
</button>
```

Replace with:
```tsx
<button
  type="button"
  class="btn btn-sm btn-square"
  title={t("edit.edit")}
  aria-label={t("edit.edit")}
  onClick={() => { editingRecipe.value = recipe; }}
>
  <IconEdit />
</button>
<button
  type="button"
  class="btn btn-sm btn-square"
  title={t("edit.copyOf")}
  aria-label={t("edit.copyOf")}
  onClick={() => copyRecipe(recipe)}
>
  <IconCopyPlus />
</button>
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add islands/RecipeCard.tsx
git commit -m "a11y: add aria-label to recipe card edit/copy buttons"
```

---

## Task 5: Replace braille sort handle with SVG grip icon

**Files:**
- Modify: `islands/RecipeNavigation.tsx:156-159`

- [ ] **Step 1: Replace `⠿` with inline SVG**

Current (`RecipeNavigation.tsx:157`):
```tsx
<li key={recipe.id} class="flex items-center gap-2 p-2 rounded bg-base-200 cursor-grab active:cursor-grabbing">
  <span class="text-base-content/40 select-none">⠿</span>
  <span class="flex-1 text-sm select-none">{nameForLang(recipe.name, language.value)}</span>
</li>
```

Replace with:
```tsx
<li key={recipe.id} class="flex items-center gap-2 p-2 rounded bg-base-200 cursor-grab active:cursor-grabbing">
  <svg width="12" height="16" viewBox="0 0 12 16" fill="currentColor" class="text-base-content/40 select-none flex-shrink-0" aria-hidden="true">
    <circle cx="3" cy="3" r="1.5"/><circle cx="9" cy="3" r="1.5"/>
    <circle cx="3" cy="8" r="1.5"/><circle cx="9" cy="8" r="1.5"/>
    <circle cx="3" cy="13" r="1.5"/><circle cx="9" cy="13" r="1.5"/>
  </svg>
  <span class="flex-1 text-sm select-none">{nameForLang(recipe.name, language.value)}</span>
</li>
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add islands/RecipeNavigation.tsx
git commit -m "ui: replace braille drag handle with SVG grip icon"
```

---

## Task 6: Apply baker% tooltip and tab i18n fixes in EditRecipeDialog

**Files:**
- Modify: `islands/EditRecipeDialog.tsx`

- [ ] **Step 1: Add `title` to the baker% input (`EditRecipeDialog.tsx:357-366`)**

Current:
```tsx
<input
  type="number"
  class="input input-bordered input-xs w-full text-right"
  value={(ing.grams * 100 / dryTotal).toFixed(1)}
  min={0}
  step={0.1}
  onInput={(e) => {
    const pct = Number((e.target as HTMLInputElement).value);
    setGrams(gi, ii, Math.round(pct * dryTotal / 100 * 10) / 10);
  }}
/>
```

Replace with:
```tsx
<input
  type="number"
  class="input input-bordered input-xs w-full text-right"
  title={t("edit.ingredients.baker_percent_hint")}
  value={(ing.grams * 100 / dryTotal).toFixed(1)}
  min={0}
  step={0.1}
  onInput={(e) => {
    const pct = Number((e.target as HTMLInputElement).value);
    setGrams(gi, ii, Math.round(pct * dryTotal / 100 * 10) / 10);
  }}
/>
```

- [ ] **Step 2: Replace hardcoded tab label strings (`EditRecipeDialog.tsx:205`)**

Current:
```tsx
{tab === "edit" ? t("edit.edit") : tab === "json" ? "JSON" : "Import"}
```

Replace with:
```tsx
{tab === "edit" ? t("edit.edit") : tab === "json" ? t("edit.tab.json") : t("edit.tab.import")}
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add islands/EditRecipeDialog.tsx
git commit -m "ui: baker% tooltip and i18n tab labels"
```

---

## Task 7: Add save-blocked hint to modal footer

**Files:**
- Modify: `islands/EditRecipeDialog.tsx:584-594`

- [ ] **Step 1: Add hint paragraph to the edit-tab footer branch**

Current (`EditRecipeDialog.tsx:584-594`):
```tsx
<div class="modal-action flex-none border-t border-base-300 mt-0 pt-3">
  {activeTab.value === "edit" ? (
    <>
      <button type="button" class="btn btn-ghost btn-sm" onClick={close}>{t("actions.cancel")}</button>
      <button type="button" class="btn btn-primary btn-sm" onClick={save} disabled={!canSave}>{t("actions.save")}</button>
    </>
  ) : (
    <button type="button" class="btn btn-ghost btn-sm" onClick={close}>{t("actions.cancel")}</button>
  )}
</div>
```

Replace with:
```tsx
<div class="modal-action flex-none border-t border-base-300 mt-0 pt-3">
  {activeTab.value === "edit" ? (
    <>
      {!canSave && (
        <p class="flex-1 text-xs text-warning self-center">{t("edit.save_blocked")}</p>
      )}
      <button type="button" class="btn btn-ghost btn-sm" onClick={close}>{t("actions.cancel")}</button>
      <button type="button" class="btn btn-primary btn-sm" onClick={save} disabled={!canSave}>{t("actions.save")}</button>
    </>
  ) : (
    <button type="button" class="btn btn-ghost btn-sm" onClick={close}>{t("actions.cancel")}</button>
  )}
</div>
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add islands/EditRecipeDialog.tsx
git commit -m "ui: show reason when save is disabled in edit dialog"
```

---

## Task 8: Restructure baking step editor row (Option C)

**Files:**
- Modify: `islands/EditRecipeDialog.tsx:411-481`

- [ ] **Step 1: Replace the inner flex row of each baking step**

Current (`EditRecipeDialog.tsx:414-461`) — the `<div class="flex gap-2 items-center flex-wrap">` block and its contents:
```tsx
<div class="flex gap-2 items-center flex-wrap">
  <span class="text-xs text-base-content/50 w-full sm:w-auto">{t("edit.baking.time")}</span>
  <input
    type="number" class="input input-bordered input-xs w-16 text-right" min={1}
    value={bt.time.from}
    onInput={(e) => setBakingTimeInterval(i, "time", "from", Number((e.target as HTMLInputElement).value))}
  />
  <span class="text-xs">–</span>
  <input
    type="number" class="input input-bordered input-xs w-16 text-right" min={1}
    value={bt.time.until}
    onInput={(e) => setBakingTimeInterval(i, "time", "until", Number((e.target as HTMLInputElement).value))}
  />
  <span class="text-xs text-base-content/50">{t("edit.baking.temperature")}</span>
  <input
    type="number" class="input input-bordered input-xs w-16 text-right" min={1}
    value={bt.temperature.from}
    onInput={(e) => setBakingTimeInterval(i, "temperature", "from", Number((e.target as HTMLInputElement).value))}
  />
  <span class="text-xs">–</span>
  <input
    type="number" class="input input-bordered input-xs w-16 text-right" min={1}
    value={bt.temperature.until}
    onInput={(e) => setBakingTimeInterval(i, "temperature", "until", Number((e.target as HTMLInputElement).value))}
  />
  <label class="flex items-center gap-1 cursor-pointer">
    <input
      type="checkbox" class="checkbox checkbox-xs"
      checked={bt.steam}
      onChange={(e) => setBakingTimeSteam(i, (e.target as HTMLInputElement).checked)}
    />
    <span class="text-xs">{t("edit.baking.steam")}</span>
  </label>
  <div class="ml-auto flex gap-1">
    <button type="button" class="btn btn-xs btn-ghost"
      onClick={() => {
        if (hasLabel) {
          updateDraft((c) => { c.bakingTime[i].label = undefined; });
        } else {
          updateDraft((c) => { c.bakingTime[i].label = { et: "", en: "" }; });
        }
      }}>
      {hasLabel ? "–" : "+"} {t("edit.baking.add_label")}
    </button>
    <button type="button" class="btn btn-xs btn-ghost text-error" onClick={() => delBakingTime(i)}>×</button>
  </div>
</div>
```

Replace with:
```tsx
<div class="flex items-end gap-3 flex-wrap">
  <div>
    <div class="text-xs text-base-content/50 mb-1">{t("edit.baking.time")}</div>
    <div class="flex items-center gap-1 border border-base-300 rounded px-2 py-1">
      <input
        type="number" class="input input-xs w-14 text-right" min={1}
        value={bt.time.from}
        onInput={(e) => setBakingTimeInterval(i, "time", "from", Number((e.target as HTMLInputElement).value))}
      />
      <span class="text-xs text-base-content/50">–</span>
      <input
        type="number" class="input input-xs w-14" min={1}
        value={bt.time.until}
        onInput={(e) => setBakingTimeInterval(i, "time", "until", Number((e.target as HTMLInputElement).value))}
      />
    </div>
  </div>
  <div>
    <div class="text-xs text-base-content/50 mb-1">{t("edit.baking.temperature")}</div>
    <div class="flex items-center gap-1 border border-base-300 rounded px-2 py-1">
      <input
        type="number" class="input input-xs w-16 text-right" min={1}
        value={bt.temperature.from}
        onInput={(e) => setBakingTimeInterval(i, "temperature", "from", Number((e.target as HTMLInputElement).value))}
      />
      <span class="text-xs text-base-content/50">–</span>
      <input
        type="number" class="input input-xs w-16" min={1}
        value={bt.temperature.until}
        onInput={(e) => setBakingTimeInterval(i, "temperature", "until", Number((e.target as HTMLInputElement).value))}
      />
    </div>
  </div>
  <label class="flex items-center gap-1 cursor-pointer pb-1">
    <input
      type="checkbox" class="checkbox checkbox-xs"
      checked={bt.steam}
      onChange={(e) => setBakingTimeSteam(i, (e.target as HTMLInputElement).checked)}
    />
    <span class="text-xs">{t("edit.baking.steam")}</span>
  </label>
  <div class="ml-auto flex gap-1 pb-1">
    <button type="button" class="btn btn-xs btn-ghost"
      onClick={() => {
        if (hasLabel) {
          updateDraft((c) => { c.bakingTime[i].label = undefined; });
        } else {
          updateDraft((c) => { c.bakingTime[i].label = { et: "", en: "" }; });
        }
      }}>
      {hasLabel ? "–" : "+"} {t("edit.baking.add_label")}
    </button>
    <button type="button" class="btn btn-xs btn-ghost text-error" onClick={() => delBakingTime(i)}>×</button>
  </div>
</div>
```

Note: `input input-xs` (without `input-bordered`) inside the pill container avoids double borders. The pill container's `border border-base-300 rounded` provides the grouping visual.

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add islands/EditRecipeDialog.tsx
git commit -m "ui: restructure baking step editor with grouped pill inputs"
```

---

## Task 9: Add +/− stepper to servings input

**Files:**
- Modify: `islands/EditRecipeDialog.tsx:237-246`

- [ ] **Step 1: Wrap the servings input in a join group**

Current (`EditRecipeDialog.tsx:237-246`):
```tsx
<label class="input input-bordered input-sm flex items-center gap-2 w-fit">
  <span class="label-text text-base-content/60">{t("edit.amount.title")}</span>
  <input
    type="number"
    class="w-16 text-right"
    value={d.amount}
    min={1}
    onInput={(e) => setAmount(Number((e.target as HTMLInputElement).value))}
  />
</label>
```

Replace with:
```tsx
<div class="flex items-center gap-2">
  <span class="label-text text-sm text-base-content/60">{t("edit.amount.title")}</span>
  <div class="join">
    <button
      type="button"
      class="btn btn-sm join-item"
      disabled={d.amount <= 1}
      onClick={() => setAmount(d.amount - 1)}
    >−</button>
    <input
      type="number"
      class="input input-bordered input-sm join-item w-16 text-center"
      value={d.amount}
      min={1}
      onInput={(e) => setAmount(Number((e.target as HTMLInputElement).value))}
    />
    <button
      type="button"
      class="btn btn-sm join-item"
      onClick={() => setAmount(d.amount + 1)}
    >+</button>
  </div>
</div>
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add islands/EditRecipeDialog.tsx
git commit -m "ui: add +/- stepper to servings field"
```

---

## Task 10: Fix delete ingredient button tap target

**Files:**
- Modify: `islands/EditRecipeDialog.tsx:373`

- [ ] **Step 1: Remove `px-1` override**

Current (`EditRecipeDialog.tsx:373`):
```tsx
<button type="button" class="btn btn-xs btn-ghost text-error px-1" onClick={() => delIng(gi, ii)}>×</button>
```

Replace with:
```tsx
<button type="button" class="btn btn-xs btn-ghost text-error" onClick={() => delIng(gi, ii)}>×</button>
```

- [ ] **Step 2: Type-check and run tests**

```bash
npx tsc --noEmit && npm test
```

Expected: no errors, all tests pass.

- [ ] **Step 3: Commit**

```bash
git add islands/EditRecipeDialog.tsx
git commit -m "ui: restore standard tap target on delete ingredient button"
```

---

## Final check

- [ ] **Run the dev server and verify all 10 changes visually**

```bash
npm run dev
```

Open http://localhost:5173. Check:
1. Open an existing recipe — preview table has `g` / `%` headers; nutrient badges show `Salt 3.2g (15%)` style
2. Open edit dialog — tabs show translated labels; baking steps show labeled pill groups; servings has +/− buttons; delete ingredient button is wider
3. Clear all ingredients in edit dialog — save button stays disabled and a warning appears to the left of the buttons
4. Hover the baker% column in the edit table — tooltip appears
5. Open sort modal — 6-dot SVG grip icon visible
6. Open in a second browser tab at narrow width (~375px) and repeat checks 2–4

- [ ] **Print preview check**

In the browser, open Print Preview (Cmd+P). Confirm:
- No column headers appear on the printed recipe
- Recipe content still fits on one page (A4)

- [ ] **Final commit if anything was missed**

```bash
git add -A
git status  # confirm only expected files
git commit -m "ui: ux improvements — final cleanup"
```
