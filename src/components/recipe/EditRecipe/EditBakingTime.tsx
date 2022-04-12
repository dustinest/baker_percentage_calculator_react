import {BakingTimeType} from "../../../types";
import {Checkbox, Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import {EditNumberInterval} from "./EditNumberInterval";
import {EditRecipeStateActionTypes, useEditRecipeContext} from "../../../State";
import {RIconButton} from "../../common/RButton";
import {DeleteICon, DoneIcon} from "../../common/Icons";
import {TranslatedTableCell} from "../../../Translations";
import {useEffect, useMemo, useState} from "react";

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
    <TableRow>
      <TableCell>
        <Checkbox checked={value.steam} onChange={(e) => setRecipeSteam(e.target.checked)}/>
      </TableCell>
      <TableCell>
        <EditNumberInterval interval={value.time} onChange={(from, until) => setRecipeBakingTime(from, until)}/>
      </TableCell>
      <TableCell>
        <EditNumberInterval interval={value.temperature} onChange={(from, until) => setRecipeTemperature(from, until)}/>
      </TableCell>
      <TableCell>
        {bakingTime ? <RIconButton onClick={removeBakingTime} icon={<DeleteICon/>}/>: <RIconButton onClick={triggerChange} icon={<DoneIcon/>}/>}
      </TableCell>
    </TableRow>
  )
}

export const EditBakingTime = ({bakingTime}: {bakingTime: BakingTimeType[]}) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TranslatedTableCell label="edit.baking_instructions.steam"/>
          <TranslatedTableCell label="edit.baking_instructions.time"/>
          <TranslatedTableCell label="edit.baking_instructions.temperature"/>
          <TableCell/>
        </TableRow>
      </TableHead>
      <TableBody>
        {bakingTime.map((bakingTime, index) => (
          <EditBakingTimeRow key={index} bakingTime={bakingTime} index={index}/>
        ))}
        <EditBakingTimeRow index={bakingTime.length} key={`new_baking-${bakingTime.length}`}/>
      </TableBody>
    </Table>
  )
}
