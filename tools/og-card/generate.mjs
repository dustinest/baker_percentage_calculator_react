// Renders tools/og-card/template.html to public/og_card.png (1200×630) with a locally installed Chrome.
// Usage: npm run og-card   (set CHROME_PATH if Chrome is not found automatically)
import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const WIDTH = 1200;
const HEIGHT = 630;
const PORT = 9339;

const here = dirname(fileURLToPath(import.meta.url));
const template = join(here, "template.html");
const output = resolve(here, "../../public/og_card.png");

const chromePath = process.env.CHROME_PATH ?? [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].find(existsSync);

if (!chromePath) {
  console.error("Chrome not found. Set CHROME_PATH to your Chrome or Chromium executable.");
  process.exit(1);
}
if (typeof WebSocket === "undefined") {
  console.error("This script needs Node 22 or newer (global WebSocket).");
  process.exit(1);
}

const profile = mkdtempSync(join(tmpdir(), "og-card-"));
const chrome = spawn(chromePath, [
  "--headless=new",
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${profile}`,
  "--hide-scrollbars",
  "--allow-file-access-from-files",
  "about:blank",
], { stdio: "ignore" });

const cleanup = async () => {
  const exited = new Promise((r) => chrome.once("exit", r));
  chrome.kill();
  await exited;
  rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

try {
  let page;
  for (let i = 0; i < 50 && !page; i++) {
    try {
      const targets = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json();
      page = targets.find((t) => t.type === "page");
    } catch {
      // Chrome is still starting
    }
    if (!page) await sleep(200);
  }
  if (!page) throw new Error("Chrome did not start.");

  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((r, j) => { ws.addEventListener("open", r); ws.addEventListener("error", j); });
  let id = 0;
  const pending = new Map();
  ws.addEventListener("message", (m) => {
    const msg = JSON.parse(m.data);
    pending.get(msg.id)?.(msg);
    pending.delete(msg.id);
  });
  const send = (method, params = {}) => new Promise((r) => {
    pending.set(++id, r);
    ws.send(JSON.stringify({ id, method, params }));
  });

  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: WIDTH, height: HEIGHT, deviceScaleFactor: 1, mobile: false });
  await send("Page.navigate", { url: pathToFileURL(template).href });

  // Wait for the page, its fonts and the logo before capturing.
  const ready = await send("Runtime.evaluate", {
    awaitPromise: true,
    returnByValue: true,
    expression: `(async () => {
      while (document.readyState !== "complete") await new Promise((r) => setTimeout(r, 50));
      await document.fonts.ready;
      return {
        fonts: document.fonts.check('40px "Young Serif"') && document.fonts.check('28px "Libre Franklin"'),
        images: [...document.images].every((img) => img.complete && img.naturalWidth > 0),
      };
    })()`,
  });
  const state = ready.result?.result?.value;
  if (!state?.fonts) throw new Error("Fonts did not load. Check your internet connection (fonts come from Google Fonts).");
  if (!state?.images) throw new Error("An image in the template did not load. Check its path.");

  const shot = await send("Page.captureScreenshot", { format: "png", clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT, scale: 1 } });
  writeFileSync(output, Buffer.from(shot.result.data, "base64"));
  console.log(`Wrote ${output}`);
  ws.close();
} catch (e) {
  console.error(e instanceof Error ? e.message : e);
  process.exitCode = 1;
} finally {
  await cleanup();
}
