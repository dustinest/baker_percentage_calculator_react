import {RecipeItem} from "./RecipeItem";
import {AppStateContext, RecipesContext} from "../../State";
import {Alert, Container} from "@mui/material";
import {Translation} from "../../Translations";
import {Fragment, useContext, useMemo} from "react";
import {GridContainer, GridItem} from "../common/GridContainer";
import {BakerPercentageAwareRecipe} from "./common/BakerPercentageAwareRecipe";

const NoRecipesError = () => {
  return (<Alert severity="warning"><Translation label="messages.no_recipes"/></Alert>);
}

export const RecipeList = () => {
  const {appState} = useContext(AppStateContext);
  const {recipeState} = useContext(RecipesContext);
  const recipes = useMemo(() => {
    return recipeState.recipes.filter((r) => recipeState.recipesFilter.includes(r.id)) as BakerPercentageAwareRecipe[]
  }, [recipeState]);

  return useMemo(() => {
    return <>
      <GridContainer className="recipes">
        {recipes.length === 0 ? <GridItem><NoRecipesError/></GridItem> : undefined}
        {recipes.map((recipe) => (
          <Fragment key={recipe.id}>
            { appState.printPreview.current ?
                <Container id={recipe.id} component="article" className="recipe-item">
                  <RecipeItem isPrintPreview={true} recipe={recipe}/>
                </Container>
                :
                <GridItem id={recipe.id} className="recipe-item">
                  <RecipeItem isPrintPreview={false} recipe={recipe} />
                </GridItem>
            }
          </Fragment>
        ))}
      </GridContainer>
    </>
  }, [recipes, appState.printPreview])
}
