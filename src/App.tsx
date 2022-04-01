import React from 'react';
import './App.css';
import {Main} from "./components/Main";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import {TRANSLATIONS} from "./data/Translations";

i18n.use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: TRANSLATIONS.en
            },
            et: {
                translation: TRANSLATIONS.et
            }
        },
        lng: "et",
        fallbackLng: "en",
        interpolation: {
            escapeValue: false // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
        }
    })

function App() {
  return (
    <div className="App">
        <Main/>
    </div>
  );
}

export default App;
