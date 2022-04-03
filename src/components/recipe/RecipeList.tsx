import {RecipeItem} from "../RecipeItem";
import {useContext, useEffect, useMemo, useState} from "react";
import {RecipesContext, StateActionTypes, UpdateRecipesAction} from "../../State";
import {RecipeType} from "../../models";

export const RecipeList = () => {
    const [recipesList, setRecipesList] = useState<RecipeType[]>([]);
    const [editRecipeId, setEditRecipeId] = useState<string | undefined>();
    const {recipes} = useContext(RecipesContext);
    useEffect(() => {
        if (!editRecipeId) setRecipesList([...recipes]);
        else setRecipesList([...recipes].filter((e) => e.id === editRecipeId));
    }, [recipes, editRecipeId]);

    const {recipesDispatch} = useContext(RecipesContext);
    const onSave = (recipe: RecipeType) => {
        recipesDispatch({
            type: StateActionTypes.UPDATE_RECIPE,
            value: recipe
        } as UpdateRecipesAction);
        setEditRecipeId(undefined);
    };

    const onEdit = (id: string) => {
        setEditRecipeId(id);
    }

    return useMemo(() => {
        return (
                <div className="recipes">
                    {recipesList.map((recipe) => (
                      <RecipeItem
                        isEdit={editRecipeId === recipe.id}
                        recipe={recipe}
                        key={recipe.id}
                        onEdit={() => onEdit(recipe.id)}
                        onSave={onSave}/>
                    ))}
                </div>
        );
        // Filter is unnecessary to filter here
        // eslint-disable-next-line
    }, [recipesList, editRecipeId]);
}
