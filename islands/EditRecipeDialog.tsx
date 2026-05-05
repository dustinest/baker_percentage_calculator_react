import { useEffect } from "preact/hooks";
import { useSignal } from "@preact/signals";
import IconCopy from "../components/icons/IconCopy.tsx";
import IconCheck from "../components/icons/IconCheck.tsx";
import {
  BakerPercentageAwareRecipe,
  copyRecipeType,
  DRY_NUTRIENTS,
  nameForLang,
  NutritionType,
  RecipeType,
} from "../lib/types.ts";
import {
  addImportedRecipe,
  confirmNewRecipe,
  editingRecipe,
  language,
  recipeToJsonExport,
  updateRecipe,
} from "../lib/state.ts";
import { readJsonRecipe } from "../lib/resolution.ts";
import { getIngredientGrams, StandardIngredients, StandardIngredientKeys } from "../lib/ingredients.ts";
import { t } from "../lib/i18n.ts";
import { calculateSourDoughStarter, splitStarterAndDough } from "../lib/sourdough.ts";
import { recalculateBakerPercentage } from "../lib/baker-percent.ts";
import RecipePreview from "../components/RecipePreview.tsx";

const INGREDIENT_GROUPS: { labelKey: string; keys: (keyof StandardIngredientKeys)[] }[] = [
  { labelKey: "ingredients.title.dry",   keys: ["WHOLE_RYE_FLOUR", "WHOLE_RYE_MALT_FLOUR", "WHOLE_WHEAT_FLOUR", "DURUM_WHEAT", "WHEAT_405_FLOUR", "WHEAT_550_FLOUR", "BARLEY", "SEEDS"] },
  { labelKey: "ingredients.title.fat",   keys: ["BUTTER", "OIL", "OLIVE_OIL"] },
  { labelKey: "ingredients.title.liquid", keys: ["WATER", "MILK_25"] },
  { labelKey: "ingredients.title.other", keys: ["SALT", "SUGAR", "SUGAR_BROWN", "EGG", "CARDAMOM", "CINNAMON"] },
];

type Tab = "edit" | "json" | "import";

type Props = { recipe: BakerPercentageAwareRecipe };

