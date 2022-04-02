import {RecipeItem} from "./RecipeItem";
import {useContext, useEffect, useMemo, useState} from "react";
import {RecipesContext, SelectedRecipeContext} from "../../State";
import {RecipeType} from "../../models";

export const RecipeList = () => {
    const [recipesList, setRecipesList] = useState<RecipeType[]>([]);
    const {recipes} = useContext(RecipesContext);
    const {selectedRecipe} = useContext(SelectedRecipeContext);

    useEffect(() => {
        const id = selectedRecipe.selectedRecipe?.id;
        if (id === undefined || id === null) {
            setRecipesList(recipes.recipes);
            return;
        }
        if (selectedRecipe.selectedRecipe?.filter) {
            setRecipesList(recipes.recipes.filter((e) => e.id === id));
            return;
        } else if (id) {
            const element = document.getElementById(id);
            if (element) {
                if (element.scrollIntoView !== undefined) {
                    element.scrollIntoView({
                        behavior: 'smooth'
                    });
                } else if (window.scrollTo !== undefined) {
                    window.scrollTo(element.offsetLeft, element.offsetTop);
                } else {
                    document.location.hash = id;
                }
            }
        }
        setRecipesList(recipes.recipes);
    }, [recipes, selectedRecipe]);

    return useMemo(() => {
        return (
                <div className="recipes">
                    {recipesList.map((recipe) => (<RecipeItem recipe={recipe} key={recipe.id} showComponents={selectedRecipe.selectedRecipe?.filter === true}/>))}
                </div>
        );
        // Filter is unnecessary to filter here
        // eslint-disable-next-line
    }, [recipesList]);
}
