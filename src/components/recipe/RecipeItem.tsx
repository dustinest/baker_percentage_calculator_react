import {IngredientsItem} from "../ingredients/IngredientsItem";
import {BakingTimeItems} from "../baking/BakingTimeItems";
import {useEffect, useState} from "react";
import {BakerPercentageResult} from "../../utils/BakerPercentageCalulation";
import {MicroNutrientsResultList} from "../micronutrients/MicroNutrientsResultList";
import {JsonRecipeType} from "../../service/RecipeReader/types";
import {
    getRecipeIdNameAndAmount,
    RecipeIdNameAndAmount,
} from "../../service/RecipeReader";
import {UseRecipe, UseRecipeResult} from "./RecipeDataHolder";

const RenderMicros = ({microNutrients}: {microNutrients: BakerPercentageResult}) => {
    return (<section className="micronutrients"><MicroNutrientsResultList microNutrientsResult={microNutrients.microNutrients}/></section>)
}

type RecipeItemToRenderProps = {
    recipe: UseRecipeResult;
    onGramsChange: (grams: number, ingredientIndex: number, index: number) => Promise<void>;
}

const RecipeItemToRender = ({recipe, onGramsChange}: RecipeItemToRenderProps) => {
    return (<>
        <section className="edit">
            <section className="ingredients">
                {recipe.recipe.microNutrients.ingredients.map((ingredients, index) => (
                    <IngredientsItem ingredients={ingredients} recipe={recipe.recipe.recipe}
                                     onGramsChange={(grams, i) => onGramsChange(grams, index, i)}
                                     key={`ingredients_${index}`}/>
                ))}
            </section>
            <RenderMicros microNutrients={recipe.recipe.microNutrients}/>
        </section>
        <section className="recipe">
            {recipe.ingredients.microNutrients.ingredients.map((ingredients, index) => (
                <IngredientsItem  ingredients={ingredients} recipe={recipe.recipe.recipe} key={`recipe_${index}`}/>
            ))}
        </section>
        <BakingTimeItems bakingTimes={recipe.recipe.recipe.getBakingTime()}/>
        <div className="description">{recipe.recipe.recipe.getDescription()}</div>
        <RenderMicros microNutrients={recipe.ingredients.microNutrients}/>
    </>)
}

export const RecipeItem = ({recipe}: { recipe: JsonRecipeType }) => {
    const {result, setGrams} = UseRecipe(recipe);
    const [recipeIdNameAndAmount, seRecipeIdNameAndAmount] = useState<RecipeIdNameAndAmount | undefined>();

    useEffect(() => {
        seRecipeIdNameAndAmount(getRecipeIdNameAndAmount(recipe));
        // eslint-disable-next-line
    }, [recipe]);

    return (<>{
        recipeIdNameAndAmount ?
            (<article id={recipeIdNameAndAmount.id}>
                <div className="recipe">
                    <h2>{recipeIdNameAndAmount.label}</h2>
                    {result ?
                        <RecipeItemToRender recipe={result} onGramsChange={setGrams}/> :
                        <label className="loading">loading...</label>
                    }
                </div>
            </article>) : undefined
    }</>)
};
