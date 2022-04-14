import {
  Card, CardContent,
} from "@mui/material";
import "./RecipeItem.css";
import {RecipeType} from "../../../types";
import {RecipeItemDetails} from "./RecipeItemData";

type RecipeItemProps = {
  recipe: RecipeType;
  isPrintPreview: boolean;
}

export const RecipeItem = (props: RecipeItemProps) => {
  return (
      <Card
        sx={{maxWidth: 400, marginLeft: "auto", marginRight: "auto"}}
        variant="outlined" className="recipe">
        <CardContent><RecipeItemDetails {...props}/></CardContent>
      </Card>
    );
};
