import { Translation as L18Translation } from 'react-i18next';
import {TableCell} from "@mui/material";

type TranslateProps = {
    label: string;
    count?: number;
};

export const Translation = ({label, count}: TranslateProps) => {
    return (<L18Translation>
        {
            (t) => <>{count === undefined ? t(label) : t(label, {count})}</>
        }
    </L18Translation>);
}

export const TranslatedLabel = ({label, count}: TranslateProps) => {
    return (<label><Translation label={label} count={count}/></label>)
}

export const TranslatedTableCell = ({label, count}: TranslateProps) => {
    return (<TableCell><label><Translation label={label} count={count}/></label></TableCell>)
}
