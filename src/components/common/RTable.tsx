import {styled, TableCell, TableHead, TableRow} from "@mui/material";
import {Translation} from "../../Translations";
import {normalizeNumberToString} from "../../utils/Numbers";
import {hasValue} from "typescript-nullsafe";

export const RTableHead = ({label}: {label: string}) => {
    return (<TableHead><TableRow><TableCell colSpan={3}><Translation label={label}/></TableCell></TableRow></TableHead>)
}

interface RTableRowProps {
    label: string,
    percent:number;
    grams: number,

    type?: string,
    fat?:number,
    ash?:number
}

const getPropsCount = ({grams, type, fat, ash}: RTableRowProps) => {
    if (hasValue(grams) && (type === "EGG_egg.generic" || type === "egg.generic")) {
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

const TableNumberCell = styled(TableCell)({
    textAlign: 'right',
    whiteSpace: 'nowrap'
});


export const RTableRow = (props: RTableRowProps) => {
    return (
      <TableRow>
          <TableCell><Translation count={getPropsCount(props)} label={props.label}/></TableCell>
          <TableNumberCell>{normalizeNumberToString(props.grams, 0)} g</TableNumberCell>
          <TableNumberCell>{normalizeNumberToString(props.percent, 2)} %</TableNumberCell>
      </TableRow>
    );
}
