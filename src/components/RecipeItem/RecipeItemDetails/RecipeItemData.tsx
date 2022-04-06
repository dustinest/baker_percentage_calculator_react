import {UseRecipeItemValues, useRecipeType} from "./UseRecipeType";
import {RecipeType} from "../../../types";
import {IngredientsItems} from "../IngredientsItem";
import {RenderBakingTimeAware} from "../RenderBakingTimeAware";
import {MicroNutrients} from "./MicroNutrients";
import {CardHeader} from "@mui/material";
import {getJsonRecipeTypeLabel} from "../../../service/RecipeReader";
import {RIconButton} from "../../common/RButton";
import {RecipeEditIcon} from "../../common/Icons";
import {RecipeContentLoader} from "./RecipeLoader";
import {useContext} from "react";
import {EditRecipeContext, EditRecipeStateActionTypes} from "../../../State";
import {useTranslation} from "../../../Translations";

export const RecipeItemData  = ({recipe, result}: {recipe: RecipeType, result: UseRecipeItemValues}) => {
  return (<>
    <section className="recipe">
      <IngredientsItems ingredients={result.recipe.microNutrients.ingredients} recipe={recipe} />
    </section>
    <RenderBakingTimeAware value={recipe}/>
    <MicroNutrients microNutrients={result.ingredients.microNutrients}/>
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
  const {result, error, loading} = useRecipeType(recipe);

  return (<>
    <RecipeItemHeader recipe={recipe}/>
    <RecipeContentLoader loading={loading} error={error}/>
    { result ? <RecipeItemData recipe={recipe} result={result}/> : undefined }
   </>);
}
