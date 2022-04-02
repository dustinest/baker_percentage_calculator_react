import {getIngredient, Ingredient} from "./Ingredient";
import {BakingTime} from "./BakingTime";
import {BakingTimeAware} from "./BakingTimeAware";
import {
    resolveBakingTimeAwareInnerTemperature,
    resolveBakingTimeAwareBakingTime, resolveBakingTimeAwareDescription,
    resolveBakingTimeAwareInnerTemperatureType
} from "./BakingTimeAwareHelper";
import {RecipeIngredientsType} from "../types";
import {NumberInterval} from "./NumberInterval";

export interface RecipeIngredients extends BakingTimeAware {
    getName(): string | null;
    getIngredients(): Ingredient[];
    isStarter(): boolean; // to be included with starter. A corner case. Check pancakes
    toType(): RecipeIngredientsType;
}

class SimpleRecipeIngredients implements RecipeIngredients{
    private readonly name: string | null;
    private readonly ingredients: Ingredient[];
    private readonly bakingTime: BakingTime[]
    private readonly description: string | null;
    private readonly starter: boolean;
    private readonly innerTemperature: NumberInterval | null;
    constructor(value: RecipeIngredientsType | RecipeIngredients) {
        this.name = (value as RecipeIngredients).getName ? (value as RecipeIngredients).getName() || null : (value as RecipeIngredientsType).name || null;
        this.ingredients = ((value as RecipeIngredients).getIngredients ? (value as RecipeIngredients).getIngredients() : ((value as RecipeIngredientsType).ingredients)).map(getIngredient);

        this.bakingTime = resolveBakingTimeAwareBakingTime(value);
        this.description = resolveBakingTimeAwareDescription(value);
        this.innerTemperature = resolveBakingTimeAwareInnerTemperature(value);

        this.starter = ((value as RecipeIngredients).isStarter ? (value as RecipeIngredients).isStarter() : ((value as RecipeIngredientsType).starter)) === true;
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

    getInnerTemperature(): NumberInterval | null {
        return this.innerTemperature;
    }

    toType(): RecipeIngredientsType {
        return {
            name: this.getName() || undefined,
            ingredients: this.getIngredients().map(e => e.toType()),
            starter: this.isStarter(),
            description: this.getDescription() || undefined,
            bakingTime: this.getBakingTime().map(e => e.toType()),
            innerTemperature: resolveBakingTimeAwareInnerTemperatureType(this)
        };
    }
}

export const getSimpleRecipeIngredients = (value: RecipeIngredientsType | RecipeIngredients) => {
    return new SimpleRecipeIngredients(value);
};
