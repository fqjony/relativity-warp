# Relativity Warp

Repo-centric automation playground and daily posts site.

## Quick start

```bash
npm install
npm run hooks:install
npm run build
npm run preview
```

## Scripts

- `npm run build` - build markdown posts into `docs/`.
- `npm run post:new -- "Post title"` - create a dated draft markdown post in `src/docs/`.
- `npm run preview` - serve `docs/` locally.
- `npm run hooks:install` - enable repo git hooks (`.githooks/`).
- `npm run hooks:uninstall` - disable repo git hooks for this clone.

## Daily post workflow

```bash
npm run post:new -- "What I worked on today"
npm run build
```

New posts start as `status: draft`. Publish by changing that frontmatter field to `published`.

## Agent publishing workflow

Use this workflow when an AI agent in any repo needs to turn a work session into an fqjony.com article.

1. Prepare a standalone Markdown article as `${file}.md`.
2. Copy it into this repo under `src/docs/`.
3. Set frontmatter:
   - `title`
   - `description`
   - `status: published` for automated posting, or `status: draft` when review is needed
   - `date: YYYY-MM-DD`
   - `datetime: YYYY-MM-DD HH:mm`
   - `labels: comma, separated, labels`
4. Run `npm run build`.
5. Start local preview with `npm run preview` and share the local URL for review.
6. Ask for explicit confirmation before pushing or opening a PR.
7. After confirmation, stop the local preview server.
8. Create a focused branch, commit the article and generated `docs/` output, push, open a PR, wait for checks, and merge only when green.

Example:

```bash
cd /Users/jonyfq/git/fqjony/relativity-warp
cp /path/to/article.md src/docs/YYYY-MM-DD-short-slug.md
npm run build
npm run preview
# Stop here. Ask the human to review locally and confirm.
# After confirmation, stop the preview server before continuing.
git checkout -b post/short-slug
git add src/docs docs
git commit -m "Publish short article title"
git push -u origin post/short-slug
gh pr create --fill
gh pr checks --watch
gh pr merge --squash --delete-branch
```

If checks fail, inspect the failure, fix the repo, rebuild, push again, and wait for checks again before merging.

Codex users can also trigger the global skill `session-to-article`, which is a thin wrapper around this README workflow. Non-Codex agents should use this section directly.

## Post model

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
- `status: draft` is rendered to HTML and marked as draft in UI.
- date sorting uses resolved datetime (frontmatter first, fallback to file `mtime`).

## Commit-time local build

Once hooks are installed, every commit runs local build automatically and stages `docs/`.

Bypass once:

```bash
SKIP_PRECOMMIT_BUILD=1 git commit -m "message"
```

## Structure

- `src/docs/` - markdown source posts.
- `src/templates/` - source HTML templates.
- `src/assets/` - source CSS/JS/images.
- `scripts/` - build scripts.
- `docs/` - generated publish root (GitHub Pages).

## Key outputs

- `docs/index.html`
- `docs/spectrum/<post-slug>/index.html`
