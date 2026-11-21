// Regenerates public/og-image.png, the preview image shown when the site is shared
// on LinkedIn, Slack, X, etc. Run with: node scripts/og-image.mjs
import sharp from "sharp";

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#e7d8be"/>
  <g transform="rotate(-3 600 315)"><rect x="110" y="70" width="980" height="500" rx="10" fill="#efe3cd"/></g>
  <rect x="90" y="55" width="1020" height="520" rx="10" fill="#fbf7ee" stroke="rgba(75,61,43,0.18)"/>
  <rect x="150" y="125" width="90" height="12" rx="6" fill="#285982"/>
  <text x="150" y="190" font-family="Helvetica, Arial, sans-serif" font-size="22" font-weight="700" letter-spacing="4" fill="#285982">PORTFOLIO DOSSIER</text>
  <text x="146" y="300" font-family="Georgia, serif" font-size="104" font-weight="700" fill="#26231f">R Avaneesh</text>
  <text x="150" y="370" font-family="Helvetica, Arial, sans-serif" font-size="36" fill="#26231f">Senior Engineer at Qualcomm</text>
  <text x="150" y="418" font-family="Helvetica, Arial, sans-serif" font-size="30" fill="#6e6559">Code intelligence · Backend systems · Applied AI</text>
  <line x1="150" y1="470" x2="1050" y2="470" stroke="rgba(38,35,31,0.14)" stroke-width="2"/>
  <text x="150" y="515" font-family="Helvetica, Arial, sans-serif" font-size="24" fill="#6e6559">avaneesh2001.github.io/avaneesh2001</text>
</svg>`;

await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile("public/og-image.png");
console.log("Wrote public/og-image.png");
