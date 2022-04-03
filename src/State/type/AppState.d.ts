import {RecipeType} from "../../models";

export interface RecipesState {
    recipes: RecipeType[];
}

export type SelectedRecipeState = {
    id: string | null,
    filter: boolean;
}

