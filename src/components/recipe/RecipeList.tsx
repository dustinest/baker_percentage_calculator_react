import {RecipeItem} from "./RecipeItem";
import {RecipesConsumer} from "../../State";
import {Container, Grid} from "@mui/material";

export const RecipeList = () => {
  return (
    <RecipesConsumer>
      {(recipes) => (
        <Grid container spacing={1} wrap="wrap" className="recipes">
          {recipes.map((recipe) => (
            <Grid item sm key={recipe.id}  id={recipe.id} className="recipe-item">
              <RecipeItem isPrintPreview={false} recipe={recipe} />
            </Grid>
          ))}
        </Grid>
    )}</RecipesConsumer>
  );
}

export const RecipePrintList = () => {
  return (
    <RecipesConsumer>
      {(recipes) => (
        <div className="recipes">
          {recipes.map((recipe) => (
            <Container id={recipe.id} key={recipe.id} component="article" className="recipe-item">
              <RecipeItem isPrintPreview={true} recipe={recipe} />
            </Container>
          ))}
        </div>
      )}</RecipesConsumer>
  );
}
