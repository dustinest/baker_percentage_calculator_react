import {RecipeType} from "../../models/types";
import {useEffect, useState} from "react";
import {recipeType2RecipeJson} from "../../service/RecipeReader";
import './RecipeJson.css';
import {useTranslation} from "../../service/TranslationService";
import {ToggleButton, ToggleButtonGroup} from "@mui/material";

const resolveRecipeJson = async (recipe: RecipeType): Promise<string> => {
    const result = await recipeType2RecipeJson(recipe);
    return JSON.stringify(result, null, 2)
};

export const RecipeJson = ({recipe}: {recipe: RecipeType}) => {
    const [recipeJson, setRecipeJson] = useState<string | undefined>();
    const icons = {
        show: useTranslation("Show JSON"),
        hide: useTranslation("Hide JSON")
    };

    const [json, setJson] = useState<string | null>(null);

    useEffect(() => {
        if (json === "JSON") {
            resolveRecipeJson(recipe).then(setRecipeJson).catch(console.error);
        } else {
            setRecipeJson(undefined);
        }
    }, [recipe, json])

    return (<section className="rawRecepie">
            <ToggleButtonGroup exclusive={true} size="small" value={json} onChange={(e, value) => setJson(value)}>
                <ToggleButton value="JSON">{json === "JSON" ? icons.hide: icons.show}</ToggleButton>
            </ToggleButtonGroup>
            {recipeJson ? <pre>{recipeJson}</pre> : undefined }
        </section>)
}
