import {DISPLAYABLE_NUTRIENTS_TYPE_ARRAY} from "../../models/interfaces/NutritionType";
import {NumberLabel} from "../common/NumberLabel";
import {MicroNutrientsCalculationResult} from "../../utils/MicroNutrientsCalculator";
import {TableBody} from "@mui/material";
import {RTableHead, RTableRow} from "../common/RTable";

type MicroNutrientsResultListParams = {
    microNutrientsResult: MicroNutrientsCalculationResult;
}
export const BakerPercentage = ({microNutrientsResult} : MicroNutrientsResultListParams) => {
    return (
        <table className="baker-percentage">
            <RTableHead label="Pagari protsent"/>
            <TableBody>
            {DISPLAYABLE_NUTRIENTS_TYPE_ARRAY
                .filter(type => microNutrientsResult.get(type).getGrams() > 0 || microNutrientsResult.get(type).getPercent() > 0)
                .map((type) => (
                    <RTableRow
                        key={type}
                        label={type}
                        grams={<NumberLabel value={microNutrientsResult.get(type).getGrams()} digits={0} suffix="g"/>}
                        percent={<NumberLabel value={microNutrientsResult.get(type).getPercent()} suffix="%"/>}/>
                ))}
            </TableBody>
        </table>
    )
}
