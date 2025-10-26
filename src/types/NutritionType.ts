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
  ash = "ash"
}

export const DISPLAYABLE_NUTRIENTS_TYPE_ARRAY = [
  NutritionType.water,
  NutritionType.salt,
  NutritionType.sugar,
  NutritionType.fat,
  NutritionType.other
];

export const DRY_NUTRIENTS = [
  NutritionType.flour,
  NutritionType.dry
];

