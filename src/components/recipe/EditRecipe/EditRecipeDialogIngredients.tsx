import {RecipeIngredientsType, RecipeType} from "../../../types";
import {
  Alert,
  Card, CardActions, CardContent, Checkbox, Collapse, FormControlLabel, Popover
} from "@mui/material";
import {useEffect, useState, MouseEvent} from "react";
import {EditRecipeIngredientsName} from "./EditRecipeIngredientsName";
import {EditRecipeIngredients, EditRecipeRemainingIngredients} from "./EditRecipeIngredients";
import {ExpandMoreAction} from "../../common/ExpandMoreAction";
import {EditRecipeStateActionTypes} from "../../../State";
import {DeleteIconButton, InfoIconButton} from "../../../Constant/Buttons";
import {RECIPE_CONSTANTS} from "../../../State/RecipeConstants";
import {useTranslation} from "../../../Translations";
import {useEditRecipeContext} from "../../../service/RecipeEditService";

const EnforceStarter = ({ingredients, index}: {ingredients: RecipeIngredientsType, index: number}) => {
  const translate = useTranslation();
  const [isStarter, setIsStarter] = useState<boolean>(ingredients.starter === true);
  const [popOverButton, setPopOverButton] = useState<HTMLButtonElement | null>(null);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => setPopOverButton(event.currentTarget);

  const editRecipeDispatch = useEditRecipeContext();

  const onCheckBoxChange = (newValue: boolean) => {
    setIsStarter(newValue);
    editRecipeDispatch({
      type: EditRecipeStateActionTypes.USE_INGREDIENT_IN_STARTER,
      index,
      value: newValue
    });
  }

  return (
    <>
      <Popover
        open={popOverButton !== null}
        anchorEl={popOverButton}
        onClose={() => setPopOverButton(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Alert severity="info">{translate("edit.enforce_starter.legend")}</Alert>
      </Popover>
        <FormControlLabel
          control={<Checkbox
            checked={isStarter}
            onChange={(e) => onCheckBoxChange(e.target.checked)}/>} label={translate("edit.enforce_starter.button")}/>
      <InfoIconButton onClick={handleClick}/>
    </>
  )
}

type EditRecipeDialogIngredientsProps = {
  ingredients: RecipeIngredientsType;
  index: number;
  recipe: RecipeType;
}
export const EditRecipeDialogIngredients = ({
                                              ingredients,
                                              recipe,
                                              index
                                            }: EditRecipeDialogIngredientsProps) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [canDeExpand, setCanDeExpand] = useState<boolean>(false);
  const [canDelete, setCanDelete] = useState<boolean>(false);
  useEffect(() => {
    const isNewRecipe = recipe.id === RECIPE_CONSTANTS.NEW_RECIPE;
    const hasIngredients = ingredients.ingredients.length > 0;
    if (isNewRecipe) {
      const hasMoreIngredients = recipe.ingredients.length > 1;
      const hasOtherIngredients = recipe.ingredients.find((a, i) => i !== index && a.ingredients.length > 0) !== undefined;
      const canDeExpand = !isNewRecipe || (hasIngredients && hasMoreIngredients && hasOtherIngredients);
      setExpanded(!canDeExpand || expanded);
      setCanDeExpand(canDeExpand);
      setCanDelete(hasIngredients && hasMoreIngredients);
    } else {
      setExpanded(!hasIngredients);
      setCanDeExpand(true);
      setCanDelete(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ingredients, recipe])

  const editRecipeDispatch = useEditRecipeContext();

  const onRemove = () => {
    editRecipeDispatch({
      type: EditRecipeStateActionTypes.REMOVE_INGREDIENT,
      index
    });
  }
  return (
    <Card>
      <CardContent>
        <EditRecipeIngredientsName ingredients={ingredients} index={index}/>
        <EditRecipeIngredients ingredients={ingredients.ingredients} index={index}/>
        {index === 0 ? <EnforceStarter ingredients={ingredients} index={index}/> : undefined}
      </CardContent>
      {canDelete || canDeExpand ? <CardActions disableSpacing>
        {canDelete ? <DeleteIconButton onClick={onRemove}/> : undefined }
        {canDeExpand ? <ExpandMoreAction expanded={expanded} onChange={setExpanded}/> : undefined}
      </CardActions> : undefined}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <EditRecipeRemainingIngredients ingredients={ingredients.ingredients} index={index}/>
        </CardContent>
      </Collapse>
    </Card>
  );
}
