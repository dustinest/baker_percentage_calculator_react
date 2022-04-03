import {createContext, Dispatch, useReducer, ReactNode, useMemo} from "react";
import {StateActions} from "../type/StateActions.d";
import {updateRecipesReducer} from "./recipesReducer";
import {RecipeType} from "../../models";

const initialRecipesState: RecipeType[] = []

type RecipesContextType = {
    recipes:  RecipeType[];
    recipesDispatch: Dispatch<StateActions>;
};

export const RecipesContext = createContext<RecipesContextType>({recipes: initialRecipesState, recipesDispatch: () => null });

const combinedRecipesStateReducers = (
    recipes: RecipeType[],
    action: StateActions
) => updateRecipesReducer(recipes, action);


export const RecipesProvider = ({ children }: { children: ReactNode }) => {
    const [recipes, recipesDispatch] = useReducer(combinedRecipesStateReducers, initialRecipesState);
    // Watches for any changes in the state and keeps the state update in sync
    //Refresh state on any action dispatched
    /*
    useEffect(() => {
        //Update the localstorage after detected change
        localStorage.setItem(APP_STATE_NAME, JSON.stringify(state));
    }, [state]);
     */
    /*
     */
    const recipesMemo = useMemo(() => ({
        recipes, recipesDispatch
    }), [recipes]);

    return (
        <RecipesContext.Provider value={recipesMemo}>
                {children}
        </RecipesContext.Provider>
    );
};

export const RecipesConsumer = ({ children }: { children: (args: RecipeType[]) => ReactNode }) => {
    return (
        <RecipesContext.Consumer>
            {(context) => {
                if (context === undefined) {
                    throw new Error('CountConsumer must be used within a CountProvider')
                }
                return children(context.recipes)
            }}
        </RecipesContext.Consumer>
    )
}
