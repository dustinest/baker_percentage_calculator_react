import {IngredientsItems} from "./IngredientsItem";
import {RenderBakingTimeAware} from "./RenderBakingTimeAware";
import {useContext, useState} from "react";
import {BakerPercentageResult} from "../../utils/BakerPercentageCalulation";
import {BakerPercentage} from "./BakerPercentage";
import {UseRecipe, UseRecipeItemValues} from "./RecipeItemData";
import {RecipeJson} from "./RecipeJson";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    Card,
    CardHeader,
    Skeleton,
    Typography
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {TranslatedLabel} from "../common/TranslatedLabel";
import "./RecipeItem.css";
import {RecipeType} from "../../models";
import {useTranslation} from "react-i18next";
import {getJsonRecipeTypeLabel} from "../../service/RecipeReader";
import {RecipesContext, StateActionTypes, UpdateRecipesAction} from "../../State";
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';

const RenderMicros = ({microNutrients}: {microNutrients: BakerPercentageResult}) => {
    return (<Typography variant="body1" className="baker-percentage" component="div"><BakerPercentage microNutrientsResult={microNutrients.microNutrients}/></Typography>)
}

type RecipeItemToRenderProps = {
    recipe: UseRecipeItemValues;
    onGramsChange: (grams: number, ingredientIndex: number, index: number) => Promise<void>;
    showComponents: boolean;
}

const RecipeItemToRender = ({recipe, onGramsChange, showComponents}: RecipeItemToRenderProps) => {
    const [isExpanded, setExpanded] = useState<boolean>(false);
    const {recipesDispatch} = useContext(RecipesContext);
    const onSubmit = () => {
        recipesDispatch({
            type: StateActionTypes.UPDATE_RECIPE,
            value: recipe.recipe.raw
        } as UpdateRecipesAction);
    };

    return (<>
        {showComponents ? (
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
                    <Button variant="contained" onClick={onSubmit} startIcon={<PlaylistAddCheckIcon />}> Ok </Button>
                    <RenderMicros microNutrients={recipe.recipe.microNutrients}/>
                </AccordionDetails>
            </Accordion>
            <RecipeJson recipe={recipe.recipe.raw}/>
        </section>
            ) : undefined }
        <section className="recipe">
            <IngredientsItems ingredients={recipe.ingredients.microNutrients.ingredients} recipe={recipe.recipe.recipe} />
        </section>
        <RenderBakingTimeAware value={recipe.recipe.recipe}/>
        <RenderMicros microNutrients={recipe.ingredients.microNutrients}/>
    </>)
}

type RecipeItemProps = {
    recipe: RecipeType;
    showComponents: boolean;
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
export const RecipeItem = ({recipe, showComponents}: RecipeItemProps) => {
    const {result, setGrams} = UseRecipe(recipe);
    const translate = useTranslation();

    return (<article id={recipe.id}><Card variant="outlined" className="recipe">
        <CardHeader title={getJsonRecipeTypeLabel(recipe, translate.t(recipe.name))}/>
        {result.result ? <RecipeItemToRender recipe={result.result} onGramsChange={setGrams} showComponents={showComponents}/> : <RecipeLoader /> }
    </Card></article>)
};
