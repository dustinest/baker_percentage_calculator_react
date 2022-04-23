import {IngredientGramsType, IngredientPercentType, RecipeIngredientsType} from "../../../types";
import {MicroNutrientsCalculationResult} from "./MicroNutrientsCalculationResult";

export type IngredientWithPercentType = IngredientPercentType & IngredientGramsType;

export type RecipeIngredientsWithPercentType = {
  ingredientWithPercent: IngredientWithPercentType[];
} & RecipeIngredientsType;

export type BakerPercentageResult = {
  microNutrients: MicroNutrientsCalculationResult;
  ingredients: RecipeIngredientsWithPercentType[];
}
