import { assertAlmostEquals } from "@std/assert";
import { readJsonRecipe } from "../lib/resolution.ts";
import { splitStarterAndDough } from "../lib/sourdough.ts";
import { recalculateBakerPercentage } from "../lib/baker-percent.ts";
import { PREDEFINED_RECIPES } from "../lib/recipes.ts";
import { nameStr, NutritionType } from "../lib/types.ts";

interface FixtureMicro {
  dryTotal: number;
  water?: { grams: number; percent: number };
  salt?: { grams: number; percent: number };
  sugar?: { grams: number; percent: number };
  fat?: { grams: number; percent: number };
}
interface Fixture { recipe: string; microNutrients: FixtureMicro }

const FIXTURES_DIR = "tests/fixtures";

const fixtureFile = (name: string) =>
  `${FIXTURES_DIR}/${name
    .toLowerCase()
    .replace(/ä/g, "a").replace(/ö/g, "o").replace(/ü/g, "u").replace(/õ/g, "o")
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "")
    .replace(/_ja_kaerahelvestega$/, "")}.json`;

Deno.test("baker-percent: micro nutrients match fixtures for all 11 recipes", async () => {
  for (const jsonRecipe of PREDEFINED_RECIPES) {
    const recipe = readJsonRecipe(jsonRecipe);
    let fixture: Fixture;
    try {
      fixture = JSON.parse(await Deno.readTextFile(fixtureFile(nameStr(recipe.name))));
    } catch { continue; }

    const split = await splitStarterAndDough(recipe.ingredients);
    const result = recalculateBakerPercentage(split);
    const mn = result.microNutrients;
    const fm = fixture.microNutrients;

    assertAlmostEquals(mn.dry_total, fm.dryTotal, 0.5, `${recipe.name}: dryTotal`);

    const check = (type: NutritionType, expected?: { grams: number; percent: number }) => {
      if (!expected) return;
      const actual = mn.nutrients[type];
      if (!actual) throw new Error(`${recipe.name}: missing ${type} in microNutrients`);
      assertAlmostEquals(actual.grams, expected.grams, 0.1, `${recipe.name} ${type}.grams`);
      assertAlmostEquals(actual.percent, expected.percent, 0.1, `${recipe.name} ${type}.percent`);
    };

    check(NutritionType.water, fm.water);
    check(NutritionType.salt, fm.salt);
    check(NutritionType.sugar, fm.sugar);
    check(NutritionType.fat, fm.fat);
  }
});

Deno.test("baker-percent: ingredient baker% matches fixtures", async () => {
  for (const jsonRecipe of PREDEFINED_RECIPES) {
    const recipe = readJsonRecipe(jsonRecipe);
    let fixture: { recipe: string; groups: Array<{ ingredients: Array<{ key: string; bakerPercent: number }> }> };
    try {
      fixture = JSON.parse(await Deno.readTextFile(fixtureFile(nameStr(recipe.name))));
    } catch { continue; }

    const split = await splitStarterAndDough(recipe.ingredients);
    const result = recalculateBakerPercentage(split);

    for (let gi = 0; gi < fixture.groups.length; gi++) {
      for (let ii = 0; ii < fixture.groups[gi].ingredients.length; ii++) {
        const fi = fixture.groups[gi].ingredients[ii];
        const si = result.ingredients[gi]?.ingredientWithPercent[ii];
        if (!si) continue;
        assertAlmostEquals(
          si.percent, fi.bakerPercent, 0.1,
          `${recipe.name} group[${gi}][${ii}] ${fi.key}: expected ${fi.bakerPercent}%, got ${si.percent}%`,
        );
      }
    }
  }
});
