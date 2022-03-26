import {NutritionType} from "./NutritionType";
import {NutrientPercentType} from "../types";

export interface NutrientPercent {
    getType(): NutritionType;
    getPercent(): number;
    toType(): NutrientPercentType;
}

export class SimpleNutrientPercent implements NutrientPercent {
    private readonly type: NutritionType;
    private readonly percent: number;
    constructor(type: NutritionType, percent: number) {
        this.type = type;
        this.percent = percent;
    }

    getPercent(): number {
        return this.percent;
    }

    getType(): NutritionType {
        return this.type;
    }

    toType(): NutrientPercentType {
        return {
            type: this.getType(),
            percent: this.getPercent()
        }
    }
}

export const geNutrientPercent = (value : NutrientPercentType | NutrientPercent): NutrientPercent => {
    return new SimpleNutrientPercent(
        (value as NutrientPercent).getType ? (value as NutrientPercent).getType() : (value as NutrientPercentType).type,
        (value as NutrientPercent).getPercent ? (value as NutrientPercent).getPercent() : (value as NutrientPercentType).percent
    );
};
