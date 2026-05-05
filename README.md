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

## Deploy to Deno Deploy

1. Push the repo to GitHub.

2. Go to [dash.deno.com](https://dash.deno.com), create a new project, and link it to this GitHub repo. Note the project name.

3. In `.github/workflows/deploy.yml`, replace `YOUR_PROJECT_NAME` with your actual project name.

4. Push to `master`. The GitHub Actions workflow builds the app and deploys automatically via OIDC — no tokens to store.

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
