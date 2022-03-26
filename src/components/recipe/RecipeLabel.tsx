import {Recipe} from "../../models/interfaces/Recipe";
import {useTranslation} from "../../service/TranslationService";
import {useEffect, useState} from "react";

type RecipeLabelProps = {
    recipe: Recipe;
};

export const RecipeLabel = ({recipe} : RecipeLabelProps) => {
    const translation = useTranslation(recipe.getName());
    const [label, setLabel] = useState<string | undefined>();
    useEffect(() => {
        if (!translation) return;
        if (recipe.getAmount() > 0) {
            setLabel(translation + " x " + recipe.getAmount());
        } else {
            setLabel(translation);
        }
    }, [recipe, translation])

    return (<>{label}</>)
}
