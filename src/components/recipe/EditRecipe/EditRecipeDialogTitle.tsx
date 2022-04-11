import {RecipeType} from "../../../types";
import {DialogTitle, Grid, TextField} from "@mui/material";
import {EditRecipeStateActionTypes, useEditRecipeContext} from "../../../State";
import {memo} from "react";
import {EditDoneButton} from "./EditDoneButton";
import {useNumberInputValueTracking, useStringInputValueTracking} from "../../../utils/UseValue";

export const EditRecipeDialogTitle = memo(({recipe}: {recipe: RecipeType}) => {
  const [name, isSameName, setName, resetName] = useStringInputValueTracking(recipe.name);
  const [amount, isSameAmount, setAmount, resetAmount] = useNumberInputValueTracking(recipe.amount);

  const editRecipeDispatch = useEditRecipeContext();
  const onNameDone = async () => {
    const cachedName = name;
    editRecipeDispatch({
      type: EditRecipeStateActionTypes.SET_NAME,
      name: cachedName
    });
    resetName(cachedName);
  }
  const onAmountDone = async () => {
    const cachedAmount = amount;
    editRecipeDispatch({
      type: EditRecipeStateActionTypes.SET_AMOUNT,
      amount: cachedAmount
    });
    resetAmount(cachedAmount);
  }

  return(<DialogTitle id="customized-dialog-title">
      <Grid container alignItems="center">
        <Grid item xs>
          <TextField
            variant="standard"
            type="string"
            value={name}
            onChange={setName}
          />
          <EditDoneButton enabled={!isSameName && name.trim().length > 0} onChange={onNameDone}/>
        </Grid>
        <Grid item xs>
          <TextField
            variant="standard"
            type="number"
            value={amount}
            onChange={setAmount}
          />
          <EditDoneButton enabled={!isSameAmount && amount > 0} onChange={onAmountDone}/>
        </Grid>
      </Grid>
    </DialogTitle>
  );
});
