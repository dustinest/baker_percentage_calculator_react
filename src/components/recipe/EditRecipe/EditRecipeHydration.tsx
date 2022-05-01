import {EditInputTimeoutNumber} from "./EditInputTimeoutNumber";
import {
  EditRecipeContext,
  EditRecipeStateActionTypes,
  SetEditRecipeIngredientHydrationStateAction
} from "../../../State";
import {RecipeHydration} from "../../../service/RecipeHydrationService";
import {Translation} from "../../../Translations";
import {TableCell, TableRow} from "@mui/material";
import {useContext} from "react";

type EditRecipeHydrationProps = {
  hydration: RecipeHydration;
  index: number;
}
export const EditRecipeHydration = ({hydration, index}: EditRecipeHydrationProps) => {

  const {editRecipeDispatch} = useContext(EditRecipeContext);
  const onSave = (value: number) => {
    editRecipeDispatch({
      type: EditRecipeStateActionTypes.SET_HYDRATION,
      hydration: value,
      index: index,
    } as SetEditRecipeIngredientHydrationStateAction);
  }

  return (<>{hydration.water <= 0 || hydration.dry <= 0 ? undefined :
    <TableRow >
      <TableCell><Translation label="edit.hydration"/></TableCell>
      <TableCell><EditInputTimeoutNumber value={hydration.hydration} onSave={onSave} endAdornment="%"/></TableCell>
    </TableRow>
  }</>);
}
