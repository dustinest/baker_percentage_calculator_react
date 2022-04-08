import {IngredientsItems} from "../IngredientsItem";
import {RecipeJson} from "../RecipeJson";
import {RecipeItemData} from "./RecipeItemData";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {InputValue} from "../../common/InputValue";
import {RecipeCancelIcon, RecipeSaveIcon} from "../../common/Icons";
import {RecipeContentLoader} from "./RecipeLoader";
import {Translation, useTranslation} from "../../../Translations";
import {useEditRecipeActions, useMessageSnackBar} from "../../../State";
import {RecipeType} from "../../../types";
import {useEffect, useState} from "react";
import {BakerPercentageResult, RecipeIngredientsWithPercentType} from "../../../utils/BakerPercentageCalulation";
import {
  recalculateIngredients,
  recalculateRecipeBakerPercentage,
  setRecipeAmount,
  setRecipeName
} from "./RecipeItemEditService";

enum ActionType {
  save,
  cancel,
  update
}

type RenderRecipeEditDialogContentProps = {
  recipe: RecipeType,
  bakerPercentage: BakerPercentageResult,
  ingredients: RecipeIngredientsWithPercentType[],
  onAction: (recipe: RecipeType, type: ActionType) => Promise<void>,
};

const RenderRecipeEditDialogContent = ({
                                         recipe,
                                         bakerPercentage,
                                         ingredients,
                                         onAction
                                       }: RenderRecipeEditDialogContentProps) => {
  const translation = useTranslation();

  const setName = async (name: string) => onAction(setRecipeName(recipe, name), ActionType.update);
  const setAmount = async (amount: number) => onAction(setRecipeAmount(recipe, amount), ActionType.update);
  //const setGrams = async (ingredientsIndex: number, index: number, value: number) => onAction(setRecipeIngredientGrams(recipe, ingredientsIndex, index, value), ActionType.update);
  const onSave = () => onAction(recipe, ActionType.save);
  const onCancel = () => onAction(recipe, ActionType.cancel);

  return (
    <>
      <DialogTitle id="customized-dialog-title">
        <InputValue value={recipe.name} onChange={setName} label={translation.translate("Name")}/>
        <InputValue value={recipe.amount} onChange={setAmount} label={translation.translate("Amount")}/>
      </DialogTitle>
      <DialogContent dividers>
        <section className="edit">
          <section className="ingredients">
            <IngredientsItems ingredients={ingredients} recipe={recipe} change={{grams: true, onRecipeChange: (r) => onAction(r, ActionType.update)}}/>
          </section>
        </section>
        <RecipeItemData bakerPercentage={bakerPercentage} recipe={recipe}/>
        <RecipeJson recipe={recipe}/>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} startIcon={<RecipeCancelIcon/>}><Translation label="Cancel"/></Button>
        <Button onClick={onSave} startIcon={<RecipeSaveIcon/>}><Translation label="Save"/></Button>
      </DialogActions>
    </>
  );
}

export const ShowErrorDialogContent = ({status}: { status: boolean }) => {
  return (<DialogContent dividers><RecipeContentLoader loading={status}/></DialogContent>);
}

export const RecipeEditDialog = () => {
  const snackBar = useMessageSnackBar();

  const [recipe, saveRecipe, cancelRecipe] = useEditRecipeActions();
  const [recipeData, setRecipeData] = useState<{
    recipe: RecipeType,
    bakerPercentage: BakerPercentageResult,
    ingredients: RecipeIngredientsWithPercentType[]
  } | null>(null)

  const loadRecipeData = async (_r: RecipeType | null) => {
    if (_r === null) {
      setRecipeData(null);
      return;
    }
    const bakerPercentage = await recalculateRecipeBakerPercentage(_r);
    const ingredients = await recalculateIngredients(_r);
    setRecipeData({ recipe: _r, bakerPercentage, ingredients });
  };

  useEffect(() => {
    loadRecipeData(recipe).catch((error) => snackBar.error(error as Error, `Error while recalculating ${recipe?.name}`).translate().enqueue());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipe])


  const onAction = async (_recipe: RecipeType, _type: ActionType): Promise<void> => {
    switch (_type) {
      case ActionType.update:
        await loadRecipeData(_recipe).catch((error) => snackBar.error(error as Error, `Error while recalculating ${_recipe?.name}`).translate().enqueue());
        break;
      case ActionType.save:
        snackBar.success("Recipe saved!").translate().enqueue();
        saveRecipe(_recipe);
        break;
      case ActionType.cancel:
        snackBar.info("Recipe edit cancelled!").translate().enqueue();
        cancelRecipe();
        break;
    }
  }

  return (<Dialog open={recipe !== null}>
    {recipeData ?
      <RenderRecipeEditDialogContent {...recipeData} onAction={onAction}/> :
      <ShowErrorDialogContent status={!recipeData}/>}
  </Dialog>);
};
