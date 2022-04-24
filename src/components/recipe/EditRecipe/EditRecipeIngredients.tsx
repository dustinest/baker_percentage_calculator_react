import {IngredientGramsType} from "../../../types";
import {
  InputAdornment,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableRow
} from "@mui/material";
import {useNumberInputValueTracking} from "../../../utils/UseValue";
import {EditRecipeStateActionTypes} from "../../../State";
import {Translation} from "../../../Translations";
import "./EditRecipeIngredients.css";
import {hasNoValue, hasValue} from "../../../utils/NullSafe";
import {ReactNode, useEffect, useState} from "react";
import {StandardIngredientMethodGrams,} from "../../../Constant/Ingredient";
import {AddButton} from "../../../Constant/Buttons";
import {HorizontalActionStack} from "../../common/CommonStack";
import {useEditRecipeContext} from "../../../service/RecipeEditService";
import {EditInputTimeoutNumber} from "./EditInputTimeoutNumber";
import {EditRecipeHydration} from "./EditRecipeHydration";

const EditRecipeIngredientTable = ({name, children}: {name: string, children: ReactNode;}) => {
  return (
    <TableRow>
      <TableCell><Translation label={name}/></TableCell>
      <TableCell>{children}</TableCell>
    </TableRow>
  )
}

type EditRecipeIngredientProps = {
  ingredientName: string;
  ingredientGrams: number;
  index: number;
  subIndex: number;
};
const EditRecipeIngredient = ({
                                ingredientName,
                                ingredientGrams,
                                index,
                                subIndex
                              }: EditRecipeIngredientProps) => {
  const editRecipeDispatch = useEditRecipeContext();
  const onSave = (value: number) => {
    editRecipeDispatch({
      type: EditRecipeStateActionTypes.SET_INGREDIENT_GRAM,
      index: {
        ingredients: index,
        ingredient: subIndex
      },
      grams: value
    });
  }
  const onDelete = () => {
    editRecipeDispatch({
      type: EditRecipeStateActionTypes.REMOVE_INGREDIENT,
      index: {
        ingredients: index,
        ingredient: subIndex
      },
    });
  }
  return (
    <EditRecipeIngredientTable name={ingredientName}>
      <EditInputTimeoutNumber  value={ingredientGrams} onSave={onSave} onDelete={onDelete} endAdornment="g"/>
    </EditRecipeIngredientTable>
  )
};

type EditRecipeIngredientsProps = {
  ingredients: IngredientGramsType[];
  index: number;
}
export const EditRecipeIngredients = ({ingredients, index}: EditRecipeIngredientsProps) => {
  return (
    <Table>
      <TableBody>

        {
          ingredients.map((ingredient, subIndex) => (
            <EditRecipeIngredient ingredientName={ingredient.name} ingredientGrams={ingredient.grams}
                                  index={index}
                                  subIndex={subIndex} key={`exising_${ingredient.id}`}/>
          ))
        }
        <EditRecipeHydration ingredients={ingredients} index={index}/>
      </TableBody>
    </Table>)
};

type EditRecipeRemainingIngredientsProps = {
  ingredients: IngredientGramsType[];
  index: number;
}
export const EditRecipeRemainingIngredients = ({ingredients, index}: EditRecipeRemainingIngredientsProps) => {
  const [selectedValue, setSelectedValue] = useState<string | null>( null);
  const [remaining, setRemaining] = useState<IngredientGramsType[]>( []);
  useEffect(() => {
    const existingValues: string[] = ingredients.map((e) => e.type as string).filter(hasValue);
    const values = StandardIngredientMethodGrams.filter((key) => !existingValues.includes(key.type as string));
    setRemaining(values);
    setSelectedValue(values.length > 0 ? values[0].type as string : null);
  }, [ingredients])

  const [grams, isSameGrams, setGrams, resetGrams] = useNumberInputValueTracking(0);
  const editRecipeDispatch = useEditRecipeContext();
  const addNewItem = () => {
    if (isSameGrams || grams <= 0 || hasNoValue(selectedValue)) {
      return;
    }
    editRecipeDispatch({
      type: EditRecipeStateActionTypes.SET_INGREDIENT_GRAM,
      index: index,
      item: selectedValue,
      grams
    });
    resetGrams(0);
  }

  return (
    <>
      { !selectedValue ? undefined :
        <HorizontalActionStack>
          <Select
            labelId="select-ingredients"
            value={selectedValue}
            onChange={(e: SelectChangeEvent) => setSelectedValue(e.target.value)}
          >
            {
              remaining.map(i => ({key: i.type as string, name: i.name})).map((ingredient) => (
                <MenuItem key={ingredient.key} value={ingredient.key}><Translation label={ingredient.name}/></MenuItem>
              ))
            }
          </Select>
          <OutlinedInput
            className="recipe-ingredient-amount"
            type="number"
            value={grams}
            onChange={setGrams}
            endAdornment={<InputAdornment position="end">g</InputAdornment>}
          />
          <AddButton onClick={addNewItem} disabled={isSameGrams || grams <= 0}/>
        </HorizontalActionStack>
      }
    </>
  )

}
