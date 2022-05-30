import {NumberIntervalType} from "../../../types";
import {EditRecipeContext, EditRecipeStateActionTypes} from "../../../State";
import {Typography} from "@mui/material";
import {Translation} from "../../../Translations";
import {useContext} from "react";
import {EditNumberInterval} from "./EditNumberInterval";
import {DeleteIconButton, DoneIconButton} from "../../../Constant/Buttons";
import {HorizontalActionStack, LabelAwareStack} from "../../common/CommonStack";
import {useValueChange} from "../../../utils/UseValue";
import {valueOf} from "typescript-nullsafe";
import {useTimeoutAsyncEffect} from "react-useasync-hooks";

type DummyTemperatureType = NumberIntervalType & {dummy: true};
const DUMMY_INNER_TEMPERATURE = Object.freeze({from: 1, until: 1, dummy: true} as DummyTemperatureType) as DummyTemperatureType;

export const EditInnerTemperature = ({temperature}: { temperature: NumberIntervalType | null }) => {
  const [value, methods, history] = useValueChange<NumberIntervalType, [number, number], NumberIntervalType>({
    initValue: valueOf(temperature, DUMMY_INNER_TEMPERATURE),
    objectEquals: (v1, v2) => v1.from === v2.from && v1.until === v2.until,
    resetValueParser: v => valueOf(v, DUMMY_INNER_TEMPERATURE),
    valueParser: ([from, until]) => ({from, until})
  });

  const {editRecipeDispatch} = useContext(EditRecipeContext);

  const dispatchChange = () => {
    editRecipeDispatch({type: EditRecipeStateActionTypes.SET_INNER_TEMPERATURE, temperature: {...value}});
    methods.resetValue(value);
  }

  useTimeoutAsyncEffect(async () => {
    if (history.equals || (history.original as DummyTemperatureType).dummy) return;
    dispatchChange();
  }, [value, history] )

  const removeTemperature = async () => {
    editRecipeDispatch({type: EditRecipeStateActionTypes.SET_INNER_TEMPERATURE});
    methods.resetValue(DUMMY_INNER_TEMPERATURE);
  }

  return (
    <LabelAwareStack>
      <Typography component="legend"><Translation label="edit.baking_instructions.inner_temperature"/></Typography>
      <HorizontalActionStack>
        <EditNumberInterval interval={value} onChange={(from, until) => methods.setValue([from, until])}/>
        {(history.original as DummyTemperatureType).dummy || !history.equals ? <DoneIconButton onClick={dispatchChange} disabled={history.equals} /> : <DeleteIconButton onClick={removeTemperature}/> }
      </HorizontalActionStack>
    </LabelAwareStack>
  )
}
