import {BakingTime, getBakingTime} from "./BakingTime";
import {getSimpleRecipeIngredients, RecipeIngredients} from "./RecipeIngredients";
import {RecipeType} from "../types";

export interface Recipe {
    getId(): string;
    getName(): string;

    getBakingTime(): BakingTime[]
    getIngredients(): RecipeIngredients[];
    getDescription(): string | null;
    toType(): RecipeType;
}

export class SimpleRecipe implements Recipe {
    private readonly id: string;
    private readonly name: string;
    private readonly bakingTime: BakingTime[]
    private readonly ingredients: RecipeIngredients[];
    private readonly description: string | null;
    constructor(a: Recipe | RecipeType) {
        this.id = (a as Recipe).getId ? (a as Recipe).getId() : (a as RecipeType).id;
        this.name = (a as Recipe).getName ? (a as Recipe).getName() : (a as RecipeType).name;
        this.bakingTime = ((a as Recipe).getBakingTime ? (a as Recipe).getBakingTime() : (a as RecipeType).bakingTime).map(getBakingTime);
        this.ingredients = ((a as Recipe).getIngredients ? (a as Recipe).getIngredients() : (a as RecipeType).ingredients).map(getSimpleRecipeIngredients);
        const description = ((a as Recipe).getDescription ? (a as Recipe).getDescription() : (a as RecipeType).description);
        this.description = description ? description : null;
    }

    getBakingTime(): BakingTime[] {
        return this.bakingTime;
    }

    getDescription(): string | null {
        return this.description;
    }

    getId(): string {
        return this.id;
    }

    getIngredients(): RecipeIngredients[] {
        return this.ingredients;
    }

    getName(): string {
        return this.name;
    }

    toType(): RecipeType {
        return {
            id: this.getId(),
            name: this.getName(),
            bakingTime: this.getBakingTime().map(e => e.toType()),
            ingredients: this.getIngredients().map(e => e.toType()),
            description: this.description || undefined
        }
    }

}

export const getRecipe = (recipe: RecipeType) => new SimpleRecipe(recipe);
