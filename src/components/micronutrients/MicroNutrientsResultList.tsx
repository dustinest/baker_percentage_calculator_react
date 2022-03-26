import {DISPLAYABLE_NUTRIENTS_TYPE_ARRAY} from "../../models/interfaces/NutritionType";
import {NumberLabel} from "../common/NumberLabel";
import {TranslatedLabel} from "../common/TranslatedLabel";
import {MicroNutrientsCalculationResult} from "../../utils/MicroNutrientsCalculator";

type MicroNutrientsResultListParams = {
    microNutrientsResult: MicroNutrientsCalculationResult;
}
export const MicroNutrientsResultList = ({microNutrientsResult} : MicroNutrientsResultListParams) => {
    return (
        <table>
            <thead><tr><th colSpan={3}><h3><TranslatedLabel label="Pagari protsent"/></h3></th></tr></thead>
            <tbody>
            {DISPLAYABLE_NUTRIENTS_TYPE_ARRAY.filter(type => microNutrientsResult.get(type).getGrams() > 0 || microNutrientsResult.get(type).getPercent() > 0).map((type) => (
            <tr key={type}>
                <th><TranslatedLabel label={type}/></th>
                <td><NumberLabel value={microNutrientsResult.get(type).getGrams()} digits={0} suffix="g"/></td>
                <td><NumberLabel value={microNutrientsResult.get(type).getPercent()} suffix="%"/></td>
            </tr>
            ))}
            </tbody>
        </table>
    )
}
