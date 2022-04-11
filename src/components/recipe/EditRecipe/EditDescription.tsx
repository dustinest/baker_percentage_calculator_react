import {useEffect} from "react";
import {Table, TableBody, TableCell, TableRow, TextField} from "@mui/material";
import {useTranslation} from "../../../Translations";
import {useMessageSnackBar} from "../../../State";
import {EditDoneButton} from "./EditDoneButton";
import {useStringValueAndOriginal} from "./ValueAndOriginal";

type EditDescriptionProps = {
  value?: string | null,
  onChange: (value?: string) => Promise<void>;
}

export const EditDescription = ({value, onChange}: EditDescriptionProps) => {
  const [description, isDescriptionSame, setDescription, resetDescription] = useStringValueAndOriginal(value);
  const snackBar = useMessageSnackBar();

  useEffect(() => {
    resetDescription(value)
  }, [value]);

  const onTextChange = () => {
    if (isDescriptionSame) return;
    onChange(description)
      .then(() => resetDescription(description))
      .catch((error) => snackBar.error(error as Error, "Error while changing the text!").translate().enqueue() );
  }
  const translation = useTranslation();

  return (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell>
            <TextField
              id="outlined-multiline-flexible" fullWidth
              label={translation.translate("Description")}
              multiline
              maxRows={4}
              value={description}
              onBlur={onTextChange}
              onChange={(e) => setDescription(e.target.value)}
            />
          </TableCell>
          <TableCell>
            <EditDoneButton enabled={!isDescriptionSame} onChange={onTextChange}/>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
