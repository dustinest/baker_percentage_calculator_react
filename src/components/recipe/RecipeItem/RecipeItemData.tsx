import {RecipeType} from "../../../types";
import {IngredientsItems} from "../common/IngredientsItem";
import {RenderBakingTimeAware} from "../common/RenderBakingTimeAware";
import {CardHeader, Container} from "@mui/material";
import {getJsonRecipeTypeLabel} from "../../../service/RecipeReader";
import {RIconButton} from "../../common/RButton";
import {RecipeEditIcon} from "../../common/Icons";
import {useMessageSnackBar, useSetEditRecipe} from "../../../State";
import {useTranslation} from "../../../Translations";
import {BakerPercentageResult} from "../../../utils/BakerPercentageCalulation";
import {BakerPercentage} from "../common/BakerPercentage";
import {useEffect, useState} from "react";
import {recalculateRecipeBakerPercentage} from "../common/RecipeItemEditService";
import {RecipeContentLoader} from "../common/RecipeLoader";

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
    <Container component="section" className="baker-percentage"><BakerPercentage microNutrientsResult={bakerPercentage.microNutrients}/></Container>
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipe]);

  return (<>
    <RecipeItemHeader recipe={recipe}/>
    <RecipeContentLoader loading={bakerPercentage === null}/>
    { bakerPercentage != null ? <RecipeItemData recipe={recipe} bakerPercentage={bakerPercentage}/> : undefined }
   </>);
}
