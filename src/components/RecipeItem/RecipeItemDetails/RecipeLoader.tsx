import {Skeleton, Typography} from "@mui/material";

export const RecipeLoader = () => {
  return (
    <div className="recipe-loader">
      <Skeleton />
      <Skeleton animation="wave" />
      <Skeleton animation={false} />
      <Skeleton animation="wave" />
      <Skeleton />
    </div>);
}

export const RecipeContentLoader = ({loading, error}: { loading?: boolean, error?: Error }) => {
    return (<>
        {
            error? <Typography variant="body2" display="block" gutterBottom>{error?.toString()}</Typography> :
                loading ? <RecipeLoader/>: undefined

        }
    </>);
}
