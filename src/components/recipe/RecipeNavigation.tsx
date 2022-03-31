import {JsonRecipeType} from "../../service/RecipeReader/types";
import {useRecipeIdNameAndAmount} from "../../service/RecipeReader";
import './RecipeNavigation.css';

type RecipeNavigationProps = {
    recipes: JsonRecipeType[];
}

const RecipeMenuItem = ({recipe}: { recipe: JsonRecipeType } ) => {
    const recipeId = useRecipeIdNameAndAmount(recipe);
    return (
        <>{recipeId ? (<li className="recipe" key={recipeId.id}><a href={`#${recipeId.id}`}>{recipeId.label}</a ></li>) : undefined}</>
    );
}


export const RecipeNavigation = ({recipes} : RecipeNavigationProps) => {
    return (
        <nav className="recipesMenu">
            <ol>
                {
                    recipes.map((recipe, index) =>
                        (<RecipeMenuItem key={index} recipe={recipe} />)
                    )
                }
            </ol>
        </nav>
    )
}
