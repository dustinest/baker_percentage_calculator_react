import {createContext, Dispatch, useReducer, ReactNode} from "react";
// noinspection ES6PreferShortImport
import {RecipesStateActions} from "./RecipesStateActions.d";
import {updateRecipesReducer} from "./recipesReducer";
import {RecipeType} from "../../types";

export type RecipeStateType = {
    recipes: RecipeType[];
    recipesFilter: string[];
};

const initialRecipesState:RecipeStateType = {
    recipes: [],
    recipesFilter: []
}

type RecipesContextType = {
    recipeState: RecipeStateType;
    recipesDispatch: Dispatch<RecipesStateActions>;
};

export const RecipesContext = createContext<RecipesContextType>({recipeState: initialRecipesState, recipesDispatch: () => null } as RecipesContextType);

const combinedRecipesStateReducers = (
    recipeState: RecipeStateType,
    action: RecipesStateActions
) => updateRecipesReducer(recipeState, action);




export const RecipesProvider = ({ children }: { children: ReactNode }) => {
    const [recipeState, recipesDispatch] = useReducer(combinedRecipesStateReducers, initialRecipesState);
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
        <RecipesContext.Provider value={{ recipeState, recipesDispatch }}>{children}</RecipesContext.Provider>
    );
};

export const RecipesConsumer = ({ children }: { children: (args: RecipeType[]) => ReactNode }) => {
    return (
        <RecipesContext.Consumer>
            {(context) => {
                if (context === undefined) {
                    throw new Error('RecipesConsumer must be used within a RecipesProvider')
                }
                const {recipes, recipesFilter} = context.recipeState;
                return children(
                  recipes.filter((r) => recipesFilter.includes(r.id)
                  )
                )
            }}
        </RecipesContext.Consumer>
    )
}
