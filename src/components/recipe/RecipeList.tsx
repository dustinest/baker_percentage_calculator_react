import {RecipeItem} from "./RecipeItem";
import {RecipesConsumer} from "../../State";
import {Container} from "@mui/material";

export const RecipeList = () => {
  return (
    <RecipesConsumer>{(recipes) => (
      <div className="recipes">
        {recipes.map((recipe) => (
            <Container id={recipe.id} key={recipe.id} component="article" className="recipe-item">
              <RecipeItem recipe={recipe} />
            </Container>
        ))}
      </div>
    )}</RecipesConsumer>
  );
}
