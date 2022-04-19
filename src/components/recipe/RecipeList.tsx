import {RecipeItem} from "./RecipeItem";
import {RecipesContext} from "../../State";
import {Alert, Container} from "@mui/material";
import {Translation} from "../../Translations";
import {ReactNode, useContext} from "react";
import {GridContainer, GridItem} from "../common/GridContainer";
import {BakerPercentageAwareRecipe} from "./common/BakerPercentageAwareRecipe";

const NoRecipesError = () => {
  return (<Alert severity="warning"><Translation label="messages.no_recipes"/></Alert>);
}

const RecipeListContainer = ({children}: {children: (args: BakerPercentageAwareRecipe[]) => ReactNode }) => {
  const {recipeState} = useContext(RecipesContext);
  return (<>{children(recipeState.recipes.filter((r) => recipeState.recipesFilter.includes(r.id)) as BakerPercentageAwareRecipe[]) }</>);
}

export const RecipeList = () => {
  return (
    <RecipeListContainer>
      {(recipes) => (
        <GridContainer className="recipes">
          {recipes.length === 0 ? <GridItem><NoRecipesError/></GridItem> : undefined}
          {recipes.map((recipe) => (
            <GridItem key={recipe.id}  id={recipe.id} className="recipe-item">
              <RecipeItem isPrintPreview={false} recipe={recipe} />
            </GridItem>
          ))}
        </GridContainer>
    )}</RecipeListContainer>
  );
}

export const RecipePrintList = () => {
  return (
    <RecipeListContainer>
      {(recipes) => (
        <div className="recipes">
          {recipes.length === 0 ? <NoRecipesError/> : undefined}
          {recipes.map((recipe) => (
            <Container id={recipe.id} key={recipe.id} component="article" className="recipe-item">
              <RecipeItem isPrintPreview={true} recipe={recipe}/>
            </Container>
          ))}
        </div>
      )}</RecipeListContainer>
  );
}
