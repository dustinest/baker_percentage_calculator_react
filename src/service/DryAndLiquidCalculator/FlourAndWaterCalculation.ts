import {NutritionType, NutrientPercentType} from "../../models";

export type FlourAndWaterPercent = {
    flour: number;
    water: number;
};

export const calculateFlourAndWaterPercent = (nutrients: NutrientPercentType[]): FlourAndWaterPercent => {
    const result = {
        flour: 0,
        water: 0
    } as FlourAndWaterPercent;
    nutrients.filter(e => e.type === NutritionType.flour || e.type === NutritionType.water).forEach((value) => {
       if (value.type === NutritionType.flour) {
           result.flour += value.percent;
       } else if (value.type === NutritionType.water) {
           result.water += value.percent;
       }
    });
    return result;
}
