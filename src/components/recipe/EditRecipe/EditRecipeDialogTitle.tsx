import {RecipeType} from "../../../types";
import {Grid, TextField} from "@mui/material";
import {EditRecipeStateActionTypes, useEditRecipeContext} from "../../../State";
import {memo} from "react";
import {EditDoneButton} from "./EditDoneButton";
import {useNumberInputValueTracking, useStringInputValueTracking} from "../../../utils/UseValue";
import "./EditRecipeDialogTitle.css";
import {useValueTimeoutAsync} from "../../../utils/Async";

export const EditRecipeDialogTitle = memo(({recipe}: { recipe: RecipeType }) => {
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

  useValueTimeoutAsync(async () => {
    if (isSameAmount || amount <= 0) {
      return;
    }
    const cachedAmount = amount;
    editRecipeDispatch({
      type: EditRecipeStateActionTypes.SET_AMOUNT,
      amount: cachedAmount
    });
    resetAmount(cachedAmount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, amount)


  return (<>
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
          className="recipe-amount"
          type="number"
          value={amount}
          onChange={setAmount}
        />
      </Grid>
    </>
  );
});
