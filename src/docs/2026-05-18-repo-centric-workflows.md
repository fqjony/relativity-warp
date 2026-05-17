---
title: Repo-Centric Workflows as the Enterprise Delivery Model
description: How UDX is framing workflows, infra builds, rabbit.ci, and dev.kit around standardized repository contracts and reusable execution parts.
status: published
date: 2026-05-18
datetime: 2026-05-18 09:00
labels: udx, dev-kit, rabbit-ci, workflows, sdlc, infrastructure
---

# Repo-Centric Workflows as the Enterprise Delivery Model

UDX strategy work has been converging on one practical idea: enterprise delivery should be driven from standardized repositories, not from scattered CI files, private notes, assistant memory, or one-off operational habits.

That sounds obvious until the system has to support more than one repo, more than one cloud, and more than one execution surface. At that point, the repository needs to do more than store source code. It needs to expose the contract for how humans, agents, CI/CD systems, cloud runners, and local tools should collaborate.

## Workflow Means More Than Pipeline

The working definition we refined is:

> A workflow is a composable operating model for getting a goal done from independent, self-contained parts.

In UDX terms:

```text
workflow = intent + rules + context + inputs + executable parts + outputs + feedback
```

A pipeline is one executable path through that workflow. It is the ordered run that happens for a specific purpose. The broader workflow includes the rules, repo context, environment mapping, runtime constraints, outputs, evidence, and feedback loop around that path.

That distinction matters. A normal CI/CD workflow might compile down to a GitHub Actions pipeline. But the same model should also apply to infrastructure provisioning, environment setup, database operations, service maintenance, application release, runbook execution, diagnostics, and support tasks.

## The Infra Build Example

The cloud deployment workflow, also called infra build, is a concrete example of this model.

The current private workflow surface is:

- `udx/gh-workflows`
- `.github/workflows/infra-build.yml`

The planned public product surface is:

- `udx/github-rabbit-action`
- GitHub Marketplace distribution

The diagram we reviewed showed the shape clearly:

- A developer pushes code.
- GitHub Actions receives the trigger and handles workflow orchestration.
- An R2A container provides a self-contained execution environment.
- Reusable component families handle AWS, GCP, Kubernetes, state, telemetry, Firebase deploy records, worker pods, and edge stack behavior.

That is a better model than treating CI as a sequence of arbitrary shell commands. GitHub Actions becomes one runner and orchestration surface. R2A becomes the packaged execution environment. Cloud and runtime domains become reusable workflow parts with declared inputs, credentials, state behavior, outputs, and reporting.

## What Repos Need To Provide

For this model to work across enterprise repos, each repo needs to expose enough structure to drive development and operations from the repo itself.

The repo contract should include:

- `.rabbit/context.yaml`
- `AGENTS.md`
- workflow files and workflow docs
- README and focused docs
- manifests for workflow, runtime, deployment, environment, or lifecycle behavior
- explicit verify, build, test, diff, plan, and run commands
- branch, lifecycle, and environment mapping where applicable

The goal is a repo-centric SDLC: the repository contract drives development, tests, agents, CI/CD, lifecycle, environments, releases, and feedback loops.

## Where dev.kit Fits

`udx/dev.kit` fits as the repo standardization and context-normalization layer.

It is not the source of business truth. The repo remains the source of truth. `dev.kit` helps discover, normalize, and refresh that truth so humans, agents, and automation can operate from the same evidence.

That makes agent sessions more useful. An agent should not have to infer a repo's lifecycle from old chat history or guess at deployment behavior from scattered files. It should be able to enter the repo, read the contract, understand the commands and manifests, inspect known gaps, and run the smallest meaningful verification.

## Test and Loop

The engineering mode behind this is deliberately iterative.

Each workflow should make it cheap to:

1. identify the intended lifecycle or environment
2. make the smallest useful change
3. run the smallest meaningful verification
4. inspect the diff, plan, output, or runtime evidence
5. feed the result into the next iteration

That is TDD thinking applied beyond application code. It applies to infrastructure, database tasks, environment changes, deployments, runbooks, diagnostics, and agent sessions.

## The UDX Position

The stronger UDX claim is not "we have better CI YAML."

The stronger claim is:

> UDX standardizes how delivery workflows are defined, composed, executed, observed, and improved across repositories and platforms.

`rabbit.ci` is the workflow platform surface. `dev.kit` makes repos readable and operable enough to participate. R2A and related workers provide self-contained execution. Reusable workflows and manifests connect the pieces into portable delivery paths.

The long-term value is collaborative, reusable engineering experience: standardized repo contracts, dynamic SDLC workflows, portable execution, tight feedback loops, and a practical path for humans and agents to work from the same operating model.
