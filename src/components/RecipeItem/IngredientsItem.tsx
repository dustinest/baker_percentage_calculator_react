import {RenderBakingTimeAware} from "./RenderBakingTimeAware";
import {
    IngredientWithPercentType,
    RecipeIngredientsWithPercentType
} from "../../utils/BakerPercentageCalulation";
import {TableBody} from "@mui/material";
import {RTableHead, RTableRow} from "../common/RTable";
import {InputValue} from "../common/InputValue";
import {NutritionType, RecipeType} from "../../types";

type IngredientsItemProps = {
    ingredients: RecipeIngredientsWithPercentType;
    recipe: RecipeType,
    onGramsChange?: (value: number, index: number) => Promise<void>,
    onPercentChange?: (value: number, index: number) => Promise<void>,
}

const mapIngredient = (ingredient: IngredientWithPercentType) => {
    const result = {
        key: ingredient.id,
        label: ingredient.name,
        type: ingredient.id,
        grams: ingredient.grams,
        percent: ingredient.percent,
        fat: 0,
        ash: 0
    };
    const fat = ingredient.nutrients.find(e => e.type === NutritionType.fat);
    const water = ingredient.nutrients.find(e => e.type === NutritionType.water);
    const ash = ingredient.nutrients.find(e => e.type === NutritionType.ash);
    if (fat && water) result.fat = fat.percent;
    if (ash) result.ash = ash.percent;
    return result;
}

const IngredientsItem = ({ingredients, recipe, onGramsChange, onPercentChange}: IngredientsItemProps) => {
    return (
        <>
            <table className="ingredients">
                {ingredients.name && ingredients.name !== recipe.name ? (<RTableHead label={ingredients.name || ""}/>) : undefined}
                <TableBody>
                {
                ingredients.ingredientWithPercent.map(mapIngredient).map((value, index)=>
                    (
                        <RTableRow
                            key={index}
                            label={value.label}
                            type={value.type}
                            fat={value.fat}
                            ash={value.ash}
                            grams={
                            onGramsChange ?
                                <InputValue value={value.grams} onChange={ (value) => onGramsChange(value, index) } suffix="g"/>  :
                                value.grams
                            }
                            percent={
                                onPercentChange ?
                                    <InputValue value={value.percent} onChange={ (value) => onPercentChange(value, index) } suffix="%"/>:
                                    value.percent
                            }
                        />
                    )
                )}
                </TableBody>
            </table>
            <RenderBakingTimeAware value={ingredients}/>
        </>
    )
}

type IngredientsItemsCallback =  (value: number, ingredientsIndex: number, index: number) => Promise<void>;
type IngredientsItemsProps = {
    ingredients: RecipeIngredientsWithPercentType[];
    recipe: RecipeType,
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
