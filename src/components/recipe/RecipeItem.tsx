import {Recipe} from "../../models/interfaces/Recipe";
import {IngredientsItem} from "../ingredients/IngredientsItem";
import {BakingTimeItems} from "../baking/BakingTimeItems";
import {useEffect, useState} from "react";
import {recalculateRecipePercents, RecipePercentsResult} from "../../utils/RecipeCalulation";
import {MicroNutrientsResultList} from "../micronutrients/MicroNutrientsResultList";
import {splitStarterAndDough} from "../../service/starter/IngredientStarterService";
import {RecipeLabel} from "./RecipeLabel";

export const RecipeItem = ({recipe}: { recipe: Recipe }) => {
    //const [ingredients, setIngredients] = useState<RecipeIngredients[] | undefined>()
    const [microNutrients, setMicroNutrients] = useState<RecipePercentsResult | undefined>();
    const [ingredientsMicros, setIngredientsMicros] = useState<RecipePercentsResult | undefined>();

    useEffect(() => {
        //setIngredients(undefined);
        setMicroNutrients(undefined);
        setIngredientsMicros(undefined);
        (async () => recalculateRecipePercents(recipe.getIngredients()))().then(setMicroNutrients);
        (async () => splitStarterAndDough(recipe.getName(), recipe.getIngredients()))().then(ingredients => {
            setIngredientsMicros(recalculateRecipePercents(ingredients));
            return ingredients;
        });
        //.then(setIngredients);
    }, [recipe]);

    const onGramsChange = (grams: number, index: number): Promise<void> => {
        console.log("Resolve the grams change");
        return Promise.resolve();
    }
    const onPercentChange = (percent: number, index: number): Promise<void> => {
        console.log("Resolve the percent change");
        return Promise.resolve();
    }

    return (
        <article id={recipe.getId()}>
            <div className="recipe">
                <h2><RecipeLabel recipe={recipe}/></h2>
                <section className="edit">
                    <section className="ingredients">
                        {microNutrients?.ingredients.map((ingredients, index) => (
                            <IngredientsItem ingredients={ingredients} recipe={recipe}
                                             onPercentChange={onPercentChange}
                                             onGramsChange={onGramsChange}
                                             key={`ingredients_${index}`}/>
                        ))}
                    </section>
                    {microNutrients?.microNutrients ? (<section className="micronutrients"><MicroNutrientsResultList
                        microNutrientsResult={microNutrients.microNutrients}/></section>) : undefined}
                </section>
                <section className="recipe">
                    {ingredientsMicros?.ingredients.map((ingredients, index) => (
                        <IngredientsItem  ingredients={ingredients} recipe={recipe} key={`recipe_${index}`}/>
                    ))}
                </section>
                <BakingTimeItems bakingTimes={recipe.getBakingTime()}/>
                <div className="description">{recipe.getDescription()}</div>
                {ingredientsMicros?.microNutrients ? (<section className="micronutrients"><MicroNutrientsResultList
                    microNutrientsResult={ingredientsMicros.microNutrients}/></section>) : undefined}
            </div>
        </article>
    )
}
