import {IngredientsItems} from "../common/IngredientsItem";
import {
  Card,
} from "@mui/material";
import "./RecipeItemData.css";
import {RecipeItemResult} from "./RecipeItemResult";
import {RecipeHeader} from "./RecipeItemHeader";
import {RecipeItemData} from "./RecipeItemData";

type RecipeItemDetailsProps = {
  isPrintPreview: boolean;
  recipe: RecipeItemResult;
};

export const RecipeItem = ({isPrintPreview, recipe}: RecipeItemDetailsProps) => {
  return (<Card variant="outlined" className="recipe">
    <RecipeHeader recipe={recipe.recipe} isPrintPreview={isPrintPreview}/>
    {recipe.bakerPercentage != null ? <IngredientsItems ingredients={recipe.bakerPercentage.ingredients} recipe={recipe.recipe}/> : undefined}
    <RecipeItemData recipe={recipe} isPrintPreview={isPrintPreview}/>
  </Card>);
}
