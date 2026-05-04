import RecipeNavigation from "../islands/RecipeNavigation.tsx";
import RecipeList from "../islands/RecipeList.tsx";
import Toast from "../components/Toast.tsx";

export default function Home() {
  return (
    <html lang="et">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Pagari protsendi kalkulaator</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body class="bg-base-100 min-h-screen">
        <div class="drawer lg:drawer-open">
          <input id="nav-drawer" type="checkbox" class="drawer-toggle" />
          <div class="drawer-content flex flex-col">
            <div class="navbar bg-base-200 lg:hidden print:hidden">
              <label for="nav-drawer" class="btn btn-ghost drawer-button">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </label>
              <span class="text-lg font-semibold">Pagari %</span>
            </div>
            <main class="p-4">
              <RecipeList />
            </main>
          </div>
          <div class="drawer-side print:hidden">
            <label for="nav-drawer" class="drawer-overlay"></label>
            <RecipeNavigation />
          </div>
        </div>
        <Toast />
      </body>
    </html>
  );
}
