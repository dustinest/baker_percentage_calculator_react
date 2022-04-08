import {useRecipeType, UseRecipeTypeStatus} from "../../../service/ReciepeCallbacks";
import {RecipeType} from "../../../types";
import {IngredientsItems} from "../IngredientsItem";
import {RenderBakingTimeAware} from "../RenderBakingTimeAware";
import {CardHeader, Typography} from "@mui/material";
import {getJsonRecipeTypeLabel} from "../../../service/RecipeReader";
import {RIconButton} from "../../common/RButton";
import {RecipeEditIcon} from "../../common/Icons";
import {RecipeContentLoader} from "./RecipeLoader";
import {useContext} from "react";
import {EditRecipeContext, EditRecipeStateActionTypes} from "../../../State";
import {useTranslation} from "../../../Translations";
import {BakerPercentageResult} from "../../../utils/BakerPercentageCalulation";
import {BakerPercentage} from "../BakerPercentage";

export type RecipeItemDataProps = {
  recipe: RecipeType;
  bakerPercentage: BakerPercentageResult;
}

export const RecipeItemData  = ({recipe, bakerPercentage}: RecipeItemDataProps) => {
  return (<>
    <section className="recipe">
      <IngredientsItems ingredients={bakerPercentage.ingredients} recipe={recipe} />
    </section>
    <RenderBakingTimeAware value={recipe}/>
    <Typography variant="body1" className="baker-percentage" component="div"><BakerPercentage microNutrientsResult={bakerPercentage.microNutrients}/></Typography>
  </>);
}

type RecipeItemHeaderProps = {
  recipe: RecipeType;
}

const RecipeItemHeader = ({recipe}: RecipeItemHeaderProps) => {
  const { editRecipeDispatch } = useContext(EditRecipeContext);
  const editRecipe = () => {
    editRecipeDispatch({
      type: EditRecipeStateActionTypes.EDIT_RECIPE,
      value: recipe
    });
  }
  const translation = useTranslation();
  return (<CardHeader title={getJsonRecipeTypeLabel(recipe)} action={<RIconButton icon={<RecipeEditIcon />} label={translation.translate("Edit")}  onClick={editRecipe}/>}/>);
}

type RecipeItemDetailsProps = RecipeItemHeaderProps;

export const RecipeItemDetails = ({recipe}: RecipeItemDetailsProps) => {
  const result = useRecipeType(recipe);

  return (<>
    <RecipeItemHeader recipe={recipe}/>
    <RecipeContentLoader loading={result.status === UseRecipeTypeStatus.WAITING}/>
    { result.status === UseRecipeTypeStatus.RESULT ? <RecipeItemData recipe={recipe} bakerPercentage={result.bakerPercentage}/> : undefined }
   </>);
}
