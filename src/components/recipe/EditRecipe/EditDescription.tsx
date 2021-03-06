import {TextField} from "@mui/material";
import {useTranslation} from "../../../Translations";
import {useMessageSnackBar} from "../../../State";
import {DoneIconButton} from "../../../Constant/Buttons";
import {HorizontalActionStack} from "../../common/CommonStack";
import {useStringInputValueChange} from "react-use-value-change";

type EditDescriptionProps = {
  value?: string | null,
  onChange: (value?: string) => Promise<void>;
}

export const EditDescription = ({value, onChange}: EditDescriptionProps) => {
  const [description, actions, history] = useStringInputValueChange(value);
  const snackBar = useMessageSnackBar();

  const onTextChange = () => {
    if (history.equals) return;
    onChange(description)
      .then(() => actions.resetToCurrentValue())
      .catch((error) => snackBar.error(error as Error, "Error while changing the text!").translate().enqueue() );
  }
  const translation = useTranslation();

  return (
    <HorizontalActionStack>
        <TextField
          fullWidth
          label={translation("edit.description.generic")}
          multiline
          maxRows={4}
          value={description}
          onBlur={onTextChange}
          onChange={actions.setValue}
        />
        <DoneIconButton disabled={history.equals} onClick={onTextChange}/>
    </HorizontalActionStack>
  );
}
