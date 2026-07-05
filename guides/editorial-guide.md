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
- `classification`: optional research role for the note. Use one of `Observation`, `Experiment`, `Pattern`, `Model`, or `Principle`.
- `models`: optional comma-separated model slugs. Add a model only when the article directly supports, tests, or explains that model.
- `questions`: optional comma-separated question slugs. Use only for questions the note materially raises or advances.

## Classifications

- `Observation`: a grounded note about something seen in real work.
- `Experiment`: a test of a workflow, tool, structure, or research loop.
- `Pattern`: a reusable mechanism that has appeared more than once.
- `Model`: a structured explanation of how several patterns or principles fit together.
- `Principle`: a stable operating rule or boundary that should guide future work.

Do not over-classify. The classification should describe the article's role in the research system, not every topic it mentions.

## Models

Model pages live in `src/models/` and render under `/models/`. A model is a living research note that connects observations into reusable engineering knowledge.

Model frontmatter:

- `title`
- `version`
- `status`
- `date`
- `summary`
- `labels`
- `questions`

Keep early models as `status: draft`. Draft model pages are rendered for review but should not be treated as settled public claims.

Link an article to a model when the article provides evidence for the model, tests the model, refines its language, or explains one of its boundaries. Do not link an article to a model just because it shares a broad topic label.

Current limitations:

- Frontmatter is flat `key: value`; do not use YAML arrays.
- `models` and `questions` are comma-separated slugs.
- Questions do not have pages yet.
- Model version relationships are not represented yet.

## New Note Checklist

- Does the note start from real engineering friction or inspected evidence?
- Is the owning source clear?
- Is the operational boundary clear?
- Does the note explain a mechanism, not just a preference?
- Is verification named or implied by concrete evidence?
- Does the lesson strengthen an existing source of truth instead of creating a new one?
- Are frontmatter description and labels specific?
- Is the classification accurate and restrained?
- Does any model link represent a real relationship?
- Does the body preserve the author's calm research voice?
