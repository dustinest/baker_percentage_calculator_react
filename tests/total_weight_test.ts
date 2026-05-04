import { assertAlmostEquals } from "@std/assert";
import { readJsonRecipe } from "../lib/resolution.ts";
import { splitStarterAndDough } from "../lib/sourdough.ts";
import { PREDEFINED_RECIPES } from "../lib/recipes.ts";

interface Fixture { recipe: string; totalWeight: { dough: number; others: number; total: number } }

const FIXTURES_DIR = "tests/fixtures";

const fixtureFile = (name: string) =>
  `${FIXTURES_DIR}/${name
    .toLowerCase()
    .replace(/ä/g, "a").replace(/ö/g, "o").replace(/ü/g, "u").replace(/õ/g, "o")
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "")
    .replace(/_ja_kaerahelvestega$/, "")}.json`;

Deno.test("total-weight: dough/others/total match fixtures", async () => {
  for (const jsonRecipe of PREDEFINED_RECIPES) {
    const recipe = readJsonRecipe(jsonRecipe);
    let fixture: Fixture;
    try {
      fixture = JSON.parse(await Deno.readTextFile(fixtureFile(recipe.name)));
    } catch { continue; }

    const split = await splitStarterAndDough(recipe.ingredients);

    // The split always produces 2 core groups (levain/starter + dough); groups[2+] are "others"
    // For starter:true recipes, the first group is the full starter group and the second is the dough.
    // Either way, dough = first 2 groups, others = the rest.
    const doughGroups = split.slice(0, 2);
    const otherGroups = split.slice(2);

    const sumGrams = (groups: typeof split) =>
      groups.flatMap((g) => g.ingredients).reduce((s, i) => s + i.grams, 0);

    const doughWeight = sumGrams(doughGroups);
    const othersWeight = sumGrams(otherGroups);
    const totalWeight = doughWeight + othersWeight;

    assertAlmostEquals(doughWeight, fixture.totalWeight.dough, 0.5, `${recipe.name}: dough weight`);
    assertAlmostEquals(othersWeight, fixture.totalWeight.others, 0.5, `${recipe.name}: others weight`);
    assertAlmostEquals(totalWeight, fixture.totalWeight.total, 0.5, `${recipe.name}: total weight`);
  }
});
