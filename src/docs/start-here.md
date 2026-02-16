---
title: Start Here
description: Minimal entry point for shaping Relativity Warp docs with a draft-first workflow.
status: published
datetime: 2026-02-16 09:00
date: 2026-02-16
labels: entry-point, docs, workflow, dev-kit
---

# Start Here

This repo now uses a simple docs model:

- One content type: `doc`.
- One workflow state: `status: draft` or `status: published`.

## What to edit first

1. Keep working notes in `src/docs/local-ai-stack-dev-kit-notes.md` (`status: draft`).
2. Promote notes to published by changing `status: published`.
3. Run `npm run build` after each meaningful update.

## Writing contract

Use this frontmatter in every doc:

- `title`
- `description`
- `status`
- `datetime` (preferred; falls back to `date`)
- `date` (optional)
- `labels` (optional)

## Scope for now

- Keep docs small.
- Prefer one concrete idea per doc.
- If a doc is not actively used, delete it.
