import {KeyboardEvent, ReactNode, useEffect, useState} from "react";
import {HorizontalActionStack, LabelAwareStack} from "../../common/CommonStack";
import {ButtonGroup, Input, InputAdornment, ListItemIcon, ListItemText, MenuItem,} from "@mui/material";
import {DoneButton, DoneIconButton, ResetButton} from "../../../Constant/Buttons";
import {DeleteIcon, ResetIcon} from "../../../Constant/Icons";
import {Translation} from "../../../Translations";
import {CommonMenuButton} from "../../common/CommonMenu";
import {valueOfFloat} from "typescript-nullsafe/src/parseNullSafeNumber/parseNullSafeNumber";

type EditInputTimeoutNumberProps = {
  value: number;
  onSave: (value: number) => void;
  onDelete?: () => void;
  endAdornment?: string;
  additionalMenu?: ReactNode;
}

export const EditInputTimeoutNumber = ({
                                         value,
                                         onSave,
                                         onDelete,
                                         endAdornment,
                                         additionalMenu
                                       }: EditInputTimeoutNumberProps) => {
  const [numberValue, setNumberValue] = useState(value);
  useEffect(() => {
    setNumberValue(value);
  }, [value, setNumberValue]);
  const [equals, setEquals] = useState(true);
  useEffect(() => {
    setEquals(numberValue == value);
  }, [numberValue, value, setEquals]);

  const onSetValue = () => {
    if (equals) return;
    onSave(numberValue);
  }

  const onResetValue = () => setNumberValue(value);

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
            value={numberValue}
            onChange={(e) => setNumberValue(valueOfFloat(e.target.value, numberValue))}
            endAdornment={endAdornment ? <InputAdornment position="end">{endAdornment}</InputAdornment> : undefined}
        />

        {onDelete ?
            <HorizontalActionStack>
              <DoneIconButton disabled={equals} onClick={onSetValue}/>
              <CommonMenuButton>
                {additionalMenu}
                <MenuItem onClick={onResetValue} disabled={equals}>
                  <ListItemIcon><ResetIcon fontSize="small"/></ListItemIcon>
                  <ListItemText><Translation label="edit.reset"/></ListItemText>
                </MenuItem>
                <MenuItem onClick={doOnDelete} disabled={!equals}>
                  <ListItemIcon><DeleteIcon fontSize="small"/></ListItemIcon>
                  <ListItemText><Translation label="edit.delete"/></ListItemText>
                </MenuItem>
              </CommonMenuButton>
            </HorizontalActionStack>
            :
            <ButtonGroup size="small">
              <DoneButton disabled={equals} onClick={onSetValue}/>
              <ResetButton disabled={equals} onClick={onResetValue}/>
            </ButtonGroup>
        }
      </LabelAwareStack>
  )
}
