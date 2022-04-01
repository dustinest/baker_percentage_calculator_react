import {RecipeItem} from "./RecipeItem";
import {JsonRecipeTypeWithLabel} from "./JsonRecipeTypeWithLabel";

type RecipeListProps = {
    recipes: JsonRecipeTypeWithLabel[];
}

export const RecipeList = ({recipes}: RecipeListProps) => {
    return (
        <>
        <div className="recipes">
            { recipes.map((recipe, index) => (<RecipeItem recipe={recipe} key={index}/>)) }
        </div>
        </>
    )
}
