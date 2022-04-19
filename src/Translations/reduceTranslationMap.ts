// noinspection ES6PreferShortImport
import {TranslationMap} from "./TranslationMap.d";
import {hasValue} from "../utils/NullSafe";

type ReduceTranslationMapResult = { [key: string]: number | string };

export const reduceTranslationMap = (values: TranslationMap): ReduceTranslationMapResult =>
  Object.entries(values)
    .reduce((result, [key, value]) => {
      if (hasValue(value)) result[key] = value;
      return result;
      }, {} as ReduceTranslationMapResult);
