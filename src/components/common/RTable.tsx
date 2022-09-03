import {styled, TableCell, TableHead, TableRow} from "@mui/material";
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

const TableNumberCell = styled(TableCell)({
    textAlign: 'right',
    whiteSpace: 'nowrap'
});

const NumberCellLabel = ({value} : {value: any}) => {
    if (typeof value === "number" ) {
        return <label>{normalizeNumber(value)} g</label>;
    }
    return <label>{value}</label>;
}

export const RTableRow = (props: RTableRowProps) => {
    return (
      <TableRow>
          <TableCell><RenderTranslatableLabel {...props}/></TableCell>
          <TableNumberCell><NumberCellLabel value={props.grams} /></TableNumberCell>
          <TableNumberCell><NumberCellLabel value={props.percent} /></TableNumberCell>
      </TableRow>
    );
}
