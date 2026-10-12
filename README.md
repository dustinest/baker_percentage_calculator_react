# Sourdough Kitchen - a Baker's Percentage Calculator

Converts any baking recipe to use a sourdough starter, based on baker's percentages.

Predefined recipes included. Custom recipes can be imported via JSON paste. All calculations run client-side; recipes can be shared via URL (`?r=` query param).

---

## Prerequisites

Install [Node.js](https://nodejs.org/) 20+ and npm 10+.

---

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Environment variables

Copy the example file and adjust it:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `VITE_SITE_URL` | Public site origin, no trailing slash (e.g. `https://juuretis.foxjunior.com`). Vite inserts it into `index.html` at build time for the canonical URL and the Open Graph / Twitter share headers (`og:url`, `og:image`). |

`.env` is gitignored; `.env.example` is committed. Because the value is baked in at build time, it must be set wherever `npm run build` runs, see [Deploy](#deploy-to-cloudflare-pages).

---

## Tests

```bash
npm test
```

Runs pure calculation tests (resolution, sourdough split, baker%, weights) against fixture files in `tests/fixtures/`.

---

## Production build

```bash
npm run build
npm run preview
```

`build` compiles the app into `dist/`. `preview` serves the built output locally.

---

## Deploy to Cloudflare Pages

### Option A: Connect via Cloudflare dashboard (simplest)

1. Push to GitHub.
2. In [Cloudflare Pages](https://pages.cloudflare.com/), create a project linked to this repo.
3. Set: **Build command** = `npm run build`, **Build output directory** = `dist`.
4. Under **Settings → Variables and Secrets**, add `VITE_SITE_URL` (type *Text*) for the Production environment, then redeploy.
5. Every push to `master` deploys automatically.

### Option B: GitHub Actions with Wrangler

Set `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` as GitHub secrets, then replace `YOUR_PROJECT_NAME` in `.github/workflows/deploy.yml` with your Cloudflare Pages project name.

The build runs in GitHub Actions, not on Cloudflare, so add `VITE_SITE_URL` as a GitHub **variable** (Settings → Secrets and variables → Actions → *Variables* tab). The workflow passes it to `npm run build`. A variable set in the Cloudflare dashboard has no effect here.

---

## Recipe format

Recipes are defined as JSON. Flour amounts drive baker's percentages. Non-flour ingredients can be specified as grams or as a percentage of total flour.

Example — flour defined by grams, salt defined by percentage:

```json
{
  "name": "My bread",
  "ingredients": [{
    "ingredients": [
      { "type": "WHEAT_550_FLOUR", "grams": 500 },
      { "type": "WATER", "percent": 75 },
      { "type": "SALT", "percent": 2 }
    ]
  }]
}
```

Percentage-based flour also works, as long as the total percentage is below 100:

```json
{ "type": "RYE_FLOUR", "percent": 20 }
```

Paste this JSON into the **Import** tab of any recipe's edit dialog to add it.
