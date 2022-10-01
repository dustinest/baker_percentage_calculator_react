import {JsonRecipe} from "../../service/PredefinedRecipeService";

export type JsonRecipeTypeWithLabel = {
    id: string;
    label: string;
} & JsonRecipe;
