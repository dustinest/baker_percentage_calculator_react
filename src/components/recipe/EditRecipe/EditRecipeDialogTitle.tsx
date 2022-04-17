import {RecipeType} from "../../../types";
import {Stack, TextField} from "@mui/material";
import {EditRecipeStateActionTypes, useEditRecipeContext} from "../../../State";
import {memo} from "react";
import {useNumberInputValueTracking, useStringInputValueTracking} from "../../../utils/UseValue";
import "./EditRecipeDialogTitle.css";
import {useValueTimeoutAsync} from "../../../utils/Async";
import {DoneIconButton} from "../../../Constant/Buttons";

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
      <Stack
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        spacing={2}
      >
        <Stack
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          spacing={0.5}
        >
          <TextField
            variant="standard"
            type="string"
            value={name}
            onChange={setName}
          />
          <DoneIconButton disabled={isSameName || name.trim().length <= 0} onClick={onNameDone}/>
        </Stack>
        <TextField
          variant="standard"
          className="recipe-amount"
          type="number"
          value={amount}
          onChange={setAmount}
        />
      </Stack>
    </>
  );
});
