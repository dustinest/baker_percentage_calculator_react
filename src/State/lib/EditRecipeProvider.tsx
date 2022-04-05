import {RecipeType} from "../../types";
import {createContext, Dispatch, ReactNode, useMemo, useReducer} from "react";
import {RecipeManagementStateActions} from "../type/EditRecipeStateAction";
import {editRecipesReducer} from "./editRecipeReducer";

type EditRecipeContextType = {
  editRecipe: null | RecipeType;
  editRecipeDispatch: Dispatch<RecipeManagementStateActions>;
};

export const EditRecipeContext = createContext<EditRecipeContextType>({editRecipe: null, editRecipeDispatch: () => null } as EditRecipeContextType);

const combinedEditRecipeRecipesStateReducers = (
  editRecipe: null | RecipeType,
  action: RecipeManagementStateActions
) => editRecipesReducer(editRecipe, action);

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
  const recipeMemo = useMemo(() => ({
    editRecipe, editRecipeDispatch
  }), [editRecipe]);

  return (
    <EditRecipeContext.Provider value={recipeMemo}>
      {children}
     </EditRecipeContext.Provider>
  );
};

export const EditRecipeConsumer = ({ children }: { children: (args: RecipeType | null) => ReactNode }) => {
  return (
    <EditRecipeContext.Consumer>
      {(context) => {
    if (context === undefined) {
      throw new Error('CountConsumer must be used within a CountProvider')
    }
    return children(context.editRecipe)
  }}
  </EditRecipeContext.Consumer>
)
}
