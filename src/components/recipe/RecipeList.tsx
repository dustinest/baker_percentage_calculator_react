import {RecipeItem} from "./RecipeItem";
import {RecipesContext} from "../../State";
import {alpha, Stack, styled, Typography} from "@mui/material";
import {Translation} from "../../Translations";
import {useContext, useMemo} from "react";
import {GridContainer, GridItem} from "../common/GridContainer";
import {BakerPercentageAwareRecipe} from "./common/BakerPercentageAwareRecipe";
import {TranslatedAddIconButton} from "../../Constant/Buttons";
import {useRecipeEditService} from "../../service/RecipeEditService";
import {BakerIcon} from "../../Constant/BakerIcon";
import {useIsDesktop} from "../../utils/ThemeQuery/lib/useIsDesktop";

export const BakerIconStyled = styled(BakerIcon)(({theme}) => ({
  padding: 0,
  width: theme.spacing(20),
  height: theme.spacing(20),
  color: alpha(theme.palette.warning.main, 0.5) // https://mui.com/material-ui/customization/how-to-customize/#2-reusable-component
}));

const NoRecipesError = () => {
  const {editRecipeMethods} = useRecipeEditService();
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      >
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          <BakerIconStyled/>
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            <Typography variant="subtitle1" component="div">
              <Translation label="messages.no_recipes"/>
            </Typography>
            <TranslatedAddIconButton translation="actions.add_recipe" onClick={editRecipeMethods.create}/>
          </Stack>
        </Stack>
      </div>
    </>);
}

const printBlockStyle = {display: 'flex', displayPrint: 'block'};

export const RecipeList = () => {
  const {recipeState} = useContext(RecipesContext);
  const isDesktop = useIsDesktop();

  const recipes = useMemo(() => {
    return recipeState.recipes.filter((r) => recipeState.recipesFilter.includes(r.id)) as BakerPercentageAwareRecipe[]
  }, [recipeState]);

  if (recipes.length === 0) {
    return <GridContainer><GridItem><NoRecipesError/></GridItem></GridContainer>;
  }
  if (isDesktop) {
    return (
      <GridContainer sx={printBlockStyle}>
        {recipes.map((recipe) => (
          <GridItem key={recipe.id} id={recipe.id} className="recipe-item" sm={6} md={4} lg={3}>
            <RecipeItem recipe={recipe}/>
          </GridItem>
        ))}
      </GridContainer>
    );
  }
  return (
    <Stack
      sx={printBlockStyle}
      direction="column"
      justifyContent="center"
      alignItems="center"
      spacing={2}
      className="recipes"
    >
      { recipes.map((recipe) => (
        <RecipeItem  className="recipe-item" key={recipe.id} recipe={recipe}/>
      )) }
    </Stack>
  );

}
