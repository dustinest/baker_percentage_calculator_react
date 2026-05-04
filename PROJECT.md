# Baker's Percentage Calculator — Complete Project Reference

## Purpose

A client-side bread-baking tool that helps bakers manage recipes and calculate **baker's percentages** — the professional convention of expressing every ingredient as a percentage of total dry/flour weight. The app also automatically splits any recipe into a minimal 2-step sourdough process (levain + final dough).

Entirely frontend. No server, no database. All data lives in memory. No persistence between sessions (localStorage was scaffolded in the code but commented out).

---

## Core Features

### 1. Recipe List & Navigation
- Left-side drawer lists all available recipes
- User selects which recipes to display (multi-select, check/uncheck all)
- Selected recipes shown as cards in the main area
- Badge on the drawer button shows how many are currently selected
- Language switcher (EE / EN) in the drawer

### 2. Baker's Percentage Calculation
- Every ingredient expressed as grams **and** as % of total dry weight (flour + dry)
- Separate table per ingredient group (levain / dough / lamination / etc.)
- Updates live when any ingredient changes

### 3. Micro Nutrients Summary
- Aggregated per recipe across all groups: total dry, water, salt, sugar, fat
- Displayed as grams and % of dry weight
- Whole grain and ash are tracked internally but not displayed

### 4. Sourdough Levain Auto-Calculator
Full 5-step pipeline — see the Algorithm section below.

### 5. Recipe Editing (full CRUD)
- Edit name, ingredient grams, group names, description
- Copy recipe (creates a new editable duplicate)
- Create new recipe from scratch
- Baking time editor: multiple phases, each with time (fixed or range), temperature, steam flag
- Inner temperature target range (from / until °C)
- Scale by portion count — optionally recalculates all ingredient grams proportionally
- Add / remove ingredient groups
- Mark a group as sourdough pre-dough (`starter: true`)
- Hydration editor: change the % hydration of a group and have water ingredients adjusted automatically

### 6. Print View
- `window.print()` → A4 layout
- Navigation, drawers, action buttons hidden (`displayPrint: none`)
- Each recipe card gets its own page break

### 7. JSON Export / Import
- Edit dialog shows the recipe serialised as JSON (expandable accordion)
- Useful for copying a recipe back into the predefined dataset
- **Import does not exist yet** — export only

### 8. Internationalisation
- Languages: **Estonian** (`ee`, default) and **English** (`gb`)
- i18next with nested key format
- Recipe names, ingredient names, UI strings all translated

---

## Algorithm: Full Sourdough Levain Pipeline

This is the most important and most complex part of the app. The pipeline runs every time a recipe is displayed or edited.

### Entry point

```
recalculateRecipeBakerPercentage(recipe)
  → splitStarterAndDough(recipe.ingredients)   // levain split
  → recalculateBakerPercentage(splitResult)    // baker % calculation
```

A prioritised blocking queue (`typescript-blocking-queue`) serialises these calls so rapid edits don't overlap.

---

### Step A — Resolve percent-based ingredients to grams

File: `src/service/PredefinedRecipeService/RecipeReader/readJsonRecipe.ts`

Ingredients can be specified as baker's percentages instead of absolute grams. The conversion:

```
totalFlourAmount = 100 × sum(grams × dryPercent/100) / remainingDryPercent

resolvedGrams = Math.round(percent_value × totalFlourAmount / 10) / 10
```

The `/10 … /10` pattern rounds to **1 decimal place**.

**Critical detail — dry extras inflate totalFlourAmount.** Ingredients with `NutritionType.dry` (BARLEY, SEEDS) count toward `totalFlourAmount` even though they are not flour. Example: "Sai seemnete" has WHEAT_550 462g + BARLEY 10g + SEEDS 12g → `totalFlourAmount = 484g`, not 462g. This makes water and salt percentages slightly different than if calculated on flour alone.

Examples:
| Recipe | Ingredient | % input | totalFlour | Resolved grams |
|---|---|---|---|---|
| Sai | WATER | 82% | 462g | 378.8g |
| Sai | SALT | 1.62% | 462g | 7.5g |
| Täisteraleib | WATER | 100% | 425g | 425g |
| Täisteraleib | SALT | 1.76% | 425g | 7.5g |
| Sai seemnete | WATER | 73.76% | 484g | 357g |
| Vastlakuklid | CARDAMOM | 0.2% | 483g | 1g |
| Kaneelirullid | CINNAMON | 3.28% | 483g | 15.8g |
| Pizza | SALT | — | — | 7.5g (entered as grams) |

---

### Step B — Classify ingredients into flour / liquid / other

