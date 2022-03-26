import {NutrientPercent, geNutrientPercent} from "./NutrientPercent";
import {IngredientGramsType} from "../types";

export interface Ingredient {
    getId(): string;
    getName(): string;
    getNutrients(): NutrientPercent[];
    getGrams(): number;
    toType(): IngredientGramsType;
}

class SimpleIngredient implements Ingredient {
    private readonly id: string;
    private readonly name: string;
    private readonly nutrients: NutrientPercent[];
    private readonly grams: number;

    constructor(id: string, name: string, nutrients: NutrientPercent[], grams: number) {
        this.id = id;
        this.name = name;
        this.nutrients = nutrients;
        this.grams = grams;
    }

    toType(): IngredientGramsType {
        return {
            id: this.getId(),
            name: this.getName(),
            nutrients: this.getNutrients().map(e => e.toType()),
            grams: this.getGrams()
        }
    }

    getId(): string {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    getGrams(): number {
        return this.grams;
    }

    getNutrients(): NutrientPercent[] {
        return this.nutrients;
    }
}

export const getIngredient = (ingredient: Ingredient | IngredientGramsType) => {
    const duplicateNutrients: string[] = [];
    return new SimpleIngredient(
        (ingredient as IngredientGramsType).id !== undefined ? (ingredient as IngredientGramsType).id : (ingredient as Ingredient).getId(),
        (ingredient as IngredientGramsType).name !== undefined ? (ingredient as IngredientGramsType).name : (ingredient as Ingredient).getName(),
        ((ingredient as IngredientGramsType).nutrients !== undefined ? (ingredient as IngredientGramsType).nutrients : (ingredient as Ingredient).getNutrients())
            .map(e => geNutrientPercent(e))
            .map(e => {
                if (duplicateNutrients.includes(e.getType())) throw new Error("Duplicate nutrient (" + e.getType() + ") percent are not allowed!");
                duplicateNutrients.push(e.getType());
                return e;
            }),
        (ingredient as IngredientGramsType).grams !== undefined ? (ingredient as IngredientGramsType).grams : (ingredient as Ingredient).getGrams()
    );
}
