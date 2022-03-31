import {RecipeType} from "../../models/types";
import {useEffect, useState} from "react";
import {TranslatedLabel} from "../common/TranslatedLabel";
import {recipeType2RecipeJson} from "../../service/RecipeReader";
import './RecipeJson.css';

const resolveRecipeJson = async (recipe: RecipeType): Promise<string> => {
    const result = await recipeType2RecipeJson(recipe);
    return JSON.stringify(result, null, 2)
};

export const RecipeJson = ({recipe}: {recipe: RecipeType}) => {
    const [recipeJson, setRecipeJson] = useState<string | undefined>();

    useEffect(() => {
        resolveRecipeJson(recipe).then(setRecipeJson).catch(console.error);
    }, [recipe])

    return (<>{recipeJson ? (
        <section className="rawRecepie">
            <h3><TranslatedLabel label="Json presentation"/></h3>
            <pre>{recipeJson}</pre>
        </section>) : undefined} </>)
}
