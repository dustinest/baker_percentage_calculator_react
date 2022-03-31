import {RecipeType} from "../../models/types";
import {useEffect, useState} from "react";
import {recipeType2RecipeJson} from "../../service/RecipeReader";
import './RecipeJson.css';
import {GoogleMaterialSwitch} from "../common/GoogleMaterialIcon";
import {useTranslation} from "../../service/TranslationService";

const resolveRecipeJson = async (recipe: RecipeType): Promise<string> => {
    const result = await recipeType2RecipeJson(recipe);
    return JSON.stringify(result, null, 2)
};

export const RecipeJson = ({recipe}: {recipe: RecipeType}) => {
    const [recipeJson, setRecipeJson] = useState<string | undefined>();
    const [recipeJsonVisible, setRecepieJsonVisible] = useState<boolean>(false);
    const showJsonTranslation = useTranslation("Show json");
    const hideJsonTranslation = useTranslation("Hide json");

    useEffect(() => {
        if (recipeJsonVisible) {
            resolveRecipeJson(recipe).then(setRecipeJson).catch(console.error);
        } else {
            setRecipeJson(undefined);
        }
    }, [recipe, recipeJsonVisible])

    return (<section className="rawRecepie">
            <GoogleMaterialSwitch labelBefore={recipeJsonVisible ? hideJsonTranslation: showJsonTranslation} onChange={setRecepieJsonVisible} icons={{unchecked: "expand_more", checked: "expand_less"}} value={recipeJsonVisible}/>
            {recipeJson ? <pre>{recipeJson}</pre> : undefined }
        </section>)
}
