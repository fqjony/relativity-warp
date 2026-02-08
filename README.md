# Relativity Warp

Repo-centric automation playground and docs site. The build step compiles Spectrum schemas and renders research articles into `public/`.

## Quick start

```bash
npm install
npm run build
npm run preview
```

## Scripts

- `npm run build` — compile Spectrum schemas + build research HTML into `public/`
- `npm run preview` — serve `public/` (publish root for GitHub Pages)

## Research index

Refresh the research links and render HTML for the homepage:

```bash
node scripts/generate-research-index.mjs
```

## Structure

- `src/assets/` — source CSS/JS/images
- `src/templates/` — HTML templates (homepage + optional data viewer)
- `src/docs/` — markdown sources for spectrum articles (rendered to `/spectrum/<slug>/`)
- `src/manifests/` — yaml manifests (tips → `/tips.json`)
- `docs/research/` — markdown sources for articles
- `public/` — build output (deploy this)

## References

- UDX (https://udx.io/)
- 12-Factor Environment Automation (https://udx.io/devops-manual/12-factor-environment-automation)
- Why Software Logistics Matter (https://udx.io/guidance/why-software-logistics-matter)
- Cloud Automation Book (https://udx.io/cloud-automation-book/foreword)
- Delivery Platform Strategy (https://udx.dev/delivery-platform/)
- DevOps Manual (https://udx.io/devops-manual)
