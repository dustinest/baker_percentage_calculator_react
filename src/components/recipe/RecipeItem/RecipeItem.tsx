import {IngredientsItems} from "../common/IngredientsItem";
import {
  Card,
} from "@mui/material";
import "./RecipeItemData.css";
import {RecipeHeader} from "./RecipeItemHeader";
import {RecipeItemData} from "./RecipeItemData";
import {BakerPercentageAwareRecipe} from "../common/BakerPercentageAwareRecipe";

type RecipeItemDetailsProps = {
  isPrintPreview: boolean;
  recipe: BakerPercentageAwareRecipe;
};

export const RecipeItem = ({isPrintPreview, recipe}: RecipeItemDetailsProps) => {
  return (<Card variant="outlined" className="recipe">
    <RecipeHeader recipe={recipe} isPrintPreview={isPrintPreview}/>
    {recipe.bakerPercentage != null ? <IngredientsItems ingredients={recipe.bakerPercentage.ingredients} recipe={recipe}/> : undefined}
    <RecipeItemData recipe={recipe} isPrintPreview={isPrintPreview}/>
  </Card>);
}
