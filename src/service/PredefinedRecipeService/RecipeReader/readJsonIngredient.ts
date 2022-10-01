import {hasValue} from "typescript-nullsafe";
import {
  GramsAmountType,
  IngredientGramsType,
  IngredientType, NutrientPercentType,
  PercentAmountType
} from "../../../types";
import {
  ExtraStandardIngredient,
  ExtraStandardIngredientMethods,
  getIngredientGrams,
} from "../../../Constant/Ingredient";
import {resolveJsonExtraStandardIngredient} from "./JsonRecepyIdGenerator";
import {JsonIngredientsIngredient} from "../type/JsonIngredients";
import {JsonExtraStandardIngredient} from "../type/JsonRecipeIngredientType";

type HasValueType <T> = {
  hadValue: boolean;
  value: T;
};

export type ResolveTestType = {
  id: HasValueType<string>;
  grams: HasValueType<number>;
  percent: HasValueType<number>;
  type: string;
  name: HasValueType<string>;
  nutrients: HasValueType<NutrientPercentType[]>;
}

const resolveValue = <T>(value: T | undefined | null, defaultValue: T): HasValueType<T> => {
  const has = hasValue(value);
  return {
    hadValue: hasValue(value),
    value: has ? value : defaultValue
  }
}

export const readJsonIngredient = (ingredient: JsonIngredientsIngredient): [IngredientGramsType, ResolveTestType] => {
  if (ingredient.type === null || ingredient.type === undefined) {
    console.error("Could not find type ", ingredient);
    throw new Error(`Type is a must of ${ingredient.name}!`)
  }
  const resultTest = {
    id: resolveValue((ingredient as IngredientType).id, ""),
    grams: resolveValue((ingredient as GramsAmountType).grams, 100),
    percent: resolveValue((ingredient as PercentAmountType).percent, -1),
    type: ingredient.type,
    name: resolveValue((ingredient as IngredientType).name, ""),
    nutrients: resolveValue((ingredient as IngredientType).nutrients, []),
  } as ResolveTestType;

  const extraStandardIngredientMethod = ExtraStandardIngredientMethods[resultTest.type as keyof ExtraStandardIngredient];
  if (extraStandardIngredientMethod !== undefined) {
    if (!resultTest.name.hadValue) throw new Error(`.name property for type ${resultTest.name.value} must be defined!`);
    const id = resolveJsonExtraStandardIngredient(ingredient as JsonExtraStandardIngredient, resultTest.grams.value);
    return [
      extraStandardIngredientMethod(id, resultTest.name.value, resultTest.grams.value),
      resultTest
    ];
  }

  const ingredientGrams = getIngredientGrams(resultTest.type, resultTest.grams.value);
  if (ingredientGrams !== undefined) {
    return [
      ingredientGrams,
      resultTest
    ];
  }
  console.error(`Could not resolve type ${resultTest.type}`, ingredient);
  throw new Error(`Could not resolve type ${resultTest.type.toString()}`)
}
