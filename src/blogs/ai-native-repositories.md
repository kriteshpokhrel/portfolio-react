---
title: "Part 5 · How I Make My Repos Easy for AI Agents"
date: "2026-07-12"
excerpt: "If agents are going to contribute to our codebases, the repository itself has to be built for them. This is a look at an AGENTS.md governance structure — an entry point that routes both humans and agents to the smallest relevant document instead of the whole codebase."
coverImage: "/covers/ai-native-repositories.svg"
---
***

*Part 5 of **AI, As I See It**, a personal series on what AI agents are really changing about how we build software — and what they aren't.*

> If humans are becoming the bottleneck, one of the more practical answers is to make the repository itself easier to reason about — for people and for agents. This is what that looked like in practice, on the projects I worked on.

## The Problem With Handing an Agent a Whole Repo

Modern coding agents are genuinely good, but I have learned they only shine when the repository gives them something to hold on to — clear documentation, architectural decision records, stable examples, boundaries, and some record of past decisions. Without that, an agent makes plausible but wrong assumptions. It introduces a second way to do something the codebase already has one way to do, invents a layer or dependency that was never there, duplicates a pattern that already exists, or puts a file on the wrong side of a module boundary.

Each of those is individually small. Together, over dozens of pull requests, they are how architecture quietly drifts.

There is also a cost problem. Scanning an entire repository to understand how it is put together is expensive — in tokens, in context, and in time. Every time an agent re-derives the architecture from raw code, you pay for it again.

## AGENTS.md as the Entry Point

The approach I settled on is a lightweight AI governance and documentation system, and the front door to all of it is a single file: `AGENTS.md`.

It is the first thing an agent should read, and it deliberately does *not* try to contain every rule. Instead it routes — it points to the smallest relevant document for the task at hand. It tells the agent what the stack is, where the architecture docs live, which parts of the codebase own which responsibilities, what kinds of changes require an ADR, and — just as importantly — what *not* to assume.

From there it branches into focused sections:

- **`docs/architecture/`** — how the system is actually built: repository map and ownership, runtime flow, the major components and how they interact, the data model, and a risk map of high-risk files and common agent mistakes.
- **`docs/standards/`** — the repeatable rules: code structure, naming, types, dependency boundaries, and when governance docs must be updated.
- **`docs/guides/`** — task-focused instructions like "how to add a new module" or "how to safely extend the data model."
- **`docs/adrs/`** — Architecture Decision Records, so architectural changes are traceable instead of mysterious six months later.
- **`templates/` and `examples/`** — copyable patterns, so agents learn from good existing code instead of inventing new shapes.

The discovery path becomes deterministic: read `AGENTS.md`, identify the task type, load only the relevant docs, follow the existing architecture, reuse templates and examples, and record an ADR when the architecture itself changes.

## Why This Helps Both Sides

The part I find most interesting is that this is not an "AI thing." It is a documentation thing that happens to serve agents well.

**For agents,** it reduces guessing and it reduces tokens. Instead of scanning the whole repository to reconstruct the architecture, an agent loads a few targeted documents into context. Less exploration, less cost, fewer hallucinations.

**For humans,** it is the same win we always wanted and rarely wrote down: faster onboarding, cleaner reviews, less architectural drift, clearer ownership across the codebase. New contributors read the same docs an agent does.

There is a subtler benefit too. It becomes far easier to *validate* a change by reading files — the ADR, the guide, the relevant standard — than by mentally re-executing the whole codebase to check whether a change is "allowed." Reading the code is still necessary; you do not get to skip that. But you are no longer starting from zero every time. The docs give you a cheap first pass, and the code gives you the confirmation.

## The Point

To me, an AI-native repository is really just a repository that is legible — one that can explain itself to whoever, or whatever, is about to change it. AGENTS.md is just the entry point. The real work is deciding, and writing down, how your system is meant to evolve.

---