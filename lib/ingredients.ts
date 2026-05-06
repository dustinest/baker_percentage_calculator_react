import {
  copyIngredientGramsType,
  IngredientGramsType,
  IngredientType,
  NutrientPercentType,
  NutritionType,
} from "./types.ts";

const createPredefined = (id: string, ...nutrients: (NutritionType | number)[]): IngredientType => {
  const _nutrients: NutrientPercentType[] = [];
  for (let i = 0; i < nutrients.length; i += 2) {
    _nutrients.push({ type: nutrients[i] as NutritionType, percent: nutrients[i + 1] as number });
  }
  return Object.freeze({
    id,
    name: `ingredient.predefined.${id}`,
    nutrients: Object.freeze(_nutrients),
  } as IngredientType);
};

export interface StandardIngredientKeys {
  SALT: IngredientType;
  SUGAR: IngredientType;
  SUGAR_BROWN: IngredientType;
  WATER: IngredientType;
  BUTTER_82: IngredientType;
  OIL: IngredientType;
  OLIVE_OIL: IngredientType;
  MILK_25: IngredientType;
  EGG: IngredientType;
  CARDAMOM: IngredientType;
  CINNAMON: IngredientType;
  WHOLE_RYE_FLOUR: IngredientType;
  WHOLE_RYE_MALT_FLOUR: IngredientType;
  WHOLE_WHEAT_FLOUR: IngredientType;
  DURUM_WHEAT: IngredientType;
  WHEAT_405_FLOUR: IngredientType;
  WHEAT_550_FLOUR: IngredientType;
  OATS: IngredientType;
  SEEDS: IngredientType;
}

export const StandardIngredients: StandardIngredientKeys = Object.freeze({
  SALT:               createPredefined("salt.generic",          NutritionType.salt,    100),
  SUGAR:              createPredefined("sugar.generic",         NutritionType.sugar,   100),
  SUGAR_BROWN:        createPredefined("sugar.brown",           NutritionType.sugar,    97, NutritionType.liquid,  3),
  WATER:              createPredefined("water.generic",         NutritionType.water,   100),
  BUTTER_82:          createPredefined("butter.fat_82",         NutritionType.fat,      82, NutritionType.water, 16, NutritionType.protein,  1, NutritionType.salt,    1),
  OIL:                createPredefined("oil.generic",           NutritionType.fat,     100),
  OLIVE_OIL:          createPredefined("oil.olive",             NutritionType.fat,     100),
  MILK_25:            createPredefined("milk.fat_25",           NutritionType.fat,     2.5, NutritionType.water, 89, NutritionType.protein, 3.3, NutritionType.sugar,  4.7, NutritionType.other, 0.5),
  EGG:                createPredefined("egg.generic",           NutritionType.egg,     100, NutritionType.water, 75, NutritionType.fat,     10, NutritionType.protein, 13, NutritionType.other, 2),
  CARDAMOM:           createPredefined("spice.cardamom",        NutritionType.spice,   100, NutritionType.liquid,  8, NutritionType.fat,      7, NutritionType.protein, 11, NutritionType.sugar, 2, NutritionType.carbs, 40, NutritionType.fiber, 28, NutritionType.other, 4),
  CINNAMON:           createPredefined("spice.cinnamon",        NutritionType.spice,   100, NutritionType.liquid, 10, NutritionType.fat,      1, NutritionType.protein,  4, NutritionType.sugar, 2, NutritionType.carbs, 26, NutritionType.fiber, 53, NutritionType.other, 4),
  WHOLE_RYE_FLOUR:    createPredefined("flour.rye.whole_grain", NutritionType.flour,   100, NutritionType.whole_grain, 100, NutritionType.liquid, 11, NutritionType.fat, 2, NutritionType.protein, 10, NutritionType.sugar, 1, NutritionType.carbs, 60, NutritionType.fiber, 15, NutritionType.other, 1),
  WHOLE_RYE_MALT_FLOUR: createPredefined("flour.rye.malt",      NutritionType.flour,   100, NutritionType.whole_grain, 100, NutritionType.liquid,  6, NutritionType.fat, 2, NutritionType.protein, 11, NutritionType.sugar, 8, NutritionType.carbs, 58, NutritionType.fiber, 14, NutritionType.other, 1),
  WHOLE_WHEAT_FLOUR:  createPredefined("flour.wheat.whole_grain", NutritionType.flour, 100, NutritionType.whole_grain, 100, NutritionType.liquid, 11, NutritionType.fat, 2, NutritionType.protein, 13, NutritionType.sugar, 1, NutritionType.carbs, 60, NutritionType.fiber, 12, NutritionType.other, 1),
  DURUM_WHEAT:        createPredefined("flour.wheat.durum",     NutritionType.flour,   100, NutritionType.whole_grain, 100, NutritionType.liquid, 11, NutritionType.fat, 2, NutritionType.protein, 13, NutritionType.sugar, 1, NutritionType.carbs, 60, NutritionType.fiber, 12, NutritionType.other, 1),
  WHEAT_405_FLOUR:    createPredefined("flour.wheat.ash_405",   NutritionType.flour,   100, NutritionType.ash, 405, NutritionType.liquid, 12, NutritionType.fat, 1, NutritionType.protein, 10, NutritionType.carbs, 73, NutritionType.fiber, 3, NutritionType.other, 1),
  WHEAT_550_FLOUR:    createPredefined("flour.wheat.ash_550",   NutritionType.flour,   100, NutritionType.ash, 550, NutritionType.liquid, 12, NutritionType.fat, 1, NutritionType.protein, 11, NutritionType.carbs, 71, NutritionType.fiber, 4, NutritionType.other, 1),
  OATS:               createPredefined("flour.oats.generic",    NutritionType.dry,     100, NutritionType.liquid, 10, NutritionType.fat, 2, NutritionType.protein, 10, NutritionType.sugar, 1, NutritionType.carbs, 60, NutritionType.fiber, 15, NutritionType.other, 2),
  SEEDS:              createPredefined("flour.seeds.generic",   NutritionType.dry,     100, NutritionType.liquid,  5, NutritionType.fat, 45, NutritionType.protein, 20, NutritionType.carbs, 12, NutritionType.fiber, 15, NutritionType.other, 3),
} as StandardIngredientKeys);

type IngredientFactory = (grams: number) => IngredientGramsType;
type IngredientFactories = { [K in keyof StandardIngredientKeys]: IngredientFactory };

export const StandardIngredientMethods: IngredientFactories = Object.freeze(
  Object.entries(StandardIngredients).reduce((obj, [key, value]) => {
    const id = `${key}_${value.id}`;
    obj[key as keyof StandardIngredientKeys] = (grams: number) =>
      copyIngredientGramsType({ ...value, grams, type: key, id });
    return obj;
  }, {} as IngredientFactories),
) as IngredientFactories;

export const getIngredientGrams = (key: string, grams: number): IngredientGramsType | undefined => {
  const factory = StandardIngredientMethods[key as keyof StandardIngredientKeys];
  return factory ? factory(grams) : undefined;
};

export const getCustomIngredient = (
  id: string, name: string, grams: number,
  nutrients?: NutrientPercentType[], type?: string,
): IngredientGramsType => ({ id, name, grams, type, nutrients: nutrients ? nutrients.map(n => ({ ...n })) : [] });
