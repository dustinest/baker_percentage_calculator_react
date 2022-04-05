import {IngredientsItems} from "../IngredientsItem";
import {RecipeJson} from "../RecipeJson";
import {RecipeItemData} from "./RecipeItemData";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {InputValue} from "../../common/InputValue";
import {RecipeCancelIcon, RecipeSaveIcon} from "../../common/Icons";
import {useTranslation} from "react-i18next";
import {RecipeLoader} from "./RecipeLoader";
import {useRecipeItemEdit} from "./useRecipeItemEdit";

export const RecipeEditDialog = () => {
  const translation = useTranslation();
  const {
    isEdit,
    editData,
    result, error, loading,
    saveRecipe, onCancelAction, setGrams, setName, setAmount
  } = useRecipeItemEdit();

  return (<Dialog open={isEdit}>
    <DialogTitle id="customized-dialog-title">
      <InputValue value={editData?.recipe?.name || ""} onChange={setName} label={translation.t("Name")}/>
      <InputValue value={editData?.recipe?.amount || 0} onChange={setAmount} label={translation.t("Amount")}/>
    </DialogTitle >
    <DialogContent dividers>
      { editData ? <>
        <section className="edit">
          <section className="ingredients">
            <IngredientsItems ingredients={editData.status.recipe.microNutrients.ingredients} recipe={editData.recipe} onGramsChange={setGrams} />
          </section>
        </section>
        <RecipeItemData result={result} error={error} loading={loading} recipe={editData.recipe}/>
        <RecipeJson recipe={editData.recipe}/>
      </> : <RecipeLoader/> }
    </DialogContent>
    <DialogActions>
      <Button onClick={onCancelAction} startIcon={<RecipeCancelIcon/>}>{translation.t("Cancel")}</Button>
      <Button onClick={saveRecipe} startIcon={<RecipeSaveIcon/>}>{translation.t("Save")}</Button>
    </DialogActions>
  </Dialog>);
};
