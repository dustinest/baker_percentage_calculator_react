import {RecipeType} from "../../../types";
import {BakerPercentageResult} from "../../../utils/BakerPercentageCalulation";

export type RecipeItemResult = {
  recipe: RecipeType;
  bakerPercentage: BakerPercentageResult;
  totalWeight: number;
}
