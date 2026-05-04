# Baker's Percentage Calculator

Converts any baking recipe to use a sourdough starter, based on baker's percentages.

Predefined recipes included. Custom recipes can be imported via JSON paste. All calculations run client-side; recipes can be shared via URL (`?r=` query param).

---

## Prerequisites

Install [Deno](https://deno.land/):

```bash
curl -fsSL https://deno.land/install.sh | sh
```

---

## Development

```bash
deno task dev
```

Open [http://localhost:8000](http://localhost:8000). The server watches `routes/` and `static/` for changes.

---

## Tests

```bash
deno task test
```

Runs pure calculation tests (resolution, sourdough split, baker%, weights) against fixture files in `tests/fixtures/`.

---

## Production build

```bash
deno task build
deno task start
```

`build` compiles islands and CSS into `_fresh/`. `start` serves the pre-built output.

---

## Deploy to Cloudflare Pages

1. Push the repo to GitHub.

2. In the [Cloudflare Pages dashboard](https://dash.cloudflare.com/), create a new project and connect the GitHub repo.

3. Set build configuration:
   - **Framework preset:** None
   - **Build command:** `deno run -A dev.ts build`
   - **Build output directory:** `_fresh`

4. Add an environment variable so Cloudflare installs Deno during the build:
   - `DENO_VERSION` → `2.x` (or the specific version you use)

5. Save and deploy. Cloudflare Pages runs the build command and serves the `_fresh/` output.

> **Note:** Fresh is a server-rendered framework. For full SSR support on Cloudflare, you may need [Cloudflare Workers](https://workers.cloudflare.com/) with a custom entry point instead of Pages. For a simpler alternative, [Deno Deploy](https://deno.com/deploy) natively supports Fresh apps with zero configuration.

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
