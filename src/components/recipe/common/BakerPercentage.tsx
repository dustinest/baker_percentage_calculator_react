import {Table, TableBody} from "@mui/material";
import {RTableHead, RTableRow} from "../../common/RTable";
import {DISPLAYABLE_NUTRIENTS_TYPE_ARRAY} from "../../../types/index";
import {MicroNutrientsResultType} from "../../../service/BakerPercentage";
import {hasValue} from "typescript-nullsafe";

type MicroNutrientsResultListParams = {
  microNutrientsResult: MicroNutrientsResultType;
}
export const BakerPercentage = ({microNutrientsResult}: MicroNutrientsResultListParams) => {
  return (
    <Table className="baker-percentage">
      <RTableHead label="ingredients.title.baker_percentage"/>
      <TableBody>
        <RTableRow
          label={`ingredient.predefined.dry.generic`}
          grams={microNutrientsResult.dry_total}
          percent={100}/>
        {
          DISPLAYABLE_NUTRIENTS_TYPE_ARRAY.map((type) => microNutrientsResult.nutrients[type]).filter(hasValue).map((value) => (
            <RTableRow
              key={value.type}
              label={`ingredient.predefined.${value.type}.generic`}
              grams={value.grams}
              percent={value.percent}/>
          ))}
      </TableBody>
    </Table>
  )
}
