import {RecipeIngredientsType} from "../../../types";
import {
  Card, CardActions, CardContent, Collapse,
} from "@mui/material";
import {useState} from "react";
import {EditRecipeIngredientsName} from "./EditRecipeIngredientsName";
import {EditRecipeIngredients, EditRecipeRemainingIngredients} from "./EditRecipeIngredients";
import {ExpandMoreAction} from "../../common/ExpandMoreAction";

export const EditRecipeDialogIngredients = ({
                                              ingredients,
                                              index
                                            }: { ingredients: RecipeIngredientsType; index: number; }) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  return (
    <Card>
      <CardContent>
        <EditRecipeIngredientsName ingredients={ingredients} index={index}/>
        <EditRecipeIngredients ingredients={ingredients.ingredients} index={index}/>
      </CardContent>
      <CardActions disableSpacing>
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
