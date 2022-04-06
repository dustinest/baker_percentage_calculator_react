import { Translation as L18Translation } from 'react-i18next';

type TranslateProps = {
    label: string;
    count?: number;
};

export const Translation = ({label, count}: TranslateProps) => {
    return (<L18Translation>
        {
            (t) => <>{count == undefined ? t(label) : t(label, {count})}</>
        }
    </L18Translation>);
}

export const TranslatedLabel = ({label, count}: TranslateProps) => {
    return (<label><Translation label={label} count={count}/></label>)
}
