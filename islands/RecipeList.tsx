import { allRecipes, bakerResults, editingRecipe, selectedIds } from "../lib/state.ts";
import { t } from "../lib/i18n.ts";
import RecipeCard from "./RecipeCard.tsx";
import EditRecipeDialog from "./EditRecipeDialog.tsx";

export default function RecipeList() {
  const newRecipeDraft = editingRecipe.value?.id === "" ? editingRecipe.value : null;
  const selected = allRecipes.value.filter((r) => selectedIds.value.has(r.id));

  return (
    <>
      {newRecipeDraft && <EditRecipeDialog recipe={{ ...newRecipeDraft, bakerPercentage: null }} />}
      {selected.length === 0 ? (
        <div class="max-w-md mx-auto mt-16 lg:mt-28 px-2 text-center">
          <img src="/logo.svg" class="h-14 w-14 mx-auto mb-5" alt="" />
          <h1 class="font-display text-3xl leading-tight">{t("navigation.title")}</h1>
          <p class="mt-3 text-base text-base-content/80 text-balance">{t("navigation.tagline")}</p>
          <p class="mt-6 text-sm text-base-content/55">{t("messages.select_recipe")}</p>
        </div>
      ) : (
        <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 items-start print:block">
          {selected.map((recipe) => {
            const result = bakerResults.value.get(recipe.id);
            if (!result) return null;
            return <RecipeCard key={recipe.id} recipe={result} />;
          })}
        </div>
      )}
    </>
  );
}
