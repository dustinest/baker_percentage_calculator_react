import {InputNumber} from "../common/InputNumber";
import {TranslatedLabel} from "../common/TranslatedLabel";
import {IngredientWithPercent} from "../../utils/RecipeCalulation";

type IngredientItemProps = {
    ingredient: IngredientWithPercent,
    onGramsChange: (grams: number) => Promise<void>;
    onPercentChange: (percent: number) => Promise<void>;
}

export const IngredientItem = ({ingredient, onGramsChange, onPercentChange}: IngredientItemProps) => {

    return (
        <tr>
            <th><label><TranslatedLabel label={ingredient.getName()}/></label></th>
            <td className="label">
                <InputNumber value={ingredient.getGrams()} suffix="g" onChange={ onGramsChange } />
            </td>

            <td className="percent"><InputNumber value={ingredient.getPercent()} suffix="%" onChange={ onPercentChange }/></td>
        </tr>
    )
}
