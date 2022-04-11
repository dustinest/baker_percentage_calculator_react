import {RecipeIngredientsType, RecipeType} from "../../../types";
import {
  Grid,
  InputAdornment,
  OutlinedInput,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField
} from "@mui/material";
import {EditRecipeStateActionTypes, useEditRecipeContext} from "../../../State";
import {useTranslation} from "../../../Translations";
import {memo} from "react";
import {EditDoneButton} from "./EditDoneButton";
import {useNumberInputValueTracking, useStringInputValueTracking} from "../../../utils/UseValue";

type EditRecipeIngredientInnerProps = {
  ingredientName: string | null | undefined;
  ingredientGrams: number | null | undefined;
  index: number;
  subIndex: number;
}

const EditRecipeIngredientInner = ({
                                     ingredientName,
                                     ingredientGrams,
                                     index,
                                     subIndex
                                   }: EditRecipeIngredientInnerProps) => {
  //const [name, isSameName, setName, resetName] = useStringValueAndOriginal(ingredientName);
  const [name] = useStringInputValueTracking(ingredientName);
  const [grams, isSameGrams, setGrams, resetGrams] = useNumberInputValueTracking(ingredientGrams);

  //console.log("render", name);
  const editRecipeDispatch = useEditRecipeContext();
  const onGramsDone = () => {
    const gramsValue = grams;
    if (gramsValue <= 0) return;
    editRecipeDispatch({
      type: EditRecipeStateActionTypes.SET_INGREDIENT_GRAM,
      index: {
        ingredients: index,
        ingredient: subIndex
      },
      grams: gramsValue
    });
    resetGrams(grams);
  }
  return (
    <TableRow>
      <TableCell>{name}</TableCell>
      <TableCell>
        <OutlinedInput
          type="number"
          value={grams}
          onChange={setGrams}
          endAdornment={<InputAdornment position="end">g</InputAdornment>}
        />
        <EditDoneButton enabled={!isSameGrams && grams > 0} onChange={onGramsDone}/>
      </TableCell>
    </TableRow>
  )
};

const EditRecipeIngredients = ({ingredients, index}: { ingredients: RecipeIngredientsType; index: number; }) => {
  const translation = useTranslation();
  const [name, isSameName, setName, resetName] = useStringInputValueTracking(ingredients.name);
  const editRecipeDispatch = useEditRecipeContext();
  const onNameDone = () => {
    editRecipeDispatch({
      type: EditRecipeStateActionTypes.SET_INGREDIENTS_NAME,
      index: index,
      name: name
    });
    resetName(name);
  }
  return (
    <table className="ingredients-item-edit">
      <TableHead>
        <TableRow>
          <TableCell colSpan={2}>
            <TextField variant="standard" type="string"
                       value={name}
                       onChange={setName}
                       label={translation.translate("Ingredients title")}
            />
            <EditDoneButton enabled={!isSameName} onChange={onNameDone}/>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {
          ingredients.ingredients.map((ingredient, subIndex) => (
            <EditRecipeIngredientInner ingredientName={ingredient.name} ingredientGrams={ingredient.grams} index={index}
                                       subIndex={subIndex} key={ingredient.id}/>
          ))
        }
      </TableBody>
    </table>
  );
}

export const EditRecipeDialogIngredients = memo(({recipe}: { recipe: RecipeType }) => {
  //console.log("RENDER this fucker");
  return (
    <>
        <Grid container spacing={2} wrap="wrap" className="edit-recipe-ingredients">
          {
            recipe.ingredients.map((ingredients, index) => (
              <Grid item md key={index}>
                <EditRecipeIngredients ingredients={ingredients} index={index}/>
              </Grid>
            ))
          }
        </Grid>
    </>
  );
});