File: `src/service/SourdoughStarter/calculateDryAndLiquid.ts`

Each ingredient is assigned to exactly one bucket based on its `nutrients`:

| Bucket | Condition | Examples |
|---|---|---|
| **Flour** | has `NutritionType.flour` | All flour types |
| **Liquid** | has `NutritionType.water` | WATER, MILK, BUTTER (18% water) |
| **Other** | neither flour nor water | SALT, SUGAR, EGG, OLIVE_OIL, BARLEY, SEEDS, CARDAMOM, CINNAMON |

Totals are normalised to their pure component:
- `totals.flour` = sum of `grams × 100 / flourPercent` per flour ingredient
- `totals.liquid` = sum of `grams × 100 / waterPercent` per liquid ingredient
- `totals.water` = same but only for ingredients that are **100% water**

**Rule — dry extras (BARLEY, SEEDS) never enter the levain.** They have `NutritionType.dry` with no flour or water, so they fall into `other` and always go to the dough.

**Note on BUTTER** — BUTTER has 18% water so it appears in the liquid bucket. Its normalised liquid equivalent is very large (`grams × 100/18`). This raises `totals.liquid` significantly but `totals.water` not at all (only 100%-water ingredients affect `totals.water`). This matters for which levain condition fires.

---

### Step C — Decide levain amounts

File: `src/service/SourdoughStarter/SourDoughStarterCalculator.ts`

```
fridge_culture = min(floor(totals.flour × 2%), 11g)   // capped at 11g
```

Four conditions checked **in this order**:

| # | Condition | Levain flour | Note |
|---|---|---|---|
| 1 | `totals.liquid / totals.flour < 30%` | `floor(totals.liquid)` | Very stiff dough — use all liquid |
| 2 | `10% < totals.water / totals.flour < 40%` | `floor(totals.water)` | Small pure-water fraction |
| 3 | Any flour ingredient has `NutritionType.whole_grain` | `floor(totals.flour × 50%)` | Whole grain formula |
| 4 | Default | `floor(totals.flour × 26%)` | Normal white-flour hydration |

```
levain_flour_amount = condition_result − fridge_culture

// White flour (conditions 1, 2, 4):
levain_liquid_amount = levain_flour_amount   // 1:1, levain is 100% hydration

// Whole grain (condition 3):
levain_liquid_amount = floor(totals.liquid × 62%)
```

The percentages (26%, 50%, 62%) were chosen empirically so that typical recipe sizes produce practical whole-gram numbers.

**Which condition fires per recipe:**

| Recipe | totals.flour | totals.water | totals.liquid | Condition | fridge | levain flour | levain liquid |
|---|---|---|---|---|---|---|---|
| Täisteraleib | 425 | 425 | 425 | whole_grain (3) | 8 | 212 | 263 |
| Sai | 462 | 378.8 | 378.8 | default (4) | 9 | 111 | 111 |
| Sai seemnete | 462 | 357 | 357 | default (4) | 9 | 111 | 111 |
| Croissant | 500 | 140 | 283.6 | water 10-40% (2) | 10 | 130 | 130 |
| Pannkook | 362 | 129.5 | 594.6 | water 10-40% (2) | 7 | 122 | 122 |
| Pizza | 515 | 340 | 340 | whole_grain (3) | 10 | 257 | 210 |
| Vastlakuklid | 483 | 83 | 715 | water 10-40% (2) | 9 | 74 | 74 |
| Kaneelirullid | 483 | 83 | 715 | water 10-40% (2) | 9 | 74 | 74 |
| Plaadikook | 808 | 123 | 1629 | water 10-40% (2) | 11* | 112 | 112 |
| Pikk sai | 340 | 142 | 229 | default (4)† | 6 | 82 | 82 |
| Moskva saiakesed | 408 | 130 | 551 | water 10-40% (2) | 8 | 122 | 122 |

\* Fridge capped at 11g (floor(808×2%)=16 → capped).
† Pikk sai: water/flour = 142/340 = 41.8% — just above the 40% upper bound, so condition 2 does NOT fire and it falls to default.

---

### Step D — Assign ingredients to levain vs dough

File: `src/service/SourdoughStarter/IngredientStarterService.ts`

The levain group is built by processing the flour bucket first, then the liquid bucket, filling up to their respective amounts. Any remainder goes to the dough (leftovers).

The levain group always starts with the fridge culture entry:
```
{ name: "ingredient.sourdough_starter.name",
  grams: fridge_flour + fridge_liquid,
  nutrients: [50% flour, 50% water] }
```

**Special path for `starter: true` groups**

