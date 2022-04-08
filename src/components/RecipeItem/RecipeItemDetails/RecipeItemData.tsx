import {RecipeType} from "../../../types";
import {IngredientsItems} from "../IngredientsItem";
import {RenderBakingTimeAware} from "../RenderBakingTimeAware";
import {CardHeader, Typography} from "@mui/material";
import {getJsonRecipeTypeLabel} from "../../../service/RecipeReader";
import {RIconButton} from "../../common/RButton";
import {RecipeEditIcon} from "../../common/Icons";
import {RecipeContentLoader} from "./RecipeLoader";
import {useMessageSnackBar, useSetEditRecipe} from "../../../State";
import {useTranslation} from "../../../Translations";
import {BakerPercentageResult} from "../../../utils/BakerPercentageCalulation";
import {BakerPercentage} from "../BakerPercentage";
import {useEffect, useState} from "react";
import {recalculateRecipeBakerPercentage} from "./RecipeItemEditService";

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
  const setEditRecipe = useSetEditRecipe();
  const translation = useTranslation();
  return (<CardHeader title={getJsonRecipeTypeLabel(recipe)} action={<RIconButton icon={<RecipeEditIcon />} label={translation.translate("Edit")}  onClick={() => setEditRecipe(recipe)}/>}/>);
}

type RecipeItemDetailsProps = RecipeItemHeaderProps;

export const RecipeItemDetails = ({recipe}: RecipeItemDetailsProps) => {
  const [bakerPercentage, setBakerPercentage] = useState<BakerPercentageResult | null>(null);
  const snackBar = useMessageSnackBar();

  useEffect(() => {
    recalculateRecipeBakerPercentage(recipe).then(setBakerPercentage).catch((e: Error) => {
      snackBar.error(e, `Error while resolving the recipe ${recipe?.name}`).translate().enqueue();
    });
  }, [recipe]);

  return (<>
    <RecipeItemHeader recipe={recipe}/>
    <RecipeContentLoader loading={bakerPercentage === null}/>
    { bakerPercentage != null ? <RecipeItemData recipe={recipe} bakerPercentage={bakerPercentage}/> : undefined }
   </>);
}
