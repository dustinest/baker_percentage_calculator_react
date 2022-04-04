import './RecipeNavigation.css';
import {Link, List, ListItemText, ListItemButton} from "@mui/material";
import {RecipesConsumer} from "../../State";
import {MenuCollapsable} from "../containers/MenuCollapsable";
import {getJsonRecipeTypeLabel} from "../../service/RecipeReader";
import {useTranslation} from "react-i18next";


export const RecipeNavigation = () => {
  const translation = useTranslation();
  return (
      <RecipesConsumer>{(recipes) => (
          <MenuCollapsable title={translation.t("snackbar.recipes", {count: recipes.length})}>
            <List>{
              recipes.map((recipe) => (
                  <ListItemButton component={Link} href={`#${recipe.id}`} key={recipe.id}>
                    <ListItemText primary={getJsonRecipeTypeLabel(recipe)}/>
                  </ListItemButton>
                  )
              )
            }
            </List>
          </MenuCollapsable>
      )
      }</RecipesConsumer>
  );
}
