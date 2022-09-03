import {IngredientsItems} from "../common/IngredientsItem";
import {
  Card,
} from "@mui/material";
import {RecipeHeader} from "./RecipeItemHeader";
import {RecipeItemData} from "./RecipeItemData";
import {BakerPercentageAwareRecipe} from "../common/BakerPercentageAwareRecipe";
import {CardProps} from "@mui/material/Card/Card";

type RecipeItemDetailsProps = {
  recipe: BakerPercentageAwareRecipe;
} & CardProps;

export const RecipeItem = ({recipe, ...cardProps}: RecipeItemDetailsProps) => {
  return (
    <Card variant="outlined" {...cardProps}>
      <RecipeHeader recipe={recipe}/>
      {recipe.bakerPercentage != null ?
        <IngredientsItems ingredients={recipe.bakerPercentage.ingredients} recipe={recipe}/> : undefined}
      <RecipeItemData recipe={recipe}/>
    </Card>
  );
}
