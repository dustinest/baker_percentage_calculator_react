import { Translation as L18Translation } from 'react-i18next';
// noinspection ES6PreferShortImport
import {TranslationMap} from "./TranslationMap.d";
import {reduceTranslationMap} from "./reduceTranslationMap";
import {hasNoValue} from "typescript-nullsafe";

type TranslationPropsAny = Omit<TranslationMap, "label">
type TranslateProps = TranslationPropsAny & { label: string; };

export const Translation = (props: TranslateProps) => {
    const {label, ...others} = props;
    if (hasNoValue(label)) {
        throw new Error("Label is required for translation!");
    }
    const args = reduceTranslationMap(others);

    return (<L18Translation>
        {
            (t) => <>{ t(label, {...args}) }</>
        }
    </L18Translation>);
}
