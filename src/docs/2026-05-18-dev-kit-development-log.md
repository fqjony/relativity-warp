---
title: How dev.kit Changed While Building It
description: A development log from the dev.kit sessions, tracing the move from audit and bridge commands toward a smaller repo-context loop.
status: published
date: 2026-05-18
datetime: 2026-05-18 10:15
labels: engineering, dev.kit, development-log, repositories, agents
---

# How dev.kit Changed While Building It

This is the development-log companion to [The Idea Behind dev.kit](/spectrum/2026-05-18-dev-kit-idea/). It is not a transcript. It is the shape that emerged across the repo sessions.

The main pattern was repeated simplification. Each useful idea had to survive the same question: does this make the repository more self-explaining, or does it create another place where truth can drift?

## 1. Start With Reachability

The first practical work was basic: make `dev.kit` easy to install, easy to run, and easy to remove. The lesson was that a repo tool must be reachable from a normal shell, but careful about global machine state.

## 2. Audit Became Repo Context

The early mental model was an audit command:

```bash
dev.kit
dev.kit bridge --json
```

The tool scanned a repo, reported whether it looked healthy, and exposed machine-readable output for agents. That was a useful starting point, but "audit" was too narrow. It sounded like a scorecard.

The better model was context coverage.

The question became:

- What did the repo declare?
- What can be resolved from strong signals?
- What is still missing, partial, stale, or ambiguous?

That shifted the output from judgment to evidence.

## 3. Bridge Output Exposed The Agent Need

`dev.kit bridge` explored how agents should consume repo context.

The sessions pushed toward output that could answer a small set of practical questions: what this repo is, what to read first, which commands matter, which constraints apply, and which gaps should shape the next step.

That direction was correct, but the command boundary became questionable. If bridge output is the machine-readable repo contract, then it should come from the same generated context as every other consumer.

The durable idea survived. The separate public surface became less important.

## 4. Archetype Detection Needed To Be Humble

The sessions explored detection for different repo shapes.

The original temptation was to hardcode lots of repo types. That does not scale well. Repos are mixed, partial, and often weird in useful ways.

The better direction was signals first:

```text
repo signals -> detected factors -> probable shape -> guidance and gaps
```

Archetypes should help explain the repo. They should not force the repo into one label.

## 5. Manifests Became First-Class

Structured files were a recurring source of confusion. Some are ordinary config. Some define workflows. Some declare deployment or runtime contracts. Some point to another repo or tool through metadata.

The useful question became: what is the backend?

For each meaningful manifest, `dev.kit` should try to show what it is, what uses it, and what evidence supports that trace.

This moved the tool from "found YAML" to "found an execution-shaping contract."

## 6. Lessons Were Useful But Risky

`dev.kit learn` explored extracting lessons from local sessions.

The idea was valid: repeated sessions reveal patterns that should improve the next session. But raw session history is too noisy to become durable repo context automatically.

The better rule is promotion: local sessions can inspire lessons, but reusable lessons should be rewritten compactly and moved into the right durable source only after they prove stable. Raw transcripts should not become the contract.

That is why local lesson extraction became less central to the current shape.

## 7. Agent Guidance Was Separated From Repo Facts

Another major change was the boundary between generated repo context and agent instruction files.

At one point, the tool generated both structured context and broader agent guidance. That helped demonstrate the workflow, but it also duplicated responsibility.

The cleaner split is simple: generated context carries repo facts and gaps; instruction files carry assistant behavior; docs explain the workflow and repair loop.

The generated context should not become a long prompt.

## 8. The Command Surface Shrunk

The most important development outcome was reducing the public loop.

The surviving shape is:

```bash
dev.kit      # orient and suggest the next step
dev.kit env  # inspect local capability
dev.kit repo # generate or refresh repo context
```

That is small enough to remember and broad enough to test against real repos.

`dev.kit` orients. `dev.kit env` explains available tools and credentials. `dev.kit repo` regenerates the repo contract.

## 9. Testing Followed The Workflow

The test suite became valuable when it matched the working loop.

Useful tests covered install behavior, command discovery, machine-readable output, repo fixtures, gap detection, manifest tracing, dependency tracing, and stale or broken context coverage.

The lesson was direct: test the repo repair loop, not just individual shell functions.

## 10. The Current Working Definition

The working definition is intentionally plain:

`dev.kit` turns repositories into self-explaining repo contracts for humans, scripts, and CI/CD.

The hoped-for loop is: inspect environment capability, read repo-owned evidence, generate compact context, expose gaps, and point to the next repair.

The implementation still has room to improve, but the boundary is clearer than it was at the start.

The next useful development work should keep using the same test: if a feature does not make repo evidence more trustworthy, easier to regenerate, or easier to act on, it probably does not belong in the core loop.
