import {Skeleton} from "@mui/material";

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

export const RecipeContentLoader = ({loading}: { loading?: boolean }) => {
    return (<>{ loading ? <RecipeLoader/>: undefined }</>);
}
