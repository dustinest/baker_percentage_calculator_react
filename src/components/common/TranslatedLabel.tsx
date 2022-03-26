import {useEffect, useState} from "react";
import {getTranslation} from "../../service/TranslationService";

export const TranslatedLabel = ({label}: {label: string}) => {
    const [_label, setLabel] = useState<string | undefined>();
    useEffect(() => {
        setLabel(getTranslation(label));
    }, [label]);
    return (
        <label>{_label}</label>
    )
}
