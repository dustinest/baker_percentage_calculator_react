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
    <div class="card card-bordered bg-base-100 shadow-sm print:break-inside-avoid print:break-after-page print:border-0 print:shadow-none text-sm">
      <div class="card-body pb-2 pt-4 print:pb-6">
        <div class="flex justify-between items-start">
          <div class="print:w-full print:text-center">
            <h2 class="card-title text-lg print:justify-center">
              {nameForLang(recipe.name, language.value)}
              {recipe.amount > 1 && (
                <span class="hidden print:inline text-sm font-normal text-base-content/60 ml-1">×{recipe.amount} {t("recipe.servings")}</span>
              )}
            </h2>
            {recipe.amount > 1 && (
              <p class="text-sm text-base-content/60 print:hidden">×{recipe.amount} {t("recipe.servings")}</p>
            )}
          </div>
          <div class="join print:hidden">
            <button
              type="button"
              class="btn btn-sm btn-square"
              title={t("edit.edit")}
              aria-label={t("edit.edit")}
              onClick={() => { editingRecipe.value = recipe; }}
            >
              <IconEdit />
            </button>
            <button
              type="button"
              class="btn btn-sm btn-square"
              title={t("edit.copyOf")}
              aria-label={t("edit.copyOf")}
              onClick={() => copyRecipe(recipe)}
            >
              <IconCopyPlus />
            </button>
          </div>
        </div>
      </div>

      {bp && (
        <RecipePreview bp={bp} recipe={recipe} lang={language.value}>
          {(recipe.bakingTime.length > 0 || recipe.innerTemperature) && (
              <>
              <div class="divider my-1" />
            <div class="px-4">
              <div class="space-y-1 text-center">
                {recipe.bakingTime.map((bt, i) => (
                  <p key={i}>
                    {bt.label && <span class="font-semibold">{nameForLang(bt.label, language.value)}: </span>}
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
              </>
          )}

        </RecipePreview>
      )}

      {isEditing && <EditRecipeDialog recipe={recipe} />}
    </div>
  );
}
