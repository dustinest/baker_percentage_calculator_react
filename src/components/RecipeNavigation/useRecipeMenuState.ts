import {useContext, useEffect, useState} from "react";
import {RecipeType} from "../../types";
import {RecipesContext, RecipesStateActionTypes} from "../../State";
import {runLater} from "typescript-async-timeouts";

export type RecipeMenuItemType = {
  id: string;
  recipe: RecipeType;
  selected: boolean;
};

type RecipeMenuStateStatus = {
  allSelected: boolean;
  noneSelected: boolean;
  selectedAmount: number;
  defaultSelected: number;
  selectedRecipe: RecipeType | null;
  hasChange: boolean;
}

type RecipeMenuStateActions = {
  select: (id: string, state: boolean) => void;
  selectAll: () => void;
  selectNone: () => void;
  submit: () => void;
  cancel: () => void;
}

export const useRecipeMenuState = (): [
  RecipeMenuItemType[],
  RecipeMenuStateActions,
  RecipeMenuStateStatus
] => {
  const {recipeState, recipesDispatch} = useContext(RecipesContext);
  const [recipeMenuItems, setRecipeMenuItems] = useState<RecipeMenuItemType[]>([]);
  const [selectedRecipes, setSelectedRecipes] = useState<string[]>([]);
  const [singleRecipe, setSingleRecipe] = useState<RecipeType | null>(null);
  const [hasChange, setHasChange] = useState<boolean>(false);

  useEffect(() => {
    const recipe = recipeState.recipesFilter.length === 1 ? recipeState.recipes.find(e => recipeState.recipesFilter.includes(e.id)) : undefined;
    setSingleRecipe(recipe || null);
  }, [recipeState]);

  useEffect(() => {
    setRecipeMenuItems(recipeState.recipes.map((recipe)=> (
      {
        id: recipe.id,
        recipe,
        selected: selectedRecipes.includes(recipe.id)
      }
    )));
    setHasChange(selectedRecipes.length !== recipeState.recipesFilter.length || recipeState.recipesFilter.find(e => selectedRecipes.includes(e)) === undefined);
  }, [selectedRecipes, recipeState]);

  useEffect(() => {
    setSelectedRecipes([...recipeState.recipesFilter]);
  },[recipeState])



  const selectAll = () => setSelectedRecipes(recipeMenuItems.map(e => e.id));
  const selectNone = () => setSelectedRecipes([]);

  const select = (id: string, selected: boolean) => {
    if (selected && !selectedRecipes.includes(id)) {
      setSelectedRecipes([...selectedRecipes, ...[id]])
    } else if (!selected && selectedRecipes.includes(id)) {
      setSelectedRecipes(selectedRecipes.filter(e => e !== id));
    }
  }

  const cancel = () => setSelectedRecipes([...recipeState.recipesFilter]);

  const submit = () => {
    runLater(() => {
      recipesDispatch({
        type: RecipesStateActionTypes.UPDATE_FILTER,
        value: selectedRecipes
      });
    }).catch(console.error);
  }

  return [recipeMenuItems, {
    select,
    selectAll,
    selectNone,
    submit,
    cancel
  },
    {
      allSelected: selectedRecipes.length === recipeMenuItems.length,
      noneSelected: selectedRecipes.length === 0,
      selectedAmount: selectedRecipes.length,
      defaultSelected: recipeState.recipesFilter.length,
      selectedRecipe: singleRecipe,
      hasChange
    }
  ];
}
