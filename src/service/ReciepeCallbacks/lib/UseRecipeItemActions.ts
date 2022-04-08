import {useContext, useEffect, useState} from "react";
import {RecipeType} from "../../../types";
import {useRecipeType} from "./UseRecipeType";
import {
  EditRecipeContext,
  EditRecipeStateActionTypes,
  RecipesContext,
  RecipesStateActionTypes,
  UpdateRecipesAction,
  useMessageSnackBar
} from "../../../State";
import { RecipeMethods} from "./RecipeHelperMethods";
import {
  CommonUseRecipeTypeResult,
  UseRecipeTypeResult,
  UseRecipeTypeStatus,
} from "../types/UseRecipeTypeResult.d";
import {
  BakerPercentageResult,
  recalculateBakerPercentage,
  RecipeIngredientsWithPercentType
} from "../../../utils/BakerPercentageCalulation";

export type UseRecipeActions = {
  setGrams: (value: number, ingredientIndex: number, index: number) => Promise<void>;
  setName: (value: string) => Promise<void>;
  setAmount: (value: number) => Promise<void>;
}


export type UseRecipeItemEditResultActions = {
  save: () => void,
  cancel: () => void,
} & UseRecipeActions;

export type UseRecipeItemEditResult = {
  isEdit: boolean;
  ingredients: RecipeIngredientsWithPercentType[],
  recipe: RecipeType,
  bakerPercentage: BakerPercentageResult,
} & UseRecipeTypeResult;

export type UseRecipeItemStatusResult = {
  isEdit: boolean;
} & CommonUseRecipeTypeResult;

export const useRecipeItemActions = (): (UseRecipeItemStatusResult & UseRecipeItemEditResultActions) | UseRecipeItemEditResult => {
  const {editRecipe, editRecipeDispatch} = useContext(EditRecipeContext);
  const [recipe, setRecipe] = useState<RecipeType | null>(editRecipe);
  useEffect(() => {
    setRecipe(editRecipe);
  }, [editRecipe]);
  const recipeResultStatus = useRecipeType(recipe);

  const [editData, setEditData] = useState<UseRecipeItemStatusResult | UseRecipeItemEditResult>({status: UseRecipeTypeStatus.WAITING, isEdit: false} as UseRecipeItemStatusResult);
  const {recipesDispatch} = useContext(RecipesContext);


  const recipeActions: UseRecipeActions = {
    setGrams: async (grams: number, ingredientIndex: number, index: number) => setRecipe(RecipeMethods.setGrams(recipe, ingredientIndex, index, grams)),
    setName: async (name: string) => setRecipe(RecipeMethods.setName(recipe, name)),
    setAmount: async (value: number) => setRecipe(RecipeMethods.setAmount(recipe, value))
  }

  const snackBar = useMessageSnackBar();

  const onCancelAction = () => {
    if (!editData.isEdit) return;
    setEditData({...editData, ...{isEdit: false}})
    editRecipeDispatch({
      type: EditRecipeStateActionTypes.CANCEL_EDIT_RECIPE
    });
    snackBar.info("Recipe edit cancelled!").translate().enqueue();
  }

  const saveRecipe = () => {
    if (!editData.isEdit) return;
    recipesDispatch({
      type: RecipesStateActionTypes.SAVE_RECIPE,
      value: recipe
    } as UpdateRecipesAction);
    setEditData({...editData, ...{isEdit: false}})
    snackBar.success("Recipe saved!").translate().enqueue();
    editRecipeDispatch({
      type: EditRecipeStateActionTypes.CANCEL_EDIT_RECIPE
    });
  }

  useEffect(() => {
    const hasRecipe = recipe !== null && recipe !== undefined;
    if (hasRecipe && recipeResultStatus.status === UseRecipeTypeStatus.RESULT) {
      // noinspection JSObjectNullOrUndefined
      const ingredientMicros = recalculateBakerPercentage(recipe.ingredients);
      setEditData({
        isEdit: true,
        status: UseRecipeTypeStatus.RESULT,
        ingredients: ingredientMicros.ingredients,
        recipe: recipe,
        bakerPercentage: recipeResultStatus.bakerPercentage,
      } as UseRecipeItemEditResult)
    } else if (editData.status !== UseRecipeTypeStatus.RESULT && editData.status !== recipeResultStatus.status){
      setEditData({...editData, ...{status: recipeResultStatus.status}});
    }
    // eslint-disable-next-line
  }, [recipeResultStatus]);

  // TODO: as we return methods recipeResultStatus the status change triggers returning this multiple times
  return {...editData, ...{
    save: saveRecipe,
      cancel: onCancelAction,
      setGrams: recipeActions.setGrams, setName: recipeActions.setName, setAmount: recipeActions.setAmount
  }};
};
