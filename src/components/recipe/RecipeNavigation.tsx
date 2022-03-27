import {JsonRecipeType} from "../../service/RecipeReader/types";
import {useRecipeIdNameAndAmount} from "../../service/RecipeReader";

type RecipeNavigationProps = {
    recipes: JsonRecipeType[];
}

const RecipeMenuItem = ({recipe}: { recipe: JsonRecipeType } ) => {
    const recipeId = useRecipeIdNameAndAmount(recipe);
    return (
        <>{recipeId ? (<li key={recipeId.id}><a href={`#${recipeId.id}`}>{recipeId.label}</a ></li>) : undefined}</>
    );
}


export const RecipeNavigation = ({recipes} : RecipeNavigationProps) => {
    return (
        <nav className="recipesMenu">
            <ul>
                {
                    recipes.map((recipe, index) =>
                        (<RecipeMenuItem key={index} recipe={recipe}/>)
                    )
                }
            </ul>
        </nav>
    )
}
