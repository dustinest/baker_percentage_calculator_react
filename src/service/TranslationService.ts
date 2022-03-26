import {useEffect, useState} from "react";
import {TRANSLATIONS} from "../data/Translations";

export const getTranslation = (key: string): string => {
    return TRANSLATIONS.est[key] || key;
}

export const useTranslation = (value: string): string | undefined => {
    const [label, setLabel] = useState<string | undefined>();
    useEffect(() => {
        if (!value) {
            setLabel(value);
        } else {
            setLabel(getTranslation(value));
        }
    }, [value]);
    return label;
}
