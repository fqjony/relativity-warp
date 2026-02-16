---
title: Local AI Stack and dev.kit Notes
description: Draft notes on local tooling, agent setup, and dev.kit direction.
status: draft
datetime: 2026-02-16 20:30
date: 2026-02-16
labels: draft, notes, local-ai, dev-kit, workflow
---

# Local AI Stack and dev.kit Notes

This is a working draft used as engineering notes.

## Dev workflow must-haves

- Always merge latest from `master` branch before starting or shipping work.
- Commit and push before end of day.

## Automation ideas from incident

- Add a Codex CLI "graceful shutdown" flow triggered by phrases like `"bye bye"` or `"I'm done for today"`.
- Shutdown flow should run:
  - `git fetch origin`
  - `git merge origin/master` (or rebase strategy if preferred)
  - `git add -A`
  - `git commit` (if there are changes)
  - `git push`
- Add a "graceful startup" flow when opening terminal:
  - sync from `master`
  - print repo status and pending TODOs

## Cron exploration

- Evaluate using `https://www.terminal.shop/cron` for scheduled reminders/checks.
- First target: end-of-day reminder if there are uncommitted changes.
- Second target: startup reminder to sync latest `master`.

## Current local equipment

1. Google Antigravity IDE.
2. IDE AI agent with supported models (including Gemini models, limited by Google subscription).
3. Codex (OpenAI coding agent IDE extension).
4. Codex CLI.

## What this enables now

- Fast local prototyping with multiple model providers.
- Side-by-side comparison of agent behavior on the same repo contract.
- More control over execution boundaries when using CLI-first workflows.

## dev.kit direction (in progress)

dev.kit is being developed to improve localhost AI integration for engineering work by providing:

- Environment bootstrapping with deterministic setup.
- Supported MCP server wiring for context and tooling.
- Reusable skills designed for repo-centric engineering flow.

## Next notes to enrich

- Define a default repo contract for prompts, artifacts, and verification.
- Capture minimal MCP baseline for coding + docs + workflow tasks.
- Standardize when to use iteration vs workflow mode.
- Add a small acceptance checklist for "ready to publish".
