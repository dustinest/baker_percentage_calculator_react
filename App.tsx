import RecipeNavigation from "./islands/RecipeNavigation";
import RecipeList from "./islands/RecipeList";
import Toast from "./components/Toast";
import { compactMode } from "./lib/state.ts";
import { t } from "./lib/i18n.ts";

export default function App() {
  return (
    <div class={`bg-base-200 min-h-screen print:bg-white${compactMode.value ? " compact-mode" : ""}`}>
      <div class="drawer lg:drawer-open">
        <input id="nav-drawer" type="checkbox" class="drawer-toggle" />
        <div class="drawer-content flex flex-col">
          <div class="navbar gap-1 bg-base-200 border-b border-base-300 lg:hidden print:hidden">
            <label for="nav-drawer" class="btn btn-ghost drawer-button">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </label>
            <img src="/logo.svg" class="h-7 w-7" alt="" />
            <span class="font-display text-lg ml-1">{t("navigation.title")}</span>
          </div>
          <main class="p-4 lg:p-6">
            <RecipeList />
          </main>
        </div>
        <div class="drawer-side print:hidden">
          <label for="nav-drawer" class="drawer-overlay"></label>
          <RecipeNavigation />
        </div>
      </div>
      <Toast />
    </div>
  );
}
