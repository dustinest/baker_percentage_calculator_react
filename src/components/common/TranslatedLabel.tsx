import {useTranslation} from "react-i18next";

type TranslateProps = {
    label: string;
};

export const RenderTranslation = ({label}: TranslateProps) => {
    const translate = useTranslation();
    return <>{translate.t(label)}</>;
}

export const TranslatedLabel = ({label}: TranslateProps) => {
    return (<label><RenderTranslation label={label}/></label>)
}
