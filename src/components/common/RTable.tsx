import {TableCell, TableHead, TableRow} from "@mui/material";
import {TranslatedLabel} from "./TranslatedLabel";


export const RTableHead = ({label}: {label: string}) => {
    return (<TableHead><TableRow><TableCell colSpan={3}><TranslatedLabel label={label}/></TableCell></TableRow></TableHead>)
}

type RTableRowProps = {
    label: string;
    grams: any;
    percent:any;
}

export const RTableRow = ({label, grams, percent}: RTableRowProps) => {
    return (<TableRow>
        <TableCell className="label"><TranslatedLabel label={label}/></TableCell>
        <TableCell className="amount">{grams}</TableCell>
        <TableCell className="percent">{percent}</TableCell>
    </TableRow>);
}
