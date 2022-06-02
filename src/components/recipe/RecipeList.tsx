import {RecipeItem} from "./RecipeItem";
import {RecipesContext} from "../../State";
import {Stack, Typography} from "@mui/material";
import {Translation} from "../../Translations";
import {useContext, useMemo} from "react";
import {GridContainer, GridItem} from "../common/GridContainer";
import {BakerPercentageAwareRecipe} from "./common/BakerPercentageAwareRecipe";
import {TranslatedAddIconButton} from "../../Constant/Buttons";
import {useRecipeEditService} from "../../service/RecipeEditService";
import {BakerIcon} from "../../Constant/BakerIcon";

const NoRecipesError = () => {
  const {editRecipeMethods} = useRecipeEditService();
  return (
    <>
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        <BakerIcon sx={{width: 100, height: 100}} color="warning"/>
        <Stack
          direction="column"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Typography variant="subtitle1" component="div">
            <Translation label="messages.no_recipes"/>
          </Typography>
          <TranslatedAddIconButton translation="actions.add_recipe" onClick={editRecipeMethods.create}/>
        </Stack>
      </Stack>
    </>);
}

export const RecipeList = () => {
  const {recipeState} = useContext(RecipesContext);
  const recipes = useMemo(() => {
    return recipeState.recipes.filter((r) => recipeState.recipesFilter.includes(r.id)) as BakerPercentageAwareRecipe[]
  }, [recipeState]);

  return (
    <>{
      recipes.length === 0 ? <NoRecipesError/> :
        <GridContainer className="recipes">
          {recipes.length === 0 ? <GridItem><NoRecipesError/></GridItem> : undefined}
          {recipes.map((recipe) => (
            <GridItem key={recipe.id} id={recipe.id} className="recipe-item">
              <RecipeItem recipe={recipe}/>
            </GridItem>
          ))}
        </GridContainer>

    }</>);
}
