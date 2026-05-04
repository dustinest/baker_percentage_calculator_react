import { bakerResults, selectedIds, allRecipes } from "../lib/state.ts";
import RecipeCard from "./RecipeCard.tsx";

export default function RecipeList() {
  const selected = allRecipes.value.filter((r) => selectedIds.value.has(r.id));

  if (selected.length === 0) {
    return (
      <div class="flex items-center justify-center h-64 text-base-content/40">
        <p>Vali vasakult retsept, mida kuvada</p>
      </div>
    );
  }

  return (
    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 items-start">
      {selected.map((recipe) => {
        const result = bakerResults.value.get(recipe.id);
        if (!result) return null;
        return <RecipeCard key={recipe.id} recipe={result} />;
      })}
    </div>
  );
}
