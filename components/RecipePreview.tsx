import type { ComponentChildren } from "preact";
import { BakerPercentageResult, DISPLAYABLE_NUTRIENTS_TYPE_ARRAY, NutritionType, RecipeType } from "../lib/types.ts";
import { t } from "../lib/i18n.ts";
import { computeSummaryWeights } from "../lib/summary-weights.ts";

const fmt = (n: number) => Math.round(n);
const fmtPct = (n: number) => n == 100 ? 100 : n.toFixed(2);
const fmtRnd100 = (n: number) =>  Math.round(n * 100) / 100;
const fmtG = (n: number) => { const r = Math.round(n * 10) / 10; return r === Math.floor(r) ? `${r}` : r.toFixed(1); };
const resolveName = (name: string | Record<string, string> | undefined, lang: string): string | null => {
  if (!name) return null;
  if (typeof name === "string") return t(name) !== name ? t(name) : name;
  const key = lang === "ee" ? "et" : "en";
  return name[key] ?? name["et"] ?? name["en"] ?? null;
};

type Props = {
  bp: BakerPercentageResult;
  recipe: RecipeType;
  lang: string;
  children?: ComponentChildren;
};

export default function RecipePreview({ bp, recipe, lang, children }: Props) {
  const { doughGrams, customGroups, totalGrams, showDough } = computeSummaryWeights(bp);
  const perPiece = recipe.amount > 1 ? totalGrams / recipe.amount : null;

  const items: string[] = [];
  if (showDough) items.push(`${t("ingredients.title.dough")}: ${fmtG(doughGrams)}g`);
  if (perPiece) items.push(`1/${recipe.amount} = ${fmtG(perPiece)}g`);
  customGroups.forEach((g) => items.push(`${resolveName(g.name, lang)}: ${fmtG(g.grams)}g`));
  items.push(`${t("totals.total")}: ${fmtG(totalGrams)}g`);

  const rows: Array<[string] | [string, string]> = [];
  for (let i = 0; i < items.length; i += 2) {
    rows.push(i + 1 < items.length ? [items[i], items[i + 1]] : [items[i]]);
  }

  return (
    <>
      <div class="px-4">
      {bp.ingredients.map((group, gi) => (
          <table key={gi} class={`table w-full ${gi < bp.ingredients.length - 1 ? 'mb-3' : ''}`}>
            {group.name && (
                <caption class="text-left text-xs font-semibold uppercase tracking-wide text-base-content/50 mb-1">
                  {resolveName(group.name, lang)}
              </caption>
            )}
            <tbody>
              {group.ingredientWithPercent.map((ing, ii) => (
                <tr key={ii}>
                  <td>{t(ing.name) !== ing.name ? t(ing.name) : ing.name}</td>
                  <td class="text-right tabular-nums">{fmtRnd100(ing.grams)}g</td>
                  <td class="text-right tabular-nums">{fmtPct(ing.percent)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
      ))}
      </div>

      {children}

      <div class="divider my-1" />
      <div class="px-4">
        <table class="table w-full">
          <tbody>
            <tr>
              <td class="print:text-xs">{t("ingredients.title.dry")}</td>
              <td class="text-right tabular-nums print:text-xs">{fmt(bp.microNutrients.dry_total)}g</td>
              <td class="text-right tabular-nums print:text-xs">100%</td>
            </tr>
            {(() => {
              const n = bp.microNutrients.nutrients[NutritionType.water];
              if (!n || n.grams < 0.1) return null;
              return (
                <tr>
                  <td class="print:text-xs">{t("ingredients.title.water")}</td>
                  <td class="text-right tabular-nums print:text-xs">{fmtG(n.grams)}g</td>
                  <td class="text-right tabular-nums print:text-xs">{fmtPct(n.percent)}%</td>
                </tr>
              );
            })()}
          </tbody>
        </table>
      </div>

      <div class="divider my-1" />
      <div class="px-4">
        <table class="table w-full">
          <tbody>
            {DISPLAYABLE_NUTRIENTS_TYPE_ARRAY.filter((type) => type !== NutritionType.water).map((type) => {
              const n = bp.microNutrients.nutrients[type];
              if (!n || n.grams < 0.1) return null;
              return (
                <tr key={type}>
                  <td class="print:text-xs">{t(`ingredients.title.${type}`) || type}</td>
                  <td class="text-right tabular-nums print:text-xs">{fmtG(n.grams)}g</td>
                  <td class="text-right tabular-nums print:text-xs">{fmtPct(n.percent)}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div class="card-footer border-t border-base-300 print:border-base-200">
        <table class="table w-full">
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                {row.length === 2 ? (
                  <>
                    <td class="text-right border-r border-base-300 pr-2 w-1/2 tabular-nums">{row[0]}</td>
                    <td class="text-left pl-2 tabular-nums">{row[1]}</td>
                  </>
                ) : (
                  <td colspan={2} class="text-center tabular-nums">{row[0]}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
