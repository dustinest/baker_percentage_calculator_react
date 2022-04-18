import {
  Card, CardContent,
} from "@mui/material";
import "./RecipeItem.css";
import {RecipeItemDetails} from "./RecipeItemData";
import {RecipeItemResult} from "./RecipeItemResult";

type RecipeItemProps = {
  recipe: RecipeItemResult;
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
