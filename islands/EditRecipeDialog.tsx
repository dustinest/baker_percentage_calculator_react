import { useSignal } from "@preact/signals";
import { BakerPercentageAwareRecipe, nameStr } from "../lib/types.ts";
import {
  addImportedRecipe,
  editingRecipe,
  recipeToJsonExport,
  setIngredientGrams,
  setRecipeAmount,
  setRecipeName,
} from "../lib/state.ts";
import { readJsonRecipe } from "../lib/resolution.ts";
import { t } from "../lib/i18n.ts";

type Tab = "edit" | "json" | "import";

type Props = { recipe: BakerPercentageAwareRecipe };

export default function EditRecipeDialog({ recipe }: Props) {
  const activeTab = useSignal<Tab>("edit");
  const importText = useSignal("");
  const importError = useSignal("");

  const close = () => { editingRecipe.value = null; };

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
              <label class="label"><span class="label-text">Nimi</span></label>
              <input
                class="input input-bordered input-sm"
                value={nameStr(recipe.name)}
                onInput={(e) => setRecipeName(recipe.id, (e.target as HTMLInputElement).value)}
              />
            </div>
            <div class="form-control">
              <label class="label"><span class="label-text">{t("edit.amount.title")}</span></label>
              <input
                type="number"
                class="input input-bordered input-sm w-24"
                value={recipe.amount}
                min={1}
                onInput={(e) => setRecipeAmount(recipe.id, Number((e.target as HTMLInputElement).value))}
              />
            </div>

            {recipe.ingredients.map((group, gi) => (
              <div key={gi} class="border border-base-300 rounded-lg p-3">
                {group.name && (
                  <p class="text-xs font-semibold uppercase text-base-content/50 mb-2">
                    {t(group.name) || group.name}
                  </p>
                )}
                <table class="table table-xs w-full">
                  <thead>
                    <tr>
                      <th>Koostisosa</th>
                      <th class="text-right">Gramm</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.ingredients.map((ing, ii) => (
                      <tr key={ii}>
                        <td>{t(ing.name) !== ing.name ? t(ing.name) : ing.name}</td>
                        <td class="text-right">
                          <input
                            type="number"
                            class="input input-bordered input-xs w-20 text-right"
                            value={ing.grams}
                            min={0}
                            step={0.5}
                            onInput={(e) =>
                              setIngredientGrams(
                                recipe.id, gi, ii,
                                Number((e.target as HTMLInputElement).value),
                              )}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}

        {activeTab.value === "json" && (
          <div>
            <details class="collapse collapse-arrow border border-base-300">
              <summary class="collapse-title text-sm font-medium">
                Retsept JSON formaadis
              </summary>
              <div class="collapse-content">
                <pre class="text-xs overflow-auto max-h-96 bg-base-200 p-3 rounded">
                  {JSON.stringify(recipeToJsonExport(recipe), null, 2)}
                </pre>
              </div>
            </details>
          </div>
        )}

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
