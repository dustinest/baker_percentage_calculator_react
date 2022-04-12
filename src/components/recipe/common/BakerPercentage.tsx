import {MicroNutrientsCalculationResult} from "../../../utils/MicroNutrientsCalculator";
import {Table, TableBody} from "@mui/material";
import {RTableHead, RTableRow} from "../../common/RTable";
import {hasValue} from "../../../utils/NullSafe";
import {DISPLAYABLE_NUTRIENTS_TYPE_ARRAY, NutritionType} from "../../../types/index";

type MicroNutrientsResultListParams = {
    microNutrientsResult: MicroNutrientsCalculationResult;
}

type BakerPercentageValues = {
    type: NutritionType;
    grams: number;
    percent: number;
}

const RemapMicroNutrients = (microNutrientsResult: MicroNutrientsCalculationResult): BakerPercentageValues[] =>
    DISPLAYABLE_NUTRIENTS_TYPE_ARRAY.map((type) => {
        const value = microNutrientsResult.get(type);
        if (value.getGrams() === 0 && value.getPercent() === 0) return undefined;
        return {
            type: type,
            grams: value.getGrams(),
            percent: value.getPercent()
        } as BakerPercentageValues;
    }).filter(hasValue);

export const BakerPercentage = ({microNutrientsResult} : MicroNutrientsResultListParams) => {
    return (
        <Table className="baker-percentage">
            <RTableHead label="ingredients.title.baker_percentage"/>
            <TableBody>
            {
                RemapMicroNutrients(microNutrientsResult).map((value) => (
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
