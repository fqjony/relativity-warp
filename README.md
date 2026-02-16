# Relativity Warp

Repo-centric automation playground and docs site.

## Quick start

```bash
npm install
npm run build
npm run preview
```

## Scripts

- `npm run build` - build tips JSON and spectrum docs into `docs/`.
- `npm run preview` - serve `docs/` locally.

## Doc model

Spectrum uses one content type: `doc`.

Frontmatter contract for `src/docs/*.md`:

- `title`
- `description`
- `status` (`published` or `draft`)
- `date` (optional)
- `labels` (comma-separated, optional)

Publishing behavior:

- `status: published` is rendered to HTML and marked as published in UI.
- `status: draft` is rendered to HTML and marked as draft in UI (also listed in `/spectrum/draft/index.json`).

## Structure

- `src/docs/` - markdown source docs.
- `src/manifests/` - source manifests (`tips.yml`).
- `src/templates/` - source HTML templates.
- `src/assets/` - source CSS/JS/images.
- `scripts/` - build scripts.
- `docs/` - generated publish root (GitHub Pages).

## Key outputs

- `docs/tips.json`
- `docs/spectrum/articles.json`
- `docs/spectrum/types.json`
- `docs/spectrum/statuses.json`
- `docs/spectrum/published/index.json`
- `docs/spectrum/draft/index.json`
