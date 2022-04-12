import {
  EditRecipeStateActionTypes,
  useEditRecipeActions,
  useEditRecipeContext,
  useMessageSnackBar
} from "../../../State";
import {useEffect, useState} from "react";
import {copyRecipeType, RecipeType} from "../../../types";
import {BakerPercentageResult} from "../../../utils/BakerPercentageCalulation";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Paper,
  Stack
} from "@mui/material";
import {IngredientsItem} from "../common/IngredientsItem";
import {BakerPercentage} from "../common/BakerPercentage";
import {EditBakingTime} from "./EditBakingTime";
import {EditInnerTemperature} from "./EditInnerTemperature";
import {EditDescription} from "./EditDescription";
import {RenderBakingTimeAware} from "../common/RenderBakingTimeAware";
import {RecipeJson} from "./RecipeJson";
import {RecipeCancelIcon, RecipeSaveIcon} from "../../common/Icons";
import {Translation} from "../../../Translations";
import {recalculateRecipeBakerPercentage} from "../common/RecipeItemEditService";
import {RecipeContentLoader} from "../common/RecipeLoader";
import {EditRecipeDialogTitle} from "./EditRecipeDialogTitle";
import {EditRecipeIngredients} from "./EditRecipeDialogIngredients";


const RenderRecipeEditDialogContent = ({recipe }: { recipe: RecipeType }) => {
  const editRecipeDispatch = useEditRecipeContext();

  const setDescription = async (value?: string) => {
    editRecipeDispatch({
      type: EditRecipeStateActionTypes.SET_DESCRIPTION,
      value
    });
  }

  return (
    <>
      <Paper elevation={0}>
        <Grid container spacing={2} wrap="wrap" className="edit-recipe-ingredients">
          <Grid item lg><EditBakingTime bakingTime={recipe.bakingTime}/></Grid>
          <Grid item md>
            <Stack>
              <EditInnerTemperature recipe={recipe}/>
              <EditDescription value={recipe.description} onChange={setDescription}/>
            </Stack>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}

export const RenderRecipeCalculationResult = ({
                                                recipe,
                                                bakerPercentage
                                              }: { recipe: RecipeType, bakerPercentage: BakerPercentageResult }) => {
  return (<>
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
    <Container><RecipeJson recipe={recipe}/></Container>
  </>)
}

export const EditRecipeDialog = () => {
  const snackBar = useMessageSnackBar();

  const [recipe, saveRecipe, cancelRecipe] = useEditRecipeActions();
  const [recipeToEdit, setRecipeToEdit] = useState<RecipeType | null>(null);

  const [bakerPercentage, setBakerPercentage] = useState<BakerPercentageResult | null>(null)

  const loadRecipeData = async (_recipe: RecipeType | null) => {
    if (_recipe === null) {
      setBakerPercentage(null);
      return;
    }
    const bakerPercentage = await recalculateRecipeBakerPercentage(_recipe);
    setBakerPercentage(bakerPercentage);
  };

  useEffect(() => {
    if (recipe === null && recipeToEdit === null) {
      return;
    }
    if (recipe !== null && (recipeToEdit === null || recipe.id !== recipeToEdit.id || recipe.amount !== recipeToEdit.amount)) {
      setRecipeToEdit(copyRecipeType(recipe));
      return;
    }
    if (recipe === null && recipeToEdit !== null) {
      setRecipeToEdit(null);
    }
  }, [recipe, recipeToEdit]);

  useEffect(() => {
    loadRecipeData(recipe).catch((error) => snackBar.error(error as Error, `Error while recalculating ${recipe?.name}`).translate().enqueue());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipe])


  const onSave = () => {
    if (recipe !== null) {
      saveRecipe(recipe);
    } else {
      cancelRecipe();
    }
  }
  const onCancel = () => {
    cancelRecipe();
  }

  return (<Dialog open={recipe !== null} fullScreen>
    {recipeToEdit == null ?
      <DialogContent dividers><RecipeContentLoader loading={true}/></DialogContent> :
      <>
        <EditRecipeDialogTitle recipe={recipeToEdit}/>
        <DialogContent dividers>
          <Stack spacing={2} alignContent="center" justifyContent="center">
            <Grid container spacing={2} wrap="wrap" className="edit-recipe-ingredients">
              {recipeToEdit.ingredients.map((ingredients, index) => (
                <Grid item md key={index}>
                  <EditRecipeIngredients ingredients={ingredients} index={index}/>
                </Grid>
                ))}
              {recipe ? <Grid item lg><RenderRecipeEditDialogContent recipe={recipe}/></Grid> : undefined}
            </Grid>
            {recipe && bakerPercentage ?
              <RenderRecipeCalculationResult recipe={recipe} bakerPercentage={bakerPercentage}/> : undefined}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel} startIcon={<RecipeCancelIcon/>}><Translation label="edit.cancel"/></Button>
          <Button onClick={onSave} startIcon={<RecipeSaveIcon/>}><Translation label="edit.save"/></Button>
        </DialogActions>
      </>
    }
  </Dialog>);
};
