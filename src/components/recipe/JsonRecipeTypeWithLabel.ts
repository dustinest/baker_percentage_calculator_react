import {JsonRecipeType} from "../../service/RecipeReader/types";

export type JsonRecipeTypeWithLabel = {
    id: string;
    label: string;
} & JsonRecipeType;
