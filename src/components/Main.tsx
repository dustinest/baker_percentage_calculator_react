import {useEffect, useState} from "react";
import {PREDEFINED_RECIPES} from "../data/PredefinedRecipes";
import {RecipeNavigation} from "./recipe/RecipeNavigation";
import {RecipeList} from "./recipe/RecipeList";
import {JsonRecipeType} from "../service/RecipeReader/types";
import {GramsAmountType} from "../models/types";
import {runLater} from "../service/RunLater";
import {CircularProgress} from "@mui/material";

const getDouble = (value: JsonRecipeType): JsonRecipeType => {
    return {
        ...value,
        ...{
            id: value.id,
            name: value.name,
            amount: value.amount ? value.amount * 2 : 2,
            ingredients: value.ingredients.map((e) => ({
                ...e,
                ...{ingredients: e.ingredients.map((i) => {
                        const jsonGrams = i as GramsAmountType;
                        if (jsonGrams.grams) {
                            return {
                                ...jsonGrams,
                                ...{grams: jsonGrams.grams * 2}
                            };
                        }
                        return i;
                    })}
            }))
        }
    } as JsonRecipeType;
};

const getRecipes = (): JsonRecipeType[] => {
    const result:JsonRecipeType[] = [];
    PREDEFINED_RECIPES.forEach((e) => {
        result.push(e);
        result.push(getDouble(e));
    });
    return result;
}

export const Main = () => {
    const [recipes, setRecipes] = useState<JsonRecipeType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const workOnRecipes = () => {
        try {
            setRecipes(getRecipes());
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    }

    useEffect(() => {
        setLoading(true);
        setRecipes([]);
        runLater(workOnRecipes).catch(e => {
            console.error(e);
            setLoading(false);
        })
    }, []);
    return (
        <>
            {
                recipes.length === 0 && loading ?
                    (<CircularProgress />) :
                    recipes.length === 0 ?
                        (<label>No recipes</label>) :
                        (
                            <>
                                <RecipeNavigation recipes={recipes}/>
                                <RecipeList recipes={recipes}/>
                            </>
                        )
            }
        </>
    )
}
