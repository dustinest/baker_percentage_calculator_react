import {RecipeIngredientsType} from "../../../types";
import {
  Button,
  Card, CardActions, CardContent, Collapse,
} from "@mui/material";
import {useState} from "react";
import {EditRecipeIngredientsName} from "./EditRecipeIngredientsName";
import {EditRecipeIngredients, EditRecipeRemainingIngredients} from "./EditRecipeIngredients";
import {ExpandMoreAction} from "../../common/ExpandMoreAction";
import {DeleteICon} from "../../common/Icons";
import {EditRecipeStateActionTypes, useEditRecipeContext} from "../../../State";

export const EditRecipeDialogIngredients = ({
                                              ingredients,
                                              index
                                            }: { ingredients: RecipeIngredientsType; index: number; }) => {
  const [expanded, setExpanded] = useState<boolean>(ingredients.ingredients.length === 0);
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
      </CardContent>
      <CardActions disableSpacing>
        <Button onClick={onRemove} startIcon={<DeleteICon/>}/>
        <ExpandMoreAction expanded={expanded} onChange={setExpanded}/>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <EditRecipeRemainingIngredients ingredients={ingredients.ingredients} index={index}/>
        </CardContent>
      </Collapse>
    </Card>
  );
}
