import { useSignal } from "@preact/signals";
import { useEffect, useRef } from "preact/hooks";
import Sortable from "sortablejs";
import { nameForLang, RecipeType } from "../lib/types.ts";
import {
  addNewRecipe,
  allRecipes,
  initUrlSync,
  language,
  selectAll,
  selectNone,
  selectedIds,
  toggleSelected,
} from "../lib/state.ts";
import { t } from "../lib/i18n.ts";

export default function RecipeNavigation() {
  useEffect(() => {
    initUrlSync();
  }, []);

  const showSort = useSignal(false);
  const sortDraft = useSignal<RecipeType[]>([]);
  const listRef = useRef<HTMLUListElement>(null);

  const openSort = () => {
    sortDraft.value = [...allRecipes.value];
    showSort.value = true;
  };

  const closeSort = () => { showSort.value = false; };

  const saveSort = () => {
    allRecipes.value = sortDraft.value;
    showSort.value = false;
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape" && showSort.value) closeSort(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (!showSort.value || !listRef.current) return;
    const sortable = new Sortable(listRef.current, {
      animation: 150,
      onEnd: (evt) => {
        const { oldIndex, newIndex } = evt;
        if (oldIndex === undefined || newIndex === undefined || oldIndex === newIndex) return;
        const next = [...sortDraft.value];
        const [moved] = next.splice(oldIndex, 1);
        next.splice(newIndex, 0, moved);
        sortDraft.value = next;
      },
    });
    return () => sortable.destroy();
  }, [showSort.value]);

  const allSelected = allRecipes.value.every((r) => selectedIds.value.has(r.id));
  const selectedCount = selectedIds.value.size;

  return (
    <>
      <ul class="menu bg-base-200 min-h-full w-64 p-4 gap-1">
        <li class="menu-title flex flex-row justify-between items-center">
          <img src="/logo.svg" class="h-8 w-8 flex-shrink-0" alt="" />
          <span class="text-lg font-bold">Pagari %</span>
          <div class="flex gap-1">
            <button
              type="button"
              class={`btn btn-xs ${language.value === "ee" ? "btn-primary" : "btn-ghost"}`}
              onClick={() => { language.value = "ee"; }}
            >
              🇪🇪
            </button>
            <button
              type="button"
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

        <div class="divider my-1" />

        <li>
          <button type="button" class="btn btn-sm btn-ghost w-full justify-start" onClick={addNewRecipe}>
            + {t("actions.add_recipe")}
          </button>
        </li>
        <li>
          <button type="button" class="btn btn-sm btn-ghost w-full justify-start" onClick={openSort}>
            ⇅ {t("actions.sort")}
          </button>
        </li>
        <li>
          <button type="button" class="btn btn-sm btn-ghost w-full justify-start" onClick={() => globalThis.print()}>
            🖨 {t("actions.print")}
          </button>
        </li>
      </ul>

      {showSort.value && (
        <dialog class="modal modal-open" onClick={(e) => e.target === e.currentTarget && closeSort()}>
          <div class="modal-box max-w-sm">
            <div class="flex justify-between items-center mb-4">
              <h3 class="font-bold text-lg">{t("actions.sort")}</h3>
              <button type="button" class="btn btn-sm btn-circle btn-ghost" onClick={closeSort}>✕</button>
            </div>
            <ul ref={listRef} class="space-y-1">
              {sortDraft.value.map((recipe) => (
                <li key={recipe.id} class="flex items-center gap-2 p-2 rounded bg-base-200 cursor-grab active:cursor-grabbing">
                  <span class="text-base-content/40 select-none">⠿</span>
                  <span class="flex-1 text-sm select-none">{nameForLang(recipe.name, language.value)}</span>
                </li>
              ))}
            </ul>
            <div class="modal-action">
              <button type="button" class="btn btn-ghost btn-sm" onClick={closeSort}>{t("actions.cancel")}</button>
              <button type="button" class="btn btn-primary btn-sm" onClick={saveSort}>{t("actions.save")}</button>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
}
