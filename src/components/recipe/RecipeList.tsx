import {RecipeItem} from "./RecipeItem";
import {RecipesContext, useMessageSnackBar} from "../../State";
import {Alert, Box, CircularProgress, CircularProgressProps, Container, Typography} from "@mui/material";
import {TranslatedLabel} from "../../Translations";
import {ReactNode, useContext, useEffect, useState} from "react";
import {RecipeItemResult} from "./RecipeItem/RecipeItemResult";
import {AsyncStatus, iterateAsync, useAsyncEffect} from "../../utils/Async";
import {recalculateRecipeBakerPercentage} from "./common/RecipeItemEditService";
import {RecipeType} from "../../types";
import {GridContainer, GridItem} from "../common/GridContainer";

const NoRecipesError = () => {
  return (<Alert severity="warning"><TranslatedLabel label="messages.no_recipes"/></Alert>);
}

type PropsStatus = {
  total: number;
  index: number;
  percent: number;
  label: string;
}

const CircularProgressWithLabel = (props: CircularProgressProps & { status: PropsStatus | null }) => {
  return (
    <>
      {  props.status ?
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" {...props} value={props.status.percent}/>
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="caption"
          component="div"
          color="text.secondary"
        >{`${Math.round(props.status.percent)}%`}</Typography>
      </Box>
    </Box>
        : undefined
      }
    </>
  );
}

const calculateTotalWeight = async (recipe: RecipeType): Promise<number> => {
  return recipe.ingredients.flatMap((ingredients) => ingredients.ingredients).map((ingredient) => ingredient.grams).reduce((total, value) => total + value, 0);
}

const RecipeListContainer = ({children}: {children: (args: RecipeItemResult[]) => ReactNode }) => {
  const {recipeState} = useContext(RecipesContext);
  const [recipeContainers, setRecipeContainers] = useState<RecipeItemResult[]>([]);
  const [recipeLoader, setRecipeLoader] = useState<PropsStatus | null>(null);
  const snackBar = useMessageSnackBar();
  const recipesResult = useAsyncEffect(async () => {
    const result: RecipeItemResult[] = [];
    const recipes = recipeState.recipes.filter((r) => recipeState.recipesFilter.includes(r.id));
    await iterateAsync(recipes, async(recipe, index) => {
      setRecipeLoader({
        index,
        total: recipes.length,
        label: recipe.name,
        percent: index > 0 ? Math.round(index * 100 / recipes.length) : 0
      });
      const bakerPercentage = await recalculateRecipeBakerPercentage(recipe);
      result.push({
        recipe: recipe,
        bakerPercentage,
        totalWeight: await calculateTotalWeight(recipe)
      });
    });
    setRecipeLoader({
      index: recipes.length,
      total: recipes.length,
      label: "done",
      percent: 100
    });
    return result;
  }, [recipeState]);
  useEffect(() => {
    if (recipesResult.status === AsyncStatus.SUCCESS) {
      setRecipeContainers(recipesResult.value);
    }
    if (recipesResult.status === AsyncStatus.ERROR) {
      snackBar.error(recipesResult.error, `Error while resolving the recipes`).translate().enqueue();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipesResult])

  return (
    <>{ recipesResult.status === AsyncStatus.LOADING ? <CircularProgressWithLabel status={recipeLoader}/> : children(recipeContainers) }</>
  )
}

export const RecipeList = () => {
  return (
    <RecipeListContainer>
      {(recipes) => (
        <GridContainer className="recipes">
          {recipes.length === 0 ? <GridItem><NoRecipesError/></GridItem> : undefined}
          {recipes.map((recipe) => (
            <GridItem key={recipe.recipe.id}  id={recipe.recipe.id} className="recipe-item">
              <RecipeItem isPrintPreview={false} recipe={recipe} />
            </GridItem>
          ))}
        </GridContainer>
    )}</RecipeListContainer>
  );
}

export const RecipePrintList = () => {
  return (
    <RecipeListContainer>
      {(recipes) => (
        <div className="recipes">
          {recipes.length === 0 ? <NoRecipesError/> : undefined}
          {recipes.map((recipe) => (
            <Container id={recipe.recipe.id} key={recipe.recipe.id} component="article" className="recipe-item">
              <RecipeItem isPrintPreview={true} recipe={recipe}/>
            </Container>
          ))}
        </div>
      )}</RecipeListContainer>
  );
}