When the first ingredient group is flagged `starter: true` (currently only Pannkook), the algorithm runs differently: instead of splitting the group's ingredients between levain and dough, the algorithm keeps ALL ingredients in the pre-dough group and only subtracts the fridge amount from the flour. The flour goes from `362g → 362−7 = 355g`. The water slot is still filled from WATER. MILK (which wouldn't normally enter the levain) stays in the group because the entire group is the pre-dough.

**Rule — milk follows water into the levain when water barely covers the slot (NOT YET IMPLEMENTED)**

When WATER exactly fills the levain liquid budget leaving 0 g of pure water for the dough, ALL milk must also move into the levain. The rationale: if the dough would receive zero free water, it is hydrated entirely by milk — in this case milk belongs with the levain for fermentation.

Threshold: `ingredient_water_grams − levain_liquid_amount − fridge = 0`

| Recipe | Water grams | Fridge | Budget | Leftover water | Milk grams | Rule fires? |
|---|---|---|---|---|---|---|
| Vastlakuklid | 83 | 9 | 74 | 0 | 210 | **YES** — milk → levain |
| Plaadikook | 123 | 11 | 112 | 0 | 385 | **YES** — milk → levain |
| Croissant | 140 | 10 | 130 | 0 | 140 | **YES** — milk → levain |
| Moskva saiakesed | 130 | 8 | 122 | 0 | 140 | **YES** — milk → levain |
| Sai | 378.8 | 9 | 111 | 258.8 | — | no milk |
| Pikk sai | 142 | 6 | 82 | 54 | 85 | no — water remains |
| Pannkook | 129.5 | 7 | 122 | 0 | 454 | handled by `starter:true` |

**The current React implementation does NOT implement this rule.** The `tests/fixtures/` files for Vastlakuklid, Plaadikook, Croissant, and Moskva saiakesed reflect the current (broken) behaviour. Each of those fixtures has `"fixtureStatus": "CURRENT_BEHAVIOUR"` to mark this.

---

### Step E — Sort ingredient order within each group

File: `src/service/SourdoughStarter/IngredientsSort.ts`

Display sort priority (water → flour → fat → salt → sugar). Any ingredient whose dominant nutrient is >80% of that type gets sorted by position in that priority list.

The fridge culture entry (50% flour, 50% water) hits a **known bug**: the condition `flour === 50 && flour === 50` (checks flour twice, should check `flour === 50 && water === 50`) always evaluates true when flour is exactly 50%, which returns sort value 0 — placing it first before all other water ingredients. This accidentally produces the correct visual result (fridge culture always appears first in the levain).

Sort order for "add ingredient" dropdown: flour → water → fat → salt → sugar (slightly different from display order).

---

### Step F — Baker's percentage calculation

File: `src/service/BakerPercentage/lib/BakerPercentageCalulation.ts`
File: `src/service/BakerPercentage/lib/MicroNutrientsCalculator.ts`

The `dryTotal` denominator is the sum of the **maximum dry nutrient contribution** per ingredient across all groups (including levain):

```
dryTotal = Σ max(grams × dryNutrientPercent/100)   for each ingredient
           where DRY_NUTRIENTS = [NutritionType.flour, NutritionType.dry]
```

The fridge culture (50% flour, 50% water) contributes `fridge_grams × 0.5` to the dry total.

Baker percent for each ingredient = `ingredient.grams / dryTotal × 100`

Micro nutrients are the aggregated gram totals per `NutritionType` across all groups. Only `[water, salt, sugar, fat, other]` are displayed; `whole_grain` and `ash` are tracked but not shown.

---

### Display rounding

Individual ingredient grams are displayed as **integers** (the app rounds for display). Baker percentages are displayed to **2 decimal places**. Total weights use **precise unrounded values**. The `tests/fixtures/` files store precise values; the PDF shows the rounded display values.

---

## Verified Recipe Outputs (from PDF print)

All values verified by tracing source code. Grams are precise calculated values; the PDF displays grams rounded to nearest integer.

### Täisteraleib (Whole grain rye bread) — total 857.5g
**Levain:** Juuretis 16g (3.76%) · Vesi 263g (61.88%) · Täistera rukkijahu 212g (49.88%)
**Dough:** Vesi 154g (36.24%) · Täistera rukkijahu 185g (43.53%) · Rukkilinnase jahu 20g (4.71%) · Sool 7.5g (1.76%)
**Baker%:** dry=425g · water=425g (100%) · salt=7.5g (1.76%)
**Baking:** steam 20 min 240°C → 40 min 240°C · inner 88–99°C

