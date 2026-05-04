import { BakerPercentageAwareRecipe, DISPLAYABLE_NUTRIENTS_TYPE_ARRAY } from "../lib/types.ts";
import { t } from "../lib/i18n.ts";
import { copyRecipe, editingRecipe } from "../lib/state.ts";
import EditRecipeDialog from "./EditRecipeDialog.tsx";

const fmt = (n: number) => Math.round(n);
const fmtPct = (n: number) => n.toFixed(2);

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
            <h2 class="card-title text-lg">{recipe.name}</h2>
            {recipe.amount > 1 && (
              <p class="text-sm text-base-content/60">×{recipe.amount} portsjonit</p>
            )}
            {recipe.description && (
              <p class="text-sm text-base-content/70 mt-1">{recipe.description}</p>
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
              {t(group.name) !== group.name ? t(group.name) : group.name}
            </p>
          )}
          <table class="table table-xs w-full">
            <thead>
              <tr>
                <th>{t("ingredients.title.baker_percentage")}</th>
                <th class="text-right">g</th>
                <th class="text-right">%</th>
              </tr>
            </thead>
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

      {bp && (
        <div class="px-4 pb-3">
          <div class="divider my-1 text-xs">Mikro</div>
          <div class="flex flex-wrap gap-2 text-xs">
            <span class="badge badge-outline">Kuiv {fmt(bp.microNutrients.dry_total)}g</span>
            {DISPLAYABLE_NUTRIENTS_TYPE_ARRAY.map((type) => {
              const n = bp.microNutrients.nutrients[type];
              if (!n || n.grams < 0.1) return null;
              return (
                <span key={type} class="badge badge-outline">
                  {t(`ingredients.title.${type}`) || type} {fmt(n.grams)}g ({fmtPct(n.percent)}%)
                </span>
              );
            })}
          </div>
        </div>
      )}

      {(recipe.bakingTime.length > 0 || recipe.innerTemperature) && (
        <div class="px-4 pb-4">
          <div class="divider my-1 text-xs">Küpsetamine</div>
          <div class="text-sm space-y-1">
            {recipe.bakingTime.map((bt, i) => (
              <p key={i}>
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
              <p class="text-base-content/70">
                {t("baking_instructions.inner_temperature", {
                  temperature: intervalStr(recipe.innerTemperature),
                })}
              </p>
            )}
          </div>
        </div>
      )}

      {isEditing && <EditRecipeDialog recipe={recipe} />}
    </div>
  );
}
