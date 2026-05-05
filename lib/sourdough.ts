import {
  copyIngredientGramsType,
  copyRecipeIngredientsType,
  IngredientGramsType,
  NutrientPercentType,
  NutritionType,
  RecipeIngredientsType,
} from "./types.ts";

// ── A: Classify ingredients into flour / liquid / other ─────────────────────

interface DryAndLiquidResult {
  ingredients: {
    flour: IngredientGramsType[];
    liquid: IngredientGramsType[];
    other: IngredientGramsType[];
  };
  totals: { flour: number; liquid: number; water: number };
}

const calculateDryAndLiquid = (ingredients: IngredientGramsType[]): DryAndLiquidResult => {
  if (!ingredients) throw new Error("No ingredients defined!");
  const result: DryAndLiquidResult = {
    ingredients: { flour: [], liquid: [], other: [] },
    totals: { flour: 0, liquid: 0, water: 0 },
  };

  for (const ingredient of ingredients) {
    const pct = ingredient.nutrients.reduce(
      (acc, n) => {
        if (n.type === NutritionType.flour) acc.flour += n.percent;
        if (n.type === NutritionType.water) acc.water += n.percent;
        return acc;
      },
      { flour: 0, water: 0 },
    );

    if (pct.flour > 0) {
      result.ingredients.flour.push(ingredient);
      result.totals.flour += ingredient.grams * 100 / pct.flour;
    }
    if (pct.water > 0) {
      const grams = ingredient.grams * 100 / pct.water;
      result.ingredients.liquid.push(ingredient);
      result.totals.liquid += grams;
      if (pct.water === 100) result.totals.water += grams;
    }
    if (pct.flour === 0 && pct.water === 0) result.ingredients.other.push(ingredient);
  }
  return result;
};

// ── B: Decide levain amounts ─────────────────────────────────────────────────

export interface StarterIngredients {
  fridge: number;
  amount: number;
}

export type StarterCalculationResult = {
  starter: { flour: StarterIngredients; liquid: StarterIngredients };
  ingredients: { flour: IngredientGramsType[]; liquid: IngredientGramsType[]; other: IngredientGramsType[] };
};

const calculateStarterFlour = (totalFlour: number): number => {
  const result = Math.floor(totalFlour * 0.02);
  return result > 11 ? 11 : result;
};

export const calculateSourDoughStarter = (group: RecipeIngredientsType): StarterCalculationResult => {
  const dal = calculateDryAndLiquid(group.ingredients.map(copyIngredientGramsType));
  const flour = Math.floor(dal.totals.flour);
  const water = Math.floor(dal.totals.water);
  const liquid = Math.floor(dal.totals.liquid);
  let fridgeAmt = calculateStarterFlour(dal.totals.flour);
  // If percentage-based amount is too small but ingredients allow it, bump to 5 (→ 10g total fridge)
  if (fridgeAmt < 5 && flour >= 5 && liquid >= 5) fridgeAmt = 5;

  const result: StarterCalculationResult = {
    starter: {
      flour: { fridge: fridgeAmt, amount: 0 },
      liquid: { fridge: fridgeAmt, amount: 0 },
    },
    ingredients: dal.ingredients,
  };

  if (liquid * 100 / flour < 30) {
    result.starter.flour.amount = Math.floor(liquid);
  } else if (water * 100 / flour > 10 && water * 100 / flour < 40) {
    result.starter.flour.amount = Math.floor(water);
  } else {
    result.starter.flour.amount = Math.floor(flour * 26 / 100);
  }
  result.starter.flour.amount -= fridgeAmt;
  result.starter.liquid.amount = result.starter.flour.amount;

  const hasWholeGrain = dal.ingredients.flour.some((f) =>
    f.nutrients.some((n) => n.type === NutritionType.whole_grain)
  );
  if (hasWholeGrain) {
    result.starter.flour.amount = Math.floor(flour * 50 / 100);
    result.starter.liquid.amount = Math.floor(liquid * 62 / 100);
  }
  return result;
};

// ── C: Sort ingredients ─────────────────────────────────────────────────────

const DISPLAY_ORDER = [
  NutritionType.water,
  NutritionType.flour,
  NutritionType.fat,
  NutritionType.salt,
  NutritionType.sugar,
];

const sortScore = (nutrients: NutrientPercentType[]): number => {
  const maximum = (100 / DISPLAY_ORDER.length) - 2; // 18
  const calc = DISPLAY_ORDER.reduce((acc, t) => { acc[t] = 0; return acc; }, {} as Record<string, number>);
  nutrients.forEach((n) => { if (calc[n.type] !== undefined) calc[n.type] += n.percent; });

  // Preserved verbatim: bug checks flour===50 twice (should check water), but produces correct result
  if (calc[NutritionType.flour] === 50 && calc[NutritionType.flour] === 50) return 0;

  for (let i = 0; i < DISPLAY_ORDER.length; i++) {
    const val = calc[DISPLAY_ORDER[i]];
    if (val > 80) return (val / 100) * (maximum * i);
  }
  return 100;
};

const sortIngredients = (items: IngredientGramsType[]): IngredientGramsType[] =>
  [...items].sort((a, b) => sortScore(a.nutrients) - sortScore(b.nutrients));

