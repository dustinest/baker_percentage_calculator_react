import {useBooleanInputValueChange} from "../../../utils/UseValue";
import {KeyboardEvent, ReactNode} from "react";
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
  additionalMenu?: ReactNode;
}

export const EditInputTimeoutNumber = ({value, onSave, onDelete, endAdornment, additionalMenu}: EditInputTimeoutNumberProps) => {
  const [editValue, actions, history] = useBooleanInputValueChange(value);

  const onSetValue = () => {
    if (history.equals) return;
    onSave(editValue);
    actions.resetToCurrentValue();
  }

  const onResetValue = () => actions.resetToOriginalValue();

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
          onChange={actions.setValue}
          endAdornment={endAdornment ? <InputAdornment position="end">{endAdornment}</InputAdornment> : undefined }
        />

        {onDelete ?
          <HorizontalActionStack>
            <DoneIconButton disabled={history.equals} onClick={onSetValue}/>
            <CommonMenuButton>
              {additionalMenu}
              <MenuItem onClick={onResetValue} disabled={history.equals}>
                <ListItemIcon><ResetIcon fontSize="small"/></ListItemIcon>
                <ListItemText><Translation label="edit.reset"/></ListItemText>
              </MenuItem>
              <MenuItem onClick={doOnDelete} disabled={!history.equals}>
                <ListItemIcon><DeleteIcon fontSize="small"/></ListItemIcon>
                <ListItemText><Translation label="edit.delete"/></ListItemText>
              </MenuItem>
            </CommonMenuButton>
          </HorizontalActionStack>
          :
          <ButtonGroup size="small">
            <DoneButton disabled={history.equals} onClick={onSetValue}/>
            <ResetButton disabled={history.equals} onClick={onResetValue}/>
          </ButtonGroup>
        }
      </LabelAwareStack>
  )
}
