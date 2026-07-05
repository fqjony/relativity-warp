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
- `classification`: optional research role for the source record. Use one of `Concept`, `Model`, `Research Note`, or `Reference`.
- `models`: optional comma-separated model slugs. Add a model only when the article directly supports, tests, or explains that model.
- `questions`: optional comma-separated question slugs. Use only for questions the note materially raises or advances.

## Research Memory Declarations

Write source metadata so the site can explain relationships without turning dated articles into mutable landing pages.

- Articles under `src/docs/` are evidence. Preserve their `/spectrum/<slug>/` URLs and improve their relationships through metadata, not route changes.
- Concepts under `src/research/` are durable research objects. Use them for current vocabulary, claims, status, maturity, and open questions.
- Models under `src/models/` explain relationships. Link notes to models only when the note provides evidence for the model, tests it, or clarifies one of its boundaries.
- Do not fabricate a relationship to fill a UI section. Empty metadata is better than a false trail.
- Prefer existing slugs in `labels`, `models`, `questions`, `evidence`, `references`, `related`, `depends_on`, and `supports` so generated pages can link real source records.

When adding or revising a research object, check whether these fields are known:

- `summary`: why the object matters in one sentence.
- `status`, `maturity`, `confidence`: current state and strength.
- `evidence`: supporting research objects, Spectrum article slugs, or model slugs.
- `references`: related source notes that are useful but not direct evidence.
- `related`, `depends_on`, `supports`, `contradicts`: explicit research graph edges.
- body section `## Open Questions`: unresolved questions not yet represented as their own research objects.

## Classifications

- `Concept`: a canonical research idea or vocabulary object. Prefer a `src/research/` page when the object should remain current.
- `Model`: a structured relationship model. Prefer a `src/models/` page when the object explains a versioned model or framework.
- `Research Note`: a dated Spectrum article under `src/docs/`; use this for observations, experiments, patterns, and synthesis tied to a moment in the research thread.
- `Reference`: a stable supporting reference, guide, index, or source note that helps readers or agents navigate the research body.

Do not over-classify. The classification should describe the record's role in the research system, not every topic it mentions. Existing published notes may retain older classification values; do not rewrite them only to reorganize navigation.

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
