import {RecipeType, RecipeTypeCopy} from "../../types";
import {createContext, Dispatch, ReactNode, useContext, useReducer} from "react";
// noinspection ES6PreferShortImport
import {EditRecipeStateActionTypes, RecipeManagementStateActions} from "./EditRecipeStateAction.d";
import {updateEditRecipeReducer} from "./editRecipeReducer";
import {RecipesContext} from "../RecipeList/RecipesProvider";
// noinspection ES6PreferShortImport
import {RecipesStateActionTypes, UpdateRecipesAction} from "../RecipeList/RecipesStateActions.d";

type EditRecipeContextType = {
  editRecipe: null | RecipeType;
  editRecipeDispatch: Dispatch<RecipeManagementStateActions>;
};

export const EditRecipeContext = createContext<EditRecipeContextType>({editRecipe: null, editRecipeDispatch: () => null } as EditRecipeContextType);

const combinedEditRecipeRecipesStateReducers = (
  editRecipe: null | RecipeType,
  action: RecipeManagementStateActions
) => updateEditRecipeReducer(editRecipe, action);

export const EditRecipeProvider = ({ children }: { children: ReactNode }) => {
  const [editRecipe, editRecipeDispatch] = useReducer(combinedEditRecipeRecipesStateReducers, null);
  // Watches for any changes in the state and keeps the state update in sync
  //Refresh state on any action dispatched
  /*
  useEffect(() => {
      //Update the localstorage after detected change
      localStorage.setItem(APP_STATE_NAME, JSON.stringify(state));
  }, [recipes]);
   */
  /*
   */
  return (
    <EditRecipeContext.Provider value={{ editRecipe, editRecipeDispatch }}>
      {children}
     </EditRecipeContext.Provider>
  );
};

export const EditRecipeConsumer = ({ children }: { children: (args: RecipeType | null) => ReactNode }) => {
  return (
    <EditRecipeContext.Consumer>
      {(context) => {
    if (context === undefined) {
      throw new Error('EditRecipeConsumer must be used within a EditRecipeProvider')
    }
    return children(context.editRecipe)
  }}
  </EditRecipeContext.Consumer>
)
}

export const useEditRecipeContext = () => {
  const {editRecipeDispatch} = useContext(EditRecipeContext);
  return editRecipeDispatch;
}

export const useSetEditRecipe = (): (recipe: RecipeType | RecipeTypeCopy) => void => {
  const { editRecipeDispatch } = useContext(EditRecipeContext);

  return (recipe: RecipeType) => {
    editRecipeDispatch({
      type: EditRecipeStateActionTypes.EDIT_RECIPE,
      value: recipe
    });
  }
};

export const useEditRecipe = (): RecipeType | null => {
  const {editRecipe} = useContext(EditRecipeContext);
  return editRecipe;
}

export const useEditRecipeActions = (): [RecipeType | null, (recipe: RecipeType) => void, () => void] => {
  const {editRecipe, editRecipeDispatch} = useContext(EditRecipeContext);
  const {recipesDispatch} = useContext(RecipesContext);

  const cancelRecipeAction = () => {
    editRecipeDispatch({
      type: EditRecipeStateActionTypes.CANCEL_EDIT_RECIPE
    });
  };

  const saveRecipeAction = (recipe: RecipeType) => {
    recipesDispatch({
      type: RecipesStateActionTypes.SAVE_RECIPE,
      value: recipe
    } as UpdateRecipesAction);
    cancelRecipeAction();
  };


  return [editRecipe, saveRecipeAction, cancelRecipeAction]
}
