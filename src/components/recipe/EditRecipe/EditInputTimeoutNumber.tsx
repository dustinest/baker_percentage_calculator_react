import {useNumberInputValueTracking} from "../../../utils/UseValue";
import {KeyboardEvent} from "react";
import {HorizontalActionStack, LabelAwareStack} from "../../common/CommonStack";
import {
  ButtonGroup,
  Input,
  InputAdornment,
  ListItemIcon,
  ListItemText,
  MenuItem,
} from "@mui/material";
import {DoneButton, DoneIconButton, ResetButton} from "../../../Constant/Buttons";
import {DeleteIcon, ResetIcon} from "../../../Constant/Icons";
import {Translation} from "../../../Translations";
import {CommonMenuButton} from "../../common/CommonMenu";

type EditInputTimeoutNumberProps = {
  value: number;
  onSave: (value: number) => void;
  onDelete?: () => void;
  endAdornment?: string;
}

export const EditInputTimeoutNumber = ({value, onSave, onDelete, endAdornment}: EditInputTimeoutNumberProps) => {
  const [editValue, isSameValue, setValue, resetValue, originalValue] = useNumberInputValueTracking(value);

  const onSetValue = () => {
    if (isSameValue) return;
    onSave(editValue);
    resetValue(editValue);
  }

  const onResetValue = () => resetValue(originalValue);

  const doOnDelete = () => {
    if (onDelete) onDelete();
  }

  const keyUp = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.code === "Enter" || event.code === "NumpadEnter") {
      onSetValue();
    }
  }

  return (
      <LabelAwareStack>
        <Input
          className="recipe-ingredient-amount"
          onKeyUp={keyUp}
          type="number"
          value={editValue}
          onChange={setValue}
          endAdornment={endAdornment ? <InputAdornment position="end">{endAdornment}</InputAdornment> : undefined }
        />

        {onDelete ?
          <HorizontalActionStack>
            <DoneIconButton disabled={isSameValue} onClick={onSetValue}/>
            <CommonMenuButton>
              <MenuItem onClick={onResetValue} disabled={isSameValue}>
                <ListItemIcon><ResetIcon fontSize="small"/></ListItemIcon>
                <ListItemText><Translation label="edit.reset"/></ListItemText>
              </MenuItem>
              <MenuItem onClick={doOnDelete} disabled={!isSameValue}>
                <ListItemIcon><DeleteIcon fontSize="small"/></ListItemIcon>
                <ListItemText><Translation label="edit.delete"/></ListItemText>
              </MenuItem>
            </CommonMenuButton>
          </HorizontalActionStack>
          :
          <ButtonGroup size="small">
            <DoneButton disabled={isSameValue} onClick={onSetValue}/>
            <ResetButton disabled={isSameValue} onClick={onResetValue}/>
          </ButtonGroup>
        }
      </LabelAwareStack>
  )
}
