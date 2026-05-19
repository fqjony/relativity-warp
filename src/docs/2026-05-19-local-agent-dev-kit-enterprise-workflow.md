---
title: A Local Driver for Repo-Centric Engineering Research
description: A research note on environment capability, normalized repo context, and agent orchestration as a practical loop for experimentation, collaboration, and delivery.
status: published
date: 2026-05-19
datetime: 2026-05-19 22:30
labels: engineering, research, dev.kit, agents, repositories, workflow
---

# A Local Driver for Repo-Centric Engineering Research

This note is part of an ongoing engineering research thread around repo-centric workflows and agent-assisted development. The previous notes have been circling the same boundary from different angles:

- [repo-centric workflows](/spectrum/2026-05-18-repo-centric-workflows/)
- [the idea behind dev.kit](/spectrum/2026-05-18-dev-kit-idea/)
- [structured evidence and interpreted intent](/spectrum/2026-05-18-structured-evidence-interpreted-intent/)
- [real repositories as context probes](/spectrum/2026-05-19-real-repos-as-context-probes/)

The research question here is practical:

```text
What local loop lets an engineer experiment across repos, tools, and team context
without turning the agent session into the only place where knowledge exists?
```

My current hypothesis is that the useful unit is not just an agent, a CLI, or a repository. It is a local research loop made from three parts:

```text
environment -> available tools, auth, runtime, and local state
dev.kit     -> normalized repo evidence and context coverage
agent       -> dynamic search, reasoning, and workflow orchestration
```

That order matters. The environment is the foundation: it defines what can be resolved locally. `dev.kit` turns that capability and repo-owned evidence into a normalized contract. The agent then uses that contract to search, reason, orchestrate work, and decide the next safe step.

Those roles should stay separate. The agent should not be treated as "the thing with tools." The environment has tools and credentials. `dev.kit` makes capability and repo-owned evidence visible. The agent decides how to use that normalized context instead of working from broad memory or guesswork.

Together, this creates a practical research driver: a way to experiment locally, work across repos, connect tools and ideas dynamically, and still leave behind evidence that a team can review and reuse.

The repo remains the source of truth. The local driver makes that truth easier to use.

## The Environment Enables Experimentation

Good engineering research needs room to experiment.

That means the environment has to make it cheap to spin up context, try a change, test it, inspect the result, and either keep it or throw it away. The local machine is where that loop is most immediate. It has the checkout, branch state, credentials, tools, runtime, package manager, browser, logs, and recent working memory.

Those capabilities are not just convenience. They determine what can be observed.

An environment with GitHub access can inspect issues, PRs, reviews, and workflow runs. An environment with package and runtime tools can build and test. An environment with deployment or cloud tools can compare declared intent with runtime behavior. A restricted environment can still help, but it should be honest about what it cannot resolve.

This is the first layer of repo-centric research: the environment gives the session concrete reach.

## dev.kit Normalizes Evidence

The second layer is normalization.

Every serious repository contains operating knowledge, but that knowledge is usually scattered across README files, docs, scripts, package manifests, workflow files, deployment manifests, tests, and team conventions.

`dev.kit` should not become a replacement for those sources. Its job is to read the repo, inspect available capability, and produce a compact view of what the repo can prove:

- what to read first
- which commands are trusted
- which manifests shape behavior
- which dependencies or related repos matter
- which gaps weaken context coverage
- which source should be improved next

That is the repo contract. It should be generated from repo-owned evidence and refreshed as the repo improves.

The important detail is that context coverage is not a score. It is a research signal. If a repo cannot explain how to test, deploy, configure, or verify itself, the next useful experiment may be to repair that contract before writing more code.

## The Agent Orchestrates Work

A local agent is powerful because it can reason across the current task, search dynamically, inspect evidence, choose the next useful workflow step, and coordinate execution.

It can move between repo files, command output, issues, PRs, commits, workflow runs, previous sessions, and user intent. Its value is not raw access to every source. Its value is deciding which source to trust next, which workflow step is safe, which gap matters, and when to stop for review.

That is a different capability from a remote stateless assistant. The local agent can connect task intent to live evidence, but it should not treat every possible source as equally important. It needs a way to understand what the environment can resolve and what the repo has already declared.

The agent is the dynamic part of the system. It can connect a bug report to recent commits, connect a failed workflow to the manifest that produced it, connect a docs gap to a repo contract repair, or connect a repeated local pattern to a reusable workflow idea.

That is the local driver: not one static pipeline, but a guided loop that can move across tools, repos, and collaboration surfaces while staying grounded in repo evidence.

## The Experiment Loop

The current loop is intentionally small:

```bash
dev.kit      # orient: environment, repo status, next action
dev.kit env  # inspect tools, auth, and capability coverage
dev.kit repo # refresh .rabbit/context.yaml from repo evidence
```

The generated `.rabbit/context.yaml` is not a hand-written manifesto. It is generated evidence: refs to read first, detected commands, manifests, dependency contracts, gaps, and repair targets.

