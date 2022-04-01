import './RecipeNavigation.css';
import {Drawer, List, ListItem, ListItemText} from "@mui/material";
import {JsonRecipeTypeWithLabel} from "./JsonRecipeTypeWithLabel";

type RecipeNavigationProps = {
    recipes: JsonRecipeTypeWithLabel[];
}
const RecipeMenuItem = ({recipe}: { recipe: JsonRecipeTypeWithLabel } ) => {
    const onClick = () => {
        if (recipe.id) {
            const element = document.getElementById(recipe.id);
            if (element) {
                if (element.scrollIntoView !== undefined) {
                    element.scrollIntoView({
                        behavior: 'smooth'
                    });
                } else if (window.scrollTo !== undefined) {
                    window.scrollTo(element.offsetLeft, element.offsetTop);
                } else {
                    document.location.hash = recipe.id;
                }
            }
        }
    };

    return (
        <><ListItem button onClick={onClick} ><ListItemText primary={recipe.label} /></ListItem></>
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
