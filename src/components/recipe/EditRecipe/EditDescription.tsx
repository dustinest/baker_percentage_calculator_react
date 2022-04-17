import {Stack, TextField} from "@mui/material";
import {useTranslation} from "../../../Translations";
import {useMessageSnackBar} from "../../../State";
import {useStringInputValueTracking} from "../../../utils/UseValue";
import {DoneIconButton} from "../../../Constant/Buttons";

type EditDescriptionProps = {
  value?: string | null,
  onChange: (value?: string) => Promise<void>;
}

export const EditDescription = ({value, onChange}: EditDescriptionProps) => {
  const [description, isDescriptionSame, setDescription, resetDescription] = useStringInputValueTracking(value);
  const snackBar = useMessageSnackBar();

  const onTextChange = () => {
    if (isDescriptionSame) return;
    onChange(description)
      .then(() => resetDescription(description))
      .catch((error) => snackBar.error(error as Error, "Error while changing the text!").translate().enqueue() );
  }
  const translation = useTranslation();

  return (
    <Stack
      direction="row"
      justifyContent="flex-start"
      alignItems="center"
      spacing={0.5}
    >
        <TextField
          fullWidth
          label={translation.translate("edit.description.generic")}
          multiline
          maxRows={4}
          value={description}
          onBlur={onTextChange}
          onChange={setDescription}
        />
        <DoneIconButton disabled={isDescriptionSame} onClick={onTextChange}/>
    </Stack>
  );
}
