import {Recipe} from "../../models/interfaces/Recipe";
import {BakingTimeItems} from "../baking/BakingTimeItems";
import {TranslatedLabel} from "../common/TranslatedLabel";
import {IngredientWithPercent, RecipeIngredientsWithPercent} from "../../utils/BakerPercentageCalulation";
import {InputNumber} from "../common/InputNumber";
import {useEffect, useState} from "react";
import {normalizeNumberString} from "../../utils/NumberValue";
import {NumberLabel} from "../common/NumberLabel";

type callbackType =  (value: number, index: number) => Promise<void>;

type IngredientsItemProps = {
    ingredients: RecipeIngredientsWithPercent;
    recipe: Recipe,
    onGramsChange?: callbackType,
    onPercentChange?: callbackType,
}

type IngredientItemLabelProps = {
    ingredient: IngredientWithPercent,
}

const RenderLabel = ({ingredient}: IngredientItemLabelProps) => {
    const [amountNumber, setAmountNumber] = useState<number|undefined>();

    useEffect(() => {
        if (ingredient.getId() === "egg") {
            setAmountNumber(ingredient.getGrams() / 64);
        } else {
            setAmountNumber(undefined);
        }
    }, [ingredient])

    return (
        <label>
            {amountNumber !== undefined
                ? (<>{amountNumber} tk - {normalizeNumberString(ingredient.getGrams(), 0)}g</>)
                : (<>{normalizeNumberString(ingredient.getGrams(), 0)}g</>)
            }
        </label>
    )
};

const RenderPercent = ({ingredient}: IngredientItemLabelProps) => {
    return (<NumberLabel value={ingredient.getPercent()} suffix="%"/>)
};

export const IngredientsItem = ({ingredients, recipe, onGramsChange, onPercentChange}: IngredientsItemProps) => {
    return (
        <>
            <table className="ingredients">
                {ingredients.getName() && ingredients.getName() !== recipe.getName() ? (
                        <thead>
                        <tr>
                            <th colSpan={3}>
                            <h3><TranslatedLabel label={ingredients.getName() || ""}/></h3>
                            </th>
                        </tr>
                        </thead>
                    ) : undefined}
                <tbody>
                {
                ingredients.getIngredientWithPercent().map((e, index)=>
                    (
                        <tr key={index}>
                            <th><TranslatedLabel label={e.getName()}/></th>
                            <td className="label">
                                {
                                    onGramsChange ?
                                        <InputNumber value={e.getGrams()} suffix="g" onChange={ (value) => onGramsChange(value, index) } /> :
                                        <RenderLabel ingredient={e}/>
                                }
                            </td>
                            <td className="percent">
                                {
                                    onPercentChange ?
                                        <InputNumber value={e.getPercent()} suffix="%" onChange={ (value) => onPercentChange(value, index) }/> :
                                        <RenderPercent ingredient={e}/>
                                }
                            </td>
                        </tr>
                    )
                )}
                </tbody>
            </table>
            <BakingTimeItems bakingTimes={ingredients.getBakingTime()}/>
            {ingredients.getDescription() ? (<div className="description">{ingredients.getDescription()}</div>) : undefined}
        </>
    )
}
