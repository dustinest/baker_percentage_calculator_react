import {useContext} from "react";
import {RecipesContext, RecipesStateActionTypes} from "../../../State";
import {RecipeType} from "../../../types";
import {CardHeader, ListItemIcon, ListItemText, MenuItem, styled} from "@mui/material";
import {RecipeName} from "../../common/RecipeName";
import {CopyOfIcon, DeleteIcon, EditIcon} from "../../../Constant/Icons";
import {Translation} from "../../../Translations";
import {CommonMenuButton} from "../../common/CommonMenu";
import {useRecipeEditService} from "../../../service/RecipeEditService";

const StyledRecipeTitle = styled('div')({
  textAlign: 'center'
});

export const RecipeHeader = ({recipe}: {recipe: RecipeType}) => {
  const {editRecipeMethods} =  useRecipeEditService();
  const {recipesDispatch} = useContext(RecipesContext);
  const onDeleteRecipe = () => {
    recipesDispatch({
      type: RecipesStateActionTypes.REMOVE_RECIPE,
      value: recipe
    });
  }
  const onEditRecipe = () => {
    editRecipeMethods.edit(recipe);
  }

  const copyRecipe = () => {
    editRecipeMethods.editCopy(recipe);
  }

  return (
    <>
      <CardHeader
        title={<StyledRecipeTitle onClick={onEditRecipe}><RecipeName recipe={recipe}/></StyledRecipeTitle>} action={
        <CommonMenuButton>
          <MenuItem onClick={onEditRecipe} >
            <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
            <ListItemText><Translation label="edit.edit"/></ListItemText>
          </MenuItem>
          <MenuItem onClick={copyRecipe} >
            <ListItemIcon><CopyOfIcon fontSize="small" /></ListItemIcon>
            <ListItemText><Translation label="edit.copyOf"/></ListItemText>
          </MenuItem>
          <MenuItem onClick={onDeleteRecipe}>
            <ListItemIcon><DeleteIcon fontSize="small" /></ListItemIcon>
            <ListItemText><Translation label="edit.delete"/></ListItemText>
          </MenuItem>
        </CommonMenuButton>
      }/>
    </>
  );
}
