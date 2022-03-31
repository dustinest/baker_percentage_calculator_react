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
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Card,
    CardHeader,
    CircularProgress,
    Typography
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {TranslatedLabel} from "../common/TranslatedLabel";

const RenderMicros = ({microNutrients}: {microNutrients: BakerPercentageResult}) => {
    return (<Typography variant="body1" component="div"><BakerPercentage microNutrientsResult={microNutrients.microNutrients}/></Typography>)
}

type RecipeItemToRenderProps = {
    recipe: UseRecipeResult;
    onGramsChange: (grams: number, ingredientIndex: number, index: number) => Promise<void>;
}

const RecipeItemToRender = ({recipe, onGramsChange}: RecipeItemToRenderProps) => {
    const [isExpanded, setExpanded] = useState<boolean>(false);

    return (<>
        <section className="edit">
            <Accordion expanded={isExpanded} onChange={(_, i) => {setExpanded(i)}}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography><TranslatedLabel label="Komponendid"/></Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <section className="ingredients">
                        <IngredientsItems ingredients={recipe.recipe.microNutrients.ingredients} recipe={recipe.recipe.recipe} onGramsChange={onGramsChange} />
                    </section>
                    <RenderMicros microNutrients={recipe.recipe.microNutrients}/>
                </AccordionDetails>
            </Accordion>
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
}

export const RecipeItem = ({recipe}: RecipeItemProps) => {
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
                {result ? <RecipeItemToRender recipe={result} onGramsChange={setGrams}/> : <CircularProgress /> }
            </Card></article>) : undefined
    }</>)
};
