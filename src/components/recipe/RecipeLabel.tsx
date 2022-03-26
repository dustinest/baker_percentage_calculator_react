import {Recipe} from "../../models/interfaces/Recipe";
import {TranslatedLabel} from "../common/TranslatedLabel";

type RecipeLabelProps = {
    recipe: Recipe;
};

export const RecipeLabel = ({recipe} : RecipeLabelProps) => {
    return (
        <label><TranslatedLabel label={recipe.getName()}/>{
            recipe.getAmount() > 0 ? ` x ${recipe.getAmount()}` : undefined
        }</label>
    )
}