### Sai (Wheat bread) — total 848.3g
**Levain:** Juuretis 18g (3.90%) · Vesi 111g (24.03%) · Nisujahu 550 111g (24.03%)
**Dough:** Vesi 258.8g (56.02%) · Nisujahu 550 342g (74.03%) · Sool 7.5g (1.62%)
**Baker%:** dry=462g · water=378.8g (81.99%) · salt=7.5g (1.62%)
**Baking:** steam 20 min 240°C → 20 min 240°C · inner 88–99°C

### Sai seemnete ja kaerahelvestega — total 848.5g
**Levain:** Juuretis 18g (3.72%) · Vesi 111g (22.93%) · Nisujahu 550 111g (22.93%)
**Dough:** Vesi 237g (48.97%) · Nisujahu 550 342g (70.66%) · Sool 7.5g (1.55%) · Kaer 10g (2.07%) · Seemned 12g (2.48%)
**Baker%:** dry=484g (462 flour + 10 barley + 12 seeds) · water=357g (73.76%) · salt=7.5g (1.55%)
**Baking:** steam 20 min 240°C → 20 min 240°C · inner 88–99°C

### Croissant — total 1167g (dough 887g + lamination 280g)
**Levain:** Juuretis 20g (4.00%) · Vesi 130g (26.00%) · Nisujahu 550 130g (26.00%)
**Dough:** Piim 140g (28.00%) · Nisujahu 550 360g (72.00%) · Või 40g (8.00%) · Sool 12g (2.40%) · Suhkur 55g (11.00%)
**Lamination:** Või 280g (56.00%)
**Baker%:** dry=500g · water=334.1g (66.82%) · salt=12g (2.40%) · sugar=55g (11.00%) · fat=266.3g (53.26%)
**Baking:** 20–30 min 210°C · inner 82–88°C
⚠ Milk rule not implemented: MILK 140g should be in levain (water leftover=0)

### Pannkook (Pancake) — total 1272.5g
**Levain (starter:true path):** Juuretis 14g (3.87%) · Vesi 122g (33.70%) · Piim 454g (125.41%) · Nisujahu 550 355g (98.07%)
**Dough:** Või 50g (13.81%) · Sool 7.5g (2.07%) · Suhkur 14g (3.87%) · 4 muna 256g (70.72%)
**Baker%:** dry=362g · water=580.65g (160.40%) · salt=7.5g (2.07%) · sugar=14g (3.87%) · fat=53.7g (14.84%)

### Pizza (×3) — total 889.9g (1/3 = 296.6g)
**Levain:** Juuretis 20g (3.88%) · Vesi 210g (40.78%) · Durum jahu 257g (49.90%)
**Dough:** Vesi 120g (23.30%) · Durum jahu 248g (48.16%) · Oliivõli 27.44g (5.33%) · Sool 7.5g (1.46%)
**Baker%:** dry=515g · water=340g (66.02%) · salt=7.5g (1.46%) · fat=27.44g (5.33%)
**Baking:** 18–30 min 210°C

### Vastlakuklid (Semla, ×18) — total 907g (1/18 = 50.3g)
**Levain:** Juuretis 18g (3.73%) · Vesi 74g (15.32%) · Nisujahu 405 74g (15.32%)
**Dough (current):** Piim 210g (43.48%) · Nisujahu 405 400g (82.82%) · Või 75g (15.53%) · Sool 5g (1.04%) · Pruunsuhkur 50g (10.35%) · Kardemon 1g (0.21%)
**Baker%:** dry=483g · water=301.25g (62.37%) · salt=5g (1.04%) · sugar=50g (10.35%) · fat=67.38g (13.95%)
**Baking:** 20–25 min 180°C · inner 82–88°C
⚠ Milk rule not implemented: MILK 210g should be in levain (water leftover=0)

### Kaneelirullid (Cinnamon rolls) — total 1130.8g (dough 907g + cinnamon 223.8g)
Same levain and dough as Vastlakuklid.
**Cinnamon layer:** Või 112g (23.19%) · Sool 1g (0.21%) · Suhkur 95g (19.67%) · Kaneel 15.8g (3.27%)
**Baker%:** dry=483g · water=321.41g (66.54%) · salt=6g (1.24%) · sugar=145g (30.02%) · fat=159.22g (32.96%)
**Baking:** 20–25 min 210°C · inner 82–88°C
⚠ Milk rule not implemented (same as Vastlakuklid)

