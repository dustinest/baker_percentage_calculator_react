import { BakerPercentageAwareRecipe, DISPLAYABLE_NUTRIENTS_TYPE_ARRAY, nameForLang } from "../lib/types.ts";
import { t } from "../lib/i18n.ts";
import { copyRecipe, editingRecipe, language } from "../lib/state.ts";
import EditRecipeDialog from "./EditRecipeDialog.tsx";

const fmt = (n: number) => Math.round(n);
const fmtPct = (n: number) => n.toFixed(2);
const fmtG = (n: number) => { const r = Math.round(n * 10) / 10; return r === Math.floor(r) ? `${r}` : r.toFixed(1); };
const resolveName = (name: string | Record<string, string> | undefined, lang: string): string | null => {
  if (!name) return null;
  if (typeof name === "string") return t(name) !== name ? t(name) : name;
  const key = lang === "ee" ? "et" : "en";
  return name[key] ?? name["et"] ?? name["en"] ?? null;
};

const intervalStr = (iv: { from: number; until: number }) =>
  iv.from === iv.until ? `${iv.from}` : `${iv.from}–${iv.until}`;

type Props = { recipe: BakerPercentageAwareRecipe };

export default function RecipeCard({ recipe }: Props) {
  const bp = recipe.bakerPercentage;
  const isEditing = editingRecipe.value?.id === recipe.id;

  return (
    <div class="card card-bordered bg-base-100 shadow-sm print:break-inside-avoid print:break-after-page">
      <div class="card-body pb-2 pt-4">
        <div class="flex justify-between items-start">
          <div>
            <h2 class="card-title text-lg">{nameForLang(recipe.name, language.value)}</h2>
            {recipe.amount > 1 && (
              <p class="text-sm text-base-content/60">×{recipe.amount} portsjonit</p>
            )}
          </div>
          <div class="flex gap-1 print:hidden">
            <button
              class="btn btn-sm btn-outline"
              onClick={() => { editingRecipe.value = recipe; }}
            >
              {t("edit.edit")}
            </button>
            <button
              class="btn btn-sm btn-ghost"
              onClick={() => copyRecipe(recipe)}
            >
              {t("edit.copyOf")}
            </button>
          </div>
        </div>
      </div>

      {bp && bp.ingredients.map((group, gi) => (
        <div key={gi} class="px-4 pb-3">
          {group.name && (
            <p class="text-xs font-semibold uppercase tracking-wide text-base-content/50 mb-1">
              {resolveName(group.name, language.value)}
            </p>
          )}
          <table class="table table-xs w-full">
            <tbody>
              {group.ingredientWithPercent.map((ing, ii) => (
                <tr key={ii}>
                  <td>{t(ing.name) !== ing.name ? t(ing.name) : ing.name}</td>
                  <td class="text-right tabular-nums">{fmt(ing.grams)}</td>
                  <td class="text-right tabular-nums">{fmtPct(ing.percent)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {(recipe.bakingTime.length > 0 || recipe.innerTemperature) && (
        <div class="px-4 pb-3">
          <div class="divider my-1" />
          <div class="text-sm space-y-1 text-center">
            {recipe.bakingTime.map((bt, i) => (
              <p key={i}>
                {bt.label && <span class="font-semibold">{bt.label[language.value === "ee" ? "et" : "en"] ?? bt.label["et"] ?? bt.label["en"]}: </span>}
                {bt.steam ? t("baking_instructions.steam", {
                  minutes: intervalStr(bt.time),
                  temperature: intervalStr(bt.temperature),
                }) : t("baking_instructions.bake", {
                  minutes: intervalStr(bt.time),
                  temperature: intervalStr(bt.temperature),
                })}
              </p>
            ))}
            {recipe.innerTemperature && (
              <p>
                {t("baking_instructions.inner_temperature", {
                  temperature: intervalStr(recipe.innerTemperature),
                })}
              </p>
            )}
          </div>
        </div>
      )}

      {recipe.description && (
        <div class="px-4 pb-3">{recipe.description}</div>
      )}

      {bp && (() => {
        const groupTotals = bp.ingredients.map((g) => ({
          name: g.name,
          grams: g.ingredientWithPercent.reduce((s, i) => s + i.grams, 0),
        }));
        const totalGrams = groupTotals.reduce((s, g) => s + g.grams, 0);
        const displayGroups = groupTotals.filter(
          (g) => g.name !== "ingredients.title.sourdough_starter_dough",
        );
        const customGroups = displayGroups.filter(
          (g) => g.name && typeof g.name === "object",
        );
        const doughGrams = displayGroups
          .filter((g) => !g.name || typeof g.name === "string")
          .reduce((s, g) => s + g.grams, 0);
        const showDough = customGroups.length > 0;
        const perPiece = recipe.amount > 1 ? totalGrams / recipe.amount : null;

        return (
          <>
            <div class="px-4 pb-3">
              <div class="divider my-1 text-xs">{t("ingredients.title.baker_percentage")}</div>
              <table class="table table-xs w-full">
                <tbody>
                  <tr>
                    <td>{t("ingredients.title.dry")}</td>
                    <td class="text-right tabular-nums">{fmt(bp.microNutrients.dry_total)}g</td>
                    <td class="text-right tabular-nums">100%</td>
                  </tr>
                  {DISPLAYABLE_NUTRIENTS_TYPE_ARRAY.map((type) => {
                    const n = bp.microNutrients.nutrients[type];
                    if (!n || n.grams < 0.1) return null;
                    return (
                      <tr key={type}>
                        <td>{t(`ingredients.title.${type}`) || type}</td>
                        <td class="text-right tabular-nums">{fmt(n.grams)}g</td>
                        <td class="text-right tabular-nums">{fmtPct(n.percent)}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div class="card-footer">
              <table class="table table-xs w-full">
                <tbody>
                  {(() => {
                    const items: string[] = [];
                    if (showDough) items.push(`${t("ingredients.title.dough")}: ${fmtG(doughGrams)}g`);
                    if (perPiece) items.push(`1/${recipe.amount} = ${fmtG(perPiece)}g`);
                    customGroups.forEach((g) => items.push(`${resolveName(g.name, language.value)}: ${fmtG(g.grams)}g`));
                    items.push(`${t("totals.total")}: ${fmtG(totalGrams)}g`);

                    const rows: Array<[string] | [string, string]> = [];
                    for (let i = 0; i < items.length; i += 2) {
                      rows.push(i + 1 < items.length ? [items[i], items[i + 1]] : [items[i]]);
                    }

                    return rows.map((row, i) => (
                      <tr key={i} class={i === rows.length - 1 ? "font-semibold" : ""}>
                        {row.length === 2 ? (
                          <>
                            <td class="text-right border-r border-base-300 pr-2 w-1/2 tabular-nums">{row[0]}</td>
                            <td class="text-left pl-2 tabular-nums">{row[1]}</td>
                          </>
                        ) : (
                          <td colspan={2} class="text-center tabular-nums">{row[0]}</td>
                        )}
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
          </>
        );
      })()}

      {isEditing && <EditRecipeDialog recipe={recipe} />}
    </div>
  );
}
