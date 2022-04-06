import {TableCell, TableHead, TableRow} from "@mui/material";
import {TranslatedLabel} from "../../Translations";
import {normalizeNumber} from "../../utils/Numbers";

export const RTableHead = ({label}: {label: string}) => {
    return (<TableHead><TableRow><TableCell colSpan={3}><TranslatedLabel label={label}/></TableCell></TableRow></TableHead>)
}

type RenderTranslatableLabelProps = {
    label: string,
    type?: string,
    grams: any,
    fat?:number,
    ash?:number
}

const RenderTranslatableLabel = ({label, grams, type, fat, ash}: RenderTranslatableLabelProps) => {
    return (<>{
        type === "egg" && typeof grams === "number" ? <TranslatedLabel label={label} count={Math.round(grams / 64)}/>:
            fat && fat > 0 ? <TranslatedLabel label={label} count={fat}/>:
                ash && ash > 0 ? <TranslatedLabel label={label} count={ash}/>:
                  <TranslatedLabel label={label}/>
    }</>);
}

type RTableRowProps = {
    percent:any;
} & RenderTranslatableLabelProps;


export const RTableRow = (props: RTableRowProps) => {
    return (<TableRow>
        <TableCell className="label"><RenderTranslatableLabel {...props}/></TableCell>
        <TableCell className="amount">{
            typeof props.grams === "number" ? <label>{normalizeNumber(props.grams)} g</label> : props.grams
        }</TableCell>
        <TableCell className="percent">{
            typeof props.percent === "number" ? <label>{normalizeNumber(props.percent)}%</label> : props.percent
        }</TableCell>
    </TableRow>);
}
