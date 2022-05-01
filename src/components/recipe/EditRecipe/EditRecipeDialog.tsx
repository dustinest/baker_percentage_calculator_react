import {EditRecipeContext, EditRecipeStateActionTypes,} from "../../../State";
import {useContext, useEffect, useState} from "react";
import {copyRecipeType, RecipeType} from "../../../types";
import {Container, Dialog, DialogActions, DialogContent, DialogTitle, Divider,} from "@mui/material";
import {IngredientsItem} from "../common/IngredientsItem";
import {BakerPercentage} from "../common/BakerPercentage";
import {EditBakingTime} from "./EditBakingTime";
import {EditInnerTemperature} from "./EditInnerTemperature";
import {EditDescription} from "./EditDescription";
import {RecipeJson} from "./RecipeJson";
import {RecipeContentLoader} from "../common/RecipeLoader";
import {EditRecipeDialogTitle} from "./EditRecipeDialogTitle";
import {EditRecipeDialogIngredients} from "./EditRecipeDialogIngredients";
import {hasNoValue, hasValue} from "../../../utils/NullSafe";
import {RECIPE_CONSTANTS} from "../../../State/RecipeConstants";
import {TranslatedAddIconButton, TranslatedCancelButton, TranslatedSaveButton} from "../../../Constant/Buttons";
import {useBakerPercentage} from "./useBakerPercentage";
import {GridContainer, GridItem} from "../../common/GridContainer";
import {VerticalStack} from "../../common/CommonStack";
import {useRecipeEditService} from "../../../service/RecipeEditService";

const RenderRecipeCalculationResult = () => {
  const {editedRecipe} = useRecipeEditService();
  const {hasValue, recipeResult, bakerPercentage} = useBakerPercentage(editedRecipe);
  return (<>
    {!hasValue ? undefined :
      <>
        <Divider/>
        <Container maxWidth="xl">
          <GridContainer>
            {
              bakerPercentage.ingredients.map((ingredients, index) => (
                <GridItem key={index}><IngredientsItem
                  index={index}
                  ingredients={ingredients}
                  recipe={recipeResult}
                  key={`ingredients_${index}`}/></GridItem>
              ))
            }
            <GridItem><BakerPercentage microNutrientsResult={bakerPercentage.microNutrients}/></GridItem>
          </GridContainer>
        </Container>
        <RecipeJson recipe={recipeResult}/>
      </>
    }
  </>)
}

const checkArrayChange = <T,>(left: T[], right: T[], callback?: (left: T, right: T) => boolean): boolean => {
  if (left.length !== right.length) return true;
  if (callback) {
    for (let i = 0; i < left.length; i++) {
      if (callback(left[i], right[i])) return true;
    }
  }
  return false;
}
const checkChange = (recipe: RecipeType | null, newRecipe: RecipeType | null | undefined): recipe is RecipeType => {
  if (hasNoValue(recipe)) return false;
  if (hasNoValue(newRecipe)) return true;
  if (recipe.id !== newRecipe.id || recipe.amount !== newRecipe.amount) return true;
  return checkArrayChange(recipe.ingredients, newRecipe.ingredients, (ingredients, newIngredients) => {
    return checkArrayChange(ingredients.ingredients, newIngredients.ingredients, (ingredient, newIngredient) => {
      return ingredient.grams !== newIngredient.grams;
    });
  });
}

export const EditRecipeDialog = () => {
  const {editedRecipe, editRecipeMethods} =  useRecipeEditService();
  const [data, setData] = useState<{edit: RecipeType, original: RecipeType} | null>();
  const [canSave, setCanSave] = useState<boolean>(false);

  useEffect(() => {
    if (editedRecipe === null) {
      if (data != null) {
        setCanSave(false);
        setData(null);
      }
      return;
    }
    if (!checkChange(editedRecipe, data?.edit)) {
      return;
    }
    setData({
      edit: copyRecipeType(editedRecipe),
      original: editedRecipe
    });
    setCanSave(editedRecipe.id !== RECIPE_CONSTANTS.NEW_RECIPE || (
      hasValue(editedRecipe.name) && editedRecipe.name.trim().length > 0 &&
      editedRecipe.ingredients.length > 0 && editedRecipe.ingredients[0].ingredients.length > 0
    ));
  }, [editedRecipe, data]);

  const {editRecipeDispatch} = useContext(EditRecipeContext);
  const addIngredients = () => {
    editRecipeDispatch({
      type: EditRecipeStateActionTypes.ADD_INGREDIENTS,
    });
  }
  const setDescription = async (value?: string) => {
    editRecipeDispatch({
      type: EditRecipeStateActionTypes.SET_DESCRIPTION,
      value
    });
  }

  return (<Dialog open={editedRecipe !== null} fullScreen>
    {data == null ?
      <DialogContent dividers><RecipeContentLoader loading={true}/></DialogContent> :
      <>
        <DialogTitle id="customized-dialog-title">
          <EditRecipeDialogTitle recipe={data.edit}/>
        </DialogTitle>
        <DialogContent dividers>
          <VerticalStack spacing={2} divider={<Divider orientation="horizontal" flexItem />}>
            <GridContainer className="edit-recipe-ingredients">
              {data.edit.ingredients.map((ingredients, index) => (
                <GridItem key={index}>
                  <EditRecipeDialogIngredients ingredients={ingredients} index={index} recipe={data.edit}/>
                </GridItem>
                ))}
            </GridContainer>
            <TranslatedAddIconButton translation="edit.ingredients.add" onClick={addIngredients} disabled={data.edit.ingredients.length > 0 && data.edit.ingredients[data.edit.ingredients.length - 1].ingredients.length === 0}/>
            <GridContainer className="edit-recipe-ingredients">
              <GridItem>
                <EditBakingTime bakingTime={data.edit.bakingTime}/>
              </GridItem>
              <GridItem>
                <Container>
                  <VerticalStack spacing={1}>
                    <EditInnerTemperature recipe={data.edit}/>
                    <EditDescription value={data.edit.description} onChange={setDescription}/>
                  </VerticalStack>
                </Container>
              </GridItem>
            </GridContainer>
            <RenderRecipeCalculationResult/>
          </VerticalStack>
        </DialogContent>
        <DialogActions>
          <TranslatedCancelButton onClick={editRecipeMethods.cancel}/>
          <TranslatedSaveButton onClick={editRecipeMethods.save} disabled={!canSave}/>
        </DialogActions>
      </>
    }
  </Dialog>);
};
