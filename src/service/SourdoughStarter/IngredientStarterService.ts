import {
    getSimpleRecipeIngredients,
    RecipeIngredients,
    IngredientGramsType,
    NutritionType
} from "../../models";
import {calculateStarter, StarterIngredients} from "./FirstIngredientCalculator";

const remapIngredient = (ingredient: IngredientGramsType, grams?: number): IngredientGramsType => {
    if (grams !== undefined) {
        return {...ingredient, ...{grams: grams}};
    }
    return {...ingredient};
}

const calculate = (container: IngredientGramsType[], starterIngredients: IngredientGramsType[], leftovers: IngredientGramsType[], dryAndLiquid: StarterIngredients) => {
    let counted = 0;
    container.forEach((ingredient) => {
        const remaining = dryAndLiquid.amount - counted;
        if (remaining <= 0) {
            leftovers.push(remapIngredient(ingredient));
        } else if (remaining <= ingredient.grams) {
            starterIngredients.push(remapIngredient(ingredient, remaining));
            counted += remaining;

            if (remaining < ingredient.grams) {
                leftovers.push(remapIngredient(ingredient, ingredient.grams - remaining - dryAndLiquid.fridge));
            }
        } else {
            starterIngredients.push(remapIngredient(ingredient, remaining));
            leftovers.push(remapIngredient(ingredient, ingredient.grams - remaining));
        }
    });
};

export const splitStarterAndDough = async (recipeName: string, recipeIngredients: RecipeIngredients[]): Promise<RecipeIngredients[]> => {
    const dryAndLiquid = await calculateStarter(recipeIngredients);
    if (dryAndLiquid === undefined) return [];

    const starterIngredients: IngredientGramsType[] = [
        {
            id: "starter_from_fridge",
            name: "Starter",
            grams: dryAndLiquid?.starter.flour.fridge + dryAndLiquid?.starter.liquid.fridge,
            nutrients: [{type: NutritionType.water, percent: 50}, {type: NutritionType.flour, percent: 50}]
        } as IngredientGramsType
    ];
    const leftovers: IngredientGramsType[] = [];

    calculate(dryAndLiquid.ingredients.dry, starterIngredients, leftovers, dryAndLiquid?.starter.flour);
    calculate(dryAndLiquid.ingredients.liquid, starterIngredients, leftovers, dryAndLiquid?.starter.liquid);

    const result: RecipeIngredients[] = [];
    recipeIngredients.forEach((ingredients, index) => {
        if (index > 0) {
            result.push(getSimpleRecipeIngredients(ingredients));
            return;
        }
        const nonStarter: IngredientGramsType[] = [...leftovers.filter(e => Math.floor(e.grams) > 0)];
        dryAndLiquid.ingredients.other.forEach((e) => {
            if (Math.floor(e.grams) > 0) nonStarter.push(remapIngredient(e));
        })
        if (dryAndLiquid.starter.flour.isFixed) { // check the pancakes
            const toAdd: IngredientGramsType[] = starterIngredients.filter((e) => !nonStarter.find(o => o.id === e.id));
            // @ts-ignore
            const _others: IngredientGramsType[] = ingredients.getIngredients().map((o) => {
                const _toAdd = toAdd.find(e => e.id === o.getId());
                if (_toAdd) {
                    //_toAdd.grams = o.grams;
                    return undefined;
                }
                const item = starterIngredients.find(e => e.id === o.getId());
                if (!item) return remapIngredient(o.toType());
                return remapIngredient(o.toType(), o.getGrams() - dryAndLiquid?.starter.flour.fridge);
            }).filter((o) => o !== undefined && o !== null);

            result.push(getSimpleRecipeIngredients({
                name: ingredients.getName() || "Dough",
                ingredients: _others.length > 0 ? [...toAdd, ..._others] : [...toAdd],
                bakingTime: [],
                innerTemperature: null,
                description: undefined
            }));
            return;
        }
        result.push(getSimpleRecipeIngredients({
            name: "Eeltaigen",
            ingredients: starterIngredients,
            bakingTime: [],
            innerTemperature: null,
            description: undefined
        }))
        result.push(getSimpleRecipeIngredients({
            name: ingredients.getName() || "Dough",
            ingredients: nonStarter,
            bakingTime: ingredients.getBakingTime().map(e => e.toType()),
            innerTemperature: ingredients.getInnerTemperature()?.toType() || null,
            description: ingredients.getDescription() || undefined
        }))
        return;
    });
    return result;
}
