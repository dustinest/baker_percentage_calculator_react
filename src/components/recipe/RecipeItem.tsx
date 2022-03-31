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
import {RecipeJson} from "./RecipeJson";

const RenderMicros = ({microNutrients}: {microNutrients: BakerPercentageResult}) => {
    return (<section className="micronutrients"><MicroNutrientsResultList microNutrientsResult={microNutrients.microNutrients}/></section>)
}

type RecipeItemToRenderProps = {
    recipe: UseRecipeResult;
    onGramsChange: (grams: number, ingredientIndex: number, index: number) => Promise<void>;
    showComponents: boolean;
}

const RecipeItemToRender = ({recipe, onGramsChange, showComponents}: RecipeItemToRenderProps) => {
    const editClassName = showComponents ? "edit" : "edit hidden";

    return (<>
        <section className={editClassName}>
            <section className="ingredients">
                {recipe.recipe.microNutrients.ingredients.map((ingredients, index) => (
                    <IngredientsItem ingredients={ingredients} recipe={recipe.recipe.recipe}
                                     onGramsChange={(grams, i) => onGramsChange(grams, index, i)}
                                     key={`ingredients_${index}`}/>
                ))}
            </section>
            <RenderMicros microNutrients={recipe.recipe.microNutrients}/>
            <RecipeJson recipe={recipe.recipe.raw}/>
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

type RecipeItemProps = {
    recipe: JsonRecipeType;
    showComponents: boolean;
}

export const RecipeItem = ({recipe, showComponents}: RecipeItemProps) => {
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
                        <RecipeItemToRender recipe={result} onGramsChange={setGrams} showComponents={showComponents}/> :
                        <label className="loading">loading...</label>
                    }
                </div>
            </article>) : undefined
    }</>)
};