export default function EditRecipeDialog({ recipe }: Props) {
  const activeTab = useSignal<Tab>("edit");
  const importText = useSignal("");
  const importError = useSignal("");
  const copied = useSignal(false);
  const draft = useSignal<RecipeType>(copyRecipeType(recipe));
  const customIngIds = useSignal<Set<string>>(new Set());

  const close = () => { editingRecipe.value = null; };
  const save = () => {
    if (!draft.value.id) {
      confirmNewRecipe(draft.value);
    } else {
      updateRecipe(draft.value);
    }
    close();
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const updateDraft = (fn: (c: RecipeType) => void) => {
    const copy = copyRecipeType(draft.value);
    fn(copy);
    draft.value = copy;
  };

  const setNameLang = (lang: string, value: string) => updateDraft((c) => {
    const cur: Record<string, string> = typeof c.name === "string" ? { et: c.name, en: c.name } : { ...(c.name as Record<string, string>) };
    cur[lang] = value;
    c.name = cur;
  });

  const setAmount = (v: number) => updateDraft((c) => { c.amount = v; });

  const setGrams = (gi: number, ii: number, v: number) => updateDraft((c) => {
    c.ingredients[gi].ingredients[ii].grams = v;
  });

  const setIngName = (gi: number, ii: number, v: string) => updateDraft((c) => {
    c.ingredients[gi].ingredients[ii].name = v;
  });

  const setGrpNameLang = (gi: number, lang: string, v: string) => updateDraft((c) => {
    const cur: Record<string, string> = typeof c.ingredients[gi].name === "object"
      ? { ...(c.ingredients[gi].name as Record<string, string>) }
      : { et: "", en: "" };
    cur[lang] = v;
    c.ingredients[gi].name = cur;
  });

  const addGroup = () => updateDraft((c) => {
    c.ingredients.push({ name: { et: "", en: "" }, ingredients: [], bakingTime: [], innerTemperature: null,  starter: false });
  });

  const addIng = (gi: number) => updateDraft((c) => {
    c.ingredients[gi].ingredients.push({
      id: `custom_${Date.now()}`,
      name: "",
      grams: 0,
      nutrients: [{ type: NutritionType.other, percent: 100 }],
      type: "other",
    });
  });

  const delGroup = (gi: number) => updateDraft((c) => {
    c.ingredients = c.ingredients.filter((_, i) => i !== gi);
  });

  const delIng = (gi: number, ii: number) => updateDraft((c) => {
    c.ingredients[gi].ingredients = c.ingredients[gi].ingredients.filter((_, i) => i !== ii);
  });

  const pickStandardIng = (gi: number, ii: number, key: string, currentGrams: number) => {
    const ing = getIngredientGrams(key, currentGrams || 0);
    if (!ing) return;
    updateDraft((c) => { c.ingredients[gi].ingredients[ii] = ing; });
  };

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

  const d = draft.value;
  const dryTotal = d.ingredients
    .flatMap((g) => g.ingredients)
    .reduce((sum, ing) => {
      const dp = ing.nutrients
        .filter((n) => DRY_NUTRIENTS.includes(n.type))
        .reduce((max, n) => Math.max(max, n.percent), 0);
      return sum + ing.grams * dp / 100;
    }, 0);

  const canSave = (() => {
    if (d.ingredients.length === 0) return false;
    const cal = calculateSourDoughStarter(d.ingredients[0]);
    const starterGrams = cal.starter.flour.fridge + cal.starter.liquid.fridge;
    return starterGrams >= 10;
  })();

  return (
    <dialog class="modal modal-open" onClick={(e) => e.target === e.currentTarget && close()}>
      <div class="modal-box max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        <div class="flex justify-between items-center mb-4 flex-none">
          <h3 class="font-bold text-lg">{nameForLang(d.name, language.value)}</h3>
          <button type="button" class="btn btn-sm btn-circle btn-ghost" onClick={close}>✕</button>
        </div>

        <div role="tablist" class="tabs tabs-bordered mb-4 flex-none">
          {(["edit", "json", "import"] as Tab[]).map((tab) => (
            <button
              type="button"
              key={tab}
              role="tab"
              class={`tab ${activeTab.value === tab ? "tab-active" : ""}`}
              onClick={() => { activeTab.value = tab; }}
            >
              {tab === "edit" ? t("edit.edit") : tab === "json" ? "JSON" : "Import"}
            </button>
          ))}
        </div>

        <div class="flex-1 overflow-y-auto">
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
                    value={typeof d.name === "object" ? (d.name["et"] ?? "") : d.name}
                    onInput={(e) => setNameLang("et", (e.target as HTMLInputElement).value)}
                  />
                </label>
                <label class="input input-bordered input-sm flex items-center gap-2">
                  <span>🇬🇧</span>
                  <input
                    type="text"
                    class="grow"
                    value={typeof d.name === "object" ? (d.name["en"] ?? "") : d.name}
                    onInput={(e) => setNameLang("en", (e.target as HTMLInputElement).value)}
                  />
                </label>
              </div>
            </div>

            <label class="input input-bordered input-sm flex items-center gap-2 w-fit">
              <span class="label-text text-base-content/60">{t("edit.amount.title")}</span>
              <input
                type="number"
                class="w-16 text-right"
                value={d.amount}
                min={1}
                onInput={(e) => setAmount(Number((e.target as HTMLInputElement).value))}
              />
            </label>

            {d.ingredients.map((group, gi) => {
              const isCustom = group.name !== undefined && typeof group.name === "object";
              const usedKeys = new Set(group.ingredients.map((i) => i.type).filter((t) => t && t !== "other"));
              const nameRecord = isCustom ? group.name as Record<string, string> : null;
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
                            onInput={(e) => setGrpNameLang(gi, "et", (e.target as HTMLInputElement).value)}
                          />
                        </label>
                        <label class="input input-bordered input-xs flex items-center gap-2">
                          <span>🇬🇧</span>
                          <input
                            type="text"
                            class="grow"
                            value={nameRecord!["en"] ?? ""}
                            onInput={(e) => setGrpNameLang(gi, "en", (e.target as HTMLInputElement).value)}
                          />
                        </label>
                      </div>
                      <button type="button" class="btn btn-xs btn-ghost text-error" onClick={() => delGroup(gi)}>
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
                        <th class="w-6" />
                      </tr>
                    </thead>
                    <tbody>
                      {group.ingredients.map((ing, ii) => (
                        <tr key={ii}>
                          <td>
                            {(() => {
                              const isStandard = ing.type && ing.type !== "other";
                              const isCustomText = !isStandard && (ing.name !== "" || customIngIds.value.has(ing.id));
                              if (isCustomText) {
                                return (
                                  <input
                                    class="input input-bordered input-xs w-full"
                                    value={ing.name}
                                    placeholder={t("edit.ingredients.ingredient")}
                                    onInput={(e) => setIngName(gi, ii, (e.target as HTMLInputElement).value)}
                                  />
                                );
                              }
                              return (
                                <select
                                  class="select select-bordered select-xs w-full"
                                  value={isStandard ? ing.type : ""}
                                  onChange={(e) => {
                                    const key = (e.target as HTMLSelectElement).value;
                                    if (key === "CUSTOM") {
                                      customIngIds.value = new Set([...customIngIds.value, ing.id]);
                                    } else if (key) {
                                      pickStandardIng(gi, ii, key, ing.grams);
                                    }
                                  }}
                                >
                                  <option value="" disabled>{t("edit.ingredients.choose")}</option>
                                  {INGREDIENT_GROUPS.map((grp) => {
                                    const available = grp.keys.filter((k) => !usedKeys.has(k) || k === ing.type);
                                    if (available.length === 0) return null;
                                    return (
                                      <optgroup key={grp.labelKey} label={t(grp.labelKey)}>
                                        {available.map((key) => (
                                          <option key={key} value={key}>
                                            {t(StandardIngredients[key].name)}
                                          </option>
                                        ))}
                                      </optgroup>
                                    );
                                  })}
                                  <option value="CUSTOM">— {t("edit.ingredients.custom")} —</option>
                                </select>
                              );
                            })()}
                          </td>
                          <td>
                            <input
                              type="number"
                              class="input input-bordered input-xs w-full text-right"
                              value={ing.grams}
                              min={0}
                              step={0.5}
                              onInput={(e) => setGrams(gi, ii, Number((e.target as HTMLInputElement).value))}
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
                                  setGrams(gi, ii, Math.round(pct * dryTotal / 100 * 10) / 10);
                                }}
                              />
                            ) : (
                              <span class="text-base-content/30 text-xs flex justify-end">—</span>
                            )}
                          </td>
                          <td>
                            <button type="button" class="btn btn-xs btn-ghost text-error px-1" onClick={() => delIng(gi, ii)}>×</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <button type="button" class="btn btn-xs btn-ghost mt-2" onClick={() => addIng(gi)}>
                    + {t("edit.ingredients.add_ingredient")}
                  </button>
                </div>
              );
            })}

            <button type="button" class="btn btn-sm btn-ghost w-full" onClick={addGroup}>
              + {t("edit.ingredients.add")}
            </button>

            <div class="border border-base-300 rounded-lg overflow-hidden">
              {canSave
                ? <RecipePreview
                    bp={recalculateBakerPercentage(splitStarterAndDough(d.ingredients))}
                    recipe={d}
                    lang={language.value}
                  />
                : <p class="text-sm text-base-content/50 text-center py-4">{t("edit.preview_hint")}</p>
              }
            </div>
          </div>
        )}

        {activeTab.value === "json" && (() => {
          const json = JSON.stringify(recipeToJsonExport(d), null, 2);
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
                {copied.value ? <IconCheck class="h-4 w-4 text-success" /> : <IconCopy />}
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
            <button type="button" class="btn btn-primary btn-sm" onClick={handleImport}>
              Impordi
            </button>
          </div>
        )}
        </div>

        <div class="modal-action flex-none border-t border-base-300 mt-0 pt-3">
          {activeTab.value === "edit" ? (
            <>
              <button type="button" class="btn btn-ghost btn-sm" onClick={close}>{t("actions.cancel")}</button>
              <button type="button" class="btn btn-primary btn-sm" onClick={save} disabled={!canSave}>{t("actions.save")}</button>
            </>
          ) : (
            <button type="button" class="btn btn-ghost btn-sm" onClick={close}>{t("actions.cancel")}</button>
          )}
        </div>
      </div>
    </dialog>
  );
}
