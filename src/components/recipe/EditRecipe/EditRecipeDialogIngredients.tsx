import {RecipeIngredientsType} from "../../../types";
import {
    InputAdornment,
    OutlinedInput,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField
} from "@mui/material";
import {EditRecipeStateActionTypes, useEditRecipeContext} from "../../../State";
import {TranslatedLabel, useTranslation} from "../../../Translations";
import {EditDoneButton} from "./EditDoneButton";
import {useNumberInputValueTracking, useStringInputValueTracking} from "../../../utils/UseValue";
import "./EditRecipeDialogIngredients.css";

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
            <TableCell><TranslatedLabel label={name}/></TableCell>
            <TableCell>
                <Stack direction="row">
                    <OutlinedInput
                        className="recipe-ingredient-amount"
                        type="number"
                        value={grams}
                        onChange={setGrams}
                        endAdornment={<InputAdornment position="end">g</InputAdornment>}
                    />
                    <EditDoneButton enabled={!isSameGrams && grams > 0} onChange={onGramsDone}/>
                </Stack>
            </TableCell>
        </TableRow>
    )
};

export const EditRecipeIngredients = ({ingredients, index}: { ingredients: RecipeIngredientsType; index: number; }) => {
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
        <Table className="ingredients-item-edit" size="small">
            <TableHead>
                <TableRow>
                    <TableCell colSpan={2}>
                        <Stack direction="row">
                            <TextField variant="standard" type="string"
                                       value={name}
                                       onChange={setName}
                                       label={translation.translate("edit.ingredients.title")}
                            />
                            <EditDoneButton enabled={!isSameName} onChange={onNameDone}/>
                        </Stack>
                    </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {
                    ingredients.ingredients.map((ingredient, subIndex) => (
                        <EditRecipeIngredientInner ingredientName={ingredient.name} ingredientGrams={ingredient.grams}
                                                   index={index}
                                                   subIndex={subIndex} key={ingredient.id}/>
                    ))
                }
            </TableBody>
        </Table>
    );
}
