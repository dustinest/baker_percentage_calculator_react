import {RenderBakingTimeAware} from "./RenderBakingTimeAware";
import {IngredientWithPercentType, RecipeIngredientsWithPercentType} from "../../../service/BakerPercentage";
import {Container, Table, TableBody} from "@mui/material";
import {RTableHead, RTableRow} from "../../common/RTable";
import {NutritionType, RecipeType} from "../../../types/index";

type BaseProps = {
  recipe: RecipeType
};


type IngredientsItemProps = {
  ingredients: RecipeIngredientsWithPercentType;
  index: number
} & BaseProps

const mapIngredient = (ingredient: IngredientWithPercentType) => {
  const result = {
    key: ingredient.id,
    label: ingredient.name,
    type: ingredient.id,
    grams: ingredient.grams,
    percent: ingredient.percent,
    fat: 0,
    ash: 0
  };
  const fat = ingredient.nutrients.find(e => e.type === NutritionType.fat);
  const water = ingredient.nutrients.find(e => e.type === NutritionType.water);
  const ash = ingredient.nutrients.find(e => e.type === NutritionType.ash);
  if (fat && water) result.fat = fat.percent;
  if (ash) result.ash = ash.percent;
  return result;
}

export const IngredientsItem = ({ingredients, recipe, index}: IngredientsItemProps) => {
  const name = ingredients.name && ingredients.name !== recipe.name ? ingredients.name : index > 0 ? "ingredients.title.dough" : undefined;
  return (
    <>
      <Table className="ingredients">
          {name ? <RTableHead label={name}/> : undefined}
        <TableBody>
          {
            ingredients.ingredientWithPercent.map(mapIngredient).map((value, i) =>
              (
                <RTableRow
                  key={i}
                  label={value.label}
                  type={value.type}
                  fat={value.fat}
                  ash={value.ash}
                  grams={value.grams}
                  percent={value.percent}
                />
              )
            )}
        </TableBody>
      </Table>
      <RenderBakingTimeAware value={ingredients}/>
    </>
  )
}

type IngredientsItemsProps = {
  ingredients: RecipeIngredientsWithPercentType[];
} & BaseProps;

export const IngredientsItems = ({ingredients, recipe}: IngredientsItemsProps) => {
  return (<Container component="section" className="recipe">{
    ingredients.map((ingredients, index) => (
      <IngredientsItem
        index={index}
        ingredients={ingredients}
        recipe={recipe}
        key={`ingredients_${index}`}/>
    ))
  }</Container>)
}
