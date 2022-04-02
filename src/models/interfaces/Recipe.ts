import {BakingTime} from "./BakingTime";
import {getSimpleRecipeIngredients, RecipeIngredients} from "./RecipeIngredients";
import {RecipeType} from "../types";
import {BakingTimeAware} from "./BakingTimeAware";
import {NumberInterval} from "./NumberInterval";
import {
    resolveBakingTimeAwareInnerTemperature,
    resolveBakingTimeAwareBakingTime,
    resolveBakingTimeAwareDescription, resolveBakingTimeAwareInnerTemperatureType
} from "./BakingTimeAwareHelper";

export interface Recipe extends BakingTimeAware {
    getId(): string;
    getName(): string;

    getAmount(): number;
    getIngredients(): RecipeIngredients[];
    toType(): RecipeType;
}

export class SimpleRecipe implements Recipe {
    private readonly id: string;
    private readonly name: string;
    private readonly bakingTime: BakingTime[]
    private readonly ingredients: RecipeIngredients[];
    private readonly description: string | null;
    private readonly amount: number;
    private readonly innerTemperature: NumberInterval | null;
    constructor(a: Recipe | RecipeType) {
        this.id = (a as Recipe).getId ? (a as Recipe).getId() : (a as RecipeType).id;
        this.name = (a as Recipe).getName ? (a as Recipe).getName() : (a as RecipeType).name;
        this.ingredients = ((a as Recipe).getIngredients ? (a as Recipe).getIngredients() : (a as RecipeType).ingredients).map(getSimpleRecipeIngredients);
        this.amount = (a as Recipe).getAmount ? (a as Recipe).getAmount() : (a as RecipeType).amount;
        this.bakingTime = resolveBakingTimeAwareBakingTime(a);
        this.description = resolveBakingTimeAwareDescription(a);
        this.innerTemperature = resolveBakingTimeAwareInnerTemperature(a);
    }

    getAmount(): number {
        return this.amount;
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

    getInnerTemperature(): NumberInterval | null {
        return this.innerTemperature;
    }

    toType(): RecipeType {
        return {
            id: this.getId(),
            name: this.getName(),
            description: this.description || undefined,
            amount: this.getAmount(),
            ingredients: this.getIngredients().map(e => e.toType()),
            bakingTime: this.getBakingTime().map(e => e.toType()),
            innerTemperature: resolveBakingTimeAwareInnerTemperatureType(this)
        }
    }

}

export const getRecipe = (recipe: RecipeType) => new SimpleRecipe(recipe);
