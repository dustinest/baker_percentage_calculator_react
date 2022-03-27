import {RecipeItem} from "./RecipeItem";
import {JsonRecipeType} from "../../service/RecipeReader/types";

type RecipeListProps = {
    recipes: JsonRecipeType[];
}

export const RecipeList = ({recipes}: RecipeListProps) => {
    return (
        <>
        <div className="recipes">
            {
                recipes.map((recipe, index) => (<RecipeItem recipe={recipe} key={index}/>))
            }
        </div>
        </>
    )
}
