import {
  Card,
} from "@mui/material";
import "./RecipeItem.css";
import {RecipeType} from "../../types";
import {RecipeItemDetails} from "./RecipeItemDetails/RecipeItemData";

type RecipeItemProps = {
  recipe: RecipeType;
}

export const RecipeItem = ({recipe}: RecipeItemProps) => {
  return (
    <article id={recipe.id}>
      <Card
        sx={{maxWidth: 400, marginLeft: "auto", marginRight: "auto"}}
        variant="outlined" className="recipe">
        <RecipeItemDetails recipe={recipe}/>
      </Card>
    </article>)
};
