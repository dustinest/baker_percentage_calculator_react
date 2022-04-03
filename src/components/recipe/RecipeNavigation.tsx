import './RecipeNavigation.css';
import {Link, List, ListItemText, ListItemButton} from "@mui/material";
import {RecipesConsumer} from "../../State";
import {MenuCollapsable} from "../containers/MenuCollapsable";
import {getJsonRecipeTypeLabel} from "../../service/RecipeReader";


export const RecipeNavigation = () => {
  return (
    <MenuCollapsable>
      <List>
        {
          <RecipesConsumer>{(recipes) => (<>{
            recipes.map((recipe) =>
              (
                <ListItemButton component={Link} href={`#${recipe.id}`} key={recipe.id}>
                  <ListItemText primary={getJsonRecipeTypeLabel(recipe)}/>
                </ListItemButton>
              )
            )
          }</>)
          }</RecipesConsumer>
        }
      </List>
    </MenuCollapsable>
  );
}
