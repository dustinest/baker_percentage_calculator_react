import {Skeleton} from "@mui/material";

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
