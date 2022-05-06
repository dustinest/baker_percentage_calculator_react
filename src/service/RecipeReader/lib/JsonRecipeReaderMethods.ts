import {hasValue} from "typescript-nullsafe";
import {
  JsonExtraStandardIngredientType,
  JsonRecipeIngredientsIngredientType,
  JsonStandardIngredientType
} from "../types";
import {
  GramsAmountType,
  IngredientGramsType,
  IngredientType, NutrientPercentType,
  PercentAmountType
} from "../../../types";
import {
  ExtraStandardIngredient,
  ExtraStandardIngredientMethods,
  getStandardIngredientMethodsGrams,
} from "../../../Constant/Ingredient";
import {resolveJsonExtraStandardIngredient} from "./JsonRecepyIdGenerator";

type HasValueType <T> = {
  has: boolean;
  value: T;
};

export type ResolveTestType = {
  id: HasValueType<string>;
  grams: HasValueType<number>;
  percent: HasValueType<number>;
  type: HasValueType<string>;
  name: HasValueType<string>;
  nutrients: HasValueType<NutrientPercentType[]>;
}

const resolveValue = <T>(value: T | undefined | null, defaultValue: T): HasValueType<T> => {
  const has = hasValue(value);
  return {
    has,
    value: has ? value : defaultValue
  }
}

const resolveIngredientByType = (resultTest: ResolveTestType, ingredient: JsonRecipeIngredientsIngredientType): IngredientGramsType | null => {
  if (!resultTest.type.has) return null;
  const extraMethod = ExtraStandardIngredientMethods[resultTest.type.value as keyof ExtraStandardIngredient];
  if (extraMethod !== undefined) {
    if (!resultTest.name.has) throw new Error(`.name property for type ${resultTest.name.value} must be defined!`);
    const id = resolveJsonExtraStandardIngredient(ingredient as JsonExtraStandardIngredientType, resultTest.grams.value);
    return extraMethod(id, resultTest.name.value, resultTest.grams.value);
  }
  const standardMethod = getStandardIngredientMethodsGrams(resultTest.type.value, resultTest.grams.value);
  if (standardMethod !== undefined) {
    return standardMethod;
  }
  throw new Error(`Could not resolve type ${resultTest.type.value.toString()}`)
}


export const resolveIngredient = (ingredient: JsonRecipeIngredientsIngredientType): [IngredientGramsType, ResolveTestType] => {
  const resultTest = {
    id: resolveValue((ingredient as IngredientType).id, ""),
    grams: resolveValue((ingredient as GramsAmountType).grams, 100),
    percent: resolveValue((ingredient as PercentAmountType).percent, -1),
    type: resolveValue((ingredient as JsonStandardIngredientType).type, ""),
    name: resolveValue((ingredient as IngredientType).name, ""),
    nutrients: resolveValue((ingredient as IngredientType).nutrients, []),
  } as ResolveTestType;
  if (resultTest.type.has) {
    const result = resolveIngredientByType(resultTest, ingredient);
    if (result !== null) return [result, resultTest];
  }
  return [{
    id: resultTest.id.value,
    grams: resultTest.grams.value,
    type: resultTest.type.value,
    nutrients: resultTest.nutrients.value,
    name: resultTest.name.value
  } as IngredientGramsType, resultTest]
}
