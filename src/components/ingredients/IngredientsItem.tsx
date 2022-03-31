import {Recipe} from "../../models/interfaces/Recipe";
import {BakingTimeItems} from "../recipe/BakingTimeItems";
import {IngredientWithPercent, RecipeIngredientsWithPercent} from "../../utils/BakerPercentageCalulation";
import {useEffect, useState} from "react";
import {normalizeNumberString} from "../../utils/NumberValue";
import {NumberLabel} from "../common/NumberLabel";
import {TableBody} from "@mui/material";
import {RTableHead, RTableRow} from "../common/RTable";
import {InputValue} from "../Input/InputValue";

type IngredientsItemProps = {
    ingredients: RecipeIngredientsWithPercent;
    recipe: Recipe,
    onGramsChange?: (value: number, index: number) => Promise<void>,
    onPercentChange?: (value: number, index: number) => Promise<void>,
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

const IngredientsItem = ({ingredients, recipe, onGramsChange, onPercentChange}: IngredientsItemProps) => {
    return (
        <>
            <table className="ingredients">
                {ingredients.getName() && ingredients.getName() !== recipe.getName() ? (<RTableHead label={ingredients.getName() || ""}/>) : undefined}
                <TableBody>
                {
                ingredients.getIngredientWithPercent().map((e, index)=>
                    (
                        <RTableRow
                            key={index}
                            label={e.getName()}
                            grams={onGramsChange ?
                                <InputValue value={e.getGrams()} onChange={ (value) => onGramsChange(value, index) } suffix="g"/>  :
                                <RenderLabel ingredient={e}/>}
                            percent={
                                onPercentChange ?
                                    <InputValue value={e.getPercent()} onChange={ (value) => onPercentChange(value, index) } suffix="%"/>:
                                    <NumberLabel value={e.getPercent()} suffix="%"/>
                            }
                        />
                    )
                )}
                </TableBody>
            </table>
            <BakingTimeItems bakingTimes={ingredients.getBakingTime()}/>
            {ingredients.getDescription() ? (<div className="description">{ingredients.getDescription()}</div>) : undefined}
        </>
    )
}

type IngredientsItemsCallback =  (value: number, ingredientsIndex: number, index: number) => Promise<void>;
type IngredientsItemsProps = {
    ingredients: RecipeIngredientsWithPercent[];
    recipe: Recipe,
    onGramsChange?: IngredientsItemsCallback,
    onPercentChange?: IngredientsItemsCallback,
}
export const IngredientsItems = ({ingredients, recipe, onGramsChange, onPercentChange}: IngredientsItemsProps) => {
    return (<>{
        ingredients.map((ingredients, index) => (
            <IngredientsItem
                ingredients={ingredients}
                recipe={recipe}
                onGramsChange={onGramsChange ? (value, _index) => onGramsChange(value, index, _index) : undefined}
                onPercentChange={onPercentChange ? (value, _index) => onPercentChange(value, index, _index) : undefined}
                key={`ingredients_${index}`}/>
        ))
    }</>)
}
