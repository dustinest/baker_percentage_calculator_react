import {TableCell, TableHead, TableRow} from "@mui/material";
import {RenderTranslation, TranslatedLabel} from "./TranslatedLabel";
import {normalizeNumber} from "../../utils/NumberValue";


export const RTableHead = ({label}: {label: string}) => {
    return (<TableHead><TableRow><TableCell colSpan={3}><TranslatedLabel label={label}/></TableCell></TableRow></TableHead>)
}

type RTableRowProps = {
    type?: string;
    label: string;
    grams: any;
    percent:any;
}

const RenderTranslatableLabel = ({label, grams, type}: {label: string, type?: string, grams: any}) => {
    return (<label>{type === "egg" && typeof grams === "number" ? <> {Math.round(grams / 64)} </> : undefined}<RenderTranslation label={label}/></label>)
}


export const RTableRow = ({label, grams, percent, type}: RTableRowProps) => {
    return (<TableRow>
        <TableCell className="label"><label><RenderTranslatableLabel label={label} type={type} grams={grams}/></label></TableCell>
        <TableCell className="amount">{
            typeof grams === "number" ? <label>{normalizeNumber(grams)} g</label> : grams
        }</TableCell>
        <TableCell className="percent">{
            typeof percent === "number" ? <label>{normalizeNumber(percent)}%</label> : percent
        }</TableCell>
    </TableRow>);
}