### Plaadikook (Pie dough) — total 1523.5g
**Levain:** Juuretis 22g (2.72%) · Vesi 112g (13.86%) · Nisujahu 550 112g (13.86%)
**Dough (current):** Piim 385g (47.65%) · Nisujahu 550 685g (84.78%) · Või 200g (24.75%) · Sool 7.5g (0.93%)
**Baker%:** dry=808g · water=534.375g (66.14%) · salt=7.5g (0.93%) · fat=174.78g (21.63%)
**Baking:** 20–30 min 210°C · inner 82–88°C
⚠ Milk rule not implemented: MILK 385g should be in levain (water leftover=0); fridge capped at 11g

### Pikk sai (Baguette, ×2) — total 573g (1/2 = 286.5g)
**Levain:** Juuretis 12g (3.53%) · Vesi 82g (24.12%) · Nisujahu 550 82g (24.12%)
**Dough:** Vesi 54g (15.88%) · Piim 85g (25.00%) · Nisujahu 550 252g (74.12%) · Sool 6g (1.76%)
**Baker%:** dry=340g · water=224.875g (66.14%) · salt=6g (1.76%) · fat=2.38g (0.70%)
**Baking:** steam 10 min 180°C → 15–20 min 180°C · inner 82–88°C
✓ Milk rule does NOT fire (54g water leftover in dough)

### Moskva saiakesed (Moscow pastries) — total 846g (dough 746g + lamination 100g)
**Levain:** Juuretis 16g (3.92%) · Vesi 122g (29.90%) · Nisujahu 405 122g (29.90%)
**Dough (current):** Piim 140g (34.31%) · Nisujahu 405 278g (68.14%) · Või 50g (12.25%) · Sool 2g (0.49%) · Pruunsuhkur 16g (3.92%)
**Lamination:** Või 100g (24.51%)
**Baker%:** dry=408g · water=293.5g (71.94%) · salt=2g (0.49%) · sugar=16g (3.92%) · fat=126.92g (31.11%)
**Baking:** 20–25 min 180°C · inner 82–88°C
⚠ Milk rule not implemented: MILK 140g should be in levain (water leftover=0)

---

## Data Model

```
RecipeType
  id: string
  name: string                        // translation key if available, otherwise raw name
  amount: number                      // portions / loaves
  description?: string
  bakingTime: BakingTimeType[]
  innerTemperature?: NumberInterval   // { from, until } °C
  ingredients: RecipeIngredientsType[]

RecipeIngredientsType
  name?: string                       // optional group name e.g. "Kihistamiseks"
  starter: boolean                    // true = sourdough pre-dough special path
  description?: string
  bakingTime: BakingTimeType[]
  innerTemperature?: NumberInterval
  ingredients: IngredientGramsType[]

IngredientGramsType
  id: string
  name: string                        // translation key e.g. "ingredient.predefined.flour.wheat.generic"
  grams: number
  nutrients: NutrientPercentType[]    // [{ type: NutritionType, percent: number }]

BakingTimeType
  time: NumberInterval                // { from, until } minutes — single value stored as {from:N, until:N}
  temperature: NumberInterval         // { from, until } °C
  steam: boolean

NumberInterval { from: number, until: number }

NutritionType (enum)
  flour | dry | water | salt | sugar | fat | spice | egg | other | whole_grain | ash

DRY_NUTRIENTS = [flour, dry]          // used as the baker% denominator
DISPLAYABLE_NUTRIENTS = [water, salt, sugar, fat, other]   // shown in micro nutrients panel
```

---

## Standard Ingredients

18 predefined ingredients (ingredient key → id → translation key):

| Key | Nutrition profile |
|---|---|
| SALT | salt 100% |
| SUGAR | sugar 100% |
| SUGAR_BROWN | sugar 100% |
| WATER | water 100% |
| BUTTER | fat 82%, water 18% |
| OIL | fat 82% |
| OLIVE_OIL | fat 100% |
| MILK | fat 2.8%, water 97.5% |
| EGG | egg 100% |
| CARDAMOM | spice 100% |
| CINNAMON | spice 100% |
| WHOLE_RYE_FLOUR | flour 100%, whole_grain 100% |
| WHOLE_RYE_MALT_FLOUR | flour 100%, whole_grain 100% |
| WHOLE_WHEAT_FLOUR | flour 100%, whole_grain 100% |
| DURUM_WHEAT | flour 100%, whole_grain 100% |
| WHEAT_405_FLOUR | flour 100%, ash 405 |
| WHEAT_550_FLOUR | flour 100%, ash 550 |
| BARLEY | dry 100% |
| SEEDS | dry 100% |

**Whole-grain trigger:** any ingredient with `NutritionType.whole_grain` in its nutrients causes the whole-grain levain formula (50%/62%) to apply for the entire recipe.

