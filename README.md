# Relativity Warp

Repo-centric automation playground and docs site.

## Quick start

```bash
npm install
npm run hooks:install
npm run build
npm run preview
```

## Scripts

- `npm run build` - build tips JSON and spectrum docs into `docs/`.
- `npm run preview` - serve `docs/` locally.
- `npm run hooks:install` - enable repo git hooks (`.githooks/`).
- `npm run hooks:uninstall` - disable repo git hooks for this clone.

## Doc model

Spectrum uses one content type: `doc`.

Frontmatter contract for `src/docs/*.md`:

- `title`
- `description`
- `status` (`published` or `draft`)
- `datetime` (optional, `YYYY-MM-DD HH:mm`)
- `date` (optional, `YYYY-MM-DD`)
- `labels` (comma-separated, optional)

If `datetime` and `date` are not set, build derives them from the markdown file local `mtime`.

Publishing behavior:

- `status: published` is rendered to HTML and marked as published in UI.
- `status: draft` is rendered to HTML and marked as draft in UI (also listed in `/spectrum/draft/index.json`).
- date sorting uses resolved datetime (frontmatter first, fallback to file `mtime`).

## Commit-time local build

Once hooks are installed, every commit runs local build automatically and stages `docs/`.

Bypass once:

```bash
SKIP_PRECOMMIT_BUILD=1 git commit -m "message"
```

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
