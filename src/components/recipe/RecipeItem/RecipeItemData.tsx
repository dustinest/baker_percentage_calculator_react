import {RenderBakingTimeAware} from "../common/RenderBakingTimeAware";
import {Container, Divider} from "@mui/material";
import {BakerPercentage} from "../common/BakerPercentage";
import {HorizontalActionStack, VerticalStack} from "../../common/CommonStack";
import {BakerPercentageAwareRecipe, RecipeGrandTotal} from "../common/BakerPercentageAwareRecipe";

const BakerPercentageContainer = ({recipe}: RecipeItemDataProps) => {
  return (<>
    {recipe.bakerPercentage !== null && recipe.bakerPercentage.ingredients.length > 0
      ? <Container component="section" className="baker-percentage"><BakerPercentage microNutrientsResult={recipe.bakerPercentage.microNutrients}/></Container> : undefined}
  </>);
}

type RecipeItemDataProps = { recipe: BakerPercentageAwareRecipe; }

const RecipeItemDataList  = ({recipe}: RecipeItemDataProps) => {
  return (<>
    <VerticalStack className="recipe-data-normal">
      <RenderBakingTimeAware value={recipe}/>
      <BakerPercentageContainer recipe={recipe}/>
      <RecipeGrandTotal recipe={recipe}/>
    </VerticalStack>
  </>);
}

const RecipeItemDataPrint  = ({recipe}: RecipeItemDataProps) => {
  return (
    <HorizontalActionStack
      justifyContent="space-evenly"
      alignItems="flex-end"
      divider={<Divider orientation="vertical" flexItem />}
      spacing={2}
      className="recipe-data-printer"
    >
      <BakerPercentageContainer recipe={recipe}/>
      <VerticalStack direction="column"
             justifyContent="flex-start"
             divider={<Divider orientation="horizontal" flexItem />}
             spacing={2}
      >
        <RenderBakingTimeAware value={recipe}/>
        <RecipeGrandTotal recipe={recipe}/>
      </VerticalStack>
    </HorizontalActionStack>
  );
}

export const RecipeItemData  = ({recipe}: {recipe: BakerPercentageAwareRecipe }) => {
  return (<><RecipeItemDataPrint recipe={recipe}/><RecipeItemDataList recipe={recipe}/></>);
}
