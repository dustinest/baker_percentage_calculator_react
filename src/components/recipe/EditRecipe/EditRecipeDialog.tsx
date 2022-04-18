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
  Container,
  Dialog,
  DialogActions,
  DialogContent, DialogTitle, Divider,
  Grid,
  Stack
} from "@mui/material";
import {IngredientsItem} from "../common/IngredientsItem";
import {BakerPercentage} from "../common/BakerPercentage";
import {EditBakingTime} from "./EditBakingTime";
import {EditInnerTemperature} from "./EditInnerTemperature";
import {EditDescription} from "./EditDescription";
import {RenderBakingTimeAware} from "../common/RenderBakingTimeAware";
import {RecipeJson} from "./RecipeJson";
import {recalculateRecipeBakerPercentage} from "../common/RecipeItemEditService";
import {RecipeContentLoader} from "../common/RecipeLoader";
import {EditRecipeDialogTitle} from "./EditRecipeDialogTitle";
import {EditRecipeDialogIngredients} from "./EditRecipeDialogIngredients";
import {hasNoValue, hasValue} from "../../../utils/NullSafe";
import {RECIPE_CONSTANTS} from "../../../State/RecipeConstants";
import {TranslatedAddButton, TranslatedCancelButton, TranslatedSaveButton} from "../../../Constant/Buttons";


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
      <Grid item lg>
        <EditBakingTime bakingTime={recipe.bakingTime}/>
      </Grid>
      <Grid item md>
          <Container>
            <Stack>
              <EditInnerTemperature recipe={recipe}/>
              <EditDescription value={recipe.description} onChange={setDescription}/>
            </Stack>
          </Container>
      </Grid>
    </>
  );
}

const RenderRecipeCalculationResult = ({
                                                recipe,
                                                bakerPercentage
                                              }: { recipe: RecipeType, bakerPercentage: BakerPercentageResult }) => {
  return (<>
    <Divider/>
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
    { recipe.id !== RECIPE_CONSTANTS.NEW_RECIPE ? <Container><RecipeJson recipe={recipe}/></Container> : undefined }
  </>)
}

const checkChange = (recipe: RecipeType | null, newRecipe: RecipeType | null): recipe is RecipeType => {
  if (hasNoValue(recipe)) return false;
  if (hasNoValue(newRecipe)) return true;
  if (recipe.id !== newRecipe.id || recipe.amount !== newRecipe.amount) return true;
  if (recipe.ingredients.length !== newRecipe.ingredients.length) return true;
  for (let i = 0; i < recipe.ingredients.length; i++) {
    if (recipe.ingredients[i].ingredients.length !== newRecipe.ingredients[i].ingredients.length) {
      return true;
    }
  }
  return false;
}

export const EditRecipeDialog = () => {
  const snackBar = useMessageSnackBar();

  const [recipe, saveRecipe, cancelRecipe] = useEditRecipeActions();
  const [recipeToEdit, setRecipeToEdit] = useState<RecipeType | null>(null);
  const [canSave, setCanSave] = useState<boolean>(false);

  const [bakerPercentage, setBakerPercentage] = useState<BakerPercentageResult | null>(null)

  const loadRecipeData = async (_recipe: RecipeType | null) => {
    if (_recipe === null) {
      setBakerPercentage(null);
      return;
    }
    const bakerPercentage = await recalculateRecipeBakerPercentage(_recipe);
    if (bakerPercentage.ingredients.find(e => e.ingredients.find(i => i.grams > 0)))
      setBakerPercentage(bakerPercentage);
    else {
      setBakerPercentage(null);
    }
  };

  useEffect(() => {
    if (recipe === null && recipeToEdit === null) {
      return;
    }
    if (checkChange(recipe, recipeToEdit)) {
      setRecipeToEdit(copyRecipeType(recipe));
      setCanSave(recipe.id !== RECIPE_CONSTANTS.NEW_RECIPE || (
        hasValue(recipe.name) && recipe.name.trim().length > 0 &&
        recipe.ingredients.length > 0 && recipe.ingredients[0].ingredients.length > 0
      ))
      return;
    }
    if (recipe === null && recipeToEdit !== null) {
      setCanSave(false);
      setRecipeToEdit(null);
    }
  }, [recipe, recipeToEdit]);

  useEffect(() => {
    loadRecipeData(recipe).catch((error) => snackBar.error(error as Error, `Error while recalculating ${recipe?.name}`).translate().enqueue());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipe])


  const onSave = () => {
    if (recipe !== null) {
      if (recipe.id === RECIPE_CONSTANTS.NEW_RECIPE) {
        recipe.id = `new_${Date.now() + Math.random()}`;
      }
      saveRecipe(recipe);
    } else {
      cancelRecipe();
    }
  }
  const onCancel = () => {
    cancelRecipe();
  }
  const editRecipeDispatch = useEditRecipeContext();
  const addIngredients = () => {
    editRecipeDispatch({
      type: EditRecipeStateActionTypes.ADD_INGREDIENTS,
    });
  }
  return (<Dialog open={recipe !== null} fullScreen>
    {recipeToEdit == null ?
      <DialogContent dividers><RecipeContentLoader loading={true}/></DialogContent> :
      <>
        <DialogTitle id="customized-dialog-title">
          <EditRecipeDialogTitle recipe={recipeToEdit}/>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} alignContent="center" justifyContent="center">
            <Grid container spacing={2} wrap="wrap" className="edit-recipe-ingredients">
              {recipeToEdit.ingredients.map((ingredients, index) => (
                <Grid item xl key={index}>
                  <EditRecipeDialogIngredients ingredients={ingredients} index={index} recipe={recipeToEdit}/>
                </Grid>
                ))}
            </Grid>
            <TranslatedAddButton translation="edit.ingredients.add"  onClick={addIngredients} disabled={recipeToEdit.ingredients.length > 0 && recipeToEdit.ingredients[recipeToEdit.ingredients.length - 1].ingredients.length === 0}/>
            <Grid container spacing={0} wrap="wrap" className="edit-recipe-ingredients">
              {recipe ? <RenderRecipeEditDialogContent recipe={recipe}/> : undefined}
            </Grid>
            {recipe && bakerPercentage ?
              <RenderRecipeCalculationResult recipe={recipe} bakerPercentage={bakerPercentage}/> : undefined}
          </Stack>
        </DialogContent>
        <DialogActions>
          <TranslatedCancelButton translation="edit.cancel" onClick={onCancel}/>
          <TranslatedSaveButton translation="edit.save" onClick={onSave} disabled={!canSave}/>
        </DialogActions>
      </>
    }
  </Dialog>);
};
