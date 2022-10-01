import {IngredientGramsType, IngredientPercentType, RecipeIngredientsType} from "../../../types";
import {MicroNutrientsResultType} from "./MicroNutrientsCalculationResult";

export type IngredientWithPercentType = IngredientPercentType & IngredientGramsType;

export type RecipeIngredientsWithPercentType = {
  ingredientWithPercent: IngredientWithPercentType[];
} & RecipeIngredientsType;

export type BakerPercentageResult = {
  microNutrients: MicroNutrientsResultType;
  ingredients: RecipeIngredientsWithPercentType[];
}
