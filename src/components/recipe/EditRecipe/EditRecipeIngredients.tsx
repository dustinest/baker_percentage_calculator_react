import {IngredientGramsType} from "../../../types";
import {
  Input,
  InputAdornment,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableRow
} from "@mui/material";
import {useBooleanInputValueChange} from "../../../utils/UseValue";
import {EditRecipeContext, EditRecipeStateActionTypes} from "../../../State";
import {Translation} from "../../../Translations";
import "./EditRecipeIngredients.css";
import {hasNoValue, hasValue} from "typescript-nullsafe";
import {ReactNode, Reducer, useContext, useEffect, useMemo, useReducer, useState} from "react";
import {StandardIngredientMethodGrams,} from "../../../Constant/Ingredient";
import {AddButton} from "../../../Constant/Buttons";
import {HorizontalActionStack} from "../../common/CommonStack";
import {EditInputTimeoutNumber} from "./EditInputTimeoutNumber";
import {EditRecipeHydration} from "./EditRecipeHydration";
import {getIngredientsHydration, RecipeHydration} from "../../../service/RecipeHydrationService";
import {PercentGlobalIcon, PercentIcon, WeightIcon} from "../../../Constant/Icons";

type EditMode = "weight" | "percent" | "global_percent" | null;

type EditRecipeIngredientRowProps = {
  name: string;
  children: ReactNode;
};

const EditRecipeIngredientRow = ({name, children}: EditRecipeIngredientRowProps) => {
  return (
    <TableRow>
      <TableCell>
        <Translation label={name}/>
      </TableCell>
      <TableCell>{children}</TableCell>
    </TableRow>
  )
}

type EditRecipeIngredientProps = {
  hydration: RecipeHydration;
  ingredientName: string;
  ingredientGrams: number;
  index: number;
  subIndex: number;
};

type ReducedState = {
  availableMode: EditMode[];
  mode: EditMode;
  endAdornment: "g" | "%";
  value: number;
  dry: number;
  valueToSave?: number;
}
type IngredientModeAction = {
  action: EditMode;
}
type IngredientSaveAction = {
  action: "save";
  value: number;
}
type ValueChangeAction = {
  action: "change";
  hydration: RecipeHydration;
  ingredientGrams: number;
}

