import {BakingTimeType} from "../../../types";
import {Checkbox, Divider, Typography} from "@mui/material";
import {EditNumberInterval} from "./EditNumberInterval";
import {EditRecipeContext, EditRecipeStateActionTypes} from "../../../State";
import {Translation} from "../../../Translations";
import {useContext, useEffect, useState} from "react";
import {DeleteIconButton, DoneIconButton} from "../../../Constant/Buttons";
import "./EditBakingTime.css";
import {HorizontalActionStack, VerticalStack} from "../../common/CommonStack";
import {useValueChange} from "../../../utils/UseValue";
import {valueOf} from "typescript-nullsafe";
import {useTimeoutAsyncEffect} from "react-useasync-hooks";

type DummyBakingTimeType = BakingTimeType & {dummy: true};
const DUMMY_BAKING_TIME = Object.freeze({
  time: {from: 1, until: 1},
  temperature: {from: 1, until: 1},
  steam: false,
  dummy: true
} as DummyBakingTimeType) as DummyBakingTimeType;

type EditBakingTimeRowProps = {
  bakingTime: BakingTimeType;
  index: number;
  onRemove: () => void;
  onDone: (value: BakingTimeType) => void;
}

const bakingTimeEquals = (v1: BakingTimeType, v2: BakingTimeType): boolean => {
    return v1.time.from === v2.time.from && v1.time.until === v2.time.until && v1.temperature.from === v2.temperature.from && v1.temperature.until === v2.temperature.until && v1.steam === v2.steam;
};

const EditBakingTimeRow = ({bakingTime, index, onRemove, onDone}: EditBakingTimeRowProps) => {
  const {editRecipeDispatch} = useContext(EditRecipeContext);
  const [value, methods, history] = useValueChange<BakingTimeType>({
    initValue: bakingTime,
    objectEquals: bakingTimeEquals,
    resetValueParser: v => valueOf(v, DUMMY_BAKING_TIME),
    valueParser: (v) => v
  });

  useEffect(() => {
    if (bakingTimeEquals(value, bakingTime)) {
      return;
    }
    methods.resetValue(bakingTime);
    // eslint-disable-next-line
  }, [bakingTime, index]);

  const dispatchChange = () => {
    editRecipeDispatch({...value, ...{type: EditRecipeStateActionTypes.SET_BAKING_TIME, index}});
    methods.resetValue(value);
    onDone(value);
  }

  useTimeoutAsyncEffect(async () => {
    if (history.equals || (history.original as DummyBakingTimeType).dummy) return;
    dispatchChange();
  }, [value, history] )


  const setRecipeBakingTime = async(from: number, until: number) => methods.setValue({time: {from, until }, temperature: value.temperature, steam: value.steam } );
  const setRecipeTemperature = async(from: number, until: number) => methods.setValue({temperature: {from, until }, time: value.time, steam: value.steam});
  const setRecipeSteam = async(steam: boolean) => methods.setValue({steam: steam, temperature: value.temperature, time: value.time});


  const removeBakingTime = async() => {
    editRecipeDispatch({type: EditRecipeStateActionTypes.REMOVE_BAKING_TIME, index});
    onRemove();
  }

  return (
    <HorizontalActionStack spacing={1}>
      <HorizontalActionStack spacing={0}>
        <Checkbox checked={value.steam} onChange={(e) => setRecipeSteam(e.target.checked)}/>
        <HorizontalActionStack spacing={1} divider={<Divider orientation="vertical" flexItem />}>
          <EditNumberInterval className="time" interval={value.time} onChange={(from, until) => setRecipeBakingTime(from, until)}/>
          <EditNumberInterval className="temperature" interval={value.temperature} onChange={(from, until) => setRecipeTemperature(from, until)}/>
        </HorizontalActionStack>
      </HorizontalActionStack>
      {(history.original as DummyBakingTimeType).dummy || !history.equals ? <DoneIconButton onClick={dispatchChange} disabled={history.equals} /> : <DeleteIconButton onClick={removeBakingTime}/> }
    </HorizontalActionStack>
  )
}

export const EditBakingTime = ({bakingTime}: {bakingTime: BakingTimeType[]}) => {
  const [values, setValues] = useState<BakingTimeType[]>([...bakingTime]);
  const onRemove = (index: number) => {
    setValues([...values].filter((e, _index) => index !== _index));
  };
  const onDone = (value: BakingTimeType, index: number) => {
    const _values = [...values];
    if (index >= _values.length) {
      _values.push(value);
      setValues(_values);
      return;
    }
    setValues(_values.map((e, _index) => _index === index ? value : e));
  };
  return (
    <VerticalStack
      className="edit-baking-time"
    >
      <HorizontalActionStack
        justifyContent="space-between"
        alignItems="baseline"
        spacing={1}
        divider={<span>,</span>}
      >
        <Typography variant="body1" gutterBottom><Translation label="edit.baking_instructions.steam"/></Typography>
        <Typography variant="body1" gutterBottom><Translation label="edit.baking_instructions.time"/></Typography>
        <Typography variant="body1" gutterBottom><Translation label="edit.baking_instructions.temperature"/></Typography>
      </HorizontalActionStack>
      {values.map((bakingTime, index) => (
        <EditBakingTimeRow key={index} bakingTime={bakingTime} index={index} onDone={(value) => onDone(value, index)} onRemove={() => onRemove(index)}/>
      ))}
      <EditBakingTimeRow index={values.length} key={`new_baking-${bakingTime.length}`} bakingTime={DUMMY_BAKING_TIME} onDone={(value) => onDone(value, values.length)} onRemove={() => {}}/>
    </VerticalStack>
  )
}
