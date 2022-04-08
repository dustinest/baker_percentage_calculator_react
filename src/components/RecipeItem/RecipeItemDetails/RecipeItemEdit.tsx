import {IngredientsItems} from "../IngredientsItem";
import {RecipeJson} from "../RecipeJson";
import {RecipeItemData} from "./RecipeItemData";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import {InputValue} from "../../common/InputValue";
import {RecipeCancelIcon, RecipeSaveIcon} from "../../common/Icons";
import {RecipeContentLoader} from "./RecipeLoader";
import {
    useRecipeItemActions, UseRecipeItemEditResult, UseRecipeTypeStatus,
} from "../../../service/ReciepeCallbacks";
import {Translation, useTranslation} from "../../../Translations";

type RenderRecipeEditDialogContentProps = {
  result: UseRecipeItemEditResult;
};

const RenderRecipeEditDialogContent = ({result}: RenderRecipeEditDialogContentProps) => {
  const translation = useTranslation();
    return (
        <>
            <DialogTitle id="customized-dialog-title">
                <InputValue value={result.recipe.name} onChange={result.setName} label={translation.translate("Name")}/>
                <InputValue value={result.recipe.amount} onChange={result.setAmount} label={translation.translate("Amount")}/>
            </DialogTitle>
            <DialogContent dividers>
                <section className="edit">
                    <section className="ingredients">
                        <IngredientsItems ingredients={result.ingredients} recipe={result.recipe}
                                          onGramsChange={result.setGrams}/>
                    </section>
                </section>
                <RecipeItemData bakerPercentage={result.bakerPercentage} recipe={result.recipe}/>
                <RecipeJson recipe={result.recipe}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={result.cancel} startIcon={<RecipeCancelIcon/>}><Translation label="Cancel"/></Button>
                <Button onClick={result.save} startIcon={<RecipeSaveIcon/>}><Translation label="Save"/></Button>
            </DialogActions>
        </>
    );
}

export const ShowErrorDialogContent = ({status}: {status: boolean}) => {
  return (<DialogContent dividers><RecipeContentLoader loading={status}/></DialogContent>);
}

export const RecipeEditDialog = () => {
    const result = useRecipeItemActions();

    //console.log("DIAL", status, recipe, result, methods);
    // TODO: this edit is caused to run multiple times
    return (<Dialog open={result.isEdit}>
        {result.status === UseRecipeTypeStatus.RESULT ? <RenderRecipeEditDialogContent result={result}/> : <ShowErrorDialogContent status={result.status === UseRecipeTypeStatus.WAITING}/>}
    </Dialog>);
};
