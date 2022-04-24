import {NumberIntervalType, RecipeType} from "../../types";

export enum EditRecipeStateActionTypes {
  EDIT_RECIPE,
  SET_NAME,
  SET_DESCRIPTION,
  SET_AMOUNT,
  SET_INGREDIENT_GRAM,
  REMOVE_INGREDIENT,
  USE_INGREDIENT_IN_STARTER,
  SET_INGREDIENTS_NAME,
  ADD_INGREDIENTS,
  SET_BAKING_TIME,
  REMOVE_BAKING_TIME,
  SET_INNER_TEMPERATURE,
  CANCEL_EDIT_RECIPE,
  SET_HYDRATION
}

export type ActionIngredientsIndex = { ingredients: number };
export type ActionIngredientIndex = { ingredient: number } & ActionIngredientsIndex;
export type ActionGenericIndex = { index: number } & ActionIngredientsIndex;

type EditRecipeStateAction<Action extends EditRecipeStateActionTypes> = { type: Action; }
type EditRecipeStateActionWithValue<Action extends EditRecipeStateActionTypes, ValueType> = { value: ValueType; } & EditRecipeStateAction<Action>;
export type EditRecipesStateAction = EditRecipeStateActionWithValue<EditRecipeStateActionTypes.EDIT_RECIPE, RecipeType>;
export type CancelEditRecipesStateAction = EditRecipeStateAction<EditRecipeStateActionTypes.CANCEL_EDIT_RECIPE>;
export type SetEditRecipeNameStateAction = { name: string;  } & EditRecipeStateAction<EditRecipeStateActionTypes.SET_NAME>;
export type SetEditRecipeIngredientsNameStateAction = { name?: string; index: number; } & EditRecipeStateAction<EditRecipeStateActionTypes.SET_INGREDIENTS_NAME>;
export type SetEditRecipeAmountStateAction = { amount: number; calculate: boolean  } & EditRecipeStateAction<EditRecipeStateActionTypes.SET_AMOUNT>;

export type RemoveRecipeIngredientStateAction = { index: ActionIngredientIndex | number; } & EditRecipeStateAction<EditRecipeStateActionTypes.REMOVE_INGREDIENT>;
export type SetEditRecipeIngredientGramsStateAction = { index: ActionIngredientIndex; grams: number;  } & EditRecipeStateAction<EditRecipeStateActionTypes.SET_INGREDIENT_GRAM>;
export type SetEditRecipeIngredientHydrationStateAction = { index: ActionIngredientIndex | number; hydration: number;  } & EditRecipeStateAction<EditRecipeStateActionTypes.SET_HYDRATION>;
export type AddStandardEditRecipeIngredientStateAction = { index: number; grams: number; item: string  } & EditRecipeStateAction<EditRecipeStateActionTypes.SET_INGREDIENT_GRAM>;

export type UseIngredientInStarterAction = { index: number; value: boolean;  } & EditRecipeStateAction<EditRecipeStateActionTypes.USE_INGREDIENT_IN_STARTER>;

export type SetEditRecipeBakingTimeStateAction = {
  index: ActionGenericIndex | number,
  time: NumberIntervalType;
  temperature: NumberIntervalType;
  steam: boolean;
} & EditRecipeStateAction<EditRecipeStateActionTypes.SET_BAKING_TIME>;

export type RemoveEditRecipeBakingTimeStateAction = {
  index: ActionGenericIndex | number
} & EditRecipeStateAction<EditRecipeStateActionTypes.REMOVE_BAKING_TIME>;

export type SetEditRecipeInnerTemperatureStateAction = {
  temperature?: NumberIntervalType;
} & EditRecipeStateAction<EditRecipeStateActionTypes.SET_INNER_TEMPERATURE>;

export type SetEditRecipeDescriptionStateAction = {
  index?: number,
} & EditRecipeStateActionWithValue<EditRecipeStateActionTypes.SET_DESCRIPTION, string | null | undefined>;

export type RecipeManagementStateActions =
  EditRecipesStateAction |
  SaveRecipesStateAction |
  CancelEditRecipesStateAction |
  SetEditRecipeNameStateAction |
  SetEditRecipeAmountStateAction |
  SetEditRecipeIngredientGramsStateAction |
  SetEditRecipeBakingTimeStateAction |
  RemoveEditRecipeBakingTimeStateAction |
  SetEditRecipeInnerTemperatureStateAction |
  SetEditRecipeIngredientsNameStateAction |
  UseIngredientInStarterAction |
  SetEditRecipeIngredientHydrationStateAction;
