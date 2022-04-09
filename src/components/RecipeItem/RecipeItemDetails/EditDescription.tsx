import {useEffect, useState} from "react";
import {Table, TableBody, TableCell, TableRow, TextField} from "@mui/material";
import {DoneIcon} from "../../common/Icons";
import {RIconButton} from "../../common/RButton";
import {useTranslation} from "../../../Translations";
import {hasValue, valueOf} from "../../../utils/NullSafe";
import {useMessageSnackBar} from "../../../State";

type EditDescriptionProps = {
  value?: string | null,
  onChange: (value?: string) => Promise<void>;
}

const canChange = (value1: string | null | undefined, value2: string | null | undefined):boolean => {
  const hasValue1 = hasValue(value1) && value1.trim().length > 0;
  const hasValue2 = hasValue(value2) && value2.trim().length > 0;
  return (!hasValue1 && !hasValue2) || (value1 === value2);
}

export const EditDescription = ({value, onChange}: EditDescriptionProps) => {
  const [text, setText] = useState<string>(value || "");
  const [submitDisabled, setSubmitDisabled] = useState<boolean>(true);

  const snackBar = useMessageSnackBar();

  useEffect(() => {
    setText(valueOf(value, ""))
  }, [value]);

  const onTextChange = () => {
    if (submitDisabled) return;
    onChange(text).catch((error) => snackBar.error(error as Error, "Error while changing the text!").translate().enqueue() );
  }

  useEffect(() => setSubmitDisabled(canChange(value, text)), [text, value]);

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
              value={text}
              onBlur={onTextChange}
              onChange={(e) => setText(e.target.value)}
            />
          </TableCell>
          <TableCell>
            <RIconButton disabled={submitDisabled} onClick={onTextChange} icon={<DoneIcon/>}/>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
