import {JsonRecipeType} from "../../service/RecipeReader/types";
import {useRecipeIdNameAndAmount} from "../../service/RecipeReader";
import {InputCheckBox} from "../Input/InputCheckBox";
import {OnChangeType} from "../Input/OnChangeType";

type RecipeNavigationProps = {
    recipes: JsonRecipeType[];
    onComponentViewChange: OnChangeType<boolean, void>
}

const RecipeMenuItem = ({recipe}: { recipe: JsonRecipeType } ) => {
    const recipeId = useRecipeIdNameAndAmount(recipe);
    return (
        <>{recipeId ? (<li className="recipe" key={recipeId.id}><a href={`#${recipeId.id}`}>{recipeId.label}</a ></li>) : undefined}</>
    );
}


export const RecipeNavigation = ({recipes, onComponentViewChange} : RecipeNavigationProps) => {
    return (
        <nav className="recipesMenu">
            <ol>
                <li><span><InputCheckBox label="Komponendid" value={true} onChange={onComponentViewChange} /></span></li>
                {
                    recipes.map((recipe, index) =>
                        (<RecipeMenuItem key={index} recipe={recipe} />)
                    )
                }
            </ol>
        </nav>
    )
}
