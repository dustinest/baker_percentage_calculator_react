import {getTranslation} from "../../service/TranslationService";

type TranslateProps = {
    label: string;
};

export const RenderTranslation = ({label}: TranslateProps) => {
    return <>{getTranslation(label)}</>;
}

export const TranslatedLabel = ({label}: TranslateProps) => {
    return (<label>{getTranslation(label)}</label>)
}
