---
title: The Workflow Around the Agent
description: Useful AI work depends on how engineers combine models, tools, instructions, and feedback, and what each iteration leaves ready for reuse.
status: draft
date: 2026-10-15
datetime: 2026-10-15 11:15
labels: ai-assisted-engineering, workflow-automation, engineering-memory, repository-centric-engineering
classification: Research Note
models:
questions: what-makes-engineering-knowledge-reusable
---

# The Workflow Around the Agent

Trying to continue engineering work with a local model changed how I think about the system around an AI agent.

The attraction was straightforward: keep the working context locally, run a model without depending on a remote service, and continue useful work. On my machine, the local models I tried demanded too much memory and compute for the quality of work I was getting. Having an agent available offline was less useful than I had expected.

That experience shifted my attention toward the toolkit: the scripts, applications, commands, documentation, and workflow parts that let me do the work. AI can help build and improve those parts. It can also participate when a task needs interpretation or adaptation. The useful arrangement depends on the task and the capabilities available.

## Availability Was Only One Question

[Offline Work Begins at the Work Host](/spectrum/2026-09-18-changing-the-agent-without-losing-the-work/) asked whether a new session could recover its instructions, repository state, boundaries, and local checks when remote services disappeared. Keeping those sources available still matters.

My later experience adds a practical question: can the available combination of tools and models do the work well enough to be worth using?

A local model can have access to the right context and still struggle with the task. A script or application may carry out part of that work directly. Another part may need a more capable model, current remote evidence, or an engineer's judgment. Continuing work means knowing which of those parts remain useful under the present conditions.

There is room for specialized local components in that arrangement. [TinyAgent](https://arxiv.org/html/2409.00608v1), for example, demonstrates a small model running on a MacBook after training to plan calls to a limited set of tools. That involves a different task and engineering investment from running a general coding agent. Local deployment, model capability, and task scope each affect the decision.

This changes what I want to preserve from an AI session. A working conversion tool, a documented procedure, or a reusable check gives me something I can use again through several execution paths. Its value can outlast the model and conversation that helped produce it.

## Engineers Compose the Work

The [earlier workflow definition](/spectrum/2026-05-18-repo-centric-workflows/) already includes intent, rules, context, executable parts, outputs, and feedback. A pipeline is one path through that larger arrangement.

In daily work, I combine manual investigation, scripts, command-line tools, applications, and agents. A pipeline can invoke an agent for one step or several. An engineer can define the steps closely, or give an agent a prepared environment and enough guidance to choose how to proceed.

The degree of freedom is an engineering choice. A routine transformation may have a clear implementation. An unfamiliar input may need interpretation. Building an application may involve repeated analysis, implementation, tests, and feedback before the useful workflow even exists.

This gives AI two roles that often meet in the same project. It helps analyze the problem and build the tools. It can then execute parts of the resulting workflow where its ability to understand and adapt is useful. An agent that helped create a tool does not have to remain a dependency of every later run.

## Interpretation Can Be a Workflow Step

One capability I find especially useful is translation between definitions that already exist.

A system may express the same kind of intent through a manifest, a command, a configuration file, or installation instructions. Conventional tooling needs rules for the forms it supports. An agent can read the source in context and derive the interpretation needed for the current task, guided by engineering instructions.

A [public Docker dependency updater](https://github.com/udx/worker/blob/latest/.github/workflows/docker-dependency-updater.yml) illustrates the distinction. It combines a generated package report with a Copilot step instructed to identify other dependency definitions from the Dockerfile and consult their upstream sources. The Dockerfile remains the maintained definition; the agent interprets it for the update task. Explicit probing and interpretation both have a place in the workflow.

The attraction is avoiding a separate catalog of every dependency pattern just to make the task executable. I think of this as translation: the agent connects an existing definition to the action I need. Engineers still define what the result must mean, what may change, and how to check it. For data normalization, that includes decisions such as units, date conventions, and how to handle missing or ambiguous values.

This division appears in [DocETL](https://ucbepic.github.io/docetl/), which combines operations expressed in natural language with explicit output schemas and pipeline optimization. Interpreting varied inputs and defining a dependable result are complementary parts of the work.

This develops the boundary in [Structured Evidence and Interpreted Intent](/spectrum/2026-05-18-structured-evidence-interpreted-intent/). Source authority and the method used to read a source are separate questions. An agent can interpret a structured definition; that interpretation remains a proposal to check against the source and the resulting behavior.

## Feedback Improves the Toolkit

For analysis and application development, much of the value comes from the feedback loop. I can examine an explanation, try an implementation, inspect its output, and use the result to guide the next iteration. Engineering expertise shapes both the question and the judgment of the answer.

The feedback needs something concrete to evaluate. A transformation should preserve the facts it is meant to carry. An application should perform the interactions it promises. Tests, source comparisons, and trying the actual result give the next iteration evidence to work from. Another model can help review, but its assessment also needs checking against those outcomes.

What survives can take several forms. A repeated operation becomes a script. An unclear decision becomes documentation. A recurring mistake becomes a check. A task that needs adaptation can remain an agent step with maintained instructions and a defined output.

The destination can become clear during later work. I may capture a useful observation, verify it, and then normalize, integrate, or convert it when its next use is known. Engineering memory participates throughout that work: it supplies guidance, helps interpret feedback, and changes as the tools and understanding improve.

That includes simplifying what was previously useful. In [Anthropic's harness experiments](https://www.anthropic.com/engineering/harness-design-long-running-apps), some orchestration could be removed as model capability improved, while evaluation still helped with harder tasks. A preserved instruction or workflow part should remain open to the same question: does it still improve the work enough to justify its cost?

## Judge the Whole Task and Its Next Use

For my own work, effectiveness includes the effort to prepare the task, run it, inspect the result, correct mistakes, and accept the outcome. Reusable tooling also has setup and maintenance costs. Faster generation can help, but the result has to justify the complete path taken to produce it.

Different benefits need separate judgments. A tool may save time, reduce the effort of an investigation, or make a task practical that I would otherwise leave undone. [METR's follow-up on developer productivity](https://metr.org/blog/2026-02-24-uplift-update/) describes how changes in task selection and concurrent agent use complicate measurement. A single claim about being faster would miss some of what I want to understand.

The next test is a later use. Can I return with a fresh session or a different tool and complete useful work from what the previous iteration left behind? I want to examine the accepted result, the effort needed to reach it, and whether the retained guidance helped. A failure should show where to improve the script, instructions, source, or check; repeated success may show which parts can be simplified.

For the engineering-memory model, this raises a question beyond whether the necessary sources are reachable: how does preserved understanding help us choose, verify, and revise an effective way to continue the work?
