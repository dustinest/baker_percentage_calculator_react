import {copyRecipeType, RecipeType} from "../../../types";


const doWithCopy = (recipe: RecipeType, method: (recipe: RecipeType) => void): RecipeType => {
  const copy = copyRecipeType(recipe);
  method(copy);
  return copy;
}

interface Methods<T>{
  setName(recipe: T, name: string): T;
  setGrams(recipe: T, ingredientIndex: number, index: number, grams: number): T;
  setAmount(recipe: T, amount: number): T;
}

const BaseMethods:Methods<RecipeType> = {
  setAmount(recipe: RecipeType, amount: number): RecipeType {
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
  }, setGrams(recipe: RecipeType, ingredientIndex: number, index: number, grams: number): RecipeType {
    if (recipe.ingredients[ingredientIndex].ingredients[index].grams === grams) return recipe;
    return doWithCopy(recipe, (e) => e.ingredients[ingredientIndex].ingredients[index].grams = grams);
  }, setName(recipe: RecipeType, name: string): RecipeType {
    if (recipe.name === name) return recipe;
    return doWithCopy(recipe, (e) => e.name = name);
  }

};

export const RecipeMethods: Methods<RecipeType |null> = {
  setAmount(recipe: RecipeType | null, amount: number): RecipeType | null {
    if (!recipe) return recipe;
    return BaseMethods.setAmount(recipe, amount);
  }, setGrams(recipe: RecipeType | null, ingredientIndex: number, index: number, grams: number): RecipeType | null {
    if (!recipe) return recipe;
    return BaseMethods.setGrams(recipe, ingredientIndex, index, grams);
  }, setName(recipe: RecipeType | null, name: string): RecipeType | null {
    if (!recipe) return recipe;
    return BaseMethods.setName(recipe, name);
  }
}
