import {
  Card,
} from "@mui/material";
import "./RecipeItem.css";
import {RecipeType} from "../../../types";
import {RecipeItemDetails} from "./RecipeItemData";

type RecipeItemProps = {
  recipe: RecipeType;
}

export const RecipeItem = ({recipe}: RecipeItemProps) => {
  return (
      <Card
        sx={{maxWidth: 400, marginLeft: "auto", marginRight: "auto"}}
        variant="outlined" className="recipe">
        <RecipeItemDetails recipe={recipe}/>
      </Card>
    );
};
