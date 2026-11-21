import { defineConfig } from "astro/config";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const assetsDir = fileURLToPath(new URL("./src/assets/", import.meta.url));
const mediaTypes = {
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp",
  ".gif": "image/gif", ".svg": "image/svg+xml", ".mp4": "video/mp4", ".webm": "video/webm",
};

// Dev server only: content files refer to images as "/images/x.jpg" (paths inside src/assets).
// The built site resolves those through Astro's image pipeline, but the local TinaCMS editor
// previews them as plain URLs, so serve the originals during `npm run dev` / `npm run cms`.
// A Vite plugin (rather than an Astro hook) so it runs before Astro's own request handling.
const serveAssetsForEditor = {
  name: "serve-assets-for-editor",
  apply: "serve",
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      // The editor lives at /avaneesh2001/admin/ and requests images relative to it.
      const path = decodeURIComponent((req.url ?? "").split("?")[0])
        .replace(/^\/avaneesh2001(?=\/)/, "")
        .replace(/^\/admin(?=\/)/, "");
      const type = mediaTypes[extname(path).toLowerCase()];
      const file = normalize(join(assetsDir, path));
      if (!type || !file.startsWith(assetsDir) || !existsSync(file) || !statSync(file).isFile()) return next();
      res.setHeader("Content-Type", type);
      createReadStream(file).pipe(res);
    });
  },
};

export default defineConfig({
  output: "static",
  trailingSlash: "always",
  site: "https://avaneesh2001.github.io/avaneesh2001/",
  base: "/avaneesh2001/",
  vite: { plugins: [serveAssetsForEditor] },
});
