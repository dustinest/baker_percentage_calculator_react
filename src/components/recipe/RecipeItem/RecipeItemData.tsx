import {RenderBakingTimeAware} from "../common/RenderBakingTimeAware";
import {Container, Divider} from "@mui/material";
import {BakerPercentage} from "../common/BakerPercentage";
import {ItemText} from "../common/ItemText";
import {Translation} from "../../../Translations";
import {HorizontalActionStack, VerticalStack} from "../../common/CommonStack";
import {BakerPercentageAwareRecipe} from "../common/BakerPercentageAwareRecipe";

const roundToTen = (amount: number): number => {
  if (amount === 0) return amount;
  return Math.round(amount * 10) / 10;
}

export const TotalWeight = ({total, amount}: {total: number, amount: number}) => {
  const weight = roundToTen(total);
  const oneWeight = amount > 1 ? roundToTen(total / amount): 0;
  return (
    <>
      {
        weight <= 0 ? undefined :
          <HorizontalActionStack
            justifyContent="center"
            alignItems="baseline"
            divider={<Divider orientation="vertical" flexItem />}
            spacing={1.5}
          >
            <ItemText className="totals"><Translation label="ingredients.title.total_weight" count={weight}/></ItemText>
            {oneWeight > 0 ? <ItemText className="totals"><Translation label="ingredients.title.total_weight_item" args={{ divider: amount, amount: oneWeight}}/></ItemText> : undefined}
          </HorizontalActionStack>
      }
    </>
  )
}

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
        <TotalWeight total={recipe.totalWeight} amount={recipe.amount}/>
      </VerticalStack>
    </HorizontalActionStack>
  </>);
}
const RecipeItemDataList  = ({recipe}: RecipeItemDataProps) => {
  return (<>
    <RenderBakingTimeAware value={recipe}/>
    <BakerPercentageContainer recipe={recipe}/>
    <TotalWeight total={recipe.totalWeight} amount={recipe.amount}/>
  </>);
}

export const RecipeItemData  = ({recipe, isPrintPreview}: {recipe: BakerPercentageAwareRecipe; isPrintPreview: boolean;}) => {
  return (<>{ isPrintPreview ? <RecipeItemDataPrint recipe={recipe}/> : <RecipeItemDataList recipe={recipe}/>} </>);
}
