import {copyIngredientGramsType, NutritionType, IngredientGramsType, IngredientType, NutrientPercentType} from "../../types";

interface StandardIngredient {
  SALT: IngredientType,
  SUGAR: IngredientType,
  SUGAR_BROWN: IngredientType,
  WATER: IngredientType,
  BUTTER: IngredientType,
  OIL: IngredientType,
  MILK: IngredientType,
  EGG: IngredientType,

  CARDAMOM: IngredientType,
  CINNAMON: IngredientType,

  OLIVE_OIL: IngredientType,
  WHOLE_RYE_FLOUR: IngredientType,
  WHOLE_WHEAT_FLOUR: IngredientType,
  DURUM_WHEAT: IngredientType,

  WHOLE_RYE_MALT_FLOUR: IngredientType,
  WHEAT_405_FLOUR: IngredientType,
  WHEAT_550_FLOUR: IngredientType
}

const createPredefined = (id: string, name: string, ...nutrients: (NutritionType | number)[]): IngredientType => {
  const _nutrients: NutrientPercentType[] = [];
  for (let i = 0; i < nutrients.length; i += 2) {
    _nutrients.push({
      type: nutrients[i] as NutritionType,
      percent: nutrients[i + 1] as number
    } as NutrientPercentType);
  }

  return Object.freeze({
    id: id,
    name: name,
    nutrients: Object.freeze(_nutrients)
  } as IngredientType);
}

export const StandardIngredients: { [Property in keyof StandardIngredient]: IngredientType } = Object.freeze({
  SALT: createPredefined("salt", "Salt", NutritionType.salt, 100),
  SUGAR: createPredefined("sugar", "Sugar", NutritionType.sugar, 100),
  SUGAR_BROWN: createPredefined("sugar_brown", "Brown sugar", NutritionType.sugar, 100),
  WATER: createPredefined("water", "Water", NutritionType.water, 100),
  BUTTER: createPredefined("butter_82", "Butter", NutritionType.fat, 82, NutritionType.water, 18),
  OIL: createPredefined("oil", "Õli", NutritionType.fat, 82, NutritionType.fat, 100),
  MILK: createPredefined("milk_2_5", "Milk", NutritionType.fat, 2.8, NutritionType.water, 97.5),
  EGG: createPredefined("egg", "Egg", NutritionType.egg, 100),

  CARDAMOM: createPredefined("cardamom", "Cardamom", NutritionType.spice, 100),
  CINNAMON: createPredefined("cinnamon", "Cinnamon", NutritionType.spice, 100),

  OLIVE_OIL: createPredefined("olive_oil", "Olive oil", NutritionType.fat, 100),
  WHOLE_RYE_FLOUR: createPredefined("whole_grain_rye_flour", "Whole grain rye flour", NutritionType.flour, 100, NutritionType.whole_grain, 100),
  WHOLE_WHEAT_FLOUR: createPredefined("whole_grain_wheat_flour", "Whole grain wheat flour", NutritionType.flour, 100, NutritionType.whole_grain, 100),
  DURUM_WHEAT: createPredefined("durum_wheat_flour", "Durum flour", NutritionType.flour, 100, NutritionType.whole_grain, 100),

  WHOLE_RYE_MALT_FLOUR: createPredefined("rye_malt_flour", "Rye malt flour", NutritionType.flour, 100, NutritionType.whole_grain, 100),
  WHEAT_405_FLOUR: createPredefined("wheat_flour_405", "Wheat flour", NutritionType.flour, 100, NutritionType.ash, 405),
  WHEAT_550_FLOUR: createPredefined("wheat_flour_550", "Wheat flour", NutritionType.flour, 100, NutritionType.ash, 550)
});

type StandardIngredientMethodsType = { [Property in keyof StandardIngredient]: (grams: number) => IngredientGramsType };


// @ts-ignore
export const StandardIngredientMethods: StandardIngredientMethodsType = Object.freeze(
  Object.entries(StandardIngredients).reduce((obj, [key, value]) => {
    // @ts-ignore
    obj[key] = (grams: number) => copyIngredientGramsType({...value, ...{grams}})
    return obj;
  }, {})) as StandardIngredientMethodsType;
