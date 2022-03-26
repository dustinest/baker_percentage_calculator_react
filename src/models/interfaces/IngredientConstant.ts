import {IngredientGramsType, IngredientType, NutrientPercentType} from "../types";
import {NutritionType} from "./NutritionType";
import {getIngredient, Ingredient} from "./Ingredient";

export interface PredefinedIngredientConstant {
    SALT: IngredientType,
    SUGAR: IngredientType,
    SUGAR_BROWN: IngredientType,
    WATER: IngredientType,
    BUTTER: IngredientType,
    OIL: IngredientType,
    MILK: IngredientType,
    EGG: IngredientType,

    CARDAMOM: IngredientType,
    CINNAMON: IngredientType,

    OLIVE_OIL: IngredientType,
    WHOLE_RYE_FLOUR: IngredientType,
    WHOLE_WHEAT_FLOUR: IngredientType,
    DURUM_WHEAT: IngredientType,

    WHOLE_RYE_MALT_FLOUR: IngredientType,
    WHEAT_405_FLOUR: IngredientType,
    WHEAT_550_FLOUR: IngredientType,
}
const createPredefined = (id: string, name: string, ...nutrients: (NutritionType | number)[]): IngredientType => {
    const _nutrients: NutrientPercentType[] = [];
    for (let i = 0; i < nutrients.length; i+=2) {
        _nutrients.push({
            type: nutrients[i] as NutritionType,
            percent: nutrients[i+1] as number
        } as NutrientPercentType);
    }

    return Object.freeze({
        id: id,
        name: name,
        nutrients: _nutrients
    } as IngredientType);
}


export const INGREDIENT_CONSTANT:PredefinedIngredientConstant = (() => {
    const result = {
        SALT: createPredefined("salt", "Sool", NutritionType.salt, 100),
        SUGAR: createPredefined("sugar", "Suhkur", NutritionType.sugar, 100),
        SUGAR_BROWN: createPredefined("sugar_brown", "Pruunsuhkur", NutritionType.sugar, 100),
        WATER: createPredefined("water", "Vesi", NutritionType.water, 100),
        BUTTER: createPredefined("butter_82", "Või (82%)", NutritionType.fat, 82, NutritionType.water, 18),
        OIL: createPredefined("oil", "Õli", NutritionType.fat, 82, NutritionType.fat, 100),
        MILK: createPredefined("milk_2_5", "Piim (2.8%)", NutritionType.fat, 2.5, NutritionType.water, 97.5),
        EGG: createPredefined("egg", "Muna", NutritionType.egg, 100),

        CARDAMOM: createPredefined("cardamom", "Kardemon", NutritionType.spice, 100),
        CINNAMON: createPredefined("cinnamon", "Kaneel", NutritionType.spice, 100),

        OLIVE_OIL: createPredefined("olive_oil", "Oliivõli", NutritionType.fat, 100),
        WHOLE_RYE_FLOUR: createPredefined("whole_grain_rye_flour", "Täistera rukkijahu", NutritionType.flour, 100, NutritionType.whole_grain, 100),
        WHOLE_WHEAT_FLOUR: createPredefined("whole_grain_wheat_flour", "Täistera nisujahu", NutritionType.flour, 100, NutritionType.whole_grain, 100),
        DURUM_WHEAT: createPredefined("durum_wheat_flour", "Durum jahu", NutritionType.flour, 100, NutritionType.whole_grain, 100),

        WHOLE_RYE_MALT_FLOUR: createPredefined("rye_malt_flour", "Rukkilinnase jahu", NutritionType.flour, 100, NutritionType.whole_grain, 100),
        WHEAT_405_FLOUR: createPredefined("wheat_flour_405", "Nisujahu 405", NutritionType.flour, 100),
        WHEAT_550_FLOUR: createPredefined("wheat_flour_550", "Nisujahu 550", NutritionType.flour, 100)
    } as PredefinedIngredientConstant;
    return Object.freeze(result);
})();

type PredefinedIngredientType = {[Property in keyof PredefinedIngredientConstant]: (grams: number) => Ingredient} & {DRY: (id: string, name: string, grams: number, nutrients?: {type: NutritionType, percent: number}[]) => IngredientGramsType};


// @ts-ignore
export const PREDEFINED_INGREDIENT: PredefinedIngredientType = {
    DRY: (id: string, name: string, grams: number, nutrients?: NutrientPercentType[]) => {
        const _nutrients: NutrientPercentType[] = [{type: NutritionType.dry, percent: 100}];
        return {
            id,
            name,
            grams,
            nutrients: nutrients !== undefined? [..._nutrients, ...nutrients] : _nutrients
        }
    }
};
// @ts-ignore
Object.keys(INGREDIENT_CONSTANT).forEach((key) => {
    // @ts-ignore
    PREDEFINED_INGREDIENT[key] = (grams: number) => {
        // @ts-ignore
        return getIngredient({...INGREDIENT_CONSTANT[key], ...{grams}});
    }
});
