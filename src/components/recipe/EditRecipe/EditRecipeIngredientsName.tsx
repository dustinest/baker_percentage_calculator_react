import {RecipeIngredientsType} from "../../../types";
import {Stack, TextField} from "@mui/material";
import {useTranslation} from "../../../Translations";
import {useStringInputValueTracking} from "../../../utils/UseValue";
import {EditRecipeStateActionTypes, useEditRecipeContext} from "../../../State";
import {DoneIconButton} from "../../../Constant/Buttons";

type EditRecipeIngredientsNameProps = { ingredients: RecipeIngredientsType; index: number };
export const EditRecipeIngredientsName = ({ingredients, index}: EditRecipeIngredientsNameProps) => {
  const translation = useTranslation();
  const [name, isSameName, setName, resetName] = useStringInputValueTracking(ingredients.name);
  const editRecipeDispatch = useEditRecipeContext();
  const onNameDone = () => {
    editRecipeDispatch({
      type: EditRecipeStateActionTypes.SET_INGREDIENTS_NAME,
      index: index,
      name: name
    });
    resetName(name);
  }

  return (
    <Stack direction="row">
      <TextField variant="standard" type="string"
                 value={name}
                 onChange={setName}
                 label={translation.translate("edit.ingredients.title")}
      />
      <DoneIconButton disabled={isSameName} onClick={onNameDone}/>
    </Stack>
  )
}
