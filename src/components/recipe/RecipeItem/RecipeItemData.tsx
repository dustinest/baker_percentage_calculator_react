import {RecipeType} from "../../../types";
import {IngredientsItems} from "../common/IngredientsItem";
import {RenderBakingTimeAware} from "../common/RenderBakingTimeAware";
import {ButtonGroup, CardHeader, Container} from "@mui/material";
import {RecipesContext, RecipesStateActionTypes, useMessageSnackBar, useSetEditRecipe} from "../../../State";
import {BakerPercentageResult} from "../../../utils/BakerPercentageCalulation";
import {BakerPercentage} from "../common/BakerPercentage";
import {useContext, useEffect, useState} from "react";
import {recalculateRecipeBakerPercentage} from "../common/RecipeItemEditService";
import {RecipeContentLoader} from "../common/RecipeLoader";
import {RecipeName} from "../../common/RecipeName";
import "./RecipeItemData.css";
import {DeleteButton, EditButton} from "../../../Constant/Buttons";

export type RecipeItemDataProps = {
  recipe: RecipeType;
  bakerPercentage: BakerPercentageResult;
}

const RecipeItemData  = ({recipe, bakerPercentage}: RecipeItemDataProps) => {
  return (<>
    <Container component="section" className="recipe">
      <IngredientsItems ingredients={bakerPercentage.ingredients} recipe={recipe} />
    </Container>
    <RenderBakingTimeAware value={recipe}/>
    {bakerPercentage.ingredients.length > 0
      ? <Container component="section" className="baker-percentage"><BakerPercentage microNutrientsResult={bakerPercentage.microNutrients}/></Container> : undefined}
  </>);
}

type RecipeItemHeaderProps = { recipe: RecipeType; }

const RecipeItemHeader = ({recipe}: RecipeItemHeaderProps) => {
  const setEditRecipe = useSetEditRecipe();
  const {recipesDispatch} = useContext(RecipesContext);
  const onDeleteRecipe = () => {
    recipesDispatch({
      type: RecipesStateActionTypes.REMOVE_RECIPE,
      value: recipe
    });
  }
  return (<CardHeader
    className="recipe-header"
    title={<RecipeName recipe={recipe}/>} action={
    <ButtonGroup variant="outlined" color="secondary" size="small">
      <DeleteButton onClick={onDeleteRecipe}/>
      <EditButton onClick={() => setEditRecipe(recipe)}/>
    </ButtonGroup>
  }/>);
}

type RecipeItemDetailsProps = {
  isPrintPreview: boolean;
} & RecipeItemHeaderProps;


export const RecipeItemDetails = ({recipe, isPrintPreview}: RecipeItemDetailsProps) => {
  const [bakerPercentage, setBakerPercentage] = useState<BakerPercentageResult | null>(null);
  const snackBar = useMessageSnackBar();

  useEffect(() => {
    recalculateRecipeBakerPercentage(recipe).then(setBakerPercentage).catch((e: Error) => {
      snackBar.error(e, `Error while resolving the recipe ${recipe?.name}`).translate().enqueue();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipe]);

  return (<>
    { isPrintPreview ? <CardHeader className="recipe-header recipe-header-print" title={<RecipeName recipe={recipe}/>}/> : <RecipeItemHeader recipe={recipe}/> }
    <RecipeContentLoader loading={bakerPercentage === null}/>
    { bakerPercentage != null ? <RecipeItemData recipe={recipe} bakerPercentage={bakerPercentage}/> : undefined }
   </>);
}