**Liquid bucket membership:** BUTTER (18% water), MILK (97.5% water) both enter the liquid bucket. OLIVE_OIL (100% fat, no water) does not.

---

## Predefined Recipes — Input Definitions

```typescript
// All defined in src/service/PredefinedRecipeService/data/PredefinedRecipes.ts
// Ingredients specified as either { type, grams } or { type, percent }
// percent is baker's percentage relative to total dry weight
```

| Recipe | Portions | Key ingredients |
|---|---|---|
| Täisteraleib | 1 | WHOLE_RYE_FLOUR 405g, WHOLE_RYE_MALT_FLOUR 20g, WATER 100%, SALT 1.76% |
| Sai | 1 | WHEAT_550_FLOUR 462g, WATER 82%, SALT 1.62% |
| Sai seemnete | 1 | WHEAT_550_FLOUR 462g, BARLEY 10g, SEEDS 12g, WATER 73.76%, SALT 1.55% |
| Croissant | 1 | WHEAT_550_FLOUR 500g, WATER 140g, MILK 140g, SUGAR 11%, BUTTER 40g, SALT 2.4%, [lam] BUTTER 280g |
| Pannkook | 1 | [starter] WHEAT_550_FLOUR 362g, WATER 129.5g, MILK 454g · BUTTER 50g, SALT 7.5g, SUGAR 14g, EGG 256g |
| Pizza | 3 | DURUM_WHEAT 515g, WATER 340g, OLIVE_OIL 27.44g, SALT 7.5g |
| Vastlakuklid | 18 | WHEAT_405_FLOUR 483g, WATER 83g, MILK 210g, BUTTER 75g, SALT 5g, SUGAR_BROWN 50g, CARDAMOM 0.2% |
| Kaneelirullid | 1 | same dough as Vastlakuklid + [cinnamon] CINNAMON 3.28%, BUTTER 112g, SALT 1g, SUGAR 95g |
| Plaadikook | 1 | WHEAT_550_FLOUR 808g, WATER 123g, MILK 385g, BUTTER 200g, SALT 7.5g |
| Pikk sai | 2 | WHEAT_550_FLOUR 340g, WATER 142g, MILK 85g, SALT 6g |
| Moskva saiakesed | 1 | WHEAT_405_FLOUR 408g, WATER 130g, MILK 140g, SUGAR_BROWN 16g, BUTTER 50g, SALT 2g, [lam] BUTTER 100g |

---

## Current Technology Stack

| Layer | Technology | Notes |
|---|---|---|
| Language | TypeScript 4.9 | Stuck at 4.9; latest is 5.x |
| Framework | React 18.3 | |
| Build | Vite 7.x | |
| Package manager | npm ≥10 + Node ≥20 | |
| UI | MUI 6.x + Emotion | ~500 KB gzipped — very heavy |
| i18n | i18next + react-i18next | |
| Notifications | notistack | Snackbar toasts |
| State | React Context + useReducer | Two contexts: RecipesContext, EditRecipeContext |
| Async | react-useasync-hooks | Used for initial recipe load |
| Queue | typescript-blocking-queue | Debounces rapid baker% recalculations |
| Timeouts | typescript-async-timeouts | Only `runLater` used (delayed drawer close) |
| Null safety | typescript-nullsafe | `hasValue` / `hasNoValue` helpers |
| Base64 | buffer (Node.js polyfill) | Unnecessary — `btoa()` is native |
| Testing | Jest + @testing-library | Unit tests exist for calculation logic |
| Deployment | DigitalOcean (static) | Via GitHub Actions |

### Key source files

| File | Purpose |
|---|---|
| `src/service/PredefinedRecipeService/data/PredefinedRecipes.ts` | All hardcoded recipe definitions |
| `src/service/PredefinedRecipeService/RecipeReader/readJsonRecipe.ts` | Percent → grams resolution |
| `src/service/SourdoughStarter/calculateDryAndLiquid.ts` | Flour/liquid/other classification |
| `src/service/SourdoughStarter/SourDoughStarterCalculator.ts` | Levain amount decision |
| `src/service/SourdoughStarter/IngredientStarterService.ts` | Ingredient assignment to groups |
| `src/service/SourdoughStarter/IngredientsSort.ts` | Display sort order |
| `src/service/BakerPercentage/lib/BakerPercentageCalulation.ts` | Baker % per ingredient |
| `src/service/BakerPercentage/lib/MicroNutrientsCalculator.ts` | Micro nutrient aggregation |
| `src/components/recipe/common/RecipeItemEditService.ts` | Pipeline entry point + queue |
| `src/State/EditRecipe/EditRecipeReducerService.ts` | All recipe mutation operations |
| `src/State/EditRecipe/editRecipeHydrationReducerService.ts` | Hydration % editing |
| `src/Constant/Ingredient/StandardIngredientConstant.ts` | Ingredient definitions |
| `src/Constant/Ingredient/CustomIngredient.ts` | Custom ingredient support (not wired to UI) |
| `src/utils/Base64.ts` | URL sharing infrastructure (unused in UI) |
| `src/static/locales/gb.json` | English translations |
| `src/static/locales/ee.json` | Estonian translations |

