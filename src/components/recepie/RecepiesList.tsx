import {RecipeItem} from "./RecipeItem";
import {useEffect, useState} from "react";
import {Recipe} from "../../models/interfaces/Recipe";
import {readJsonRecipeToRecipeObjectArray} from "../../service/RecipeReader/lib/JsonRecipeReader";
import {PREDEFINED_RECIPES} from "../../data/PredefinedRecipes";

export const RecepiesList = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        setLoading(true);
        setRecipes([]);
        readJsonRecipeToRecipeObjectArray(PREDEFINED_RECIPES).then(setRecipes).catch(e => {
            console.error(e);
        }).finally(() => setLoading(false));
    }, []);
    return (
        <div className="recipes">
            {
                recipes.length === 0 && loading ?
                    (<label>Loading...</label>)
                        : recipes.length === 0 ?
                    (
                    <label>No recipes</label>
                    ) :
                    recipes.map((recipe) =>
                        (<RecipeItem recipe={recipe} key={recipe.getId()}/>)
                )
            }
        </div>
    )
}
