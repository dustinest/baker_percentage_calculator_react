import {RecipeType} from "../../../../types";
import {BakerPercentageResult} from "../../../../service/BakerPercentage";

export type TotalWeights = {
  dough: number,
  others: number,
  total: number
};

export type BakerPercentageAwareRecipe = {
  bakerPercentage: BakerPercentageResult;
  totalWeight: TotalWeights
} & RecipeType;
