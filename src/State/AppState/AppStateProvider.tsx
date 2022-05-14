import {createContext, Dispatch, ReactNode, useReducer} from "react";
import {AppStateActionTypes} from "./AppStateActions";

type PreviousAndCurrent<TYPE> = {
  previous: TYPE;
  current: TYPE;
}

export type AppStateType = {
  menuOpen: PreviousAndCurrent<boolean>;
  printPreview: PreviousAndCurrent<boolean>;
};

const initialAppState:AppStateType = {
  menuOpen: {previous: false, current: false},
  printPreview: {previous: false, current: false}
}

type AppStateContextType = {
  appState: AppStateType;
  appStateDispatch: Dispatch<AppStateActionTypes>;
};

export const AppStateContext = createContext<AppStateContextType>({appState: initialAppState, appStateDispatch: () => null } as AppStateContextType);

const combinedReducers = (
  appState: AppStateType,
  action: AppStateActionTypes
):AppStateType => {
  switch (action) {
    case AppStateActionTypes.MENU_OPEN:
      if (appState.menuOpen.current) {
        return appState;
      }
      return {...appState, ...{menuOpen: {previous: appState.menuOpen.current, current: true}}};
    case AppStateActionTypes.MENU_CLOSE:
      if (!appState.menuOpen.current) {
        return appState;
      }
      return {...appState, ...{menuOpen: {previous: appState.menuOpen.current, current: false}}};
    case AppStateActionTypes.PRINT_PREVIEW_OPEN:
      if (appState.printPreview.current) {
        return appState;
      }
      return {...appState, ...{printPreview: {previous: appState.printPreview.current, current: true}}};
    case AppStateActionTypes.PRINT_PREVIEW_CLOSE:
      if (!appState.printPreview.current) {
        return appState;
      }
      return {...appState, ...{printPreview: {previous: appState.printPreview.current, current: false}}};
  }
};

export const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const [appState, appStateDispatch] = useReducer(combinedReducers, initialAppState);
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
    <AppStateContext.Provider value={{ appState, appStateDispatch }}>{children}</AppStateContext.Provider>
  );
};
