import type { ComponentChildren } from "preact";
import { BakerPercentageResult, DISPLAYABLE_NUTRIENTS_TYPE_ARRAY, nameForLang, NutritionType, RecipeType } from "../lib/types.ts";
import { t } from "../lib/i18n.ts";
import { computeSummaryWeights } from "../lib/summary-weights.ts";
import { showPercent } from "../lib/state.ts";

const fmt = (n: number) => Math.round(n);
const fmtPct = (n: number) => n == 100 ? 100 : n.toFixed(2);
const fmtRnd100 = (n: number) =>  Math.round(n * 100) / 100;
const fmtG = (n: number) => { const r = Math.round(n * 10) / 10; return r === Math.floor(r) ? `${r}` : r.toFixed(1); };
const resolveName = (name: string | Record<string, string> | undefined, lang: string): string | null => {
  if (!name) return null;
  if (typeof name === "string") return t(name) !== name ? t(name) : name;
  return nameForLang(name, lang) || null;
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

  const tags: { label: string; grams: number }[] = [];
  if (showDough) tags.push({ label: t("ingredients.title.dough"), grams: doughGrams });
  if (perPiece) tags.push({ label: `1/${recipe.amount}`, grams: perPiece });
  customGroups.forEach((g) => tags.push({ label: resolveName(g.name, lang) ?? "", grams: g.grams }));

  return (
    <>
      <div class="px-5">
        <table class="recipe-table w-full text-[0.9375rem] print:text-[13pt]">
          {bp.ingredients.map((group, gi) => (
            <tbody key={gi}>
              {group.name && (
                <tr>
                  <td colspan={showPercent.value ? 3 : 2} class="border-b-0 pt-4 pb-1 text-sm font-semibold text-secondary print:text-[11pt]">
                    {resolveName(group.name, lang)}
                  </td>
                </tr>
              )}
              {group.ingredientWithPercent.map((ing, ii) => (
                <tr key={ii}>
                  <td>{t(ing.name) !== ing.name ? t(ing.name) : ing.name}</td>
                  <td class="text-right font-semibold whitespace-nowrap">{fmtRnd100(ing.grams)} g</td>
                  {showPercent.value && <td class="text-right text-base-content/55 w-20 pl-4 whitespace-nowrap">{fmtPct(ing.percent)}%</td>}
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>

      {children}

      <div class="px-5 pt-4 pb-3 print:text-[9pt]">
        <table class="recipe-table w-full text-base-content/75">
          <tbody>
            <tr>
              <td>{t("ingredients.title.dry")}</td>
              <td class="text-right whitespace-nowrap">{fmt(bp.microNutrients.dry_total)} g</td>
              <td class="text-right w-20 text-base-content/55">100%</td>
            </tr>
            {(() => {
              const n = bp.microNutrients.nutrients[NutritionType.water];
              if (!n || n.grams < 0.1) return null;
              return (
                <tr>
                  <td>{t("ingredients.title.water")}</td>
                  <td class="text-right whitespace-nowrap">{fmtG(n.grams)} g</td>
                  <td class="text-right w-20 text-base-content/55">{fmtPct(n.percent)}%</td>
                </tr>
              );
            })()}
          </tbody>
        </table>

        <ul class="flex flex-wrap gap-x-3 gap-y-0.5 mt-2 text-xs text-base-content/60">
          {DISPLAYABLE_NUTRIENTS_TYPE_ARRAY.filter((type) => type !== NutritionType.water).map((type) => {
            const n = bp.microNutrients.nutrients[type];
            if (!n || n.grams < 0.1) return null;
            return (
              <li key={type}>{t(`ingredients.title.${type}`) || type} {fmtG(n.grams)} g ({Math.round(n.percent)}%)</li>
            );
          })}
        </ul>
      </div>

      <dl class="flex flex-wrap gap-x-5 gap-y-1 px-5 py-3 border-t border-base-300 print:text-[9pt]">
        {tags.map((tag, i) => (
          <div key={i} class="flex gap-1.5">
            <dt class="text-base-content/60">{tag.label}</dt>
            <dd>{fmtG(tag.grams)} g</dd>
          </div>
        ))}
        <div class="flex gap-1.5 ml-auto">
          <dt class="text-base-content/60">{t("totals.total")}</dt>
          <dd class="font-semibold">{fmtG(totalGrams)} g</dd>
        </div>
      </dl>
    </>
  );
}
