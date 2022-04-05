import {
  Card,
} from "@mui/material";
import "./RecipeItem.css";
import {RecipeType} from "../../types";
import {useContext, useState} from "react";
import {RecipesContext, StateActionTypes, UpdateRecipesAction} from "../../State";
import {RecipeItemDetails} from "./RecipeItemDetails/RecipeItemData";
import {RecipeEditDialog} from "./RecipeItemDetails/RecipeItemEdit";

type RecipeItemProps = {
  recipe: RecipeType;
}

export const RecipeItem = ({recipe}: RecipeItemProps) => {
  const [edit, setEdit] = useState<boolean>(false);

  const onCancel = () => setEdit(false);
  const onEdit = () => setEdit(true);

  const {recipesDispatch} = useContext(RecipesContext);
  const onSave = (recipe: RecipeType) => {
    setEdit(false);
    recipesDispatch({
      type: StateActionTypes.UPDATE_RECIPE,
      value: recipe
    } as UpdateRecipesAction);
  };

  return (
    <article id={recipe.id}>
      <RecipeEditDialog edit={edit} recipe={recipe} onSave={onSave} onCancel={onCancel}/>
      <Card
        sx={{maxWidth: 400, marginLeft: "auto", marginRight: "auto"}}
        variant="outlined" className="recipe">
        <RecipeItemDetails recipe={recipe} onEdit={onEdit}/>
      </Card>
    </article>)
};
