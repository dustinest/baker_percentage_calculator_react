import {JsonRecipeType} from "../../service/RecipeReader/types";
import {useRecipeIdNameAndAmount} from "../../service/RecipeReader";
import {OnChangeType} from "../Input/OnChangeType";
import './RecipeNavigation.css';
import {FormControlLabel, Switch} from "@mui/material";

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
                <li><FormControlLabel className="switch-visibility" control={<Switch checked={true} onChange={(e) => onComponentViewChange(e.target.checked)}/>} label="Komponendid"/></li>
                {
                    recipes.map((recipe, index) =>
                        (<RecipeMenuItem key={index} recipe={recipe} />)
                    )
                }
            </ol>
        </nav>
    )
}
