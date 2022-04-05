import {UseRecipeResultStatus, useRecipeType} from "./UseRecipeType";
import {RecipeType} from "../../../types";
import {IngredientsItems} from "../IngredientsItem";
import {RenderBakingTimeAware} from "../RenderBakingTimeAware";
import {MicroNutrients} from "./MicroNutrients";
import {useTranslation} from "react-i18next";
import {CardHeader, Typography} from "@mui/material";
import {getJsonRecipeTypeLabel} from "../../../service/RecipeReader";
import {RIconButton} from "../../common/RButton";
import {RecipeEditIcon} from "../../common/Icons";
import {RecipeLoader} from "./RecipeLoader";
import {useContext} from "react";
import {EditRecipeStateActionTypes} from "../../../State";
import {EditRecipeContext} from "../../../State/lib/EditRecipeProvider";


export const RecipeItemData  = ({recipe, result, error, loading}: UseRecipeResultStatus & {recipe: RecipeType}) => {
  return (<>
    {
      loading ? <RecipeLoader/>:
        result ? <>
          <section className="recipe">
            <IngredientsItems ingredients={result.recipe.microNutrients.ingredients} recipe={recipe} />
          </section>
          <RenderBakingTimeAware value={recipe}/>
          <MicroNutrients microNutrients={result.ingredients.microNutrients}/>
        </>:
          <Typography variant="body2" display="block" gutterBottom>{error?.toString()}</Typography>
    }
  </>)
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
  return (<CardHeader title={getJsonRecipeTypeLabel(recipe)} action={<RIconButton icon={<RecipeEditIcon />} label={translation.t("Edit")}  onClick={editRecipe}/>}/>);
}

type RecipeItemDetailsProps = RecipeItemHeaderProps;

export const RecipeItemDetails = ({recipe}: RecipeItemDetailsProps) => {
  const {result, error, loading} = useRecipeType(recipe);

  return (<>
    <RecipeItemHeader recipe={recipe}/>
    <RecipeItemData recipe={recipe} result={result} error={error} loading={loading}/>
   </>);
}
