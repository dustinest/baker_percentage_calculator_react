import {
  RecipeIngredientsType,
  RecipeType
} from "../../../types";
import {newBlockingPromiseQueue} from "../../../utils/BlockingQueue";
import {
  BakerPercentageResult,
  recalculateBakerPercentage
} from "../../../utils/BakerPercentageCalulation";
import {splitStarterAndDough} from "../../../service/SourdoughStarter";

export const blockAndRunRecipeLater = (() => {
  const queue = newBlockingPromiseQueue();
  return <T, R = void>(value: T, callable: (value: T) => Promise<R>) => queue.blockAndRun(() => callable(value));
})();

const recalculatePercentage = async (ingredients: RecipeIngredientsType[]): Promise<BakerPercentageResult> => {
  return blockAndRunRecipeLater(ingredients, async (e) => recalculateBakerPercentage(e));
}

export const recalculateRecipeBakerPercentage = async (recipe: RecipeType): Promise<BakerPercentageResult> => {
  return blockAndRunRecipeLater(recipe,(e) => splitStarterAndDough(e.ingredients)).then(recalculatePercentage);
}

export const recalculateIngredients = async (recipe: RecipeType): Promise<BakerPercentageResult> => {
  return recalculatePercentage(recipe.ingredients);
}
