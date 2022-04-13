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
  ActionGenericIndex, ActionIngredientIndex, AddStandardEditRecipeIngredientStateAction,
  RemoveEditRecipeBakingTimeStateAction,
  SetEditRecipeAmountStateAction,
  SetEditRecipeBakingTimeStateAction, SetEditRecipeDescriptionStateAction,
  SetEditRecipeIngredientGramsStateAction, SetEditRecipeIngredientsNameStateAction,
  SetEditRecipeInnerTemperatureStateAction,
  SetEditRecipeNameStateAction
} from "./EditRecipeStateAction.d";
import {hasNoValueOrEquals, hasValue} from "../../utils/NullSafe";
import {getStandardIngredientMethodsGrams} from "../../Constant/Ingredient";

type Methods = {
  setName: (recipe: RecipeType | null, action: SetEditRecipeNameStateAction) => RecipeType | null,
  setIngredientGram: (recipe: RecipeType | null, action: SetEditRecipeIngredientGramsStateAction) => RecipeType | null,
  setAmount: (recipe: RecipeType | null, action: SetEditRecipeAmountStateAction) => RecipeType | null,
  setBakingTime: (recipe: RecipeType | null, action: SetEditRecipeBakingTimeStateAction) => RecipeType | null,
  removeBakingTime: (recipe: RecipeType | null, action: RemoveEditRecipeBakingTimeStateAction) => RecipeType | null,
  setInnerTemperature: (recipe: RecipeType | null, action: SetEditRecipeInnerTemperatureStateAction) => RecipeType | null,
  setDescription: (recipe: RecipeType | null, action: SetEditRecipeDescriptionStateAction) => RecipeType | null,
  setIngredientsName: (recipe: RecipeType | null, action: SetEditRecipeIngredientsNameStateAction) => RecipeType | null,
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
  setIngredientGram: (recipe: RecipeType | null, action: SetEditRecipeIngredientGramsStateAction | AddStandardEditRecipeIngredientStateAction) => {
    if (!recipe) return recipe;
    if (typeof action.index === "number") {
      const index = action.index as number;
      if (recipe.ingredients.length <= index) {
        throw new Error("Not managed: new ingredients should be added!");
      }
      const type = (action as AddStandardEditRecipeIngredientStateAction).item;
      if (!type) {
        throw new Error("Type must be provided!");
      }
      const item = getStandardIngredientMethodsGrams(type, action.grams);
      if (!item) throw new Error(`Could not find item for type ${type}!`)
      const copy = copyRecipeType(recipe);
      copy.ingredients[index].ingredients.push(item);
      return copy;
    }
    const index = action.index as ActionIngredientIndex;
    if (recipe.ingredients.length <= index.ingredients) {
      throw new Error("Not managed: new ingredients should be added!");
    }
    if (recipe.ingredients[index.ingredients].ingredients.length <= index.ingredient) {
      throw new Error("Not managed: new ingredients to array should be added!");
    }
    if (recipe.ingredients[index.ingredients].ingredients[index.ingredient].grams === action.grams) return recipe;
    const copy = copyRecipeType(recipe);
    copy.ingredients[index.ingredients].ingredients[index.ingredient].grams = action.grams
    return copy;
  },

  setAmount: (recipe: RecipeType | null, action: SetEditRecipeAmountStateAction) => {
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
    const value = action.value === undefined || action.value === null || action.value.trim().length === 0 ? null : action.value;
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
  },
  setIngredientsName: (recipe: RecipeType | null, action: SetEditRecipeIngredientsNameStateAction) => {
    if (!recipe) return null;
    const newName = hasValue(action.name) ? action.name.trim() : undefined;
    if (recipe.ingredients[action.index].name === newName) {
      return;
    }
    const copy = copyRecipeType(recipe);
    copy.ingredients[action.index].name = newName;
    return copy;
  }
} as Methods) as Methods;
