import {NumberIntervalType, RecipeType} from "../../../types";
import {EditRecipeStateActionTypes, useEditRecipeContext} from "../../../State";
import {Stack, Typography} from "@mui/material";
import {Translation} from "../../../Translations";
import {useEffect, useState} from "react";
import {EditNumberInterval} from "./EditNumberInterval";
import {DeleteIconButton, DoneIconButton} from "../../../Constant/Buttons";

const DUMMY_INNER_TEMPERATURE = Object.freeze({from: 1, until: 1} as NumberIntervalType) as NumberIntervalType;

export const EditInnerTemperature = ({recipe}: { recipe: RecipeType }) => {
  const [value, setValue] = useState<NumberIntervalType>(DUMMY_INNER_TEMPERATURE);
  useEffect(() => {
    setValue(recipe.innerTemperature || DUMMY_INNER_TEMPERATURE);
  }, [recipe])

  const editRecipeDispatch = useEditRecipeContext();

  const dispatchChange = (valueToSet: NumberIntervalType) => {
    editRecipeDispatch({type: EditRecipeStateActionTypes.SET_INNER_TEMPERATURE, temperature: valueToSet});
  }
  const dispatchOrSet = (valueToSet: NumberIntervalType) => {
    if (recipe.innerTemperature)
      dispatchChange(valueToSet);
    else
      setValue(valueToSet);
  }

  const setInnerTemperature = async (from: number, until: number) => dispatchOrSet({from, until});
  const triggerChange = () => dispatchChange(value);
  const removeTemperature = async () =>
    editRecipeDispatch({type: EditRecipeStateActionTypes.SET_INNER_TEMPERATURE});

  return (
    <Stack
      direction="row"
      justifyContent="flex-start"
      alignItems="center"
      spacing={2}
    >
      <Typography component="legend"><Translation label="edit.baking_instructions.inner_temperature"/></Typography>
    <Stack
      direction="row"
      justifyContent="flex-start"
      alignItems="center"
      spacing={0.5}
    >
      <EditNumberInterval interval={value} onChange={(from, until) => setInnerTemperature(from, until)}/>
      {recipe.innerTemperature ? <DeleteIconButton onClick={removeTemperature}/> :
        <DoneIconButton onClick={triggerChange}/>}
    </Stack>
    </Stack>
  )
}