const EditRecipeIngredient = ({
                                hydration,
                                ingredientName,
                                ingredientGrams,
                                index,
                                subIndex
                              }: EditRecipeIngredientProps) => {
  const [ingredientValue, setIngredientValue] = useReducer<Reducer<ReducedState, IngredientModeAction | IngredientSaveAction | ValueChangeAction>>(
    (state, action) => {
      if (action.action === "change") {
        return { mode: "weight", endAdornment: "g", value: action.ingredientGrams, dry: action.hydration.dry, availableMode: state.availableMode }
      }
      if (action.action === "weight") {
        return { mode: "weight", endAdornment: "g", value: ingredientGrams, dry: hydration.dry, availableMode: state.availableMode }
      } else if (action.action === "percent") {
        const newValue = Math.round(ingredientGrams * 10000 / hydration.dry) / 100;
        return  {mode: "percent", endAdornment: "%", value: newValue, dry: hydration.dry, availableMode: state.availableMode }
      }
      if (action.action === "save") {
        if (state.mode === "weight" || state.mode === null) {
          return {...state, ...{valueToSave: action.value}};
        } else {
          const weightValue = Math.round(state.dry * action.value) / 100;
          return {...state, ...{valueToSave: weightValue}};
        }
      }
      return state;
    },
    {
      availableMode: hydration.dry > 0 ? ["weight", "percent" /*, "global_percent"*/] : [], // global_percent is not implemented above
      mode: hydration.dry > 0 ? "weight" : null,
      endAdornment: "g",
      dry: hydration.dry,
      value: ingredientGrams
    }
  );

  useEffect(() => {
    setIngredientValue({action: "change", hydration, ingredientGrams} as ValueChangeAction);
  }, [ hydration, ingredientGrams, index, subIndex ])


  const {editRecipeDispatch} = useContext(EditRecipeContext);

  useEffect(() => {
    if (hasNoValue(ingredientValue.valueToSave)) return;
    editRecipeDispatch({
      type: EditRecipeStateActionTypes.SET_INGREDIENT_GRAM,
      index: {
        ingredients: index,
        ingredient: subIndex
      },
      grams: ingredientValue.valueToSave
    });
    setIngredientValue({action: "weight"} as IngredientModeAction);
  }, [ingredientValue, editRecipeDispatch, index, subIndex])

  const onDelete = () => {
    editRecipeDispatch({
      type: EditRecipeStateActionTypes.REMOVE_INGREDIENT,
      index: {
        ingredients: index,
        ingredient: subIndex
      },
    });
  }
  const menu = useMemo<ReactNode[]>(() => {
    return ingredientValue.availableMode.map((modeValue) =>
        (<MenuItem key={modeValue} onClick={() => setIngredientValue({action: modeValue} as IngredientModeAction)} disabled={modeValue === ingredientValue.mode}>
          <ListItemIcon>{
            modeValue === "weight" ? <WeightIcon fontSize="small"/>:
            modeValue === "percent" ? <PercentIcon fontSize="small"/>:
            modeValue === "global_percent" ? <PercentGlobalIcon fontSize="small"/>:
            undefined
          }</ListItemIcon>
          <ListItemText><Translation label={`edit.mode.${modeValue}`}/></ListItemText>
        </MenuItem>)
      );
  }, [ingredientValue.availableMode, ingredientValue.mode]);

  return (
    <EditRecipeIngredientRow name={ingredientName}>
      <>{
        ingredientValue.mode === 'weight' ?
          <EditInputTimeoutNumber  value={ingredientValue.value} onSave={(value) => setIngredientValue({action: "save", value})} onDelete={onDelete} endAdornment="g" additionalMenu={menu}/> :
       ingredientValue.mode === 'percent' ?
          <EditInputTimeoutNumber  value={ingredientValue.value} onSave={(value) => setIngredientValue({action: "save", value})} onDelete={onDelete} endAdornment="%" additionalMenu={menu}/> :
       ingredientValue.mode === 'global_percent' ?
          <EditInputTimeoutNumber  value={ingredientValue.value} onSave={(value) => setIngredientValue({action: "save", value})} onDelete={onDelete} endAdornment="%" additionalMenu={menu}/> :
       undefined
      }
      </>
    </EditRecipeIngredientRow>
  )
};

type EditRecipeIngredientsProps = {
  ingredients: IngredientGramsType[];
  index: number;
}
export const EditRecipeIngredients = ({ingredients, index}: EditRecipeIngredientsProps) => {
  const hydration = useMemo(() => getIngredientsHydration(ingredients), [ingredients]);
  return (
    <Table>
      <TableBody>

        {
          ingredients.map((ingredient, subIndex) => (
            <EditRecipeIngredient ingredientName={ingredient.name} ingredientGrams={ingredient.grams}
                                  hydration={hydration}
                                  index={index}
                                  subIndex={subIndex} key={`exising_${ingredient.id}`}/>
          ))
        }
        <EditRecipeHydration hydration={hydration} index={index}/>
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

  const [grams, actions, history] = useBooleanInputValueChange(0);
  const {editRecipeDispatch} = useContext(EditRecipeContext);
  const addNewItem = () => {
    if (history.equals || grams <= 0 || hasNoValue(selectedValue)) {
      return;
    }
    editRecipeDispatch({
      type: EditRecipeStateActionTypes.SET_INGREDIENT_GRAM,
      index: index,
      item: selectedValue,
      grams
    });
    actions.resetValue(0);
  }

  return (
    <>
      { !selectedValue ? undefined :
        <HorizontalActionStack spacing={0} justifyContent="center">
          <HorizontalActionStack spacing={2}>
          <Select
            variant="standard"
            value={selectedValue}
            onChange={(e: SelectChangeEvent) => setSelectedValue(e.target.value)}
          >
            {
              remaining.map(i => ({key: i.type as string, name: i.name})).map((ingredient) => (
                <MenuItem key={ingredient.key} value={ingredient.key}><Translation label={ingredient.name}/></MenuItem>
              ))
            }
          </Select>
          <Input
            className="recipe-ingredient-amount"
            type="number"
            value={grams}
            onChange={actions.setValue}
            endAdornment={<InputAdornment position="end">g</InputAdornment>}
          />
          </HorizontalActionStack>
          <AddButton onClick={addNewItem} disabled={history.equals || grams <= 0}/>
        </HorizontalActionStack>
      }
    </>
  )

}
