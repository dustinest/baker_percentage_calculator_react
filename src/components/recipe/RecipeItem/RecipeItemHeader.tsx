import {MouseEvent, useContext, useState} from "react";
import {RecipesContext, RecipesStateActionTypes, useSetEditRecipe} from "../../../State";
import {RECIPE_CONSTANTS} from "../../../State/RecipeConstants";
import {RecipeType, RecipeTypeCopy} from "../../../types";
import {CardHeader, ListItemIcon, ListItemText, Menu, MenuItem} from "@mui/material";
import {RecipeName} from "../../common/RecipeName";
import {MoreIconButton} from "../../../Constant/Buttons";
import {CopyOfIcon, DeleteIcon, EditIcon} from "../../../Constant/Icons";
import {Translation} from "../../../Translations";

const RecipeItemHeaderList = ({recipe}: {recipe: RecipeType}) => {
  const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null);
  const onMenuOpen = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setAnchorElement(event.currentTarget);
  }
  const onMenuClose = () => setAnchorElement(null);

  const setEditRecipe = useSetEditRecipe();
  const {recipesDispatch} = useContext(RecipesContext);
  const onDeleteRecipe = () => {
    onMenuClose();
    recipesDispatch({
      type: RecipesStateActionTypes.REMOVE_RECIPE,
      value: recipe
    });
  }
  const onEditRecipe = () => {
    onMenuClose();
    setEditRecipe(recipe);
  }

  const copyRecipe = () => {
    onMenuClose();
    setEditRecipe({...recipe, ...{id: RECIPE_CONSTANTS.NEW_RECIPE, copyId: recipe.id}} as RecipeTypeCopy);
  }

  return (
    <>
      <CardHeader
        className="recipe-header"
        title={<div onClick={onEditRecipe}><RecipeName recipe={recipe}/></div>} action={
        <MoreIconButton aria-controls={anchorElement !== null ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={anchorElement !== null ? 'true' : undefined}
                        onClick={onMenuOpen}/>
      }/>
      <Menu
        id="basic-menu"
        anchorEl={anchorElement}
        open={anchorElement !== null}
        onClose={onMenuClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
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
      </Menu>
    </>
  );
}

const RecipeItemHeaderPrint = ({recipe}: {recipe: RecipeType}) => {
  return (<CardHeader className="recipe-header recipe-header-print" title={<RecipeName recipe={recipe}/>}/>);
}

export const RecipeHeader = ({recipe, isPrintPreview}: {recipe: RecipeType; isPrintPreview: boolean;}) => {
  return (<>{ isPrintPreview ? <RecipeItemHeaderPrint recipe={recipe}/> : <RecipeItemHeaderList recipe={recipe}/>} </>);
}
