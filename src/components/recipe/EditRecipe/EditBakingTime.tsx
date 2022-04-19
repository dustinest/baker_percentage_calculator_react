import {BakingTimeType} from "../../../types";
import {Checkbox, Divider, Typography} from "@mui/material";
import {EditNumberInterval} from "./EditNumberInterval";
import {EditRecipeStateActionTypes, useEditRecipeContext} from "../../../State";
import {TranslatedLabel} from "../../../Translations";
import {useEffect, useMemo, useState} from "react";
import {DeleteIconButton, DoneIconButton} from "../../../Constant/Buttons";
import "./EditBakingTime.css";
import {HorizontalActionStack, VerticalStack} from "../../common/CommonStack";

const DUMMY_BAKING_TIME = Object.freeze({
  time: {from: 1, until: 1},
  temperature: {from: 1, until: 1},
  steam: false
} as BakingTimeType) as BakingTimeType;

const EditBakingTimeRow = ({bakingTime, index}: {bakingTime?: BakingTimeType, index: number}) => {
  const editRecipeDispatch = useEditRecipeContext();
  const [value, setValue] = useState<BakingTimeType>(DUMMY_BAKING_TIME);

  const bakingTimeValue = useMemo<BakingTimeType>(() => {
    return bakingTime || DUMMY_BAKING_TIME;
  }, [bakingTime])

  useEffect(() => {
    setValue(bakingTimeValue);
  }, [bakingTimeValue]);

  const dispatchChange = (valueToSet: BakingTimeType) => {
    editRecipeDispatch({...valueToSet, ...{type: EditRecipeStateActionTypes.SET_BAKING_TIME, index}});
  }
  const dispatchOrSet = (valueToSet: BakingTimeType) => {
    if (bakingTime)
      dispatchChange(valueToSet);
    else
      setValue(valueToSet);
  }

  const setRecipeBakingTime = async(from: number, until: number) => dispatchOrSet({...value, ...{time: {from, until }}});
  const setRecipeTemperature = async(from: number, until: number) => dispatchOrSet({...value, ...{temperature: {from, until }}});
  const setRecipeSteam = async(steam: boolean) => dispatchOrSet({...value, ...{steam: steam}});


  const triggerChange = () => dispatchChange(value);

  const removeBakingTime = async() =>
    editRecipeDispatch({type: EditRecipeStateActionTypes.REMOVE_BAKING_TIME, index});

  return (
    <HorizontalActionStack spacing={1}>
      <HorizontalActionStack spacing={0}>
        <Checkbox checked={value.steam} onChange={(e) => setRecipeSteam(e.target.checked)}/>
        <HorizontalActionStack spacing={1} divider={<Divider orientation="vertical" flexItem />}>
          <EditNumberInterval className="time" interval={value.time} onChange={(from, until) => setRecipeBakingTime(from, until)}/>
          <EditNumberInterval className="temperature" interval={value.temperature} onChange={(from, until) => setRecipeTemperature(from, until)}/>
        </HorizontalActionStack>
      </HorizontalActionStack>
      {bakingTime ? <DeleteIconButton onClick={removeBakingTime}/> : <DoneIconButton onClick={triggerChange}/> }
    </HorizontalActionStack>
  )
}

export const EditBakingTime = ({bakingTime}: {bakingTime: BakingTimeType[]}) => {
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
        <Typography variant="body1" gutterBottom><TranslatedLabel label="edit.baking_instructions.steam"/></Typography>
        <Typography variant="body1" gutterBottom><TranslatedLabel label="edit.baking_instructions.time"/></Typography>
        <Typography variant="body1" gutterBottom><TranslatedLabel label="edit.baking_instructions.temperature"/></Typography>
      </HorizontalActionStack>
      {bakingTime.map((bakingTime, index) => (
        <EditBakingTimeRow key={index} bakingTime={bakingTime} index={index}/>
      ))}
      <EditBakingTimeRow index={bakingTime.length} key={`new_baking-${bakingTime.length}`}/>
    </VerticalStack>
  )
}
