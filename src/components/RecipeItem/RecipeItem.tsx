import {IngredientsItems} from "./IngredientsItem";
import {RenderBakingTimeAware} from "./RenderBakingTimeAware";
import {BakerPercentageResult} from "../../utils/BakerPercentageCalulation";
import {BakerPercentage} from "./BakerPercentage";
import {UseRecipe, UseRecipeActions, UseRecipeItemValues} from "./RecipeItemData";
import {RecipeJson} from "./RecipeJson";
import {
  Card,
  CardHeader,
  Skeleton,
  Typography
} from "@mui/material";
import "./RecipeItem.css";
import {RecipeType} from "../../models";
import {getJsonRecipeTypeLabel} from "../../service/RecipeReader";
import {InputValue} from "../common/InputValue";
import {RecipeCancelIcon, RecipeEditIcon, RecipeSaveIcon} from "../common/Icons";
import {RButtonGroup, RIconButton} from "../common/RButton";
import {useTranslation} from "react-i18next";

const RenderMicros = ({microNutrients}: {microNutrients: BakerPercentageResult}) => {
    return (<Typography variant="body1" className="baker-percentage" component="div"><BakerPercentage microNutrientsResult={microNutrients.microNutrients}/></Typography>)
}

type RecipeItemToRenderProps = {
  actions: UseRecipeActions;
  recipe: RecipeType;
  values: UseRecipeItemValues;
  modifiers?: {
      onSave: (recipe: RecipeType) => void;
      onCancel: () => void;
  }
}

const RecipeItemToRender = ({actions, recipe, values, modifiers}: RecipeItemToRenderProps) => {
    return (<>
        {modifiers ? (
            <section className="edit">
                <section className="ingredients">
                    <IngredientsItems ingredients={values.recipe.microNutrients.ingredients} recipe={values.recipe.recipe} onGramsChange={actions.setGrams} />
                </section>
                <RButtonGroup label="Actions" actions={[
                    {
                        icon: <RecipeSaveIcon />,
                        label: "Save",
                        onClick: () => modifiers.onSave(recipe)
                    },
                    {
                        icon: <RecipeCancelIcon />,
                        label: "Cancel",
                        onClick: modifiers.onCancel
                    }
                ]}/>
            </section>
        ) : undefined }
        <section className="recipe">
            <IngredientsItems ingredients={values.ingredients.microNutrients.ingredients} recipe={values.recipe.recipe} />
        </section>
        <RenderBakingTimeAware value={values.recipe.recipe}/>
        <RenderMicros microNutrients={values.ingredients.microNutrients}/>
        {modifiers ? <RecipeJson recipe={recipe}/> : undefined }
    </>)
}

type RecipeItemHeaderProps = {
    recipe: RecipeType;
    actions: UseRecipeActions;
    values?: UseRecipeItemValues;
    onEdit: () => void;
    isEdit: boolean;
}

export const RecipeItemHeader = ({actions, recipe, values, isEdit, onEdit}: RecipeItemHeaderProps) => {
    const translation = useTranslation();
    return (<>{
        !isEdit ? <CardHeader title={getJsonRecipeTypeLabel(recipe)} onClick={onEdit} action={<RIconButton icon={<RecipeEditIcon />} label={translation.t("Edit")}  onClick={onEdit}/>}/>:
            values? <CardHeader title={<InputValue value={recipe.name} onChange={actions.setName} />} />
                : <CardHeader title={getJsonRecipeTypeLabel(recipe)}/>
    }</>);
}

type RecipeItemProps = {
    recipe: RecipeType;
    onEdit: () => void;
    onSave: (recipe: RecipeType) => void;
    onCancel: () => void;
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

export const RecipeItem = ({recipe, onEdit, onSave, onCancel, isEdit}: RecipeItemProps) => {
    const [ recipeTypeValue, actions, recipeResult ] = UseRecipe(recipe);

    const cancelAction = () => {
        actions.cancel();
        onCancel();
    }

    return (
      <article id={recipe.id}>
          <Card
            sx={{ maxWidth: 400, marginLeft: "auto", marginRight: "auto" }}
            variant="outlined" className="recipe">
              <RecipeItemHeader recipe={recipe} actions={actions} values={recipeResult.result} onEdit={onEdit} isEdit={isEdit} />
              {recipeResult.result ? <RecipeItemToRender recipe={recipeTypeValue} values={recipeResult.result} actions={actions} modifiers={isEdit ? {onCancel: cancelAction, onSave} : undefined}/> : <RecipeLoader /> }
          </Card>
      </article>)
};
