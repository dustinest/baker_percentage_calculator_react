import React from 'react';
import './App.css';
import {Main} from "./components/Main";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from './data/locales/en.json'
import et from './data/locales/et.json'

i18n.use(initReactI18next)
    .init({
        resources: {
          en: {
            translation: en
          },
          et: {
            translation: et
          }
        },
        lng: "et",
        fallbackLng: ["en", "et"],
        interpolation: {
            escapeValue: false // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
        }
    }).catch((error) => console.error("Error while reading the translations!", error));

function App() {
  return (
    <div className="App">
        <Main/>
    </div>
  );
}

export default App;
