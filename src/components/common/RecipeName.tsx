import {RecipeType} from "../../types";

export const RecipeName = ({recipe}: {recipe: RecipeType}) => {
  return (<>{recipe.amount && recipe.amount > 1 ? `${recipe.name} x ${recipe.amount}` : `${recipe.name}` }</>)
}
