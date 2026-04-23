import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const distDir = path.resolve("dist");
const basePath = "/avaneesh2001";
const supportedExtensions = new Set([".html", ".css", ".js"]);

const replacementPatterns = [
  { pattern: /(href=")\/(?!\/|avaneesh2001\/)/g, replacement: `$1${basePath}/` },
  { pattern: /(src=")\/(?!\/|avaneesh2001\/)/g, replacement: `$1${basePath}/` },
  { pattern: /(srcset=")\/(?!\/|avaneesh2001\/)/g, replacement: `$1${basePath}/` },
  { pattern: /(poster=")\/(?!\/|avaneesh2001\/)/g, replacement: `$1${basePath}/` },
  { pattern: /(content=")\/(?!\/|avaneesh2001\/)/g, replacement: `$1${basePath}/` },
  { pattern: /(url\(\s*['"]?)\/(?!\/|avaneesh2001\/)/g, replacement: `$1${basePath}/` },
];

function rewriteFile(filePath) {
  const extension = path.extname(filePath);
  if (!supportedExtensions.has(extension)) return;

  const original = readFileSync(filePath, "utf8");
  const updated = replacementPatterns.reduce(
    (content, { pattern, replacement }) => content.replace(pattern, replacement),
    original,
  );

  if (updated !== original) {
    writeFileSync(filePath, updated);
  }
}

function walk(currentPath) {
  const stats = statSync(currentPath);

  if (stats.isDirectory()) {
    for (const entry of readdirSync(currentPath)) {
      walk(path.join(currentPath, entry));
    }
    return;
  }

  rewriteFile(currentPath);
}

walk(distDir);
