# OG card generator

Technical tooling only. Nothing here is deployed; the site uses `public/og_card.png`.

- `template.html`: the 1200×630 share card as a web page. Edit texts, colours or layout here.
- `generate.mjs`: renders the template to `public/og_card.png`.

```bash
npm run og-card
```

Requirements: Node 22+, Google Chrome (or Chromium) installed, and an internet connection for Google Fonts.
If Chrome isn't found automatically, point to it: `CHROME_PATH=/path/to/chrome npm run og-card`.

To preview while editing, open `template.html` in a browser. The card is the 1200×630 area at the top left.

After deploying a new card, social platforms keep showing the old one until the URL is re-scraped
(e.g. Facebook Sharing Debugger, LinkedIn Post Inspector).
