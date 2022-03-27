import {RecipeItem} from "./RecipeItem";
import {JsonRecipeType} from "../../service/RecipeReader/types";

type RecipeListProps = {
    recipes: JsonRecipeType[];
    showComponents: boolean;
}

export const RecipeList = ({recipes, showComponents}: RecipeListProps) => {
    return (
        <>
        <div className="recipes">
            {
                recipes.map((recipe, index) => (<RecipeItem recipe={recipe} key={index} showComponents={showComponents}/>))
            }
        </div>
        </>
    )
}
