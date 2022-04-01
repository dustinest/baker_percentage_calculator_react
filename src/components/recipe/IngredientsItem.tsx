import {Recipe} from "../../models/interfaces/Recipe";
import {BakingTimeItems} from "./BakingTimeItems";
import {RecipeIngredientsWithPercent} from "../../utils/BakerPercentageCalulation";
import {TableBody} from "@mui/material";
import {RTableHead, RTableRow} from "../common/RTable";
import {InputValue} from "../common/InputValue";

type IngredientsItemProps = {
    ingredients: RecipeIngredientsWithPercent;
    recipe: Recipe,
    onGramsChange?: (value: number, index: number) => Promise<void>,
    onPercentChange?: (value: number, index: number) => Promise<void>,
}

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
                            type={e.getId()}
                            grams={onGramsChange ?
                                <InputValue value={e.getGrams()} onChange={ (value) => onGramsChange(value, index) } suffix="g"/>  :
                                e.getGrams()}
                            percent={
                                onPercentChange ?
                                    <InputValue value={e.getPercent()} onChange={ (value) => onPercentChange(value, index) } suffix="%"/>:
                                    e.getPercent()
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
