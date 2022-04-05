import {useContext, useEffect, useState} from "react";
import {copyRecipeType, RecipeType} from "../../../types";
import {UseRecipeItemValues, UseRecipeResultStatus, useRecipeType} from "./UseRecipeType";
import {EditRecipeContext} from "../../../State/lib/EditRecipeProvider";
import {EditRecipeStateActionTypes, RecipesContext, RecipesStateActionTypes, UpdateRecipesAction} from "../../../State";

export type UseRecipeActions = {
  setGrams: (value: number, ingredientIndex: number, index: number) => Promise<void>;
  setName: (value: string) => Promise<void>;
  setAmount: (value: number) => Promise<void>;
}


const useRecipeItemData = (recipe: RecipeType | null): [RecipeType | null, UseRecipeActions, UseRecipeResultStatus] => {
  const [recipeTypeValue, setRecipeTypeValue] = useState<RecipeType | null>(recipe);
  const recipeResultStatus = useRecipeType(recipeTypeValue);

  useEffect(() => {
    setRecipeTypeValue(recipe);
  }, [recipe]);


  const withRecipeArgs = async (callable: (newRecipe: RecipeType) => Promise<RecipeType | undefined>) => {
    const result = await callable(copyRecipeType(recipeTypeValue as RecipeType));
    if (result) {
      setRecipeTypeValue(result);
    }
  }

  const recipeActions: UseRecipeActions = {
    setGrams: async(grams: number, ingredientIndex: number, index: number) => {
      if (!recipeTypeValue) return;
      if (recipeTypeValue.ingredients[ingredientIndex].ingredients[index].grams !== grams) {
        await withRecipeArgs(async (recipeType) => {
          recipeType.ingredients[ingredientIndex].ingredients[index].grams = grams;
          return recipeType;
        });
      }
    },
    setName: async(name: string) => {
      if (!recipeTypeValue) return;
      if (!name || name.trim().length === 0 || recipeTypeValue.name === name) {
        return;
      }
      await withRecipeArgs (async (recipeType) => {
        recipeType.name = name.trim();
        return recipeType;
      });
    },
    setAmount: async (value: number) => {
      if (!recipeTypeValue) return;
      const _value = Math.floor(value * 10) / 10;
      if (_value <= 0) {
        return;
      }
      await withRecipeArgs (async (recipeType) => {
        const _amountChange = _value / recipeType.amount;
        recipeType.ingredients.forEach((e) => {
          e.ingredients.forEach((i) => {
            i.grams = i.grams * _amountChange;
          })
        });
        recipeType.amount = _value;
        return recipeType;
      });
    }
  }

  return [ recipeTypeValue, recipeActions, recipeResultStatus ];
};


export type UseRecipeItemEditResultActions = {
  save: () => void,
  cancel: () => void,
} & UseRecipeActions;

export type UseRecipeItemEditResultStatus = {
  isEdit: boolean; error?: Error; loading: boolean;
}
export type UseRecipeItemEditResult = {
  status: UseRecipeItemEditResultStatus,
  recipe?: RecipeType;
  result?: UseRecipeItemValues;
  methods: UseRecipeItemEditResultActions;
}

export const useRecipeItemEdit = (): UseRecipeItemEditResult => {
  const [edit, setEdit] = useState<boolean>(false);
  const [editData, setEditData] = useState<{recipe: RecipeType, result: UseRecipeItemValues} | null>(null);

  const { editRecipe, editRecipeDispatch } = useContext(EditRecipeContext);
  const { recipesDispatch } = useContext(RecipesContext);
  const [recipeTypeValue, {setGrams, setName, setAmount}, {result, error, loading}] = useRecipeItemData(editRecipe);

  const onCancelAction = () => {
    if (!edit) return;
    editRecipeDispatch({
      type: EditRecipeStateActionTypes.CANCEL_EDIT_RECIPE
    });
  }

  const saveRecipe = () => {
    if (!edit) return;
    recipesDispatch({
      type: RecipesStateActionTypes.UPDATE_RECIPE,
      value: recipeTypeValue
    } as UpdateRecipesAction);
    onCancelAction();
  }

  useEffect(() => {
    if (!!result && !!recipeTypeValue) {
      setEditData({
        recipe: recipeTypeValue,
        result: result
      })
      setEdit(true);
    } else {
      setEdit(false);
    }
  }, [result, recipeTypeValue]);

  return {
    status: {isEdit: edit, error, loading},
    recipe: editData?.recipe,
    result: editData?.result,
    methods: {
      save: saveRecipe,
      cancel: onCancelAction,
      setGrams, setName, setAmount
    }
  };
};