const sortGroups = (groups: RecipeIngredientsType[]): RecipeIngredientsType[] =>
  groups.map((g) => ({ ...g, ingredients: sortIngredients(g.ingredients) }));

// ── D: Assign ingredients to levain vs dough ─────────────────────────────────

const remapIngredient = (ing: IngredientGramsType, grams?: number): IngredientGramsType =>
  copyIngredientGramsType(grams !== undefined ? { ...ing, grams } : ing);

const fillSlot = (
  container: IngredientGramsType[],
  starterOut: IngredientGramsType[],
  leftoversOut: IngredientGramsType[],
  slot: StarterIngredients,
): void => {
  let counted = 0;
  for (const ingredient of container) {
    const remaining = slot.amount - counted;
    if (remaining <= 0) {
      leftoversOut.push(remapIngredient(ingredient));
    } else if (remaining <= ingredient.grams) {
      starterOut.push(remapIngredient(ingredient, remaining));
      counted += remaining;
      if (remaining < ingredient.grams) {
        leftoversOut.push(remapIngredient(ingredient, ingredient.grams - remaining - slot.fridge));
      }
    } else {
      starterOut.push(remapIngredient(ingredient, remaining));
      leftoversOut.push(remapIngredient(ingredient, ingredient.grams - remaining));
    }
  }
};

export const splitStarterAndDough = (
  recipeIngredients: RecipeIngredientsType[],
): RecipeIngredientsType[] => {
  if (recipeIngredients.length === 0) return [];
  const cal = calculateSourDoughStarter(recipeIngredients[0]);
  if (!cal) return [];

  const starterIngredients: IngredientGramsType[] = [{
    id: "starter_from_fridge",
    name: "ingredient.sourdough_starter.name",
    grams: cal.starter.flour.fridge + cal.starter.liquid.fridge,
    nutrients: [
      { type: NutritionType.water, percent: 50 },
      { type: NutritionType.flour, percent: 50 },
    ],
  }];
  const leftovers: IngredientGramsType[] = [];

  fillSlot(cal.ingredients.flour, starterIngredients, leftovers, cal.starter.flour);
  fillSlot(cal.ingredients.liquid, starterIngredients, leftovers, cal.starter.liquid);

  // Milk rule: if all pure WATER was consumed (leftover = 0), move MILK to levain
  const waterIngredients = cal.ingredients.liquid.filter((i) =>
    i.nutrients.every((n) => n.type !== NutritionType.flour) &&
    i.nutrients.some((n) => n.type === NutritionType.water && n.percent === 100)
  );
  const milkIngredients = cal.ingredients.liquid.filter((i) =>
    i.nutrients.some((n) => n.type === NutritionType.water && n.percent < 100 && n.percent > 50)
  );
  const waterConsumedFully = waterIngredients.some((waterIng) => {
    // leftover = grams - liquidSlotAmount - fridge = 0
    return Math.floor(waterIng.grams - cal.starter.liquid.amount - cal.starter.liquid.fridge) === 0;
  });
  if (waterConsumedFully && milkIngredients.length > 0 && !recipeIngredients[0].starter) {
    for (const milkIng of milkIngredients) {
      const idx = leftovers.findIndex((l) => l.id === milkIng.id);
      if (idx !== -1) {
        starterIngredients.push(leftovers.splice(idx, 1)[0]);
      }
    }
  }

  const result: RecipeIngredientsType[] = [];
  recipeIngredients.forEach((group, index) => {
    if (index > 0) {
      result.push(copyRecipeIngredientsType(group));
      return;
    }
    const nonStarter: IngredientGramsType[] = [
      ...leftovers.filter((e) => Math.floor(e.grams) > 0),
      ...cal.ingredients.other.filter((e) => Math.floor(e.grams) > 0).map((e) => remapIngredient(e)),
    ];

    if (group.starter) {
      // starter:true path — all ingredients stay together (Pannkook)
      const toAdd = starterIngredients.filter((e) => !nonStarter.find((o) => o.id === e.id));
      const others = group.ingredients
        .map((o) => {
          const inToAdd = toAdd.find((e) => e.id === o.id);
          if (inToAdd) return undefined;
          const inStarter = starterIngredients.find((e) => e.id === o.id);
          if (!inStarter) return remapIngredient(o);
          return remapIngredient(o, o.grams - cal.starter.flour.fridge);
        })
        .filter((x): x is IngredientGramsType => x != null);

      result.push(copyRecipeIngredientsType({
        name: group.name || "ingredients.title.sourdough_starter_dough",
        ingredients: others.length > 0 ? [...toAdd, ...others] : [...toAdd],
        bakingTime: [],
        innerTemperature: null,
        description: null,
        starter: group.starter,
      }));
      return;
    }

    result.push(copyRecipeIngredientsType({
      name: "ingredients.title.sourdough_starter_dough",
      ingredients: starterIngredients,
      bakingTime: [],
      innerTemperature: null,
      description: null,
    }));
    result.push(copyRecipeIngredientsType({
      name: group.name || "ingredients.title.dough",
      ingredients: nonStarter,
      bakingTime: group.bakingTime,
      innerTemperature: group.innerTemperature,
      description: group.description,
    }));
  });

  return sortGroups(result);
};
