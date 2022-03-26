export enum NutritionType {
    flour = "flour",
    dry = "dry",
    water = "water",
    salt = "salt",
    sugar = "sugar",
    fat = "fat",
    spice = "spice",
    egg = "egg",
    other = "other",
    whole_grain = "whole_grain",
}

export const NUTRIENTS_TYPE_ARRAY = (Object.keys(NutritionType) as Array<keyof typeof NutritionType>).map(e => NutritionType[e]);
export const DISPLAYABLE_NUTRIENTS_TYPE_ARRAY = NUTRIENTS_TYPE_ARRAY.filter(e => e !== NutritionType.whole_grain);
export const DRY_NUTRIENTS = [
//    NutritionType.dry,
    NutritionType.flour
];

