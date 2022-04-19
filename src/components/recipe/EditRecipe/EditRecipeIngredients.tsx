import {IngredientGramsType} from "../../../types";
import {
  InputAdornment, MenuItem,
  OutlinedInput, Select, SelectChangeEvent,
  Table, TableBody,
  TableCell,
  TableRow
} from "@mui/material";
import {useNumberInputValueTracking, useStringInputValueTracking} from "../../../utils/UseValue";
import {EditRecipeStateActionTypes, useEditRecipeContext} from "../../../State";
import {useValueTimeoutAsync} from "../../../utils/Async";
import {Translation} from "../../../Translations";
import "./EditRecipeIngredients.css";
import {hasNoValue, hasValue} from "../../../utils/NullSafe";
import {ReactNode, useEffect, useState} from "react";
import {
  StandardIngredientMethodGrams,
} from "../../../Constant/Ingredient";
import {AddButton, DeleteButton} from "../../../Constant/Buttons";
import {HorizontalActionStack} from "../../common/CommonStack";

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
  //const [name, isSameName, setName, resetName] = useStringValueAndOriginal(ingredientName);
  const [name] = useStringInputValueTracking(ingredientName);
  const [grams, isSameGrams, setGrams, resetGrams] = useNumberInputValueTracking(ingredientGrams);

  //console.log("render", name);
  const editRecipeDispatch = useEditRecipeContext();
  useValueTimeoutAsync(async () => {
    if (isSameGrams || grams <= 0) {
      return;
    }
    const gramsValue = grams;
    editRecipeDispatch({
      type: EditRecipeStateActionTypes.SET_INGREDIENT_GRAM,
      index: {
        ingredients: index,
        ingredient: subIndex
      },
      grams: gramsValue
    });
    resetGrams(gramsValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, grams)

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
    <EditRecipeIngredientTable name={name}>
      <HorizontalActionStack>
        <OutlinedInput
          className="recipe-ingredient-amount"
          type="number"
          value={grams}
          onChange={setGrams}
          endAdornment={<InputAdornment position="end">g</InputAdornment>}
        />
        <DeleteButton onClick={onDelete}/>
      </HorizontalActionStack>
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
