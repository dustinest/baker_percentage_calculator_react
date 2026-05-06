import { useSignal } from "@preact/signals";
import { useEffect, useRef } from "preact/hooks";
import Sortable from "sortablejs";
import { nameForLang, RecipeType } from "../lib/types.ts";
import {
  addNewRecipe,
  allRecipes,
  compactMode,
  initUrlSync,
  language,
  selectAll,
  selectNone,
  selectedIds,
  showPercent,
  toggleSelected,
} from "../lib/state.ts";
import { t } from "../lib/i18n.ts";

export default function RecipeNavigation() {
  useEffect(() => {
    initUrlSync();
  }, []);

  const showSort = useSignal(false);
  const showView = useSignal(false);
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
      <div class="flex flex-col h-screen w-64 bg-base-200">

        <div class="flex-none flex items-center gap-2 px-4 py-3">
          <img src="/logo.svg" class="h-8 w-8 flex-shrink-0" alt="" />
          <span class="text-lg font-bold">{t("navigation.title")}</span>
        </div>

        <div class="flex-1 overflow-y-auto">
          <ul class="menu gap-1 px-4 pb-2">
            <li>
              <label class="cursor-pointer flex items-center gap-2">
                <input
                  type="checkbox"
                  class="checkbox checkbox-sm"
                  checked={allSelected}
                  onChange={() => allSelected ? selectNone() : selectAll()}
                />
                <span class="text-sm font-medium">
                  {selectedCount > 0 ? t("navigation.selected", { count: selectedCount }) : t("navigation.select_all")}
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
          </ul>
        </div>

        <div class={`overflow-hidden transition-all duration-200 ease-out ${showView.value ? "max-h-48" : "max-h-0"}`}>
          <div class="border-t border-base-300 px-4 py-3 flex flex-col gap-3">
            <div class="flex items-center justify-between">
              <button type="button" class="btn btn-sm btn-ghost px-0" onClick={openSort}>
                ⇅ {t("actions.sort")}
              </button>
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
            </div>
            <label class="cursor-pointer flex items-center gap-2">
              <input
                type="checkbox"
                class="checkbox checkbox-sm"
                checked={showPercent.value}
                onChange={() => { showPercent.value = !showPercent.value; }}
              />
              <span class="text-sm">{t("view.show_percent")}</span>
            </label>
            <label class="cursor-pointer flex items-center gap-2">
              <input
                type="checkbox"
                class="checkbox checkbox-sm"
                checked={compactMode.value}
                onChange={() => { compactMode.value = !compactMode.value; }}
              />
              <span class="text-sm">{t("view.compact")}</span>
            </label>
          </div>
        </div>

        <div class="flex-none flex items-center justify-between px-4 py-2 border-t border-base-300">
          <button type="button" class="btn btn-xs btn-ghost" onClick={() => globalThis.print()}>
            🖨 {t("actions.print")}
          </button>
          <button
            type="button"
            class={`btn btn-xs btn-ghost${showView.value ? " btn-active" : ""}`}
            title={t("view.title")}
            aria-label={t("view.title")}
            onClick={() => { showView.value = !showView.value; }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>

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
                  <svg width="12" height="16" viewBox="0 0 12 16" fill="currentColor" class="text-base-content/40 select-none flex-shrink-0" aria-hidden="true">
                    <circle cx="3" cy="3" r="1.5"/><circle cx="9" cy="3" r="1.5"/>
                    <circle cx="3" cy="8" r="1.5"/><circle cx="9" cy="8" r="1.5"/>
                    <circle cx="3" cy="13" r="1.5"/><circle cx="9" cy="13" r="1.5"/>
                  </svg>
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
