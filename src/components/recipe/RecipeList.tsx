import {RecipeItem} from "../RecipeItem";
import {RecipesConsumer} from "../../State";

export const RecipeList = () => {
  return (
    <RecipesConsumer>{(recipes) => (
      <div className="recipes">
        {recipes.map((recipe) => (
          <RecipeItem
            recipe={recipe}
            key={recipe.id}
          />
        ))}
      </div>
    )}</RecipesConsumer>
  );
}
