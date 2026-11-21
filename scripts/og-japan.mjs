// Regenerates public/og-japan.png, the preview shown when the Japan field notes are shared.
// It uses the map exactly as the site draws it, so run it with the dev server up:
//   npm run dev   (in another terminal)
//   node scripts/og-japan.mjs [page URL]
import { readFileSync } from "node:fs";
import sharp from "sharp";

const url = process.argv[2] ?? "http://localhost:4321/avaneesh2001/activities/japan/";
const page = await (await fetch(url)).text();
const accent = "#8a3b4f"; // garnet, the Activities tab colour

// The map SVG with its styles inlined, so it renders outside the browser.
let css = readFileSync(new URL("../src/styles/japan.css", import.meta.url), "utf8");
css = css.slice(css.indexOf("/* Map ink"), css.indexOf("/* Stops */"))
  .replaceAll("var(--accent)", accent).replaceAll("var(--mono-font)", "Menlo, monospace").replaceAll("var(--ink)", "#26231f");
const svg = page.match(/<svg[^>]*class="japan-map-svg"[\s\S]*?<\/svg>/)?.[0];
if (!svg) throw new Error(`No map found at ${url}`);
const [, mapW, mapH] = svg.match(/viewBox="0 0 (\d+) (\d+)"/).map(Number);
const height = 540;
const width = Math.round((mapW / mapH) * height);
const map = await sharp(Buffer.from(
  svg.replace("<svg", `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}"`)
     .replace(/<title[\s\S]*?<\/title>/, `<style>${css}</style>`),
)).png().toBuffer();

const card = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#e7d8be"/>
  <rect x="40" y="35" width="1120" height="560" rx="10" fill="#fbf7ee" stroke="rgba(75,61,43,0.18)"/>
  <rect x="100" y="110" width="90" height="12" rx="6" fill="${accent}"/>
  <text x="100" y="175" font-family="Helvetica, Arial, sans-serif" font-size="22" font-weight="700" letter-spacing="4" fill="${accent}">FIELD NOTES · MAY 2018</text>
  <text x="96" y="275" font-family="Georgia, serif" font-size="74" font-weight="700" fill="#26231f">A week in Japan</text>
  <text x="100" y="345" font-family="Helvetica, Arial, sans-serif" font-size="30" fill="#26231f">SAKURA Science Exchange Program</text>
  <text x="100" y="393" font-family="Helvetica, Arial, sans-serif" font-size="26" fill="#6e6559">A Nobel laureate, ASIMO, a tunnel under Tokyo Bay,</text>
  <text x="100" y="429" font-family="Helvetica, Arial, sans-serif" font-size="26" fill="#6e6559">a steelworks and JAXA Tsukuba</text>
  <line x1="100" y1="480" x2="${1160 - width - 90}" y2="480" stroke="rgba(38,35,31,0.14)" stroke-width="2"/>
  <text x="100" y="525" font-family="Helvetica, Arial, sans-serif" font-size="24" fill="#6e6559">R Avaneesh · Portfolio</text>
</svg>`;

await sharp(Buffer.from(card))
  .composite([{ input: map, left: 1160 - width - 40, top: 45 }])
  .png({ compressionLevel: 9 })
  .toFile("public/og-japan.png");
console.log("Wrote public/og-japan.png");
