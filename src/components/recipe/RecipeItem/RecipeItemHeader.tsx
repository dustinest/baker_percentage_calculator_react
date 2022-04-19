import {useContext} from "react";
import {RecipesContext, RecipesStateActionTypes, useSetEditRecipe} from "../../../State";
import {RECIPE_CONSTANTS} from "../../../State/RecipeConstants";
import {RecipeType, RecipeTypeCopy} from "../../../types";
import {CardHeader, ListItemIcon, ListItemText, MenuItem} from "@mui/material";
import {RecipeName} from "../../common/RecipeName";
import {CopyOfIcon, DeleteIcon, EditIcon} from "../../../Constant/Icons";
import {Translation} from "../../../Translations";
import {CommonMenuButton} from "../../common/CommonMenu";

const RecipeItemHeaderList = ({recipe}: {recipe: RecipeType}) => {
  const setEditRecipe = useSetEditRecipe();
  const {recipesDispatch} = useContext(RecipesContext);
  const onDeleteRecipe = () => {
    recipesDispatch({
      type: RecipesStateActionTypes.REMOVE_RECIPE,
      value: recipe
    });
  }
  const onEditRecipe = () => {
    setEditRecipe(recipe);
  }

  const copyRecipe = () => {
    setEditRecipe({...recipe, ...{id: RECIPE_CONSTANTS.NEW_RECIPE, copyId: recipe.id}} as RecipeTypeCopy);
  }

  return (
    <>
      <CardHeader
        className="recipe-header"
        title={<div onClick={onEditRecipe}><RecipeName recipe={recipe}/></div>} action={
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

const RecipeItemHeaderPrint = ({recipe}: {recipe: RecipeType}) => {
  return (<CardHeader className="recipe-header recipe-header-print" title={<RecipeName recipe={recipe}/>}/>);
}

export const RecipeHeader = ({recipe, isPrintPreview}: {recipe: RecipeType; isPrintPreview: boolean;}) => {
  return (<>{ isPrintPreview ? <RecipeItemHeaderPrint recipe={recipe}/> : <RecipeItemHeaderList recipe={recipe}/>} </>);
}
