# Relativity Warp

Repo-centric engineering memory and research notes site.

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

## Research note workflow

```bash
npm run post:new -- "Operational boundary from repeated repo friction"
npm run build
```

New posts start as `status: draft`. Publish by changing that frontmatter field to `published`.

## Article tone

Relativity Warp posts should usually read as engineering notes, research, or discovery logs. Prefer durable technical ideas, patterns, tradeoffs, and learning loops over internal project exposure. Mention specific companies, repos, clients, products, or private implementation details only when the post is intentionally about that public context.

Keep articles at the engineering-story level. Avoid implementation-heavy walkthroughs, long code examples, file-by-file change logs, and narrow technical details that will age quickly. Use short commands, snippets, or pseudo-code only when they clarify the mechanism.

For editorial guidance, see [guides/editorial-guide.md](guides/editorial-guide.md).

## Agent publishing workflow

Use this workflow when an AI agent in any repo needs to turn a work session into an fqjony.com article.

Publishing changes must go through a pull request. Do not push directly to `main`, even for generated `docs/` output or small metadata edits. GitHub Pages deploys from `main` after the PR is reviewed and merged.

1. Build a source-context bundle before writing.
   - Read the source repo `README.md`, `AGENTS.md` or `CLAUDE.md` when present, and `.rabbit/context.yaml` when present.
   - Inspect `git status --short`, recent commits, and the current diff in the source repo.
   - Read source repo docs referenced by `.rabbit/context.yaml` or agent instructions.
   - For UDX repos, prefer repo-owned context and run/inspect `dev.kit` or `dev.kit repo` output when available.
   - Write down the concrete files, commits, diffs, commands, and docs that support the article.
2. Build continuity with existing posts.
   - Read recent articles in `src/docs/` before drafting.
   - Make the new article fit the ongoing engineering story where it naturally can.
   - Prefer logical progression over isolated one-off posts, but do not force a connection when the topic is genuinely separate.
   - Avoid repeating the same point from an earlier article unless the new evidence advances it.
3. Decide whether there is enough evidence.
   - If the evidence is only a chat summary, stop and ask for the source repo, branch, PR, issue, commit range, or notes.
   - Do not publish broad claims, private implementation details, repo names, product names, or roadmap language unless they are intentionally public and supported by inspected sources.
   - Prefer one well-grounded article over multiple overlapping articles.
4. Prepare a standalone Markdown article as `${file}.md`.
5. Copy it into this repo under `src/docs/`.
6. Set frontmatter:
   - `title`
   - `description`
   - `status: published` for automated posting, or `status: draft` when review is needed
   - `date: YYYY-MM-DD`
   - `datetime: YYYY-MM-DD HH:mm`
   - `labels: comma, separated, labels`
7. Run `npm run build`.
8. Start local preview with `npm run preview` and share the local URL for review.
9. Ask for explicit confirmation before pushing a branch or opening a PR.
10. After confirmation, stop the local preview server.
11. Create a focused branch, commit the article and generated `docs/` output, push the branch, open a PR, wait for checks, and merge only when green.

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

After merge, verify GitHub Pages rather than assuming deployment completed:

```bash
gh api repos/fqjony/relativity-warp/pages
gh api repos/fqjony/relativity-warp/pages/builds/latest
curl -sS https://fqjony.com/ | head -c 2000
```

Expected Pages settings are legacy GitHub Pages from branch `main`, path `/docs`, with custom domain `fqjony.com`.

Codex users can also trigger the global skill `session-to-article`, which is a thin wrapper around this README workflow. Non-Codex agents should use this section directly.

## Post model

Frontmatter contract for `src/docs/*.md`:

- `title`
- `seo_title` (optional, used in `<title>` and social metadata while preserving the visible article title)
- `description`
- `seo_description` (optional, used in metadata when it should differ from the visible listing description)
- `status` (`published` or `draft`)
- `datetime` (optional, `YYYY-MM-DD HH:mm`)
- `date` (optional, `YYYY-MM-DD`)
- `labels` (comma-separated, optional)

If `datetime` and `date` are not set, build derives them from the markdown file local `mtime`.

Publishing behavior:

- `status: published` is rendered to HTML and marked as published in UI.
- `status: draft` is rendered to HTML and marked as draft in UI.
- date sorting uses resolved datetime (frontmatter first, fallback to file `mtime`).

## Discovery model

The build script in `scripts/build-research.mjs` is the source of truth for generated publishing metadata. It reads the Markdown frontmatter, renders each post under `docs/spectrum/<slug>/`, and keeps the checked-in GitHub Pages output aligned with the source posts.

Generated discovery behavior:

- The homepage metadata lives in `src/templates/index.html`.
- Article `<title>`, description, canonical URL, Open Graph, Twitter card, published time, and article tags are generated from each post's frontmatter.
- `seo_title` and `seo_description` can make metadata more searchable while leaving the visible article title and listing description calm and research-oriented.
- `labels` drive both visible post metadata and the generated "Related" links on article pages. Prefer improving the existing label taxonomy before adding a new navigation system.
- `status: draft` pages are rendered for preview but receive `noindex, nofollow` metadata and are excluded from `docs/sitemap.xml`.
- `docs/sitemap.xml` lists the homepage and published articles with canonical `https://fqjony.com` URLs.
- `docs/robots.txt` allows crawling and points search engines at the sitemap.

SEO guide for every new article:

- Write a strong `description`, and use `seo_description` when search/social metadata should be more precise than the visible listing copy.
- Use 3-5 precise `labels` that describe the article topic and connect it to the existing taxonomy.
- Include 2-4 internal related links in the article body when there are genuinely relevant published posts.
- Confirm the canonical published URL will be `https://fqjony.com/spectrum/<post-slug>/`.
- Do not change article or site structure unless repeated publishing friction shows the structure itself is the problem.

For future publishing, keep source edits in `src/docs/` and `src/templates/`; do not hand-edit generated article pages in `docs/`. After source changes, run `npm run build` and commit both source files and generated `docs/` output.

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
- `guides/` - repo-owned editorial and publishing guidance.
- `scripts/` - build scripts.
- `docs/` - generated publish root (GitHub Pages).

## Key outputs

- `docs/index.html`
- `docs/spectrum/<post-slug>/index.html`
- `docs/sitemap.xml`
- `docs/robots.txt`
