import {TableCell, TableHead, TableRow} from "@mui/material";
import {TranslatedLabel} from "./TranslatedLabel";
import {normalizeNumber} from "../../utils/NumberValue";
import {useTranslation} from "react-i18next";


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
    const translate = useTranslation();
    return (<label>{
        type === "egg" && typeof grams === "number" ?
            <>{translate.t(label, {count: Math.round(grams / 64)})}</>:
            fat && fat > 0 ? <>{translate.t(label, {count: fat})}</>:
                ash && ash > 0 ? <>{translate.t(label, {count: ash})}</>:
                    <>{translate.t(label)}</>
    }</label>);
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
