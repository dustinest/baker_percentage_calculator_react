import {JsonRecipeType} from "../../service/RecipeReader/types";
import {useRecipeIdNameAndAmount} from "../../service/RecipeReader";
import './RecipeNavigation.css';
import {Drawer, List, ListItem, ListItemText} from "@mui/material";

type RecipeNavigationProps = {
    recipes: JsonRecipeType[];
}
const RecipeMenuItem = ({recipe}: { recipe: JsonRecipeType } ) => {
    const recipeId = useRecipeIdNameAndAmount(recipe);
    const onClick = () => {
        if (recipeId?.id) {
            const element = document.getElementById(recipeId.id);
            if (element) {
                if (element.scrollIntoView !== undefined) {
                    element.scrollIntoView({
                        behavior: 'smooth'
                    });
                } else if (window.scrollTo !== undefined) {
                    window.scrollTo(element.offsetLeft, element.offsetTop);
                } else {
                    document.location.hash = recipeId.id;
                }
            }
        }
    };

    return (
        <>{recipeId ? (
                <ListItem button onClick={onClick} ><ListItemText primary={recipeId.label} /></ListItem>
        ) : undefined}</>
    );
}


export const RecipeNavigation = ({recipes} : RecipeNavigationProps) => {
    return (
        <Drawer variant="permanent"
                anchor="left">
            <List>
                {
                    recipes.map((recipe, index) =>
                        (<RecipeMenuItem key={index} recipe={recipe} />)
                    )
                }
            </List>
        </Drawer>
    )
}
