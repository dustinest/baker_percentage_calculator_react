import {IngredientGramsType} from "../../../types";
import {useMemo} from "react";
import {EditInputTimeoutNumber} from "./EditInputTimeoutNumber";
import {EditRecipeStateActionTypes, SetEditRecipeIngredientHydrationStateAction} from "../../../State";
import {useEditRecipeContext} from "../../../service/RecipeEditService";
import {getIngredientsHydration} from "../../../service/RecipeHydrationService";
import {Translation} from "../../../Translations";
import {TableCell, TableRow} from "@mui/material";

type EditRecipeHydrationProps = {
  ingredients: IngredientGramsType[];
  index: number;
}
export const EditRecipeHydration = ({ingredients, index}: EditRecipeHydrationProps) => {
  const hydration = useMemo(() => getIngredientsHydration(ingredients), [ingredients]);

  const editRecipeDispatch = useEditRecipeContext();
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
