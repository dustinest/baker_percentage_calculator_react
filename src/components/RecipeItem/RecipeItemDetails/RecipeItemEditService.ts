import {copyRecipeType, RecipeIngredientsType, RecipeType} from "../../../types";
import {newBlockingPromiseQueue} from "../../../utils/BlockingQueue";
import {
  BakerPercentageResult,
  recalculateBakerPercentage,
  RecipeIngredientsWithPercentType
} from "../../../utils/BakerPercentageCalulation";
import {splitStarterAndDough} from "../../../service/SourdoughStarter";

const doWithCopy = (recipe: RecipeType, method: (recipe: RecipeType) => void): RecipeType => {
  const copy = copyRecipeType(recipe);
  method(copy);
  return copy;
}

export const setRecipeAmount = (recipe: RecipeType, amount: number): RecipeType => {
    if (recipe.amount === amount) return recipe;
    const value = Math.floor(amount * 10) / 10;
    if (amount <= 0) return recipe;

    const amountChange = value / recipe.amount;
    if (amountChange <= 0) return recipe;

    return doWithCopy(recipe, (e) => {
      e.ingredients.forEach((e) => {
        e.ingredients.forEach((i) => {
          i.grams = i.grams * amountChange;
        })
      });
      e.amount = value;
    });
  }
;

export const setRecipeIngredientGrams = (recipe: RecipeType, ingredientIndex: number, index: number, grams: number): RecipeType => {
    if (recipe.ingredients[ingredientIndex].ingredients[index].grams === grams) return recipe;
    return doWithCopy(recipe, (e) => e.ingredients[ingredientIndex].ingredients[index].grams = grams);
  }
;

export const setRecipeName = (recipe: RecipeType, name: string): RecipeType => {
  if (recipe.name === name) return recipe;
  return doWithCopy(recipe, (e) => e.name = name);
};


export const blockAndRunRecipeLater = (() => {
  const queue = newBlockingPromiseQueue();
  return <T, R = void>(value: T, callable: (value: T) => Promise<R>) => queue.blockAndRun(() => callable(value));
})();

const recalculatePercentage = async (ingredients: RecipeIngredientsType[]): Promise<BakerPercentageResult> => {
  return blockAndRunRecipeLater(ingredients, async (e) => recalculateBakerPercentage(e));
}

export const recalculateRecipeBakerPercentage = async (recipe: RecipeType): Promise<BakerPercentageResult> => {
  return blockAndRunRecipeLater(recipe,(e) => splitStarterAndDough(e.name, e.ingredients)).then(recalculatePercentage);
}

export const recalculateIngredients = async (recipe: RecipeType): Promise<RecipeIngredientsWithPercentType[]> => {
  return recalculatePercentage(recipe.ingredients).then((e) => e.ingredients);
}
