import {Recipe} from "../../models/interfaces/Recipe";
import {RecipeLabel} from "./RecipeLabel";

type RecipeNavigationProps = {
    recipes: Recipe[];
}

export const RecipeNavigation = ({recipes} : RecipeNavigationProps) => {
    return (
        <nav className="recipesMenu">
            <ul>
                {
                    recipes.map((recipe) =>
                        (<li key={recipe.getId()}><a href={`#${recipe.getId()}`}><RecipeLabel recipe={recipe}/></a ></li>)
                    )
                }
            </ul>
        </nav>
    )
}
