---
title: Real Repositories as Context Probes
description: A continuation of the dev.kit research series: using real repos to test whether generated context actually improves engineering work.
status: published
date: 2026-05-19
datetime: 2026-05-19 19:05
labels: engineering, dev.kit, repositories, context, testing, agents
---

# Real Repositories as Context Probes

The previous notes in this series worked toward a boundary: the repository is the source of truth, and `dev.kit` is only a normalization layer around that truth.

That boundary raises a practical testing question.

If the point of a repo-context tool is to make real repositories easier to enter, repair, and automate, then fixture tests are not enough. Fixtures are necessary, but they can only prove that a known contract still behaves the same way. They do not prove that the tool is reading the messy, uneven, partially documented shape of real repositories well.

The next useful step is to treat real repositories as context probes.

## Fixtures Test The Contract

Small fixtures are still important.

They should cover deterministic behavior:

- output shape
- gap categories
- manifest inventory
- command detection
- stale context handling
- known regressions

That is where a synthetic repo is useful. It can be intentionally small. It can represent a narrow edge case. It can protect a bug fix forever.

But fixtures should not grow into a fake universe of every possible repo type. When that happens, the tool starts optimizing for its own test model instead of the repositories it is supposed to help.

## Real Repos Test The Reading

A real repo is different from a fixture because it contains accidental complexity.

Docs may be uneven. Workflows may be partial. A manifest may be important even when it is not part of the first reading path. Config may be implied by deployment files. Test commands may be obvious to the team but not encoded strongly enough for a new reader.

Those are not just defects. They are exactly the conditions a repo-context tool has to handle.

For `dev.kit`, the useful question is not only:

```text
does the parser work?
```

It is:

```text
does the generated context help the next human or agent choose the right next step?
```

That requires running against real repos and looking at the output as an engineering artifact.

## The Probe Should Be Read-Only First

The safest default is read-only.

The probe should inspect a repo, emit JSON, summarize the workflow state, and stop. It should not silently regenerate context in another working tree. If write mode is needed, it should be explicit and usually pointed at a temp clone or disposable local copy.

That keeps the feedback loop clean:

```text
inspect repo
report context status
report gap count
report read-first refs
compare noise and coverage
change dev.kit or the owning repo source
rerun
```

The important part is that the probe produces comparable signals. A release check should make it easy to see whether a change reduced noisy refs, improved a gap, preserved manifest coverage, or made the workflow state clearer.

## Environment Definitions Are Still Evidence

One concrete example from the current work is nested environment definitions.

A directory such as `.rabbit/infra_configs/` can contain environment definitions deployed by workflows. Those files are real repo evidence. They should be included in manifest and context validation.

But that does not mean every nested environment manifest should flood the first reading list.

That distinction matters:

- include the manifest in structured coverage
- avoid turning first-read refs into a long inventory dump

This is the same boundary from the earlier evidence note. Structured sources should be parsed. Reading order should stay useful.

## Values Belong In Config

Another practical refinement is where release probes are declared.

Hardcoding repo lists, recommended tooling repos, or validation defaults in shell code makes the tool harder to manage. Those values are part of the repo contract for `dev.kit` itself, so they belong in config or manifests.

That does not make the tool more complex. It makes the contract more reviewable.

The code executes behavior. The config declares the managed values. The docs explain how to use the loop.

## Gaps Drive The Optimization Loop

The useful release question becomes:

```text
which repo made the output feel wrong?
```

Maybe a gap points to the wrong repair target. Maybe a manifest is inventoried but not explained. Maybe the first-read refs are too noisy. Maybe a slow run reveals that context generation is scanning too much. Maybe the JSON contract is technically correct but redundant for an agent.

Each of those is a useful signal.

The repair should follow the same rule as before:

1. identify the strongest repo-owned gap or normalization problem
2. fix the owning source or the normalization rule
3. rerun the probe
4. verify that the output changed in the intended direction

That is how real repos become part of the test loop without turning every repo into a permanent fixture.

## The Release Gate

For a `dev.kit` release, the gate should stay modest.

Run deterministic fixture tests to protect the contract. Run a small read-only real-repo matrix to test whether the tool still reads practical repo shapes. Compare context status, gap count, and read-first ref count. Look for obvious redundancy, missing coverage, and slow paths.

Do not assert exact output for moving public repositories unless they are pinned. Do not write into real working repos unless explicitly requested. Do not let generated context replace the repo-owned sources it summarizes.

That keeps the tool aligned with the research story:

```text
repo-owned evidence
  -> normalized context
  -> visible gaps
  -> real repo probes
  -> targeted repair
  -> regenerated evidence
```

The goal is not to make `dev.kit` smarter than the repo.

The goal is to make the repo easier to understand, test, and improve.
