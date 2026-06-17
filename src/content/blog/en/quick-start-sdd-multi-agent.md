---
# SPDX-License-Identifier: CC-BY-SA-4.0
# SPDX-FileCopyrightText: 2026 SubLang International <https://sublang.ai>
title: 'How to Get Started Fast with SDD + Multi-Agent Long-Horizon Tasks'
description: 'Use spec-driven development (SDD) to turn fragile conversation context into a shared source of truth, so multiple AI agents collaborate on long-horizon tasks without drifting — the shortest path you can start today.'
pubDate: 2026-06-17
categories:
  - blog
---

When several agents collaborate on a long-horizon task — one that spans many turns, many files, and several hours — the enemy is rarely raw model capability. It is **context drift**: each agent sees slightly different information, the goal wanders as the conversation grows, and rework and misunderstanding compound with every iteration.

Spec-driven development (SDD) answers this directly: use a versioned specification (spec) as the shared source of truth for every agent, turning fragile, easily-lost conversation context into a durable, citable protocol. This post gives you the shortest path to start today.

## Why long-horizon tasks need specs

Long-horizon work is fundamentally at odds with how large language models operate:

- **The context window is finite.** As a task drags on, the conversation gets compressed and forgotten, and early agreements slip away.
- **Parallel agents can't see each other.** When several agents work at once, none of them can see the others' in-flight decisions.
- **Without a shared source of truth, misunderstanding compounds.** Small per-turn deviations stack up until the work has drifted from the original intent.

A spec writes down *what to build, why, and where the boundaries are* as structured text, commits it to the repo, and has every agent read it before starting and write back to it when finished. Conversation is volatile; the spec is durable — that is the foundation of long-horizon collaboration.

## What a spec looks like

A spec is a natural-language description of a system's requirements and behavior. It should be versioned and kept in "eventual consistency" with the code. It doesn't need heavyweight tooling — a clear, predictable sentence shape is enough. We recommend writing each spec item in the [GEARS](/ref/gears-ai-ready-spec-syntax/) pattern:

```text
[Where <static precondition>] [While <runtime state>] [When <trigger>] The <subject> shall <behavior>.
```

For example:

```text
When the user submits the form, the system shall validate every required field and return the first error.
```

Three things to keep in mind: specs are **iterative** (they grow alongside the code, iteration by iteration — this is not a return to waterfall); specs can be **AI-drafted** (humans give intent, AI fills in detail); and specs stay in **eventual consistency** with code (intent first, write back after it lands).

## Five steps to get started

1. **Start from a one-sentence intent.** A human writes the intent first — don't rush to implementation. "What I want, and why" is enough to kick things off.
2. **Have an agent draft the intent into a spec.** Emit items in the GEARS pattern, with decision records (DRs) and iteration records (IRs) where useful. You review rather than write line by line.
3. **Decompose into one-commit-sized tasks.** Slice the spec into independent, separately-committable tasks and label their dependencies. The smaller the grain, the easier to parallelize and to roll back.
4. **Split the work across agents.** Each agent takes one task and its **first action is to read the relevant spec**, treating the spec as a protocol to execute rather than free improvisation.
5. **Close the loop and write back.** Review the output → write changes back into the spec to keep eventual consistency → update the index (e.g. `map.md`) so the next round is easy to find.

## A few practices that keep multiple agents on track

- **Single source of truth.** The spec lives in the repo, not in one conversation.
- **Self-contained items.** Each item carries no implicit dependency on context elsewhere; when it needs a reference, it links explicitly.
- **Small steps.** Tasks sized to one commit make both parallelism and rollback lighter.
- **Explicit handoff.** Agents hand off through specs and PRs, not by relaying a long transcript to the next agent.
- **Read first, write last.** Every agent's first action is to read the spec; its last action is to write the spec back.

## A minimal skeleton

You don't need a sprawling system on day one. A working `specs/` directory can be small:

```text
specs/
  decisions/   # decision records (DRs)
  iterations/  # iteration records (IRs)
  user/        # items for user-visible behavior
  dev/         # items for internal implementation
  map.md       # an index, for easy lookup
```

Start with one spec and one iteration, and let it grow with the code.

## Closing

A spec is not extra overhead; it is the infrastructure that makes "long-horizon" possible at all. When AI does the drafting and humans do the reviewing, the cost-benefit ratio of writing specs flips: you trade a small cost for a protocol that every agent can align on.

To go deeper on the spec syntax we use, read [*GEARS: the AI-Ready Spec Syntax*](/ref/gears-ai-ready-spec-syntax/).
