import {NutritionType} from "../types/NutritionType";
import {INGREDIENT_CONSTANT, PREDEFINED_INGREDIENT} from "./IngredientConstant";

describe("INGREDIENT_CONSTANT are defined", () => {
    it ("Salt is OK", () => {
        expect(INGREDIENT_CONSTANT.SALT.id).toBe("salt");
        expect(INGREDIENT_CONSTANT.SALT.name).toBe("Sool");
        expect(INGREDIENT_CONSTANT.SALT.nutrients.length).toBe(1);
        // @ts-ignore
        expect(INGREDIENT_CONSTANT.SALT.nutrients[0].type).toBe(NutritionType.salt);
        // @ts-ignore
        expect(INGREDIENT_CONSTANT.SALT.nutrients[0].percent).toBe(100);
    });

    it ("butter_82 is OK", () => {
        expect(INGREDIENT_CONSTANT.BUTTER.id).toBe("butter_82");
        expect(INGREDIENT_CONSTANT.BUTTER.name).toBe("Või (82%)");
        expect(INGREDIENT_CONSTANT.BUTTER.nutrients.length).toBe(2);
        // @ts-ignore
        expect(INGREDIENT_CONSTANT.BUTTER.nutrients[0].type).toBe(NutritionType.fat);
        // @ts-ignore
        expect(INGREDIENT_CONSTANT.BUTTER.nutrients[0].percent).toBe(82);
        // @ts-ignore
        expect(INGREDIENT_CONSTANT.BUTTER.nutrients[1].type).toBe(NutritionType.water);
        // @ts-ignore
        expect(INGREDIENT_CONSTANT.BUTTER.nutrients[1].percent).toBe(18);
    });
});

describe("PREDEFINED_INGREDIENT are defined", () => {
    it ("Dry is OK", () => {
        const dry = PREDEFINED_INGREDIENT.DRY("dry one", "Dry name",112);
        expect(dry.id).toBe("dry one");
        expect(dry.name).toBe("Dry name");
        expect(dry.nutrients.length).toBe(1);
        expect(dry.nutrients[0].type).toBe(NutritionType.dry);
        expect(dry.nutrients[0].percent).toBe(100);
        expect(dry.grams).toBe(112);
    });

    it ("Custom Dry is OK", () => {
        const dry = PREDEFINED_INGREDIENT.DRY("dry one 1", "Dry name 1",112, [{type: NutritionType.fat, percent: 20}]);
        expect(dry.id).toBe("dry one 1");
        expect(dry.name).toBe("Dry name 1");
        expect(dry.nutrients.length).toBe(2);
        expect(dry.nutrients[0].type).toBe(NutritionType.dry);
        expect(dry.nutrients[0].percent).toBe(100);

        expect(dry.nutrients[1].type).toBe(NutritionType.fat);
        expect(dry.nutrients[1].percent).toBe(20);

        expect(dry.grams).toBe(112);
    });

    it ("Salt is OK", () => {
        const salt = PREDEFINED_INGREDIENT.SALT(123);
        expect(salt.getId()).toBe("salt");
        expect(salt.getName()).toBe("Sool");
        expect(salt.getNutrients().length).toBe(1);
        expect(salt.getNutrients()[0].getType()).toBe(NutritionType.salt);
        expect(salt.getNutrients()[0].getPercent()).toBe(100);
        expect(salt.getGrams()).toBe(123);
    });

    it ("butter_82 is OK", () => {
        const butter = PREDEFINED_INGREDIENT.BUTTER(321);
        expect(butter.getId()).toBe("butter_82");
        expect(butter.getName()).toBe("Või (82%)");
        expect(butter.getNutrients().length).toBe(2);
        expect(butter.getNutrients()[0].getType()).toBe(NutritionType.fat);
        expect(butter.getNutrients()[0].getPercent()).toBe(82);
        expect(butter.getNutrients()[1].getType()).toBe(NutritionType.water);
        expect(butter.getNutrients()[1].getPercent()).toBe(18);
        expect(butter.getGrams()).toBe(321);
    });
});
