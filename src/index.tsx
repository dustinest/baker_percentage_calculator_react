import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {RecipesProvider} from "./State";
import {SnackbarProvider} from "notistack";

ReactDOM.render(
  <React.StrictMode>
      <RecipesProvider>
          <SnackbarProvider maxSnack={3} dense={true} preventDuplicate={true} >
          <App />
          </SnackbarProvider>
      </RecipesProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
