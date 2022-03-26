import {useTranslation} from "../../service/TranslationService";

export const TranslatedLabel = ({label}: {label: string}) => {
    const translation = useTranslation(label);
    return (<label>{translation}</label>)
}
