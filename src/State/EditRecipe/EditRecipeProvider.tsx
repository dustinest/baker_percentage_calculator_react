import {RecipeType} from "../../types";
import {createContext, Dispatch, ReactNode, useReducer} from "react";
// noinspection ES6PreferShortImport
import {RecipeManagementStateActions} from "./EditRecipeStateAction.d";
import {updateEditRecipeReducer} from "./editRecipeReducer";

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
