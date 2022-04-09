import {
  bakingTimeEquals,
  copyBakingTimeType,
  copyNumberIntervalType,
  copyRecipeType,
  numberIntervalTypeEquals,
  RecipeType
} from "../../types";
// noinspection ES6PreferShortImport
import {
  ActionGenericIndex,
  RemoveEditRecipeBakingTimeStateAction,
  SetEditRecipeAmountStateAction,
  SetEditRecipeBakingTimeStateAction, SetEditRecipeDescriptionStateAction,
  SetEditRecipeIngredientGramsStateAction,
  SetEditRecipeInnerTemperatureStateAction,
  SetEditRecipeNameStateAction
} from "./EditRecipeStateAction.d";
import {hasNoValueOrEquals} from "../../utils/NullSafe";

interface Methods {
  setName: (recipe: RecipeType | null, action: SetEditRecipeNameStateAction) => RecipeType | null,
  setIngredientGram: (recipe: RecipeType | null, action: SetEditRecipeAmountStateAction) => RecipeType | null,
  setAmount: (recipe: RecipeType | null, action: SetEditRecipeIngredientGramsStateAction) => RecipeType | null,
  setBakingTime: (recipe: RecipeType | null, action: SetEditRecipeBakingTimeStateAction) => RecipeType | null,
  removeBakingTime: (recipe: RecipeType | null, action: RemoveEditRecipeBakingTimeStateAction) => RecipeType | null,
  setInnerTemperature: (recipe: RecipeType | null, action: SetEditRecipeInnerTemperatureStateAction) => RecipeType | null,
  setDescription: (recipe: RecipeType | null, action: SetEditRecipeDescriptionStateAction) => RecipeType | null,
}

const resolveActionGenericIndex = (index: ActionGenericIndex | number, callback1: (index: number) => RecipeType | null, callback2: (index: ActionGenericIndex) => RecipeType | null) => {
  if (typeof index === "number") {
    return callback1(index as number);
  }
  return callback2(index as ActionGenericIndex);
}

export const EditRecipeReducerService = Object.freeze({
  setName: (recipe: RecipeType | null, action: SetEditRecipeNameStateAction) => {
    if (!recipe || recipe.name === action.name) return recipe;
    const copy = copyRecipeType(recipe);
    copy.name = action.name;
    return copy;
  },
  setIngredientGram: (recipe: RecipeType | null, action: SetEditRecipeAmountStateAction) => {
    if (!recipe) return recipe;
    if (recipe.ingredients[action.index.ingredients].ingredients[action.index.ingredient].grams === action.grams) return recipe;
    const copy = copyRecipeType(recipe);
    copy.ingredients[action.index.ingredients].ingredients[action.index.ingredient].grams = action.grams
    return copy;
  },

  setAmount: (recipe: RecipeType | null, action: SetEditRecipeIngredientGramsStateAction) => {
    if (!recipe || action.amount <= 0 || recipe.amount === action.amount) return recipe;
    const value = Math.floor(action.amount * 10) / 10;
    if (value <= 0) return recipe;
    const amountChange = value / recipe.amount;
    const copy = copyRecipeType(recipe);
    copy.ingredients.forEach((e) => {
      e.ingredients.forEach((i) => {
        i.grams = i.grams * amountChange;
      })
    });
    copy.amount = value;
    return copy;
  },
  setBakingTime: (recipe: RecipeType | null, action: SetEditRecipeBakingTimeStateAction) => {
    if (!recipe) return null;
    return resolveActionGenericIndex(action.index, (index) => {
      if (index >= recipe.bakingTime.length) {
        const copy = copyRecipeType(recipe);
        copy.bakingTime.push(copyBakingTimeType(action));
        return copy;
      } else if (!bakingTimeEquals(recipe.bakingTime[index], action)) {
        const copy = copyRecipeType(recipe);
        copy.bakingTime[index] = copyBakingTimeType(action);
        return copy;
      }
      return recipe;
    }, (index) => {
      if (index.index >= recipe.ingredients[index.ingredients].bakingTime.length) {
        const copy = copyRecipeType(recipe);
        copy.ingredients[index.ingredients].bakingTime.push(copyBakingTimeType(action));
        return copy;
      } else if (!bakingTimeEquals(recipe.ingredients[index.ingredients].bakingTime[index.index], action)) {
        const copy = copyRecipeType(recipe);
        recipe.ingredients[index.ingredients].bakingTime[index.index] = copyBakingTimeType(action);
        return copy;
      }
      return recipe;
    });
  },
  removeBakingTime: (recipe: RecipeType | null, action: RemoveEditRecipeBakingTimeStateAction) => {
    if (!recipe) return null;
    return resolveActionGenericIndex(action.index, (index) => {
      if (index >= recipe.bakingTime.length) return recipe;
      const copy = copyRecipeType(recipe);
      copy.bakingTime = recipe.bakingTime.filter((e, i) => i !== index);
      return copy;
    }, (index) => {
      if (index.index >= recipe.ingredients[index.ingredients].bakingTime.length) return recipe;
      const copy = copyRecipeType(recipe);
      recipe.ingredients[index.ingredients].bakingTime = recipe.ingredients[index.ingredients].bakingTime.filter((e, i) => i !== index.index);
      return copy;
    });
  },
  setInnerTemperature: (recipe: RecipeType | null, action: SetEditRecipeInnerTemperatureStateAction) => {
    if (!recipe) return null;
    if (
      (!recipe.innerTemperature && !!action.temperature) ||
      (!!recipe.innerTemperature && !!action.temperature && !numberIntervalTypeEquals(recipe.innerTemperature, action.temperature))
    ) {
      const copy = copyRecipeType(recipe);
      copy.innerTemperature = copyNumberIntervalType(action.temperature);
      return copy;
    }
    if (recipe.innerTemperature && !action.temperature) {
      const copy = copyRecipeType(recipe);
      copy.innerTemperature = null;
      return copy;
    }
    return recipe;
  },
  setDescription: (recipe: RecipeType | null, action: SetEditRecipeDescriptionStateAction) => {
    if (!recipe) return null;
    const value = action.value === undefined || action.value === null || action.value.trim().length == 0 ? null : action.value;
    if (action.index === undefined || action.index === null) {
      if (hasNoValueOrEquals(recipe.description, action.value)) {
        return recipe;
      }
      const copy = copyRecipeType(recipe);
      copy.description = value;
      return copy;
    }
    if (hasNoValueOrEquals(recipe.ingredients[action.index].description, action.value)) {
      return recipe;
    }
    const copy = copyRecipeType(recipe);
    recipe.ingredients[action.index].description = value;
    return copy;
  }
} as Methods) as Methods;
