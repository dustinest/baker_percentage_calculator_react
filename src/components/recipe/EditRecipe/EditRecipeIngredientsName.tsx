import {RecipeIngredientsType} from "../../../types";
import {ButtonGroup, Input} from "@mui/material";
import {Translation, useTranslation} from "../../../Translations";
import {useStringInputValueChange} from "../../../utils/UseValue";
import {EditRecipeContext, EditRecipeStateActionTypes} from "../../../State";
import {DoneButton} from "../../../Constant/Buttons";
import {LabelAwareStack} from "../../common/CommonStack";
import {useContext} from "react";

type EditRecipeIngredientsNameProps = { ingredients: RecipeIngredientsType; index: number };
export const EditRecipeIngredientsName = ({ingredients, index}: EditRecipeIngredientsNameProps) => {
  const translation = useTranslation();
  const [name, actions, history] = useStringInputValueChange(ingredients.name);
  const {editRecipeDispatch} = useContext(EditRecipeContext);
  const onNameDone = () => {
    editRecipeDispatch({
      type: EditRecipeStateActionTypes.SET_INGREDIENTS_NAME,
      index: index,
      name: name
    });
    actions.resetToCurrentValue();
  }

  return (<>{index === 0 ? <Translation label="ingredients.title.dough"/> :
    <LabelAwareStack justifyContent="center">
      <Input type="string"
             sx={{width: "20ch"}}
             value={name}
             onChange={actions.setValue}
             placeholder={translation("edit.ingredients.title")}
      />
      <ButtonGroup size="small">
        <DoneButton disabled={history.equals} onClick={onNameDone}/>
      </ButtonGroup>
    </LabelAwareStack>
  }</>)
}
