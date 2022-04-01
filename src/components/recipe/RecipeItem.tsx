import {IngredientsItems} from "./IngredientsItem";
import {BakingTimeItems} from "./BakingTimeItems";
import {useState} from "react";
import {BakerPercentageResult} from "../../utils/BakerPercentageCalulation";
import {BakerPercentage} from "./BakerPercentage";
import {UseRecipe, UseRecipeValues} from "./RecipeDataHolder";
import {RecipeJson} from "./RecipeJson";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Card,
    CardHeader,
    Skeleton,
    Typography
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {TranslatedLabel} from "../common/TranslatedLabel";
import {JsonRecipeTypeWithLabel} from "./JsonRecipeTypeWithLabel";
import "./RecipeItem.css";

const RenderMicros = ({microNutrients}: {microNutrients: BakerPercentageResult}) => {
    return (<Typography variant="body1" className="baker-percentage" component="div"><BakerPercentage microNutrientsResult={microNutrients.microNutrients}/></Typography>)
}

type RecipeItemToRenderProps = {
    recipe: UseRecipeValues;
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
                    <Typography><TranslatedLabel label="Recipe components"/></Typography>
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
    recipe: JsonRecipeTypeWithLabel;
}

const RecipeLoader = () => {
    return (
        <div className="recipe-loader">
            <Skeleton />
            <Skeleton animation="wave" />
            <Skeleton animation={false} />
            <Skeleton animation="wave" />
            <Skeleton />
        </div>);
}
export const RecipeItem = ({recipe}: RecipeItemProps) => {
    const {result, setGrams} = UseRecipe(recipe);
    return (<article id={recipe.id}><Card variant="outlined" className="recipe">
        <CardHeader title={recipe.label}/>
        {result.result ? <RecipeItemToRender recipe={result.result} onGramsChange={setGrams}/> : <RecipeLoader /> }
    </Card></article>)
};
