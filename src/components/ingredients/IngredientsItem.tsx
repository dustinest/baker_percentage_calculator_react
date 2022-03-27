import {IngredientItem} from "./IngredientItem";
import {Recipe} from "../../models/interfaces/Recipe";
import {BakingTimeItems} from "../baking/BakingTimeItems";
import {TranslatedLabel} from "../common/TranslatedLabel";
import {RecipeIngredientsWithPercent} from "../../utils/BakerPercentageCalulation";
import {IngredientItemLabel} from "./IngredientItemLabel";

type callbackType =  (value: number, index: number) => Promise<void>;

type IngredientsItemProps = {
    ingredients: RecipeIngredientsWithPercent;
    recipe: Recipe,
}

type IngredientsItemPropsWithCallback = {
    onGramsChange: callbackType,
    onPercentChange: callbackType,
} & IngredientsItemProps


export const IngredientsItem = (props: IngredientsItemProps | IngredientsItemPropsWithCallback) => {
    const ingredients = props.ingredients;
    const recipe = props.recipe;

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
                    ((props as IngredientsItemPropsWithCallback).onGramsChange && (props as IngredientsItemPropsWithCallback).onPercentChange ?
                            (<IngredientItem
                                ingredient={e}
                                onGramsChange={(value) => (props as IngredientsItemPropsWithCallback).onGramsChange(value, index)}
                                onPercentChange={(value) => (props as IngredientsItemPropsWithCallback).onPercentChange(value, index)} key={e.getId()}/>):
                            (<IngredientItemLabel ingredient={e} key={e.getId()}/>)
                    )
                )}
                </tbody>
            </table>
            <BakingTimeItems bakingTimes={ingredients.getBakingTime()}/>
            {ingredients.getDescription() ? (<div className="description">{ingredients.getDescription()}</div>) : undefined}
        </>
    )
}
