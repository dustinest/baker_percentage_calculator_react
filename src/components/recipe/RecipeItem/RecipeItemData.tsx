import {RecipeType, RecipeTypeCopy} from "../../../types";
import {IngredientsItems} from "../common/IngredientsItem";
import {RenderBakingTimeAware} from "../common/RenderBakingTimeAware";
import {
  CardHeader,
  Container,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem, Stack,
} from "@mui/material";
import {RecipesContext, RecipesStateActionTypes, useSetEditRecipe} from "../../../State";
import {BakerPercentage} from "../common/BakerPercentage";
import {useContext, useState, MouseEvent} from "react";
import {RecipeName} from "../../common/RecipeName";
import "./RecipeItemData.css";
import { MoreIconButton } from "../../../Constant/Buttons";
import {Translation} from "../../../Translations";
import {CopyOfIcon, DeleteIcon, RecipeEditIcon} from "../../../Constant/Icons";
import {RECIPE_CONSTANTS} from "../EditRecipe";
import {RecipeItemResult} from "./RecipeItemResult";
import {ItemText} from "../common/ItemText";

const roundToTen = (amount: number): number => {
  if (amount === 0) return amount;
  return Math.round(amount * 10) / 10;
}

export const TotalWeight = ({total, amount}: {total: number, amount: number}) => {
  const weight = roundToTen(total);
  const oneWeight = amount > 1 ? roundToTen(total / amount): 0;
  return (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="baseline"
      divider={<Divider orientation="vertical" flexItem />}
      spacing={1.5}
    >
      <ItemText className="totals"><Translation label="ingredients.title.total_weight" count={weight}/></ItemText>
      {oneWeight > 0 ? <ItemText className="totals"><Translation label="ingredients.title.total_weight_item" args={{ divider: amount, amount: oneWeight}}/></ItemText> : undefined}
    </Stack>
  )
}

type RecipeItemHeaderProps = { recipe: RecipeType; }

const RecipeItemHeader = ({recipe}: RecipeItemHeaderProps) => {
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
          <ListItemIcon><RecipeEditIcon fontSize="small" /></ListItemIcon>
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

export type RecipeItemDataProps = {
  recipe: RecipeItemResult;
}
const RecipeItemData  = ({recipe}: RecipeItemDataProps) => {
  return (<>
    <RenderBakingTimeAware value={recipe.recipe}/>
    {recipe.bakerPercentage !== null && recipe.bakerPercentage.ingredients.length > 0
      ? <Container component="section" className="baker-percentage"><BakerPercentage microNutrientsResult={recipe.bakerPercentage.microNutrients}/></Container> : undefined}
    { recipe.totalWeight > 0 ? <TotalWeight total={recipe.totalWeight} amount={recipe.recipe.amount}/> : undefined }
  </>);
}

const RecipeItemDataPrint  = ({recipe}: RecipeItemDataProps) => {
  return (<>
    <Stack
      direction="row"
      justifyContent="space-evenly"
      alignItems="flex-end"
      divider={<Divider orientation="vertical" flexItem />}
      spacing={2}
    >
      {recipe.bakerPercentage !== null && recipe.bakerPercentage.ingredients.length > 0
        ? <Container component="section" className="baker-percentage"><BakerPercentage microNutrientsResult={recipe.bakerPercentage.microNutrients}/></Container> : undefined}
      <Stack direction="column"
             justifyContent="flex-start"
             alignItems="center"
             divider={<Divider orientation="horizontal" flexItem />}
             spacing={2}
      >
        <RenderBakingTimeAware value={recipe.recipe}/>
        { recipe.totalWeight > 0 ? <TotalWeight total={recipe.totalWeight} amount={recipe.recipe.amount}/> : undefined }
      </Stack>
    </Stack>
  </>);
}

type RecipeItemDetailsProps = {
  isPrintPreview: boolean;
  recipe: RecipeItemResult;
};

export const RecipeItemDetails = ({recipe, isPrintPreview}: RecipeItemDetailsProps) => {
  return (<>
    { isPrintPreview ? <CardHeader className="recipe-header recipe-header-print" title={<RecipeName recipe={recipe.recipe}/>}/> : <RecipeItemHeader recipe={recipe.recipe}/> }
    { recipe.bakerPercentage != null ? <Container component="section" className="recipe"><IngredientsItems ingredients={recipe.bakerPercentage.ingredients} recipe={recipe.recipe} /></Container> : undefined}
    { isPrintPreview ? <RecipeItemDataPrint recipe={recipe}/> : <RecipeItemData recipe={recipe}/> }
   </>);
}
