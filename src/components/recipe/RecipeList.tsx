import {RecipeItem} from "./RecipeItem";
import {RecipesContext} from "../../State";
import {Alert} from "@mui/material";
import {Translation} from "../../Translations";
import {useContext, useMemo} from "react";
import {GridContainer, GridItem} from "../common/GridContainer";
import {BakerPercentageAwareRecipe} from "./common/BakerPercentageAwareRecipe";

const NoRecipesError = () => {
  return (<Alert severity="warning"><Translation label="messages.no_recipes"/></Alert>);
}

export const RecipeList = () => {
  const {recipeState} = useContext(RecipesContext);
  const recipes = useMemo(() => {
    return recipeState.recipes.filter((r) => recipeState.recipesFilter.includes(r.id)) as BakerPercentageAwareRecipe[]
  }, [recipeState]);

  return (<GridContainer className="recipes">
    {recipes.length === 0 ? <GridItem><NoRecipesError/></GridItem> : undefined}
    {recipes.map((recipe) => (
      <GridItem key={recipe.id} id={recipe.id} className="recipe-item">
        <RecipeItem recipe={recipe} />
      </GridItem>
    ))}
  </GridContainer>);
}
