import {RecipeItem} from "./RecipeItem";
import {Recipe} from "../../models/interfaces/Recipe";

type RecipeListProps = {
    recipes: Recipe[];
}

export const RecipeList = ({recipes}: RecipeListProps) => {
    return (
        <>
        <div className="recipes">
            {
                recipes.map((recipe) => (<RecipeItem recipe={recipe} key={recipe.getId()}/>))
            }
        </div>
        </>
    )
}
