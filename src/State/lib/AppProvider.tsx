import {createContext, Dispatch, useReducer, ReactNode, useMemo} from "react";
import {StateActions} from "../type/StateActions.d";
import {RecipesState, SelectedRecipeState} from "../type/AppState";
import {setRecipeReducer, updateRecipesReducer} from "./recipesReducer";

const initialRecipesState:RecipesState = { recipes: [] }
const initialSelectedRecipeState:SelectedRecipeState = {
    id: null,
    filter: false
}

type RecipesContextType = {
    recipes: RecipesState;
    recipesDispatch: Dispatch<StateActions>;
};

export const RecipesContext = createContext<RecipesContextType>({recipes: initialRecipesState, recipesDispatch: () => null });

type SelectedRecipeContextType = {
    selectedRecipe: SelectedRecipeState;
    selectedRecipeDispatch: Dispatch<StateActions>;
};

export const SelectedRecipeContext = createContext<SelectedRecipeContextType>({selectedRecipe: initialSelectedRecipeState, selectedRecipeDispatch: () => null });


const combinedRecipesStateReducers = (
    { recipes }: RecipesState,
    action: StateActions
) => ({
    recipes: updateRecipesReducer(recipes, action)
});

const combinedSelectedRecipeSateReducers = (
    state: SelectedRecipeState,
    action: StateActions
) => setRecipeReducer(state, action);


export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [recipes, recipesDispatch] = useReducer(combinedRecipesStateReducers, initialRecipesState);
    const [selectedRecipe, selectedRecipeDispatch] = useReducer(combinedSelectedRecipeSateReducers, initialSelectedRecipeState);
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

    const selectedRecipesMemo = useMemo(() => ({
        selectedRecipe, selectedRecipeDispatch
    }), [selectedRecipe]);

    return (
        <SelectedRecipeContext.Provider value={selectedRecipesMemo}>
        <RecipesContext.Provider value={recipesMemo}>
                {children}
        </RecipesContext.Provider>
        </SelectedRecipeContext.Provider>
    );
};

export const RecipesContextConsumer = ({ children }: { children: (args: RecipesContextType) => ReactNode }) => {
    return (
        <RecipesContext.Consumer>
            {(context) => {
                if (context === undefined) {
                    throw new Error('CountConsumer must be used within a CountProvider')
                }
                return children(context)
            }}
        </RecipesContext.Consumer>
    )
}
