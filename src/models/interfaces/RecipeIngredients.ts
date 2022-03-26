import {getIngredient, Ingredient} from "./Ingredient";
import {BakingTime, getBakingTime} from "./BakingTime";
import {RecipeIngredientsType} from "../types";

export interface RecipeIngredients {
    getName(): string | null;
    getIngredients(): Ingredient[];
    getBakingTime(): BakingTime[];
    getDescription(): string | null;
    isStarter(): boolean; // to be included with starter. A corner case. Check pancakes
    toType(): RecipeIngredientsType;
}

class SimpleRecipeIngredients implements RecipeIngredients{
    private readonly name: string | null;
    private readonly ingredients: Ingredient[];
    private readonly bakingTime: BakingTime[]
    private readonly description: string | null;
    private readonly starter: boolean;
    constructor(name: string | undefined | null, ingredients: Ingredient[], bakingTime: BakingTime[], description?: string | null, starter?: boolean) {
        this.name = name || null;
        this.ingredients = ingredients;
        this.bakingTime = bakingTime;
        this.description = description ? description : null;
        this.starter = starter === true;
    }

    getBakingTime(): BakingTime[] {
        return this.bakingTime;
    }

    getDescription(): string | null {
        return this.description;
    }

    getIngredients(): Ingredient[] {
        return this.ingredients;
    }

    getName(): string | null {
        return this.name;
    }

    isStarter(): boolean {
        return this.starter;
    }

    toType(): RecipeIngredientsType {
        return {
            name: this.getName() || undefined,
            ingredients: this.getIngredients().map(e => e.toType()),
            bakingTime: this.getBakingTime().map(e => e.toType()),
            starter: this.isStarter(),
            description: this.getDescription() || undefined
        };
    }
}

export const getSimpleRecipeIngredients = (value: RecipeIngredientsType | RecipeIngredients) => {
    return new SimpleRecipeIngredients(
        (value as RecipeIngredients).getName ? (value as RecipeIngredients).getName() : ((value as RecipeIngredientsType).name),
        ((value as RecipeIngredients).getIngredients ? (value as RecipeIngredients).getIngredients() : ((value as RecipeIngredientsType).ingredients)).map(getIngredient),
        ((value as RecipeIngredients).getBakingTime ? (value as RecipeIngredients).getBakingTime() : ((value as RecipeIngredientsType).bakingTime)).map(getBakingTime),
        (value as RecipeIngredients).getDescription ? (value as RecipeIngredients).getDescription() : ((value as RecipeIngredientsType).description),
        (value as RecipeIngredients).isStarter ? (value as RecipeIngredients).isStarter() : ((value as RecipeIngredientsType).starter)
    );
};
