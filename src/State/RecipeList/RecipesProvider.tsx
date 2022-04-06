import {createContext, Dispatch, useReducer, ReactNode} from "react";
// noinspection ES6PreferShortImport
import {RecipesStateActions} from "./RecipesStateActions.d";
import {updateRecipesReducer} from "./recipesReducer";
import {RecipeType} from "../../types";

const initialRecipesState: RecipeType[] = []

type RecipesContextType = {
    recipes:  RecipeType[];
    recipesDispatch: Dispatch<RecipesStateActions>;
};

export const RecipesContext = createContext<RecipesContextType>({recipes: initialRecipesState, recipesDispatch: () => null } as RecipesContextType);

const combinedRecipesStateReducers = (
    recipes: RecipeType[],
    action: RecipesStateActions
) => updateRecipesReducer(recipes, action);




export const RecipesProvider = ({ children }: { children: ReactNode }) => {
    const [recipes, recipesDispatch] = useReducer(combinedRecipesStateReducers, initialRecipesState);
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
        <RecipesContext.Provider value={{ recipes, recipesDispatch }}>{children}</RecipesContext.Provider>
    );
};

export const RecipesConsumer = ({ children }: { children: (args: RecipeType[]) => ReactNode }) => {
    return (
        <RecipesContext.Consumer>
            {(context) => {
                if (context === undefined) {
                    throw new Error('RecipesConsumer must be used within a RecipesProvider')
                }
                return children(context.recipes)
            }}
        </RecipesContext.Consumer>
    )
}
