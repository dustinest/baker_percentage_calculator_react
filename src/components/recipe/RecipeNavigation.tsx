import './RecipeNavigation.css';
import {Drawer, List, ListItem, ListItemText, Tab, Tabs} from "@mui/material";
import {SyntheticEvent, useContext, useEffect, useMemo, useState} from "react";
import {RecipesContext, SelectedRecipeContext, SelectRecipeAction, StateActionTypes} from "../../State";
import {RecipeType} from "../../models";
import {useTranslation} from "react-i18next";
import {getJsonRecipeTypeLabel} from "../../service/RecipeReader";

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
    const [tabIndex, setTabIndex] = useState<number>(0);
    const [recipeId, setRecipeId] = useState<string | undefined>();
    const handleTabSwitch = (event: SyntheticEvent, newValue: number) => {
        setTabIndex(newValue)
    }
    const handleItemClick = (recipe: RecipeType) => {
        setRecipeId(recipe.id);
    };
    useEffect(() => {
        selectedRecipeDispatch({
            type: StateActionTypes.SELECT_RECIPE,
            value: recipeId ? recipeId : null,
            filter: tabIndex === 1
        } as SelectRecipeAction);
    }, [recipeId, tabIndex, selectedRecipeDispatch])

        return (
            <Drawer variant="permanent" anchor="left">
                <Tabs value={tabIndex} onChange={handleTabSwitch} aria-label="basic tabs example">
                    <Tab label="All"/>
                    <Tab label="Filter"/>
                </Tabs>
                <RecipeNavigationList handleItemClick={handleItemClick}/>
            </Drawer>
        );
}
