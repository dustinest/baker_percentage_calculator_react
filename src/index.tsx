import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {RecipesProvider} from "./State";
import {SnackbarProvider} from "notistack";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <RecipesProvider>
      <SnackbarProvider maxSnack={3} dense={true} preventDuplicate={true}>
        <App/>
      </SnackbarProvider>
    </RecipesProvider>
  </React.StrictMode>
);