### Known deficiencies in the current codebase
- **Milk rule not implemented** (see algorithm Step D above)
- `CustomIngredient.ts` exists but is not reachable from the UI
- `Base64.ts` URL-sharing utility exists but is not wired to anything
- localStorage persistence is commented out in `RecipesProvider.tsx`
- No recipe import (only export via JSON accordion)
- Sorting bug `flour===50 && flour===50` produces correct result accidentally
- TypeScript 4.9 (not 5.x)
- No routing — single-page dialog model

---

## Rebuild Plan

### Goals
- **No npm** — no Node.js toolchain whatsoever
- **Fully serverless** — deployable to edge platforms without a Node server
- Preserve all existing calculation logic exactly (port verbatim)
- Fix the milk rule (the one known algorithm deficiency)
- Add localStorage persistence (already scaffolded, just uncommented)
- Add recipe import from JSON

### Recommended Stack

| Layer | Choice | Reason |
|---|---|---|
| Runtime | **Deno** | Native TypeScript, no npm, URL imports, built-in fmt/lint/test |
| Framework | **Fresh 2** | Islands architecture, Preact, no bundler in dev, deploys to Deno Deploy |
| UI | **Preact** (bundled with Fresh) | Drop-in React replacement, ~3 KB |
| Styling | **Tailwind CSS** via Fresh plugin | No PostCSS, utility-first, print: variant built in |
| i18n | Custom signal-based lookup | Remove i18next entirely — files are small |
| State | **Preact Signals** | Replaces Context + useReducer, reactive, no boilerplate |
| Persistence | `localStorage` | Restore commented-out code |
| Testing | `deno test` | Built in, no Jest config |
| Deployment | **Deno Deploy** | Free tier, edge, push-to-deploy from GitHub |

### Project structure

```
fresh-baker/
├── deno.json
├── main.ts
├── fresh.config.ts
├── islands/
│   ├── RecipeNavigation.tsx
│   ├── RecipeList.tsx
│   ├── RecipeCard.tsx
│   └── EditRecipeDialog.tsx
├── components/
│   ├── Layout.tsx
│   └── PrintLayout.tsx
├── routes/
│   └── index.tsx
├── lib/
│   ├── types.ts          # all types (port from src/types/)
│   ├── ingredients.ts    # StandardIngredients (port verbatim)
│   ├── recipes.ts        # PREDEFINED_RECIPES (port verbatim)
│   ├── resolution.ts     # readJsonRecipe percent→grams (port verbatim)
│   ├── sourdough.ts      # full levain pipeline WITH milk rule fixed
│   ├── baker-percent.ts  # recalculateBakerPercentage (port verbatim)
│   ├── state.ts          # Preact Signals global state
│   ├── i18n.ts           # lightweight t() function
│   └── storage.ts        # localStorage save/load
├── locales/
│   ├── ee.json
│   └── gb.json
└── static/
    ├── flags/ee.svg
    └── flags/gb.svg
```

### Dependency replacements

| Current | Replacement |
|---|---|
| React Context + useReducer | Preact Signals |
| i18next + react-i18next | Custom `t()` (~30 lines) |
| notistack | Signal-driven toast component (~30 lines) |
| react-useasync-hooks | `useEffect` + signal |
| typescript-blocking-queue | 300ms `setTimeout` debounce |
| typescript-async-timeouts | `setTimeout` directly |
| typescript-nullsafe | Native `!= null` checks |
| buffer (base64 polyfill) | Native `btoa()` / `atob()` |
| MUI + Emotion | Tailwind CSS |

### MUI → Tailwind mapping

| MUI | Tailwind |
|---|---|
| `Card variant="outlined"` | `border rounded-lg` |
| `Dialog fullScreen` | `fixed inset-0 z-50 bg-white overflow-auto` |
| `Drawer` | `fixed left-0 top-0 h-full w-64 bg-white shadow-lg` |
| `Table/TableRow/TableCell` | `table w-full text-sm` |
| `CircularProgress` | CSS spinner |
| `Accordion` | `<details><summary>` |
| `Snackbar` | CSS transition + signal |
| Print hiding | `print:hidden` |
| Per-page print break | `print:break-after-page print:break-inside-avoid` |

