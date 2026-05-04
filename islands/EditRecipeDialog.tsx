import { useEffect } from "preact/hooks";
import { useSignal } from "@preact/signals";
import { BakerPercentageAwareRecipe, nameForLang, nameStr } from "../lib/types.ts";
import {
  addImportedRecipe,
  addIngredientGroup,
  addIngredientToGroup,
  editingRecipe,
  language,
  recipeToJsonExport,
  removeGroup,
  removeIngredient,
  setGroupName,
  setIngredientGrams,
  setIngredientName,
  setRecipeAmount,
  setRecipeNameForLang,
} from "../lib/state.ts";
import { readJsonRecipe } from "../lib/resolution.ts";
import { t } from "../lib/i18n.ts";


type Tab = "edit" | "json" | "import";

type Props = { recipe: BakerPercentageAwareRecipe };

export default function EditRecipeDialog({ recipe }: Props) {
  const activeTab = useSignal<Tab>("edit");
  const importText = useSignal("");
  const importError = useSignal("");
  const copied = useSignal(false);

  const close = () => { editingRecipe.value = null; };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const handleImport = () => {
    importError.value = "";
    try {
      const parsed = JSON.parse(importText.value);
      if (!parsed.name || !Array.isArray(parsed.ingredients)) {
        importError.value = "Vigane JSON formaat — name ja ingredients on kohustuslikud";
        return;
      }
      const resolved = readJsonRecipe(parsed);
      addImportedRecipe(resolved);
      close();
    } catch (e) {
      importError.value = `JSON viga: ${e instanceof Error ? e.message : String(e)}`;
    }
  };

  return (
    <dialog class="modal modal-open" onClick={(e) => e.target === e.currentTarget && close()}>
      <div class="modal-box max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-bold text-lg">{nameStr(recipe.name)}</h3>
          <button class="btn btn-sm btn-circle btn-ghost" onClick={close}>✕</button>
        </div>

        <div role="tablist" class="tabs tabs-bordered mb-4">
          {(["edit", "json", "import"] as Tab[]).map((tab) => (
            <button
              key={tab}
              role="tab"
              class={`tab ${activeTab.value === tab ? "tab-active" : ""}`}
              onClick={() => { activeTab.value = tab; }}
            >
              {tab === "edit" ? t("edit.edit") : tab === "json" ? "JSON" : "Import"}
            </button>
          ))}
        </div>

        {activeTab.value === "edit" && (
          <div class="space-y-4">
            <div class="form-control">
              <label class="label"><span class="label-text">{t("edit.name")}</span></label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-0">
              <label class="input input-bordered input-sm flex items-center gap-2">
                <span>🇪🇪</span>
                <input
                  type="text"
                  class="grow"
                  value={typeof recipe.name === "object" ? (recipe.name["et"] ?? "") : recipe.name}
                  onInput={(e) => setRecipeNameForLang(recipe.id, "et", (e.target as HTMLInputElement).value)}
                />
              </label>
              <label class="input input-bordered input-sm flex items-center gap-2">
                <span>🇬🇧</span>
                <input
                  type="text"
                  class="grow"
                  value={typeof recipe.name === "object" ? (recipe.name["en"] ?? "") : recipe.name}
                  onInput={(e) => setRecipeNameForLang(recipe.id, "en", (e.target as HTMLInputElement).value)}
                />
              </label>
            </div>
            </div>

            <div class="flex items-center gap-3">
              <span class="label-text">{t("edit.amount.title")}</span>
              <input
                type="number"
                class="input input-bordered input-sm w-24 text-right ml-auto"
                value={recipe.amount}
                min={1}
                onInput={(e) => setRecipeAmount(recipe.id, Number((e.target as HTMLInputElement).value))}
              />
            </div>

            {recipe.ingredients.map((group, gi) => {
              const isCustom = group.name !== undefined && typeof group.name === "object";
              const nameRecord = isCustom ? group.name as Record<string, string> : null;
              const dryTotal = recipe.bakerPercentage?.microNutrients.dry_total ?? 0;
              return (
                <div key={gi} class="border border-base-300 rounded-lg p-3">
                  {isCustom ? (
                    <div class="flex gap-2 items-start mb-2">
                      <div class="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <label class="input input-bordered input-xs flex items-center gap-2">
                          <span>🇪🇪</span>
                          <input
                            type="text"
                            class="grow"
                            value={nameRecord!["et"] ?? ""}
                            onInput={(e) => setGroupName(recipe.id, gi, "et", (e.target as HTMLInputElement).value)}
                          />
                        </label>
                        <label class="input input-bordered input-xs flex items-center gap-2">
                          <span>🇬🇧</span>
                          <input
                            type="text"
                            class="grow"
                            value={nameRecord!["en"] ?? ""}
                            onInput={(e) => setGroupName(recipe.id, gi, "en", (e.target as HTMLInputElement).value)}
                          />
                        </label>
                      </div>
                      <button type="button" class="btn btn-xs btn-ghost text-error" onClick={() => removeGroup(recipe.id, gi)}>
                        {t("edit.delete")}
                      </button>
                    </div>
                  ) : group.name && (
                    <p class="text-xs font-semibold uppercase text-base-content/50 mb-2">
                      {typeof group.name === "string" ? (t(group.name) || group.name) : nameForLang(group.name, language.value)}
                    </p>
                  )}

                  <table class="table table-xs w-full">
                    <thead>
                      <tr>
                        <th>{t("edit.ingredients.ingredient")}</th>
                        <th class="text-right w-20">g</th>
                        <th class="text-right w-20">{t("edit.ingredients.baker_percent")}</th>
                        {isCustom && <th class="w-6" />}
                      </tr>
                    </thead>
                    <tbody>
                      {group.ingredients.map((ing, ii) => (
                          <tr key={ii}>
                            <td>
                              {isCustom ? (
                                <input
                                  class="input input-bordered input-xs w-full"
                                  value={ing.name}
                                  placeholder={t("edit.ingredients.ingredient")}
                                  onInput={(e) => setIngredientName(recipe.id, gi, ii, (e.target as HTMLInputElement).value)}
                                />
                              ) : (
                                t(ing.name) !== ing.name ? t(ing.name) : ing.name
                              )}
                            </td>
                            <td>
                              <input
                                type="number"
                                class="input input-bordered input-xs w-full text-right"
                                value={ing.grams}
                                min={0}
                                step={0.5}
                                onInput={(e) => setIngredientGrams(recipe.id, gi, ii, Number((e.target as HTMLInputElement).value))}
                              />
                            </td>
                            <td>
                              {dryTotal > 0 ? (
                                <input
                                  type="number"
                                  class="input input-bordered input-xs w-full text-right"
                                  value={(ing.grams * 100 / dryTotal).toFixed(1)}
                                  min={0}
                                  step={0.1}
                                  onInput={(e) => {
                                    const pct = Number((e.target as HTMLInputElement).value);
                                    setIngredientGrams(recipe.id, gi, ii, Math.round(pct * dryTotal / 100 * 10) / 10);
                                  }}
                                />
                              ) : (
                                <span class="text-base-content/30 text-xs flex justify-end">—</span>
                              )}
                            </td>
                            {isCustom && (
                              <td>
                                <button type="button" class="btn btn-xs btn-ghost text-error px-1" onClick={() => removeIngredient(recipe.id, gi, ii)}>×</button>
                              </td>
                            )}
                          </tr>
                      ))}
                    </tbody>
                  </table>

                  {isCustom && (
                    <button type="button" class="btn btn-xs btn-ghost mt-2" onClick={() => addIngredientToGroup(recipe.id, gi)}>
                      + {t("edit.ingredients.add_ingredient")}
                    </button>
                  )}
                </div>
              );
            })}

            <button type="button" class="btn btn-sm btn-ghost w-full" onClick={() => addIngredientGroup(recipe.id)}>
              + {t("edit.ingredients.add")}
            </button>
          </div>
        )}

        {activeTab.value === "json" && (() => {
          const json = JSON.stringify(recipeToJsonExport(recipe), null, 2);
          const handleCopy = async () => {
            if (navigator.clipboard) {
              await navigator.clipboard.writeText(json);
            } else {
              const el = document.createElement("textarea");
              el.value = json;
              el.style.cssText = "position:fixed;opacity:0";
              document.body.appendChild(el);
              el.select();
              document.execCommand("copy");
              document.body.removeChild(el);
            }
            copied.value = true;
            setTimeout(() => { copied.value = false; }, 2000);
          };
          return (
            <div class="relative">
              <button
                type="button"
                class="absolute top-2 right-2 btn btn-xs btn-ghost opacity-60 hover:opacity-100"
                onClick={handleCopy}
                title="Copy to clipboard"
              >
                {copied.value ? (
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                )}
              </button>
              <pre class="text-xs overflow-auto max-h-96 bg-base-200 p-3 rounded">{json}</pre>
            </div>
          );
        })()}

        {activeTab.value === "import" && (
          <div class="space-y-3">
            <p class="text-sm text-base-content/70">
              Kleebi JSON retsept alla ja vajuta "Impordi".
            </p>
            <textarea
              class="textarea textarea-bordered w-full h-48 font-mono text-xs"
              placeholder='{ "name": "Minu retsept", "ingredients": [...] }'
              value={importText.value}
              onInput={(e) => { importText.value = (e.target as HTMLTextAreaElement).value; }}
            />
            {importError.value && (
              <div class="alert alert-error text-sm">
                <span>{importError.value}</span>
              </div>
            )}
            <button class="btn btn-primary btn-sm" onClick={handleImport}>
              Impordi
            </button>
          </div>
        )}

        <div class="modal-action">
          <button class="btn btn-ghost btn-sm" onClick={close}>Sulge</button>
        </div>
      </div>
    </dialog>
  );
}
