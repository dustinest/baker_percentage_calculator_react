import {getRecipe, Recipe} from "../../models/interfaces/Recipe";
import {IngredientsItem} from "../ingredients/IngredientsItem";
import {BakingTimeItems} from "../baking/BakingTimeItems";
import {useEffect, useState} from "react";
import {recalculateBakerPercentage, BakerPercentageResult} from "../../utils/BakerPercentageCalulation";
import {MicroNutrientsResultList} from "../micronutrients/MicroNutrientsResultList";
import {splitStarterAndDough} from "../../service/SourdoughStarter";
import {JsonRecipeType} from "../../service/RecipeReader/types";
import {
    readJsonRecipe,
    getRecipeIdNameAndAmount,
    RecipeIdNameAndAmount,
} from "../../service/RecipeReader";
import {RecipeIngredients} from "../../models/interfaces/RecipeIngredients";
import {runPromiseLater} from "../../service/RunLater";

type RecipeArgs = {
    recipe: {
        recipe: Recipe;
        microNutrients: BakerPercentageResult;
    }
    ingredients: {
        ingredients: RecipeIngredients[];
        microNutrients: BakerPercentageResult;
    }
}

const RenderMicros = ({microNutrients}: {microNutrients: BakerPercentageResult}) => {
    return (<section className="micronutrients"><MicroNutrientsResultList microNutrientsResult={microNutrients.microNutrients}/></section>)
}

type RecipeItemToRenderProps = {
    recipe: RecipeArgs;
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
    const [recipeArgs, setRecipeArgs] = useState<RecipeArgs | undefined>();
    const [recipeIdNameAndAmount, seRecipeIdNameAndAmount] = useState<RecipeIdNameAndAmount | undefined>();

    const parseRecipe = (params?: {grams?: number, percent?: number, ingredientIndex: number, index: number}) => {
        if (!params) setRecipeArgs(undefined);
        if (recipe === undefined) return;
        runPromiseLater(async () => {
            const recipeType = await readJsonRecipe(recipe);
            if (params) {
                const ingredient = recipeType.ingredients[params.ingredientIndex].ingredients[params.index];
                if (params.grams && params.grams > 0) {
                    ingredient.grams = params.grams;
                }
            }
            const recipeObject = getRecipe(recipeType);
            const micronutrients = recalculateBakerPercentage(recipeObject.getIngredients());
            runPromiseLater(async () => {
                const ingredients = await splitStarterAndDough(recipeObject.getName(), recipeObject.getIngredients());
                const ingredientMicros = recalculateBakerPercentage(ingredients);
                setRecipeArgs({
                    recipe: {
                        recipe: recipeObject,
                        microNutrients: micronutrients
                    },
                    ingredients: {
                        ingredients: ingredients,
                        microNutrients: ingredientMicros
                    }
                } as RecipeArgs);
            }, 1).catch(console.error);
        }).catch(console.error);
    };

    const onGramsChange = async (grams: number, ingredientIndex: number, index: number): Promise<void> => {
        parseRecipe({grams, ingredientIndex, index});
    }

    useEffect(() => {
        seRecipeIdNameAndAmount(getRecipeIdNameAndAmount(recipe));
        parseRecipe();
        // eslint-disable-next-line
    }, [recipe]);

    return (<>{
        recipeIdNameAndAmount ?
            (<article id={recipeIdNameAndAmount.id}>
                <div className="recipe">
                    <h2>{recipeIdNameAndAmount.label}</h2>
                    {recipeArgs ?
                        <RecipeItemToRender recipe={recipeArgs} onGramsChange={onGramsChange}/> :
                        <label className="loading">loading...</label>
                    }
                </div>
            </article>) : undefined
    }</>)
};
