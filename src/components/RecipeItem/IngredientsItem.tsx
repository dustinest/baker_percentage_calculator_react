import {RenderBakingTimeAware} from "./RenderBakingTimeAware";
import {IngredientWithPercentType, RecipeIngredientsWithPercentType} from "../../utils/BakerPercentageCalulation";
import {TableBody} from "@mui/material";
import {RTableHead, RTableRow} from "../common/RTable";
import {InputValue} from "../common/InputValue";
import {NutritionType, RecipeType} from "../../types";
import {EditRecipeStateActionTypes, useEditRecipeContext} from "../../State";

type BaseProps = {
  recipe: RecipeType,
  change?: {
    grams?: boolean,
    percentage?: boolean,
  }
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

export const IngredientsItem = ({ingredients, recipe, index, change}: IngredientsItemProps) => {
  const editRecipeDispatch = useEditRecipeContext();

  const setGrams = async (subIndex: number, grams: number) => {
    editRecipeDispatch({
      type: EditRecipeStateActionTypes.SET_INGREDIENT_GRAM,
      index: {
        ingredients: index,
        ingredient: subIndex
      },
      grams
    });
  }
  const setPercentage = () => {
    throw new Error("Not implemented!");
  };
  return (
    <>
      <table className="ingredients">
        {ingredients.name && ingredients.name !== recipe.name ? (
          <RTableHead label={ingredients.name || ""}/>) : undefined}
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
                  grams={
                    change?.grams ?
                      <InputValue value={value.grams} onChange={(value) => setGrams(i, value)} suffix="g"/> :
                      value.grams
                  }
                  percent={
                    change?.percentage ?
                      <InputValue value={value.percent} onChange={setPercentage}
                                  suffix="%"/> :
                      value.percent
                  }
                />
              )
            )}
        </TableBody>
      </table>
      <RenderBakingTimeAware value={ingredients}/>
    </>
  )
}

type IngredientsItemsProps = {
  ingredients: RecipeIngredientsWithPercentType[];
} & BaseProps;

export const IngredientsItems = ({ingredients, recipe, change}: IngredientsItemsProps) => {
  return (<>{
    ingredients.map((ingredients, index) => (
      <IngredientsItem
        index={index}
        change={change}
        ingredients={ingredients}
        recipe={recipe}
        key={`ingredients_${index}`}/>
    ))
  }</>)
}
