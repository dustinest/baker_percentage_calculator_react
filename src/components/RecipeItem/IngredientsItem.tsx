import {NutritionType, Recipe} from "../../models";
import {RenderBakingTimeAware} from "./RenderBakingTimeAware";
import {IngredientWithPercent, RecipeIngredientsWithPercent} from "../../utils/BakerPercentageCalulation";
import {TableBody} from "@mui/material";
import {RTableHead, RTableRow} from "../common/RTable";
import {InputValue} from "../common/InputValue";

type IngredientsItemProps = {
    ingredients: RecipeIngredientsWithPercent;
    recipe: Recipe,
    onGramsChange?: (value: number, index: number) => Promise<void>,
    onPercentChange?: (value: number, index: number) => Promise<void>,
}

const mapIngredient = (ingredient: IngredientWithPercent) => {
    const result = {
        key: ingredient.getId(),
        label: ingredient.getName(),
        type: ingredient.getId(),
        grams: ingredient.getGrams(),
        percent: ingredient.getPercent(),
        fat: 0,
        ash: 0
    };
    const fat = ingredient.getNutrients().find(e => e.getType() === NutritionType.fat);
    const water = ingredient.getNutrients().find(e => e.getType() === NutritionType.water);
    const ash = ingredient.getNutrients().find(e => e.getType() === NutritionType.ash);
    if (fat && water) {
        result.fat = fat.getPercent()
    }
    if (ash) {
        result.ash = ash.getPercent();
    }
    return result;
}

const IngredientsItem = ({ingredients, recipe, onGramsChange, onPercentChange}: IngredientsItemProps) => {
    return (
        <>
            <table className="ingredients">
                {ingredients.getName() && ingredients.getName() !== recipe.getName() ? (<RTableHead label={ingredients.getName() || ""}/>) : undefined}
                <TableBody>
                {
                ingredients.getIngredientWithPercent().map(mapIngredient).map((value, index)=>
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
