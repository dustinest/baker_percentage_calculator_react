import {
  RecipeIngredientsType,
  RecipeType
} from "../../../types";
import {
  BakerPercentageResult,
  recalculateBakerPercentage
} from "../../../service/BakerPercentage";
import {splitStarterAndDough} from "../../../service/SourdoughStarter";
import {newPrioritizedBlockingQueue} from "typescript-blocking-queue";

export const blockAndRunRecipeLater = (() => {
  const queue = newPrioritizedBlockingQueue();
  return <T, R = void>(value: T, callable: (value: T) => Promise<R>) => queue.prioritized().enqueue(() => callable(value));
})();

const recalculatePercentage = async (ingredients: RecipeIngredientsType[]): Promise<BakerPercentageResult> => {
  return blockAndRunRecipeLater(ingredients, async (e) => recalculateBakerPercentage(e));
}

export const recalculateRecipeBakerPercentage = async (recipe: RecipeType): Promise<BakerPercentageResult> => {
  return blockAndRunRecipeLater(recipe,(e) => splitStarterAndDough(e.ingredients)).then(recalculatePercentage);
}
