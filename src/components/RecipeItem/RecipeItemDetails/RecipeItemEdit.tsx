import {IngredientsItems} from "../IngredientsItem";
import {RecipeJson} from "../RecipeJson";
import {RecipeItemData} from "./RecipeItemData";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {InputValue} from "../../common/InputValue";
import {RecipeCancelIcon, RecipeSaveIcon} from "../../common/Icons";
import {RecipeContentLoader} from "./RecipeLoader";
import {
  useRecipeItemEdit,
  UseRecipeItemEditResultActions, UseRecipeItemEditResultStatus
} from "./useRecipeItemEdit";
import {RecipeType} from "../../../types";
import {UseRecipeItemValues} from "./UseRecipeType";
import {Translation, useTranslation} from "../../../Translations";

type RenderRecipeEditDialogContentProps = {
  recipe: RecipeType;
  result: UseRecipeItemValues;
  methods: UseRecipeItemEditResultActions;
};

const RenderRecipeEditDialogContent = ({recipe, result, methods}: RenderRecipeEditDialogContentProps) => {
  const translation = useTranslation();
    return (
        <>
            <DialogTitle id="customized-dialog-title">
                <InputValue value={recipe.name} onChange={methods.setName} label={translation.translate("Name")}/>
                <InputValue value={recipe.amount} onChange={methods.setAmount} label={translation.translate("Amount")}/>
            </DialogTitle>
            <DialogContent dividers>
                <section className="edit">
                    <section className="ingredients">
                        <IngredientsItems ingredients={result.recipe.microNutrients.ingredients} recipe={recipe}
                                          onGramsChange={methods.setGrams}/>
                    </section>
                </section>
                <RecipeItemData result={result} recipe={recipe}/>
                <RecipeJson recipe={recipe}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={methods.cancel} startIcon={<RecipeCancelIcon/>}><Translation label="Cancel"/></Button>
                <Button onClick={methods.save} startIcon={<RecipeSaveIcon/>}><Translation label="Save"/></Button>
            </DialogActions>
        </>
    );
}

export const ShowErrorDialogContent = ({status}: {status: UseRecipeItemEditResultStatus}) => {
  return (<DialogContent dividers><RecipeContentLoader loading={status.loading} error={status.error}/></DialogContent>);
}

export const RecipeEditDialog = () => {
    const {status, recipe, result, methods} = useRecipeItemEdit();
    // TODO: this edit is caused to run multiple times
    return (<Dialog open={status.isEdit}>
        {result && recipe && !status.loading && !status.error ? <RenderRecipeEditDialogContent recipe={recipe} result={result} methods={methods}/> : <ShowErrorDialogContent status={status}/>}
    </Dialog>);
};
