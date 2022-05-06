import {TableCell, TableHead, TableRow} from "@mui/material";
import {Translation} from "../../Translations";
import {normalizeNumber} from "../../utils/Numbers";
import {hasValue} from "typescript-nullsafe";

export const RTableHead = ({label}: {label: string}) => {
    return (<TableHead><TableRow><TableCell colSpan={3}><Translation label={label}/></TableCell></TableRow></TableHead>)
}

type RenderTranslatableLabelProps = {
    label: string,
    type?: string,
    grams: any,
    fat?:number,
    ash?:number
}
const getPropsCount = ({grams, type, fat, ash}: RenderTranslatableLabelProps) => {
    if (hasValue(grams) && (type === "EGG_egg.generic" || type === "egg.generic") && typeof grams === "number") {
        return grams > 0 ? Math.round(grams / 64) : 0;
    }
    if (hasValue(fat) && fat > 0) {
        return fat;
    }
    if (hasValue(ash) && ash > 0) {
        return ash;
    }
    return null;
}
const RenderTranslatableLabel = (props: RenderTranslatableLabelProps) => {
    const count = getPropsCount(props);
    return (<Translation count={count} label={props.label}/>);
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
