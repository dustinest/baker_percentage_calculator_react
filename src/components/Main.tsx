import {useEffect, useState} from "react";
import {Recipe} from "../models/interfaces/Recipe";
import {readJsonRecipeToRecipeObjectArray} from "../service/RecipeReader";
import {PREDEFINED_RECIPES} from "../data/PredefinedRecipes";
import {RecipeNavigation} from "./recipe/RecipeNavigation";
import {RecipeList} from "./recipe/RecipeList";

export const Main = () => {
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
        <>
            {
                recipes.length === 0 && loading ?
                    (<label>Loading...</label>) :
                    recipes.length === 0 ?
                        (<label>No recipes</label>) :
                        (
                            <>
                                <RecipeNavigation recipes={recipes}/>
                                <RecipeList recipes={recipes}/>
                            </>
                        )
            }
        </>
    )
}
