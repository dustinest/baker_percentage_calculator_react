import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {RecipesProvider} from "./State";

ReactDOM.render(
  <React.StrictMode>
      <RecipesProvider>
          <App />
      </RecipesProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
