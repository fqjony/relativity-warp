---
title: The Idea Behind dev.kit
description: Why dev.kit exists: repositories as operating contracts, not just code folders.
status: published
date: 2026-05-18
datetime: 2026-05-18 10:00
labels: engineering, dev.kit, repositories, agents, sdlc
---

# The Idea Behind dev.kit

Start with the broader context: [Repo-Centric Workflows as an Engineering System](/spectrum/2026-05-18-repo-centric-workflows/).

`dev.kit` came from a repeated frustration in real repo work: the repository usually contains the truth, but not always in a form that a new developer, a CI job, a local script, or an AI agent can use quickly.

The README might explain the project. Workflows might show how releases happen. Manifests might describe runtime behavior. Commands might live in a build file or script. A good engineer can eventually reconstruct the operating model, but every reconstruction costs time and creates room for drift.

The idea behind `dev.kit` is to make that reconstruction explicit.

## The Repository Is The Contract

The core belief is that the repo should be the first operating surface.

Not chat memory. Not one person's shell history. Not an assistant thread. Not a wiki page that slowly diverges from the thing that actually runs.

The repo should answer:

- What is this project?
- What should I read first?
- Which commands are trusted?
- Which manifests shape behavior?
- Which workflows execute delivery?
- Which dependency repos matter?
- Which context is missing or weak?
- How do I verify a change?

That is what "repo-centric SDLC" means in practice. Development, tests, agents, CI/CD, lifecycle, environments, releases, and feedback loops should all start from the same repo-owned contract.

## Why A Tool Is Needed

Even when the repo is the source of truth, the truth is distributed.

A typical repo contract is spread across docs, workflows, scripts, manifests, tests, generated context, release notes, and dependency references.

Humans can synthesize that. Automation needs structure. Agents need both structure and reading order.

The working idea for `dev.kit` is to become an adapter between those worlds. It discovers repo-owned evidence, normalizes it, and writes compact context that other actors can use.

The tool should not replace the repo. It should make the repo easier to use.

## The Original Product Tension

The early sessions explored a larger surface: auditing repos, exposing machine-readable output, generating agent guidance, learning from sessions, improving install flow, detecting repo shapes, and tracing dependencies.

All of that was directionally useful. It also created a design tension.

If `dev.kit` does too much, it becomes another source of truth. If it stores too much local session material, it risks turning working memory into repo context. If it generates too much prose, the output becomes another document to maintain.

The better line appears narrower:

```text
discover repo evidence
normalize what can be trusted
report what is missing
guide the next repair
regenerate from source
```

## The Practical Output

The current center of gravity is generated repo context.

That context can include identity, reading order, commands, gaps, manifests, dependencies, and repair targets.

This makes the repo more legible without pretending every repo is perfect.

The most important part is not the happy-path summary. It is the gaps. A gap says, "this repo has an operating contract weakness that can be repaired in a repo-owned source."

That is how the tool stays useful during real work. It turns ambiguity into a focused next step.

## The Agent Angle

AI agents made the need sharper, but not separate.

An agent entering a repo needs the same things a human needs: an entrypoint, reading order, trusted commands, constraints, verification, and known gaps.

The difference is that agents are more likely to over-read, under-read, or infer from stale memory. A generated repo context gives the agent a current, compact grounding point.

The hoped-for instruction stays simple:

```bash
dev.kit
dev.kit repo
```

Start from the repo, refresh context, then work from the evidence.

## What dev.kit Should Not Be

The sessions also clarified the negative space.

`dev.kit` should not be a replacement for docs, a transcript archive, a heavyweight platform, an agent prompt dumping tool, or a place to hide repo gaps with generated prose.

It should be a small normalization layer that helps the repo become more self-explaining.

That is the idea: make every repository easier to enter, repair, automate, and hand off by keeping the operating contract close to the code and regenerating it from evidence.
