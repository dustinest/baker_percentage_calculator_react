import {IngredientsItems} from "./IngredientsItem";
import {RenderBakingTimeAware} from "./RenderBakingTimeAware";
import {BakerPercentageResult} from "../../utils/BakerPercentageCalulation";
import {BakerPercentage} from "./BakerPercentage";
import {UseRecipe, UseRecipeItemValues} from "./RecipeItemData";
import {RecipeJson} from "./RecipeJson";
import {
  Button,
  Card,
  CardHeader, IconButton,
  Skeleton,
  Typography
} from "@mui/material";
import "./RecipeItem.css";
import {RecipeType} from "../../models";
import {useTranslation} from "react-i18next";
import {getJsonRecipeTypeLabel} from "../../service/RecipeReader";
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import EditIcon from '@mui/icons-material/Edit';
import {InputValue} from "../common/InputValue";

const RenderMicros = ({microNutrients}: {microNutrients: BakerPercentageResult}) => {
    return (<Typography variant="body1" className="baker-percentage" component="div"><BakerPercentage microNutrientsResult={microNutrients.microNutrients}/></Typography>)
}

type RecipeItemToRenderProps = {
  recipe: UseRecipeItemValues;
  onGramsChange: (grams: number, ingredientIndex: number, index: number) => Promise<void>;
  onSave?: (recipe: RecipeType) => void;
}

const RecipeItemToRender = ({recipe, onGramsChange, onSave}: RecipeItemToRenderProps) => {

    return (<>
        {onSave ? (
            <section className="edit">
                <section className="ingredients">
                    <IngredientsItems ingredients={recipe.recipe.microNutrients.ingredients} recipe={recipe.recipe.recipe} onGramsChange={onGramsChange} />
                </section>
                <Button variant="contained" onClick={() => onSave(recipe.recipe.raw)} startIcon={<PlaylistAddCheckIcon />}> Ok </Button>
                <RenderMicros microNutrients={recipe.recipe.microNutrients}/>
            </section>
        ) : undefined }
        <section className="recipe">
            <IngredientsItems ingredients={recipe.ingredients.microNutrients.ingredients} recipe={recipe.recipe.recipe} />
        </section>
        <RenderBakingTimeAware value={recipe.recipe.recipe}/>
        <RenderMicros microNutrients={recipe.ingredients.microNutrients}/>
        {onSave ? <RecipeJson recipe={recipe.recipe.raw}/> : undefined }
    </>)
}

type RecipeItemProps = {
    recipe: RecipeType;
    onEdit: () => void;
    onSave: (recipe: RecipeType) => void;
    isEdit: boolean;
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
export const RecipeItem = ({recipe, onEdit, onSave, isEdit}: RecipeItemProps) => {
    const {result, setGrams, setName} = UseRecipe(recipe);
    const translate = useTranslation();

    return (
      <article id={recipe.id}>
          <Card
            sx={{ maxWidth: 400, marginLeft: "auto", marginRight: "auto" }}
            variant="outlined" className="recipe">
            <CardHeader
              title={
                isEdit ? <InputValue value={recipe.name} onChange={setName} /> : getJsonRecipeTypeLabel(recipe)
              }
              action={
                isEdit ? undefined : <IconButton aria-label={translate.t("Edit")} onClick={onEdit}><EditIcon /></IconButton>
            }/>
              {result.result ? <RecipeItemToRender recipe={result.result} onGramsChange={setGrams} onSave={isEdit ? onSave : undefined}/> : <RecipeLoader /> }
          </Card>
      </article>)
};
