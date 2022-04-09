import {IngredientsItem, IngredientsItems} from "../IngredientsItem";
import {RecipeJson} from "../RecipeJson";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Stack,
} from "@mui/material";
import {InputValue} from "../../common/InputValue";
import {RecipeCancelIcon, RecipeSaveIcon} from "../../common/Icons";
import {RecipeContentLoader} from "./RecipeLoader";
import {Translation, useTranslation} from "../../../Translations";
import {
  EditRecipeStateActionTypes,
  useEditRecipeActions,
  useEditRecipeContext,
  useMessageSnackBar
} from "../../../State";
import {RecipeType} from "../../../types";
import {useEffect, useState} from "react";
import {BakerPercentageResult} from "../../../utils/BakerPercentageCalulation";
import {recalculateIngredients, recalculateRecipeBakerPercentage,} from "./RecipeItemEditService";
import {RenderBakingTimeAware} from "../RenderBakingTimeAware";
import {BakerPercentage} from "../BakerPercentage";
import {EditBakingTime} from "./EditBakingTime";
import {EditInnerTemperature} from "./EditInnerTemperature";
import {EditDescription} from "./EditDescription";

enum ActionType {
  save,
  cancel
}

type RenderRecipeEditDialogContentProps = {
  recipe: RecipeType,
  bakerPercentage: BakerPercentageResult,
  recipeBakerPercentage: BakerPercentageResult,
  onAction: (recipe: RecipeType, type: ActionType) => Promise<void>,
};

const RenderRecipeEditDialogContent = ({
                                         recipe,
                                         bakerPercentage,
                                         recipeBakerPercentage,
                                         onAction
                                       }: RenderRecipeEditDialogContentProps) => {
  const translation = useTranslation();
  const editRecipeDispatch = useEditRecipeContext();

  const setName = async (name: string) => {
    editRecipeDispatch({
      type: EditRecipeStateActionTypes.SET_NAME,
      name
    });
  }
  const setAmount = async (amount: number) => {
    editRecipeDispatch({
      type: EditRecipeStateActionTypes.SET_AMOUNT,
      amount
    });
  }

  const setDescription = async (value?: string) => {
    editRecipeDispatch({
      type: EditRecipeStateActionTypes.SET_DESCRIPTION,
      value
    });
  }

  const onSave = () => onAction(recipe, ActionType.save);
  const onCancel = () => onAction(recipe, ActionType.cancel);

  return (
    <>
      <DialogTitle id="customized-dialog-title">
        <Grid container alignItems="center">
          <Grid item xs>
            <InputValue value={recipe.name} onChange={setName} label={translation.translate("Name")}/>
          </Grid>
          <Grid item xs>
            <InputValue value={recipe.amount} onChange={setAmount} label={translation.translate("Amount")}/>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} alignContent="center" justifyContent="center">
          <Paper elevation={4}>
            <Container maxWidth="lg">
              <Grid container spacing={2} wrap="wrap">
                <Grid item md>
                  <IngredientsItems ingredients={recipeBakerPercentage.ingredients} recipe={recipe}
                                    change={{grams: true}}/>
                </Grid>
                <Grid item xs>
                  <BakerPercentage microNutrientsResult={recipeBakerPercentage.microNutrients}/>
                </Grid>
              </Grid>
            </Container>
            <Container maxWidth="md">
              <Stack spacing={2} alignContent="center" justifyContent="center">
                <EditBakingTime bakingTime={recipe.bakingTime}/>
                <Container maxWidth="xs">
                  <EditInnerTemperature recipe={recipe}/>
                </Container>
                <Container>
                  <EditDescription value={recipe.description} onChange={setDescription}/>
                </Container>
              </Stack>
            </Container>
          </Paper>
          <Container maxWidth="xl">
            <Grid container spacing={2} wrap="wrap">
              {
                bakerPercentage.ingredients.map((ingredients, index) => (
                  <Grid item xs key={index}><IngredientsItem
                    index={index}
                    ingredients={ingredients}
                    recipe={recipe}
                    key={`ingredients_${index}`}/></Grid>
                ))
              }
            </Grid>
          </Container>
          <Box justifyContent="center">
            <Container maxWidth="xs" sx={{textAlign: "center"}}>
              <RenderBakingTimeAware value={recipe}/>
            </Container>
          </Box>
          <Box justifyContent="center">
            <Container maxWidth="xs">
              <BakerPercentage microNutrientsResult={bakerPercentage.microNutrients}/>
            </Container>
          </Box>
          <Container>
            <RecipeJson recipe={recipe}/>
          </Container>
        </Stack>
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
    recipeBakerPercentage: BakerPercentageResult
  } | null>(null)

  const loadRecipeData = async (_recipe: RecipeType | null) => {
    if (_recipe === null) {
      setRecipeData(null);
      return;
    }
    const bakerPercentage = await recalculateRecipeBakerPercentage(_recipe);
    const recipeBakerPercentage = await recalculateIngredients(_recipe);
    setRecipeData({recipe: _recipe, bakerPercentage, recipeBakerPercentage});
  };

  useEffect(() => {
    loadRecipeData(recipe).catch((error) => snackBar.error(error as Error, `Error while recalculating ${recipe?.name}`).translate().enqueue());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipe])


  const onAction = async (_recipe: RecipeType, _type: ActionType): Promise<void> => {
    switch (_type) {
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

  return (<Dialog open={recipe !== null} fullScreen>
    {recipeData ?
      <RenderRecipeEditDialogContent {...recipeData} onAction={onAction}/> :
      <ShowErrorDialogContent status={!recipeData}/>}
  </Dialog>);
};
