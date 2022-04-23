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
const RecipeItemDataPrint  = ({recipe}: RecipeItemDataProps) => {
  return (<>
    <HorizontalActionStack
      justifyContent="space-evenly"
      alignItems="flex-end"
      divider={<Divider orientation="vertical" flexItem />}
      spacing={2}
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
  </>);
}
const RecipeItemDataList  = ({recipe}: RecipeItemDataProps) => {
  return (<>
    <RenderBakingTimeAware value={recipe}/>
    <BakerPercentageContainer recipe={recipe}/>
    <RecipeGrandTotal recipe={recipe}/>
  </>);
}

export const RecipeItemData  = ({recipe, isPrintPreview}: {recipe: BakerPercentageAwareRecipe; isPrintPreview: boolean;}) => {
  return (<>{ isPrintPreview ? <RecipeItemDataPrint recipe={recipe}/> : <RecipeItemDataList recipe={recipe}/>} </>);
}
