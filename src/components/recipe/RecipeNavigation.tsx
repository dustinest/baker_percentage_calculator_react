import './RecipeNavigation.css';
import {List, ListItem, ListItemText} from "@mui/material";
import {useContext, useEffect, useMemo, useState} from "react";
import {
    RecipesContext,
    SelectedRecipeContext,
    SelectRecipeAction,
    StateActionTypes
} from "../../State";
import {RecipeType} from "../../models";
import {useTranslation} from "react-i18next";
import {getJsonRecipeTypeLabel} from "../../service/RecipeReader";
import {MenuCollapsable} from "../containers/MenuCollapsable";

const RecipeMenuItem = ({recipe, onSelect}: { recipe: RecipeType, onSelect: () => void }) => {
    const translate = useTranslation();
    return (
        <><ListItem button onClick={onSelect}><ListItemText
            primary={getJsonRecipeTypeLabel(recipe, translate.t(recipe.name))}/></ListItem></>
    );
}

const RecipeNavigationList = ({handleItemClick}: { handleItemClick: (recipe: RecipeType) => void }) => {
    const {recipes} = useContext(RecipesContext);
    return useMemo(() => {
        return (
            <List>
                {
                    recipes.recipes.map((recipe) =>
                        (<RecipeMenuItem key={recipe.id} recipe={recipe} onSelect={() => handleItemClick(recipe)}/>)
                    )
                }
            </List>
        );
        // eslint-disable-next-line
    }, [recipes]);
};

export const RecipeNavigation = () => {
    const {selectedRecipeDispatch} = useContext(SelectedRecipeContext);
    const [recipeId, setRecipeId] = useState<string | undefined>();

    const handleItemClick = (recipe: RecipeType) => {
        setRecipeId(recipe.id);
    };
    useEffect(() => {
        selectedRecipeDispatch({
            type: StateActionTypes.SELECT_RECIPE,
            value: recipeId ? recipeId : null,
        } as SelectRecipeAction);
    }, [recipeId, selectedRecipeDispatch])

        return (
            <MenuCollapsable>
                <RecipeNavigationList handleItemClick={handleItemClick}/>
            </MenuCollapsable>
        );
}
