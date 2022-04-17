import {RecipeType, RecipeTypeCopy} from "../../../types";
import {IngredientsItems} from "../common/IngredientsItem";
import {RenderBakingTimeAware} from "../common/RenderBakingTimeAware";
import {CardHeader, Container, ListItemIcon, ListItemText, Menu, MenuItem} from "@mui/material";
import {RecipesContext, RecipesStateActionTypes, useMessageSnackBar, useSetEditRecipe} from "../../../State";
import {BakerPercentageResult} from "../../../utils/BakerPercentageCalulation";
import {BakerPercentage} from "../common/BakerPercentage";
import {useContext, useEffect, useState, MouseEvent} from "react";
import {recalculateRecipeBakerPercentage} from "../common/RecipeItemEditService";
import {RecipeContentLoader} from "../common/RecipeLoader";
import {RecipeName} from "../../common/RecipeName";
import "./RecipeItemData.css";
import { MoreIconButton } from "../../../Constant/Buttons";
import {Translation} from "../../../Translations";
import {CopyOfIcon, DeleteIcon, RecipeEditIcon} from "../../../Constant/Icons";
import {RECIPE_CONSTANTS} from "../EditRecipe";

export type RecipeItemDataProps = {
  recipe: RecipeType;
  bakerPercentage: BakerPercentageResult;
}

const RecipeItemData  = ({recipe, bakerPercentage}: RecipeItemDataProps) => {
  return (<>
    <Container component="section" className="recipe">
      <IngredientsItems ingredients={bakerPercentage.ingredients} recipe={recipe} />
    </Container>
    <RenderBakingTimeAware value={recipe}/>
    {bakerPercentage.ingredients.length > 0
      ? <Container component="section" className="baker-percentage"><BakerPercentage microNutrientsResult={bakerPercentage.microNutrients}/></Container> : undefined}
  </>);
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

type RecipeItemDetailsProps = {
  isPrintPreview: boolean;
} & RecipeItemHeaderProps;


export const RecipeItemDetails = ({recipe, isPrintPreview}: RecipeItemDetailsProps) => {
  const [bakerPercentage, setBakerPercentage] = useState<BakerPercentageResult | null>(null);
  const snackBar = useMessageSnackBar();

  useEffect(() => {
    recalculateRecipeBakerPercentage(recipe).then(setBakerPercentage).catch((e: Error) => {
      snackBar.error(e, `Error while resolving the recipe ${recipe?.name}`).translate().enqueue();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipe]);

  return (<>
    { isPrintPreview ? <CardHeader className="recipe-header recipe-header-print" title={<RecipeName recipe={recipe}/>}/> : <RecipeItemHeader recipe={recipe}/> }
    <RecipeContentLoader loading={bakerPercentage === null}/>
    { bakerPercentage != null ? <RecipeItemData recipe={recipe} bakerPercentage={bakerPercentage}/> : undefined }
   </>);
}
