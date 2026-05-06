# UX Improvements Design

Date: 2026-05-06  
Scope: All 10 issues identified in the UX review

## Print constraint

Each recipe card uses `print:break-after-page` — one card per A4 page. Any change to `RecipePreview.tsx` that adds vertical DOM nodes must carry `print:hidden` or must not add height on print.

---

## 1. Save button: silent failure fix

**File:** `islands/EditRecipeDialog.tsx`, `locales/ee.json`, `locales/gb.json`

When `canSave` is false (fridge starter < 10g), add a hint in the modal footer. The footer is `flex` with buttons right-aligned; add a `flex-1` `<p>` on the left side of that same row. It renders only when `!canSave`, keeping the footer height constant.

New locale keys:
- `edit.save_blocked` — `"Levain too small — need at least 10g fridge starter."` (EN) / equivalent ET

No change to `canSave` logic or any calculation.

---

## 2. Baking step editor: inline with grouped inputs (Option C)

**File:** `islands/EditRecipeDialog.tsx`

Replace the current single flat `flex` row with a layout where each range pair (time, temperature) is wrapped in a visually grouped pill container with its label above it:

```
[Time (min)]           [Temp (°C)]
[ from ] – [ until ]   [ from ] – [ until ]    ☐ Steam    [+ label] [×]
```

Implementation:
- Each pair: `<div>` with `<div class="text-xs text-base-content/50 mb-1">` label above, then `<div class="flex items-center gap-1 border border-base-300 rounded px-2 py-1">` wrapping the two inputs and dash.
- The outer row: `flex items-end gap-3 flex-wrap`
- Steam checkbox and action buttons align to `items-center` with `ml-auto` on the button group.
- Label inputs (when toggled) remain in a second row below, unchanged.
- No changes to handlers (`setBakingTimeInterval`, `setBakingTimeSteam`, `setBakingTimeLabel`).

---

## 3. Recipe card buttons: accessibility

**File:** `islands/RecipeCard.tsx`

Add `aria-label` to both icon buttons using existing locale values:
- Edit button: `aria-label={t("edit.edit")}`
- Copy button: `aria-label={t("edit.copyOf")}`

No visible text label added. No layout change.

---

## 4. Preview table: column headers

**File:** `components/RecipePreview.tsx`

Add a `<thead>` row to the ingredient table with three columns:
- Left: empty (ingredient name is self-evident)
- Right: `g`
- Right: `%`

Styling: `text-xs text-base-content/50`  
**Print:** `<thead>` carries `print:hidden` — headers do not appear on paper.

---

## 5. Baker% edit column: affordance tooltip

**File:** `islands/EditRecipeDialog.tsx`, `locales/ee.json`, `locales/gb.json`

Add `title={t("edit.ingredients.baker_percent_hint")}` to the baker% `<input>` in the edit table.

New locale keys:
- `edit.ingredients.baker_percent_hint` — `"Edit % to recalculate grams"` (EN) / equivalent ET

No layout change.

---

## 6. i18n: hardcoded tab labels

**File:** `islands/EditRecipeDialog.tsx`, `locales/ee.json`, `locales/gb.json`

Replace hardcoded `"JSON"` and `"Import"` strings in the tab renderer with `t()` calls.

New locale keys:
- `edit.tab.json` — `"JSON"` (same in both languages)
- `edit.tab.import` — `"Import"` (EN) / `"Impordi"` (ET)

---

## 7. Micronutrient badges: format

**File:** `components/RecipePreview.tsx`

Change badge display from `name: Xg / Y.YY%` to `Name Xg (Y%)`:
- Drop the `:` and `/`
- Round percent to nearest integer (`Math.round`)
- Use title-cased output from `t()` as-is (no extra transform needed — locale keys already use title case)

Affects only the `DISPLAYABLE_NUTRIENTS_TYPE_ARRAY` badge map. No print impact (format change only, no height change).

---

## 8. Servings: +/− stepper

**File:** `islands/EditRecipeDialog.tsx`

Wrap the servings `<input type="number">` in a DaisyUI `join` group:

```
[ − ] [ input ] [ + ]
```

- `−` button: calls `setAmount(d.amount - 1)`, `disabled={d.amount <= 1}`
- `+` button: calls `setAmount(d.amount + 1)`
- Input retains `type="number"` with `min={1}` for direct entry
- Buttons use `btn btn-sm` (same height as the input at `input-sm`)

Edit dialog only — no print impact.

---

## 9. Sort handle: SVG grip icon

**File:** `islands/RecipeNavigation.tsx`

Replace the `⠿` braille character with an inline SVG 6-dot grip (2 columns × 3 rows, ~12×16px), colored `currentColor` with `class="text-base-content/40"`. No new dependency.

SVG reference (6 dots, standard drag handle):
```svg
<svg width="12" height="16" viewBox="0 0 12 16" fill="currentColor">
  <circle cx="3" cy="3" r="1.5"/><circle cx="9" cy="3" r="1.5"/>
  <circle cx="3" cy="8" r="1.5"/><circle cx="9" cy="8" r="1.5"/>
  <circle cx="3" cy="13" r="1.5"/><circle cx="9" cy="13" r="1.5"/>
</svg>
```

---

## 10. Delete ingredient button: tap target

**File:** `islands/EditRecipeDialog.tsx`

Remove the `px-1` override from the delete ingredient button. Use standard `btn btn-xs btn-ghost text-error` padding (~24px wide vs current ~16px).

---

## Files changed summary

| File | Sections |
|------|----------|
| `islands/EditRecipeDialog.tsx` | 1, 2, 5, 6, 8, 10 |
| `islands/RecipeCard.tsx` | 3 |
| `islands/RecipeNavigation.tsx` | 9 |
| `components/RecipePreview.tsx` | 4, 7 |
| `locales/gb.json` | 1, 5, 6 |
| `locales/ee.json` | 1, 5, 6 |
