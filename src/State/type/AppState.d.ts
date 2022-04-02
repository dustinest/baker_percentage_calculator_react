import {RecipeType} from "../../models";

export type SelectedRecipeType = {
    id: string,
    filter: boolean
};

export interface RecipesState {
    recipes: RecipeType[];
}

export interface SelectedRecipeState {
    selectedRecipe: SelectedRecipeType | null;
}