### What can be ported verbatim (no React dependencies)
- `BakerPercentageCalulation.ts`
- `MicroNutrientsCalculator.ts`
- `calculateDryAndLiquid.ts`
- `SourDoughStarterCalculator.ts`
- `IngredientsSort.ts`
- `StandardIngredientConstant.ts`
- `PredefinedRecipes.ts`
- `readJsonRecipe.ts` (except remove `hasValue` dependency)
- All `types/*.d.ts`
- `locales/ee.json`, `locales/gb.json`

### What must be rewritten
- `IngredientStarterService.ts` — fix the milk rule here
- All React components → Preact islands
- All Context/useReducer state → Signals
- `EditRecipeReducerService.ts` → plain functions called by signals
- `RecipeEditService.ts` → plain functions

### i18n replacement

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

### localStorage persistence

```ts
const KEY = "baker_recipes_v1";
export const loadRecipes = (): RecipeType[] => {
  try { return JSON.parse(localStorage.getItem(KEY) ?? "[]"); } catch { return []; }
};
export const saveRecipes = (recipes: RecipeType[]) =>
  localStorage.setItem(KEY, JSON.stringify(recipes));
```
Wire into a signal `effect(() => saveRecipes(allRecipes.value))`.

### Deployment

```bash
# Dev (no npm, no build step)
deno task start

# Deploy
deployctl deploy --project=baker-percentage main.ts
```

### Features to add in the rebuild (were missing or wired up)
1. **Milk rule** — fix `IngredientStarterService.ts` (detailed above)
2. **localStorage persistence** — restore commented code
3. **Recipe import from JSON** — paste JSON → parse → add to recipe list
4. **Custom ingredient creation** — `CustomIngredient.ts` logic exists, just needs UI
5. **URL sharing** — base64-encode selected recipe IDs in query param

### Effort estimate

| Area | Complexity |
|---|---|
| Calculation logic port | Low — pure functions, port verbatim |
| Milk rule fix | Low — add one condition to `IngredientStarterService` |
| State rewrite (Context → Signals) | Medium |
| UI rewrite (MUI → Tailwind) | High — most of the work |
| i18n replacement | Low |
| localStorage | Low |
| Tests | Medium — port to `deno test` |
| Deploy setup | Low |

---

## Test Fixtures

### Reference files
- `Sourdough baker percentages.pdf` — browser print of the deployed app, all 11 recipes with calculated outputs. **Ground truth** for regression testing.
- `Sourdough baker percentages.html` — the deployed Vite build (Cloudflare-served). Same dataset, live calculation.

### Fixture files (already created)
`tests/fixtures/` — one JSON file per recipe. Derived by tracing the source algorithm and cross-checked against the PDF.

| File | Recipe | Status |
|---|---|---|
| `taisteraleib.json` | Whole grain rye bread | ✓ correct |
| `sai.json` | Wheat bread | ✓ correct |
| `sai_seemnete.json` | Bread with seeds & barley | ✓ correct |
| `croissant.json` | Croissant | ⚠ milk rule not applied |
| `pannkook.json` | Pancake | ✓ correct (starter:true path) |
| `pizza.json` | Pizza ×3 | ✓ correct |
| `vastlakuklid.json` | Semla ×18 | ⚠ milk rule not applied |
| `kaneelirullid.json` | Cinnamon rolls | ⚠ milk rule not applied |
| `plaadikook.json` | Pie dough | ⚠ milk rule not applied |
| `pikk_sai.json` | Baguette ×2 | ✓ correct |
| `moskva_saiakesed.json` | Moscow pastries | ⚠ milk rule not applied |

Each fixture has: `levainAlgorithm` (condition + fridge + amounts), `groups[]` (ingredients with precise grams and baker%), `microNutrients` (dryTotal + per-nutrient), `totalWeight` (dough / others / total). Files marked ⚠ have `"fixtureStatus": "CURRENT_BEHAVIOUR"` and must be recalculated once the milk rule is implemented.

### Suggested test structure

```
tests/
  fixtures/               # JSON ground truth (already created)
  resolution_test.ts      # readJsonRecipe: percent → grams
  sourdough_test.ts       # full levain split matches fixture
  baker_percent_test.ts   # baker% and micro nutrients match fixture
  total_weight_test.ts    # dough/others/total match fixture
```

All run with `deno test --allow-read`. No Jest, no config files.
