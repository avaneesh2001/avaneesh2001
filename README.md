# R Avaneesh — portfolio

Personal portfolio site built with [Astro](https://astro.build) and deployed to GitHub Pages at
<https://avaneesh2001.github.io/avaneesh2001/>.

## Editing content

All text lives in TOML files under `data/` — one per page (`home.toml`, `experience.toml`, …) plus
`site.toml` for the name, navigation and footer. Edit them by hand, or with the local editor:

```bash
npm run cms        # then open http://localhost:4321/avaneesh2001/admin/index.html
```

The editor (TinaCMS, local mode — no account needed) writes straight to `data/*.toml` and uploads
images into `src/assets/`. It only runs on your machine and is never deployed; commit and push the
changed files as usual. Saving rewrites the whole file, so comments in the TOML are dropped.

The site is laid out as a folder: each page in `site.toml`'s navigation is a numbered file with
its own tab, in the order listed. A link's `accent` sets its tab colour and that page's accent.

Skill labels must match real entries: experience as `Role · Company`, projects and activities by
title, education by institution name. The build stops with a clear error if one doesn't.

- **Internal links** are root-relative (`/projects/`, `/resume.pdf`). The `/avaneesh2001/` prefix is
  added automatically from `base` in `astro.config.mjs`.
- **Images and videos** go in `src/assets/` and are referenced relative to it
  (`images/gold_medal.JPG`, `projects/demo.mp4`). At build time Astro resizes images and converts
  them to WebP, so originals can be full size. Keep videos short and compressed.
- **Files served as-is** (resume PDF, favicon) go in `public/`.

## Commands

```bash
npm install        # once
npm run dev        # local dev server at http://localhost:4321/avaneesh2001/
npm run build      # static build into dist/
npm run preview    # serve the built site
npm run check      # type-check pages and content types
npm run cms        # local content editor (see above)
```

One-off generators (outputs are committed):

```bash
node scripts/og-image.mjs              # public/og-image.png, the site's link preview
node scripts/og-japan.mjs              # public/og-japan.png, the Japan page's preview (dev server must be running)
node scripts/japan-map.mjs <osm-dir>   # src/components/japan-map-geo.json from OpenStreetMap downloads (queries in the script)
```

## Deploying

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes `dist/`
to GitHub Pages.