That gives a local agent a better starting point than broad repo scanning. Instead of guessing where meaning lives, the agent can read the normalized contract first, inspect the highest-priority refs, and use live GitHub, cloud, or package data only when the task actually needs it.

`dev.kit` also gives the agent a useful constraint: if coverage is weak, do not hide that weakness with a confident summary. Improve the owning repo source or report the gap.

In practice, the research loop becomes:

```text
run dev.kit
check environment coverage
read the repo contract
choose the smallest useful experiment
run the repo-declared verification
inspect the diff and evidence
repair the repo-owned source when context is weak
regenerate the contract
repeat
```

That loop turns standardization into normal engineering work. If a command is missing, add it to the owning build file or docs. If a manifest is important but untraced, improve the manifest metadata or the detection rule. If a repo has a gap, fix the source that should declare the contract and rerun `dev.kit repo`.

The key is that the improvement goes back into the repo, not only into an agent prompt or one isolated session.

This is also how local agent research becomes reusable. The agent can use session history and local knowledge as temporary working context, but durable knowledge should be promoted into repo docs, manifests, tests, skills, or public notes only after it proves useful.

## Cross-Repo Research

Most useful development work does not stay inside one file.

A feature may touch application code, shared workflow logic, environment config, documentation, release notes, and a follow-up issue. A bug may require reading a runtime log, a CI run, a dependency repo, a previous PR, and the current branch diff. A platform improvement may start as one repo-local repair and later become a reusable workflow part.

This is where a local agent helps: it can search and connect the live surfaces quickly. This is where `dev.kit` helps: it prevents that search from becoming random by giving the agent a repo-specific contract and context coverage signal.

The pattern is:

```text
repo-owned evidence
  -> normalized context
  -> dynamic search
  -> smallest useful experiment
  -> verification evidence
  -> reusable improvement
```

The goal is not to make every repo identical. The goal is to make each repo clear enough that humans, agents, CI systems, and shared tools can collaborate from the same operating contract.

For a research workspace, that matters because experiments are only useful if they can be compared, repeated, or promoted. A local session can be exploratory, but the result should have a path back into a durable surface: repo contract, test, workflow, doc, skill, or article.

## Team-Scale Evidence

This also connects to larger delivery models.

Larger delivery work often looks like a waterfall from a distance: requirements, planning, implementation, review, release, deployment, validation, and audit. In practice, good engineering inside that structure is still incremental. Each step should produce evidence that the next step can consume.

Repo contracts help bridge those two modes.

A team can keep the large lifecycle visible while still working in small loops:

- issues and PRs carry intent and review context
- repo docs explain operating rules
- manifests declare runtime and deployment behavior
- workflows execute repeatable checks
- generated context exposes current coverage and gaps
- local agents use the same evidence as humans and CI

That is the useful form of structured delivery for agent-assisted engineering: not a rigid handoff where knowledge disappears between phases, but a chain of evidence where each phase leaves something inspectable for the next actor.

The same loop can serve a solo local research session and a team process. Locally, the agent uses environment capability to work quickly. At the team level, repo contracts and generated context make the result reviewable. At the organization level, the same evidence chain supports audit, release confidence, and repeatable handoff.

That is why experimentation matters. The team needs the ability to try, test, share, discard, and repeat without losing the thread. Fast experiments are not the opposite of governance. They are how governance gets better evidence.

## Why This Is Better Than A Bigger Prompt

The tempting answer to agent workflow is to write a longer global instruction file.

Some global guidance is useful. But global instructions should not carry repo-specific truth. The repo should. Otherwise the agent gets smarter in one session while the repository stays unclear for everyone else.

The healthier split is:

```text
environment               -> tools, auth, runtime, local state
dev.kit env               -> capability and auth coverage
repo-owned docs/manifests -> maintained source truth
.rabbit/context.yaml      -> normalized repo evidence and gaps
global agent instructions -> behavior, preferences, and collaboration style
agent session             -> dynamic reasoning and workflow orchestration
```

When the session discovers something durable, it should be promoted into the smallest right place: a repo doc, a manifest, a test, a reusable skill, or a published engineering note. Raw session memory should stay provisional until it proves reusable.

That promotion path is what makes a personal research workspace useful. The workspace can hold experiments and synthesis, but the owning repository should still hold the operating truth.

## Research Outcome

The local agent becomes more useful when it starts every repo session from the same contract a human can review.

`dev.kit` makes that contract compact and repeatable. The environment exposes concrete capability: shell, tools, auth, live collaboration context, recent sessions, and test execution. The local agent orchestrates that capability against the repo contract. The research workspace captures the reusable idea, while the team benefits because improvements flow back into repo-owned sources instead of staying hidden in one terminal history.

That is the direction I want from this system:

```text
environment capability
  -> repo contract
  -> agent orchestration
  -> experiment
  -> verification evidence
  -> repo repair
  -> regenerated context
  -> better next session
```

The result is not a claim that an agent replaces engineering judgment. It is a better engineering research driver: smart enough to search and adapt, grounded enough to respect repo evidence, flexible enough to experiment across repos and tools, and visible enough for team-scale delivery.
