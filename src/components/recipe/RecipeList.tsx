import {RecipeItem} from "./RecipeItem";
import {useContext, useEffect, useMemo, useState} from "react";
import {RecipesContext, SelectedRecipeContext} from "../../State";
import {RecipeType} from "../../models";

export const RecipeList = () => {
    const [recipesList, setRecipesList] = useState<RecipeType[]>([]);
    const {recipes} = useContext(RecipesContext);
    const {selectedRecipe} = useContext(SelectedRecipeContext);

    useEffect(() => {
        if (selectedRecipe.id === undefined || selectedRecipe.id === null) {
            setRecipesList(recipes.recipes);
            return;
        }
        if (selectedRecipe.filter) {
            setRecipesList(recipes.recipes.filter((e) => e.id === selectedRecipe.id));
            return;
        }
        const element = document.getElementById(selectedRecipe.id);
        if (!element) {
            return;
        }
        if (element.scrollIntoView !== undefined) {
            element.scrollIntoView({
                behavior: 'smooth'
            });
        } else if (window.scrollTo !== undefined) {
            window.scrollTo(element.offsetLeft, element.offsetTop);
        } else {
            document.location.hash = selectedRecipe.id;
        }
        setRecipesList(recipes.recipes);
    }, [recipes, selectedRecipe]);

    return useMemo(() => {
        return (
                <div className="recipes">
                    {recipesList.map((recipe) => (<RecipeItem recipe={recipe} key={recipe.id} showComponents={selectedRecipe.filter}/>))}
                </div>
        );
        // Filter is unnecessary to filter here
        // eslint-disable-next-line
    }, [recipesList]);
}
