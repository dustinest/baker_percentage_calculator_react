import {RecipeItem} from "./RecipeItem";
import {RecipesContext, useMessageSnackBar} from "../../State";
import {Alert, Box, CircularProgress, CircularProgressProps, Container, Typography} from "@mui/material";
import {TranslatedLabel} from "../../Translations";
import {ReactNode, useContext, useEffect, useState} from "react";
import {RecipeItemResult} from "./RecipeItem/RecipeItemResult";
import {AsyncStatus,useAsyncEffect} from "../../utils/Async";
import {GridContainer, GridItem} from "../common/GridContainer";
import {getRecipesBakerPercentage} from "./common/useBakerPercentage";

const NoRecipesError = () => {
  return (<Alert severity="warning"><TranslatedLabel label="messages.no_recipes"/></Alert>);
}

type PropsStatus = {
  progress: number;
  label: string;
}

const CircularProgressWithLabel = (props: CircularProgressProps & { status: PropsStatus | null }) => {
  return (
    <>
      {  props.status ?
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" {...props} value={props.status.progress}/>
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
        >{`${Math.round(props.status.progress)}%`}</Typography>
      </Box>
    </Box>
        : undefined
      }
    </>
  );
}



const RecipeListContainer = ({children}: {children: (args: RecipeItemResult[]) => ReactNode }) => {
  const {recipeState} = useContext(RecipesContext);
  const [recipeContainers, setRecipeContainers] = useState<RecipeItemResult[]>([]);
  const [recipeLoader, setRecipeLoader] = useState<PropsStatus | null>(null);
  const snackBar = useMessageSnackBar();
  const recipesResult = useAsyncEffect(async () => {
    return getRecipesBakerPercentage(
      recipeState.recipes.filter((r) => recipeState.recipesFilter.includes(r.id)),
      (recipe, progress) => {
        setRecipeLoader({
          label: recipe.name,
          progress
        });
      }
    );
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
