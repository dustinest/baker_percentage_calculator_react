import {TRANSLATIONS} from "../data/Translations";
import {valueOf} from "../utils/NullSafe";

export const getTranslation = (key: string): string => {
    return valueOf(TRANSLATIONS.est[key], key);
}
