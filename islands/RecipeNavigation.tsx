import { useSignal } from "@preact/signals";
import { nameForLang } from "../lib/types.ts";
import {
  allRecipes,
  initUrlSync,
  language,
  selectAll,
  selectNone,
  selectedIds,
  toggleSelected,
} from "../lib/state.ts";
import { t } from "../lib/i18n.ts";
import { useEffect } from "preact/hooks";

export default function RecipeNavigation() {
  useEffect(() => {
    initUrlSync();
  }, []);

  const allSelected = allRecipes.value.every((r) => selectedIds.value.has(r.id));
  const selectedCount = selectedIds.value.size;

  return (
    <ul class="menu bg-base-200 min-h-full w-64 p-4 gap-1">
      <li class="menu-title flex flex-row justify-between items-center">
        <img src="/logo.svg" class="h-8 w-8 flex-shrink-0" alt="" />
        <span class="text-lg font-bold">Pagari %</span>
        <div class="flex gap-1">
          <button
            class={`btn btn-xs ${language.value === "ee" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => { language.value = "ee"; }}
          >
            🇪🇪
          </button>
          <button
            class={`btn btn-xs ${language.value === "gb" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => { language.value = "gb"; }}
          >
            🇬🇧
          </button>
        </div>
      </li>

      <li>
        <label class="cursor-pointer flex items-center gap-2">
          <input
            type="checkbox"
            class="checkbox checkbox-sm"
            checked={allSelected}
            onChange={() => allSelected ? selectNone() : selectAll()}
          />
          <span class="text-sm font-medium">
            {selectedCount > 0 ? `${selectedCount} valitud` : "Vali kõik"}
          </span>
        </label>
      </li>

      <div class="divider my-1" />

      {allRecipes.value.map((recipe) => (
        <li key={recipe.id}>
          <label class="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              class="checkbox checkbox-sm"
              checked={selectedIds.value.has(recipe.id)}
              onChange={() => toggleSelected(recipe.id)}
            />
            <span class="text-sm">
              {nameForLang(recipe.name, language.value)}
              {recipe.amount > 1 && <span class="text-xs text-base-content/60 ml-1">×{recipe.amount}</span>}
            </span>
          </label>
        </li>
      ))}
    </ul>
  );
}
