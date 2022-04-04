import {useRecipeItemData} from "./UseRecipeType";
import {RecipeType} from "../../../models";
import {IngredientsItems} from "../IngredientsItem";
import {RecipeJson} from "../RecipeJson";
import {RecipeItemData} from "./RecipeItemData";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {InputValue} from "../../common/InputValue";
import {RecipeCancelIcon, RecipeSaveIcon} from "../../common/Icons";
import {useTranslation} from "react-i18next";
import {RecipeLoader} from "./RecipeLoader";

type RecipeEditDialogProps = {
  recipe: RecipeType;
  edit: boolean;
  onSave: (recipe: RecipeType) => void;
  onCancel: () => void;
}
export const RecipeEditDialog = ({edit, recipe, onSave, onCancel}: RecipeEditDialogProps) => {
  const translation = useTranslation();
  const [recipeTypeValue, {cancel, setGrams, setName, setAmount}, {result, error, loading}] = useRecipeItemData(recipe);

  const onCancelAction = () => {
    cancel();
    onCancel();
  }

  return (<Dialog open={edit}>
    <DialogTitle id="customized-dialog-title">
      <InputValue value={recipeTypeValue.name} onChange={setName} label={translation.t("Name")}/>
      <InputValue value={recipeTypeValue.amount} onChange={setAmount} label={translation.t("Amount")}/>
    </DialogTitle >
    <DialogContent dividers>
      { result ? <>
        <section className="edit">
          <section className="ingredients">
            <IngredientsItems ingredients={result.recipe.microNutrients.ingredients} recipe={result.recipe.recipe} onGramsChange={setGrams} />
          </section>
        </section>
        <RecipeItemData result={result} error={error} loading={loading}/>
        <RecipeJson recipe={recipe}/>
      </> : <RecipeLoader/> }
    </DialogContent>
    <DialogActions>
      <Button onClick={onCancelAction} startIcon={<RecipeCancelIcon/>}>{translation.t("Cancel")}</Button>
      <Button onClick={() => onSave(recipeTypeValue)} startIcon={<RecipeSaveIcon/>}>{translation.t("Save")}</Button>
    </DialogActions>
  </Dialog>);
};
