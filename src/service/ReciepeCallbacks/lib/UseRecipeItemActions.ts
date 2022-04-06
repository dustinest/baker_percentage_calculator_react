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
import {UseRecipeTypeResult} from "../types/UseRecipeTypeResult";

export type UseRecipeActions = {
  setGrams: (value: number, ingredientIndex: number, index: number) => Promise<void>;
  setName: (value: string) => Promise<void>;
  setAmount: (value: number) => Promise<void>;
}


export type UseRecipeItemEditResultActions = {
  save: () => void,
  cancel: () => void,
} & UseRecipeActions;

export type UseRecipeItemEditResultStatus = {
  isEdit: boolean; error: boolean; loading: boolean;
}
export type UseRecipeItemEditResult = {
  status: UseRecipeItemEditResultStatus,
  recipe?: RecipeType;
  result?: UseRecipeTypeResult;
  methods: UseRecipeItemEditResultActions;
}

export const useRecipeItemActions = (): UseRecipeItemEditResult => {
  const { editRecipe, editRecipeDispatch } = useContext(EditRecipeContext);
  const [recipe, setRecipe] = useState<RecipeType | null>(editRecipe);
  useEffect(() => {
    setRecipe(editRecipe);
  }, [editRecipe]);
  const recipeResultStatus = useRecipeType(recipe);

  const [edit, setEdit] = useState<boolean>(false);
  const [editData, setEditData] = useState<{recipe: RecipeType, result: UseRecipeTypeResult} | null>(null);
  const { recipesDispatch } = useContext(RecipesContext);



  const recipeActions: UseRecipeActions = {
    setGrams: async(grams: number, ingredientIndex: number, index: number) => setRecipe(RecipeMethods.setGrams(recipe, ingredientIndex, index, grams)),
    setName: async(name: string) => setRecipe(RecipeMethods.setName(recipe, name)),
    setAmount: async (value: number) => setRecipe(RecipeMethods.setAmount(recipe, value))
  }


  const snackBar = useMessageSnackBar();

  const onCancelAction = () => {
    if (!edit) return;
    editRecipeDispatch({
      type: EditRecipeStateActionTypes.CANCEL_EDIT_RECIPE
    });
    snackBar.info("Recipe edit cancelled!").translate().enqueue();
  }

  const saveRecipe = () => {
    if (!edit) return;
    recipesDispatch({
      type: RecipesStateActionTypes.SAVE_RECIPE,
      value: recipe
    } as UpdateRecipesAction);
    snackBar.success("Recipe saved!").translate().enqueue();
    editRecipeDispatch({
      type: EditRecipeStateActionTypes.CANCEL_EDIT_RECIPE
    });
  }

  useEffect(() => {
    if (!!recipe && !!recipeResultStatus && recipeResultStatus.result) {
      setEditData({
        recipe: recipe,
        result: recipeResultStatus.result
      })
      setEdit(true);
    } else {
      setEdit(false);
    }
  }, [recipeResultStatus, recipe]);

  return {
    status: {isEdit: edit, error: recipeResultStatus.error, loading: recipeResultStatus.loading},
    recipe: editData?.recipe,
    result: editData?.result,
    methods: {
      save: saveRecipe,
      cancel: onCancelAction,
      setGrams: recipeActions.setGrams, setName: recipeActions.setName, setAmount: recipeActions.setAmount
    }
  };
};
