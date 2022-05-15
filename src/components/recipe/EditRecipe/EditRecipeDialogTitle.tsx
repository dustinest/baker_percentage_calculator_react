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
import {EditRecipeContext, EditRecipeStateActionTypes} from "../../../State";
import {useNumberInputValueTracking, useStringInputValueTracking} from "../../../utils/UseValue";
import "./EditRecipeDialogTitle.css";
import {
  DoneIconButton,
  EditLabelIconButton,
  TranslatedCancelButton,
  TranslatedChangeButton
} from "../../../Constant/Buttons";
import {HorizontalActionStack} from "../../common/CommonStack";
import {SyntheticEvent, useContext, useEffect, useState} from "react";
import {Translation, useTranslation} from "../../../Translations";

const EditAmount = ({recipe}: { recipe: RecipeType }) => {
  const [amount, actions, history] = useNumberInputValueTracking(recipe.amount);
  const {editRecipeDispatch} = useContext(EditRecipeContext);
  const [tabValue, setTabValue] = useState(0);
  const [edit, setEdit] = useState<boolean>(false);

  const translation = useTranslation();
  const sendChange = () => {
    if (history.equals || amount <= 0) {
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
    if (edit) actions.resetToCurrentValue();
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
              onChange={actions.setValue}
            />
          </HorizontalActionStack>
        </DialogContent>
        <DialogActions>
          <TranslatedCancelButton onClick={onClose}/>
          <TranslatedChangeButton onClick={sendChange} disabled={history.equals || amount <= 0}/>
        </DialogActions>
      </Dialog>
      <EditLabelIconButton onClick={() => setEdit(true)}><Translation label={"edit.amount.button"} count={recipe.amount}/></EditLabelIconButton>
    </>);
}

export const EditName = ({recipe}: { recipe: RecipeType }) => {
  const [name, actions, history] = useStringInputValueTracking(recipe.name);
  const {editRecipeDispatch} = useContext(EditRecipeContext);
  const onNameDone = async () => {
    editRecipeDispatch({
      type: EditRecipeStateActionTypes.SET_NAME,
      name: name
    });
    actions.resetToCurrentValue();
  }
  return (
    <HorizontalActionStack>
      <TextField
        variant="standard"
        type="string"
        value={name}
        onChange={actions.setValue}
      />
      <DoneIconButton disabled={history.equals || name.trim().length <= 0} onClick={onNameDone}/>
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
