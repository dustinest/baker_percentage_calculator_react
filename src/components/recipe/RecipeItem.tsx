import {IngredientsItems} from "../ingredients/IngredientsItem";
import {BakingTimeItems} from "./BakingTimeItems";
import {useEffect, useState} from "react";
import {BakerPercentageResult} from "../../utils/BakerPercentageCalulation";
import {BakerPercentage} from "./BakerPercentage";
import {JsonRecipeType} from "../../service/RecipeReader/types";
import {
    getRecipeIdNameAndAmount,
    RecipeIdNameAndAmount,
} from "../../service/RecipeReader";
import {UseRecipe, UseRecipeResult} from "./RecipeDataHolder";
import {RecipeJson} from "./RecipeJson";
import {Card, CardHeader, CircularProgress, Typography} from "@mui/material";

const RenderMicros = ({microNutrients}: {microNutrients: BakerPercentageResult}) => {
    return (<Typography variant="body1" component="div"><BakerPercentage microNutrientsResult={microNutrients.microNutrients}/></Typography>)
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
                <IngredientsItems ingredients={recipe.recipe.microNutrients.ingredients} recipe={recipe.recipe.recipe} onGramsChange={onGramsChange} />
            </section>
            <RenderMicros microNutrients={recipe.recipe.microNutrients}/>
            <RecipeJson recipe={recipe.recipe.raw}/>
        </section>
        <section className="recipe">
            <IngredientsItems ingredients={recipe.ingredients.microNutrients.ingredients} recipe={recipe.recipe.recipe} />
        </section>
        <BakingTimeItems bakingTimes={recipe.recipe.recipe.getBakingTime()}/>
        <Typography variant="body1">{recipe.recipe.recipe.getDescription()}</Typography>
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
            (<article id={recipeIdNameAndAmount.id}><Card variant="outlined" className="recipe">
                <CardHeader title={recipeIdNameAndAmount.label}/>
                {result ? <RecipeItemToRender recipe={result} onGramsChange={setGrams} showComponents={showComponents}/> : <CircularProgress /> }
            </Card></article>) : undefined
    }</>)
};
