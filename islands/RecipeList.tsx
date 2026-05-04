import { allRecipes, bakerResults, editingRecipe, selectedIds } from "../lib/state.ts";
import RecipeCard from "./RecipeCard.tsx";
import EditRecipeDialog from "./EditRecipeDialog.tsx";

export default function RecipeList() {
  const newRecipeDraft = editingRecipe.value?.id === "" ? editingRecipe.value : null;
  const selected = allRecipes.value.filter((r) => selectedIds.value.has(r.id));

  return (
    <>
      {newRecipeDraft && <EditRecipeDialog recipe={{ ...newRecipeDraft, bakerPercentage: null }} />}
      {selected.length === 0 ? (
        <div class="flex items-center justify-center h-64 text-base-content/40">
          <p>Vali vasakult retsept, mida kuvada</p>
        </div>
      ) : (
        <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 items-start">
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
