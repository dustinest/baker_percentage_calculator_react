import React from 'react';
import './Print.css';
import {Main} from "./components/Main";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import gb from './static/locales/gb.json'
import ee from './static/locales/ee.json'
import {createTheme, ThemeProvider} from "@mui/material";

i18n.use(initReactI18next)
    .init({
        resources: {
          gb: {
            translation: gb
          },
          ee: {
            translation: ee
          }
        },
        lng: "ee",
        fallbackLng: ["gb", "ee"],
        interpolation: {
            escapeValue: false // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
        }
    }).catch((error) => console.error("Error while reading the translations!", error));

export const appTheme = createTheme({
});

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={appTheme}>
      <Main/>
      </ThemeProvider>
    </div>
  );
}

export default App;
