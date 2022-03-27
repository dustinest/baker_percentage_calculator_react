import {TranslatedLabel} from "../common/TranslatedLabel";
import {NumberLabel} from "../common/NumberLabel";
import {useEffect, useState} from "react";
import {normalizeNumberString} from "../../utils/NumberValue";
import {IngredientWithPercent} from "../../utils/BakerPercentageCalulation";

type IngredientItemLabelProps = {
    ingredient: IngredientWithPercent,
}

export const IngredientItemLabel = ({ingredient}: IngredientItemLabelProps) => {
    const [amountNumber, setAmountNumber] = useState<number|undefined>();

    useEffect(() => {
        if (ingredient.getId() === "egg") {
            setAmountNumber(ingredient.getGrams() / 64);
        } else {
            setAmountNumber(undefined);
        }
    }, [ingredient])

    return (
        <tr>
            <th>
                <TranslatedLabel label={ingredient.getName()}/>
            </th>
            <td className="label">
                <label>
                    {amountNumber !== undefined
                        ? (<>{amountNumber} tk - {normalizeNumberString(ingredient.getGrams(), 0)}g</>)
                        : (<>{normalizeNumberString(ingredient.getGrams(), 0)}g</>)
                    }
                </label>
            </td>

            <td className="percent"><NumberLabel value={ingredient.getPercent()} suffix="%"/></td>
        </tr>
    )
}
