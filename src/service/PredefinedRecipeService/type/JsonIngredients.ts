import {IngredientGramsType, IngredientPercentType} from "../../../types";
import {
  JsonExtraStandardIngredientGrams, JsonExtraStandardIngredientPercentage,
  JsonStandardIngredientGrams, JsonStandardIngredientPercent,
} from "./JsonRecipeIngredientType";
import {JsonBakingTime, JsonNumberInterval} from "./JsonBakingTime";

export type JsonIngredientsIngredient =
  IngredientGramsType |
  IngredientPercentType |
  JsonStandardIngredientGrams |
  JsonStandardIngredientPercent |
  JsonExtraStandardIngredientGrams |
  JsonExtraStandardIngredientPercentage;

export type JsonIngredients = {
  name?: string;
  ingredients: JsonIngredientsIngredient[];
  bakingTime?: JsonBakingTime[]
  innerTemperature?: JsonNumberInterval;

  description?: string;
  starter?: boolean; // to be included with starter. A corner case. Check pancakes
};
