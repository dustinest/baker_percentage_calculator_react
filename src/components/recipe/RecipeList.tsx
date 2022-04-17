import {RecipeItem} from "./RecipeItem";
import {RecipesConsumer} from "../../State";
import {Alert, Container, Grid} from "@mui/material";
import {TranslatedLabel} from "../../Translations";

const NoRecipesError = () => {
  return (<Alert severity="warning"><TranslatedLabel label="messages.no_recipes"/></Alert>);
}

export const RecipeList = () => {
  return (
    <RecipesConsumer>
      {(recipes) => (
        <Grid container spacing={1} wrap="wrap" className="recipes">
          {recipes.length === 0 ? <Grid item><NoRecipesError/></Grid> : undefined}
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
          {recipes.length === 0 ? <NoRecipesError/> : undefined}
          {recipes.map((recipe) => (
            <Container id={recipe.id} key={recipe.id} component="article" className="recipe-item">
              <RecipeItem isPrintPreview={true} recipe={recipe}/>
            </Container>
          ))}
        </div>
      )}</RecipesConsumer>
  );
}
