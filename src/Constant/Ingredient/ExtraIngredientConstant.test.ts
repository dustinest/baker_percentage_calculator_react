import {NutritionType} from "../../types/NutritionType";
import {ExtraStandardIngredientMethods} from "./ExtraIngredientConstant";

describe("ExtraStandardIngredientMethods are defined", () => {
  it ("Dry is OK", () => {
    const dry = ExtraStandardIngredientMethods.DRY("dry one", "Dry name",112);
    expect(dry.id).toBe("dry one");
    expect(dry.name).toBe("Dry name");
    expect(dry.nutrients.length).toBe(1);
    expect(dry.nutrients[0].type).toBe(NutritionType.dry);
    expect(dry.nutrients[0].percent).toBe(100);
    expect(dry.grams).toBe(112);
  });

  it ("Custom Dry is OK", () => {
    const dry = ExtraStandardIngredientMethods.DRY("dry one 1", "Dry name 1",112, [{type: NutritionType.fat, percent: 20}]);
    expect(dry.id).toBe("dry one 1");
    expect(dry.name).toBe("Dry name 1");
    expect(dry.nutrients.length).toBe(2);
    expect(dry.nutrients[0].type).toBe(NutritionType.dry);
    expect(dry.nutrients[0].percent).toBe(100);

    expect(dry.nutrients[1].type).toBe(NutritionType.fat);
    expect(dry.nutrients[1].percent).toBe(20);

    expect(dry.grams).toBe(112);
  });
});
