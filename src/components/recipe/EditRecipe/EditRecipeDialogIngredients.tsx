import {RecipeIngredientsType, RecipeType} from "../../../types";
import {
  Alert,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  Collapse,
  FormControlLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Popover
} from "@mui/material";
import {MouseEvent, useContext, useEffect, useMemo, useState} from "react";
import {EditRecipeIngredientsName} from "./EditRecipeIngredientsName";
import {EditRecipeIngredients, EditRecipeRemainingIngredients} from "./EditRecipeIngredients";
import {ExpandMoreAction} from "../../common/ExpandMoreAction";
import {EditRecipeContext, EditRecipeStateActionTypes} from "../../../State";
import {InfoIconButton} from "../../../Constant/Buttons";
import {RECIPE_CONSTANTS} from "../../../State/RecipeConstants";
import {Translation, useTranslation} from "../../../Translations";
import {CommonMenuButton} from "../../common/CommonMenu";
import {DeleteIcon} from "../../../Constant/Icons";

const EnforceStarter = ({ingredients, index}: {ingredients: RecipeIngredientsType, index: number}) => {
  const translate = useTranslation();
  const [isStarter, setIsStarter] = useState<boolean>(ingredients.starter === true);
  const [popOverButton, setPopOverButton] = useState<HTMLButtonElement | null>(null);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => setPopOverButton(event.currentTarget);

  const {editRecipeDispatch} = useContext(EditRecipeContext);

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

  const privileges = useMemo<{expand: { is: boolean, can: boolean}, delete: {can: boolean}, enforceStarter: boolean}>(() => {
    const isNewRecipe = recipe.id === RECIPE_CONSTANTS.NEW_RECIPE;
    const hasMoreIngredients = recipe.ingredients.length > 1;
    const hasOtherIngredients = recipe.ingredients.find((a, i) => i !== index && a.ingredients.length > 0) !== undefined;
    return {
      expand: {
        is: isNewRecipe,
        can: !isNewRecipe || hasMoreIngredients
      },
      delete: {
        can: hasOtherIngredients
      },
      enforceStarter: index === 0 && ingredients.ingredients.length > 0
    }
    // To mute ingredients check. We do need it!
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ingredients, recipe, index]);

  useEffect(() => {
    setExpanded(privileges.expand.is)
  }, [privileges.expand.is]);

  const {editRecipeDispatch} = useContext(EditRecipeContext);

  const onRemove = () => {
    editRecipeDispatch({
      type: EditRecipeStateActionTypes.REMOVE_INGREDIENT,
      index
    });
  }


  return (
    <Card>
      <CardHeader
        title={ <EditRecipeIngredientsName ingredients={ingredients} index={index}/> }
        action={privileges.delete.can ? <CommonMenuButton>
          <MenuItem onClick={onRemove} disabled={!privileges.delete.can}>
            <ListItemIcon><DeleteIcon fontSize="small"/></ListItemIcon>
            <ListItemText><Translation label="edit.delete"/></ListItemText>
          </MenuItem>
        </CommonMenuButton> : undefined}
      />
      { ingredients.ingredients.length > 0 ? <CardContent>
        <EditRecipeIngredients ingredients={ingredients.ingredients} index={index}/>
      </CardContent> : undefined }
      <CardActions disableSpacing>
        {privileges.enforceStarter ? <EnforceStarter ingredients={ingredients} index={index}/> : undefined}
        {privileges.expand.can ?  <ExpandMoreAction expanded={expanded} onChange={setExpanded}/> : undefined}
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <EditRecipeRemainingIngredients ingredients={ingredients.ingredients} index={index}/>
        </CardContent>
      </Collapse>
    </Card>
  );
}
