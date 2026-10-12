import { BakerPercentageAwareRecipe, intervalStr, nameForLang } from "../lib/types.ts";
import { t } from "../lib/i18n.ts";
import { copyRecipe, editingRecipe, language } from "../lib/state.ts";
import EditRecipeDialog from "./EditRecipeDialog.tsx";
import IconEdit from "../components/icons/IconEdit.tsx";
import IconCopyPlus from "../components/icons/IconCopyPlus.tsx";
import RecipePreview from "../components/RecipePreview.tsx";

type Props = { recipe: BakerPercentageAwareRecipe };

export default function RecipeCard({ recipe }: Props) {
  const bp = recipe.bakerPercentage;
  const isEditing = editingRecipe.value?.id === recipe.id;

  return (
    <article class="recipe-card card border border-base-300 bg-base-100 text-sm print:block print:border-0 print:bg-transparent print:max-w-[150mm] print:mx-auto">
      <div class="flex justify-between items-start gap-3 px-5 pt-5 print:pb-4">
        <div class="print:w-full print:text-center">
          <h2 class="font-display text-[1.375rem] leading-tight print:text-[22pt]">
            {nameForLang(recipe.name, language.value)}
            {recipe.amount > 1 && (
              <span class="hidden print:inline font-sans text-sm text-base-content/60 ml-1">×{recipe.amount} {t("recipe.servings")}</span>
            )}
          </h2>
          {recipe.amount > 1 && (
            <p class="text-sm text-base-content/60 mt-0.5 print:hidden">×{recipe.amount} {t("recipe.servings")}</p>
          )}
        </div>
        <div class="flex -mr-2 -mt-1 print:hidden">
          <button
            type="button"
            class="btn btn-sm btn-square btn-ghost text-base-content/60 hover:text-primary"
            title={t("edit.edit")}
            aria-label={t("edit.edit")}
            onClick={() => { editingRecipe.value = recipe; }}
          >
            <IconEdit />
          </button>
          <button
            type="button"
            class="btn btn-sm btn-square btn-ghost text-base-content/60 hover:text-primary"
            title={t("edit.copyOf")}
            aria-label={t("edit.copyOf")}
            onClick={() => copyRecipe(recipe)}
          >
            <IconCopyPlus />
          </button>
        </div>
      </div>

      {bp && (
        <RecipePreview bp={bp} recipe={recipe} lang={language.value}>
          {(recipe.bakingTime.length > 0 || recipe.innerTemperature) && (
            <ol class="mx-5 mt-4 px-4 py-3 space-y-1 rounded-field bg-base-200/70 print:bg-transparent print:px-0 print:text-[11pt]">
              {recipe.bakingTime.map((bt, i) => (
                <li key={i}>
                  {bt.label && <span class="font-semibold">{nameForLang(bt.label, language.value)}: </span>}
                  {bt.steam ? t("baking_instructions.steam", {
                    minutes: intervalStr(bt.time),
                    temperature: intervalStr(bt.temperature),
                  }) : t("baking_instructions.bake", {
                    minutes: intervalStr(bt.time),
                    temperature: intervalStr(bt.temperature),
                  })}
                </li>
              ))}
              {recipe.innerTemperature && (
                <li class="text-base-content/70">
                  {t("baking_instructions.inner_temperature", {
                    temperature: intervalStr(recipe.innerTemperature),
                  })}
                </li>
              )}
            </ol>
          )}
        </RecipePreview>
      )}

      {isEditing && <EditRecipeDialog recipe={recipe} />}
    </article>
  );
}
