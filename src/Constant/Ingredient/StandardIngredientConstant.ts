import {
  copyIngredientGramsType,
  IngredientGramsType,
  IngredientType,
  NutrientPercentType,
  NutritionType
} from "../../types";
import {hasValue} from "typescript-nullsafe";
import {SORT_INGREDIENTS} from "../../service/SourdoughStarter/IngredientsSort";

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

const createPredefined = (id: string, ...nutrients: (NutritionType | number)[]): IngredientType => {
  const _nutrients: NutrientPercentType[] = [];
  const defined = {
    flour: 0,
    dry: 0
  }
  for (let i = 0; i < nutrients.length; i += 2) {
    const type = {
      type: nutrients[i] as NutritionType,
      percent: nutrients[i + 1] as number
    } as NutrientPercentType;
    if (type.type === NutritionType.flour) {
      defined.flour += type.percent;
    }
    if (type.type === NutritionType.dry) {
      defined.dry += type.percent;
    }
    _nutrients.push(type);
  }

  return Object.freeze({
    id: id,
    name: `ingredient.predefined.${id}`,
    nutrients: Object.freeze(_nutrients)
  } as IngredientType);
}

export const StandardIngredients: { [Property in keyof StandardIngredient]: IngredientType } = Object.freeze({
  SALT: createPredefined("salt.generic", NutritionType.salt, 100),
  SUGAR: createPredefined("sugar.generic", NutritionType.sugar, 100),
  SUGAR_BROWN: createPredefined("sugar.brown", NutritionType.sugar, 100),
  WATER: createPredefined("water.generic", NutritionType.water, 100),
  BUTTER: createPredefined("butter.generic", NutritionType.fat, 82, NutritionType.water, 18),
  OIL: createPredefined("oil.generic", NutritionType.fat, 82, NutritionType.fat, 100),
  MILK: createPredefined("milk.generic", NutritionType.fat, 2.8, NutritionType.water, 97.5),
  EGG: createPredefined("egg.generic", NutritionType.egg, 100),

  CARDAMOM: createPredefined("spice.cardamom", NutritionType.spice, 100),
  CINNAMON: createPredefined("spice.cinnamon", NutritionType.spice, 100),

  OLIVE_OIL: createPredefined("oil.olive", NutritionType.fat, 100),
  WHOLE_RYE_FLOUR: createPredefined("flour.rye.whole_grain", NutritionType.flour, 100, NutritionType.whole_grain, 100),
  WHOLE_WHEAT_FLOUR: createPredefined("flour.wheat.whole_grain", NutritionType.flour, 100, NutritionType.whole_grain, 100),
  DURUM_WHEAT: createPredefined("flour.wheat.durum", NutritionType.flour, 100, NutritionType.whole_grain, 100),

  WHOLE_RYE_MALT_FLOUR: createPredefined("flour.rye.malt", NutritionType.flour, 100, NutritionType.whole_grain, 100),
  WHEAT_405_FLOUR: createPredefined("flour.wheat.generic", NutritionType.flour, 100, NutritionType.ash, 405),
  WHEAT_550_FLOUR: createPredefined("flour.wheat.generic", NutritionType.flour, 100, NutritionType.ash, 550)
});

type StandardIngredientMethodsType = { [Property in keyof StandardIngredient]: (grams: number) => IngredientGramsType };


export const StandardIngredientMethods: StandardIngredientMethodsType = Object.freeze(
  Object.entries(StandardIngredients).reduce((obj, [key, value]) => {
    const id = `${key}_${value.id}`;
    obj[key as keyof StandardIngredient] = (grams: number) => copyIngredientGramsType({...value, ...{grams}, ...{type: key, id: id}})
    return obj;
  }, {} as StandardIngredientMethodsType)) as StandardIngredientMethodsType;

export const getStandardIngredientMethodsGrams = (key: string, grams: number): IngredientGramsType | undefined => {
  const standardMethod = StandardIngredientMethods[key as keyof StandardIngredient];
  if (!standardMethod) return undefined;
  return standardMethod(grams);
}

export const StandardIngredientMethodGrams:Readonly<IngredientGramsType[]> = Object.freeze(SORT_INGREDIENTS.add(Object.keys(StandardIngredientMethods)
  .map((key) => getStandardIngredientMethodsGrams(key, 1))
  .filter(hasValue)));
