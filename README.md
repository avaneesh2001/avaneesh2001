# Vellum Portfolio

A static, TOML-driven personal portfolio built with Astro. It is designed for GitHub Pages and keeps all editable content in the `data/` directory.

## Edit Content

Update the TOML files in `data/`:

- `site.toml`
- `home.toml`
- `experience.toml`
- `projects.toml`
- `skills.toml`
- `activities.toml`
- `achievements.toml`
- `education.toml`

## Commands

```bash
npm install
npm run dev
npm run build
```

The static site is generated into `dist/`.

## GitHub Pages

The included workflow in `.github/workflows/deploy.yml` builds the site and publishes `dist/` to GitHub Pages on pushes to `main`. In the repository settings, set Pages to use GitHub Actions.
