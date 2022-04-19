import {RecipeType} from "../../../../types";
import {BakerPercentageResult} from "../../../../utils/BakerPercentageCalulation";

export type BakerPercentageAwareRecipe = {
  bakerPercentage: BakerPercentageResult;
  totalWeight: number;
} & RecipeType;
