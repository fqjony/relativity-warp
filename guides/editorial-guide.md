# Editorial Guide

fqjony.com is an engineering memory system, not a portfolio and not a generic blog. Posts should read as continuous research notes grounded in repo work, runtime evidence, and operational learning.

## Working Model

- Start from observed engineering friction.
- Identify the owning source: repository, runtime system, GitHub record, human decision, generated context, or workflow.
- Define the operational boundary before explaining the repair.
- Explain the mechanism that makes the next execution safer or clearer.
- Verify through evidence: build output, tests, logs, review history, deployment checks, or source references.
- Preserve the lesson without creating a competing source of truth.

## Vocabulary

Prefer precise operating language:

- operational truth
- engineering memory
- runtime evidence
- repo-owned evidence
- owning source
- operational boundary
- execution surface
- repo contract
- operating contract
- context contract
- repair loop
- generated context
- source-backed
- workflow state
- preserve patterns, not residue
- do not invent new wells

Use these carefully. A strong note usually needs a few of them, not all of them.

Reduce broad or generic language:

- knowledge, unless the sentence really means accumulated understanding
- automation, when execution, orchestration, workflow mechanism, repair loop, or verification is more accurate
- best practices, thought leadership, transformation, platform strategy, unlock, accelerate
- "This note explores..." when the sentence can state the mechanism directly
- "A research note on..." in frontmatter descriptions

## Description Patterns

Frontmatter descriptions should be concrete and mechanism-first. Avoid repeated scaffolding such as:

- "A research note on..."
- "A practical note on..."
- "A synthesis note..."
- "This note is part of..."
- "A continuation of..."

Useful patterns:

- "Repositories define..."
- "Session start establishes..."
- "Repeated engineering friction becomes..."
- "Generated context helps when..."
- "Runtime evidence matters because..."

Examples:

- "Session start establishes the operating boundary before AI-assisted work begins: repo, branch, objective, evidence, limits, and current state."
- "Repeated engineering friction becomes mechanism only when it points back to an owning source, an explicit boundary, and a verification path."
- "Repositories become execution surfaces where workflow contracts, runtime configuration, permissions, evidence, and repair loops converge."

## Titles

Titles should name the mechanism or boundary. Prefer calm, specific titles over slogans.

Good title shapes:

- "Session Start Is an Operational Boundary"
- "Repositories as Operational Execution Surfaces"
- "Structured Evidence and Interpreted Intent"
- "When Experience Becomes Automation"

Avoid titles that sound like a generic DevOps article, marketing page, or SEO query.

## Frontmatter

- `title`: visible title; keep it close to the article thesis.
- `description`: mechanism-first listing copy.
- `seo_title`: optional; use only when metadata needs a slightly clearer search/social title.
- `seo_description`: optional; use when metadata needs more precision than the visible description.
- `labels`: use precise labels that connect related notes. Prefer `engineering-memory`, `runtime-evidence`, `operational-truth`, `session-boundaries`, `repository-centric-engineering`, `workflow-automation`, and `ai-assisted-engineering` when accurate.

## New Note Checklist

- Does the note start from real engineering friction or inspected evidence?
- Is the owning source clear?
- Is the operational boundary clear?
- Does the note explain a mechanism, not just a preference?
- Is verification named or implied by concrete evidence?
- Does the lesson strengthen an existing source of truth instead of creating a new one?
- Are frontmatter description and labels specific?
- Does the body preserve the author's calm research voice?
