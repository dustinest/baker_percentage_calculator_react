import {RecipeType} from "../../../types";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tab,
  Tabs,
  TextField
} from "@mui/material";
import {EditRecipeStateActionTypes} from "../../../State";
import {useNumberInputValueTracking, useStringInputValueTracking} from "../../../utils/UseValue";
import "./EditRecipeDialogTitle.css";
import {
  DoneIconButton, EditLabelIconButton, TranslatedCancelButton, TranslatedChangeButton
} from "../../../Constant/Buttons";
import {HorizontalActionStack} from "../../common/CommonStack";
import {useState, SyntheticEvent, useEffect} from "react";
import {Translation, useTranslation} from "../../../Translations";
import {useEditRecipeContext} from "../../../service/RecipeEditService";

const EditAmount = ({recipe}: { recipe: RecipeType }) => {
  const [amount, isSameAmount, setAmount, resetAmount] = useNumberInputValueTracking(recipe.amount);
  const editRecipeDispatch = useEditRecipeContext();
  const [tabValue, setTabValue] = useState(0);
  const [edit, setEdit] = useState<boolean>(false);

  const translation = useTranslation();
  const sendChange = () => {
    if (isSameAmount || amount <= 0) {
      return;
    }
    setEdit(false);
    editRecipeDispatch({
      type: EditRecipeStateActionTypes.SET_AMOUNT,
      calculate: tabValue === 1,
      amount
    });
  }

  useEffect(() => {
    if (edit) resetAmount(recipe.amount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [edit, recipe])

  const handleTabsChange = (event: SyntheticEvent, newValue: number) => setTabValue(newValue);
  const onClose = () => setEdit(false);

  return (
    <>
      <Dialog open={edit} onClose={onClose}>
        <DialogTitle sx={{m: 0, p: 2}}>
          <Tabs value={tabValue} onChange={handleTabsChange}>
            <Tab label={translation("edit.amount.tab.change")}/>
            <Tab label={translation("edit.amount.tab.calculate")}/>
          </Tabs>
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText>
            <Translation label={tabValue !== 0 ? "edit.amount.calculate" : "edit.amount.change"}/>
          </DialogContentText>
          <HorizontalActionStack justifyContent="center">
            <TextField
              variant="standard"
              className="recipe-amount"
              type="number"
              value={amount}
              onChange={setAmount}
            />
          </HorizontalActionStack>
        </DialogContent>
        <DialogActions>
          <TranslatedCancelButton onClick={onClose}/>
          <TranslatedChangeButton onClick={sendChange} disabled={isSameAmount || amount <= 0}/>
        </DialogActions>
      </Dialog>
      <EditLabelIconButton onClick={() => setEdit(true)}><Translation label={"edit.amount.button"} count={recipe.amount}/></EditLabelIconButton>
    </>);
}

export const EditName = ({recipe}: { recipe: RecipeType }) => {
  const [name, isSameName, setName, resetName] = useStringInputValueTracking(recipe.name);
  const editRecipeDispatch = useEditRecipeContext();
  const onNameDone = async () => {
    const cachedName = name;
    editRecipeDispatch({
      type: EditRecipeStateActionTypes.SET_NAME,
      name: cachedName
    });
    resetName(cachedName);
  }
  return (
    <HorizontalActionStack>
      <TextField
        variant="standard"
        type="string"
        value={name}
        onChange={setName}
      />
      <DoneIconButton disabled={isSameName || name.trim().length <= 0} onClick={onNameDone}/>
    </HorizontalActionStack>
  );
};


export const EditRecipeDialogTitle = ({recipe}: { recipe: RecipeType }) => {
  return (
    <HorizontalActionStack spacing={2} justifyContent="center">
      <EditName recipe={recipe}/>
      <EditAmount recipe={recipe}/>
    </HorizontalActionStack>
  );
};
