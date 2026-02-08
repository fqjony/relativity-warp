---
title: Context-Driven Engineering
description: Make context explicit so automation becomes stable, verifiable, and repeatable.
type: article
labels: engineering, development, software, automation, physics
---

# Context-Driven Engineering

Context-driven engineering treats repository structure, manifests, and execution rules as first-class inputs. When context is explicit, output becomes stable.

## Problem statement

- Real repos contain hidden rules: owners, deploy targets, environment constraints.
- Systems drift when rules are implicit.
- Repeatability collapses when inputs are not explicit.

## The context surface

A minimal context surface should expose:

- Source boundaries and output roots.
- Allowed commands and tool versions.
- Manifests for data inputs.
- Verification steps and gates.

## How to implement it

1. Publish repo structure and build outputs.
2. Store manifests for inputs (`src/manifests/`).
3. Define execution rules (`scripts/`, `README`).
4. Make verification a requirement, not an option.

## Physics note

Treat context like the coordinate system. If you change the frame, your results drift. Fix the frame and the system becomes predictable.

## Flow (placeholder)

- Context surface → Step plan → Artifact → Verify → Publish
