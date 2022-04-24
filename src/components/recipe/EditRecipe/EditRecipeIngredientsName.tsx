import {RecipeIngredientsType} from "../../../types";
import {ButtonGroup, Input} from "@mui/material";
import {Translation, useTranslation} from "../../../Translations";
import {useStringInputValueTracking} from "../../../utils/UseValue";
import {EditRecipeStateActionTypes} from "../../../State";
import {DoneButton} from "../../../Constant/Buttons";
import {LabelAwareStack} from "../../common/CommonStack";
import {useEditRecipeContext} from "../../../service/RecipeEditService";

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

  return (<>{index === 0 ? <Translation label="ingredients.title.dough"/> :
    <LabelAwareStack justifyContent="center">
      <Input type="string"
             sx={{width: "20ch"}}
             value={name}
             onChange={setName}
             placeholder={translation("edit.ingredients.title")}
      />
      <ButtonGroup size="small">
        <DoneButton disabled={isSameName} onClick={onNameDone}/>
      </ButtonGroup>
    </LabelAwareStack>
  }</>)
}
