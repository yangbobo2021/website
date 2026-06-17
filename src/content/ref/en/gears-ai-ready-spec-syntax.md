---
# SPDX-License-Identifier: CC-BY-SA-4.0
# SPDX-FileCopyrightText: 2026 SubLang International <https://sublang.ai>
title: 'GEARS: the AI-Ready Spec Format'
description: 'An introduction to Generalized EARS, the specification syntax designed for AI-native software development'
pubDate: 2026-01-14
heroImage: ../../../assets/gears-hero.png
heroImageAlt: 'Applications of GEARS'
devtoUrl: 'https://dev.to/sublang/gears-the-spec-syntax-that-makes-ai-coding-actually-work-4f3f'
mediumUrl: 'https://medium.com/sublang/generalized-ears-the-ai-ready-spec-syntax-11ba36a37165'
categories:
  - engineering
---

Amazon's coding agent Kiro uses the Easy Approach to Requirements Syntax (EARS) in its specification-driven development workflow. It popularizes a practice: turn a vague prompt or context into a specification (spec) in a clear format, so both humans and agents can better understand.

EARS was developed by Alistair Mavin and colleagues at Rolls-Royce PLC and has become a widely adopted notation for writing clear, testable requirements. Its original paper won the 10-year most influential industry paper award in the IEEE International Requirements Engineering Conference 2019.

However, the notation was originally designed for high-level stakeholder requirements—not for the full spectrum of software specifications (specs) that modern development demands. Working with EARS in spec-driven development revealed friction points.

Therefore, we propose GEARS, generalized EARS or Generalized Expression for AI-Ready Specs. It extends EARS for the age of AI coding by preserving what made EARS successful while adapting the syntax for broader use in specs.

## What Are Specs

Specs are natural-language descriptions of system requirements and behaviors. Specs should be versioned and maintain "eventual consistency" with code so that they become the primary source of truth for AI to understand the system. In a broader sense, specs can also describe the decisions, plans, and changes made to a system, though GEARS doesn't cover them as they are auxiliary and less frequently cited in prompts or contexts for AI agents.

**Specs are the new “source code” for human developers.** We believe specs are essential to AI-native software development for two reasons:

- Without clear specs, misunderstandings among humans and LLMs constantly exist. Specs are the natural-language media for human developers and AI agents to communicate.
- There are always divisions of work in software even with the power of AI. Clear specs help humans and agents to understand and reuse system components.

**Specs are iterative.** It is *not* a return to the waterfall model. Specs grow from scratch along with the code iteration by iteration.

**Specs can be AI-generated.** It doesn't mean humans have to write every single line of specs. Usually human developers start with high-level and sometimes vague intent and discuss with AI. Then AI can help specify, propose considerations, and fill in details. Finally, AI can write the specs in the right format.

## Why Use GEARS

AI needs consistency. LLMs perform better with predictable structure. A spec format acts as a protocol between human intent and AI execution. Without it, misunderstandings easily propagate across iterations and create volatility and risk.

Humans need it too. The bottleneck in AI coding is rarely the agent’s capability—it's our ability to express what we want. A constrained syntax leads to clarity. You don't want to write a free-form prose; the structure helps us get precision.

AI reduces the “best practice tax”. GEARS is intentionally lightweight and intuitive, without the need for heavy tooling or training. Formal specs, comprehensive test cases, traceable requirements—all valuable, all expensive. But when AI drafts and humans only review, the cost-benefit ratio shifts dramatically.

Test cases should ideally use the same language. The original EARS was designed for requirements; testing frameworks may use BDD-style Given-When-Then. Maintaining two cognitive models creates burden for LLMs. GEARS unifies both, expressed in the same syntax.

## The GEARS Syntax

```markdown
[Where `<static precondition(s)>`]
[While `<stateful precondition(s)>`]
[When `<trigger>`]
The `<subject>` shall `<behavior>`
```

| Keyword | Purpose | Maps to GWT |
| ------- | ------- | ----------- |
| Where | Static precondition—configuration, feature flags, environment | Given (setup) |
| While | Stateful precondition—a condition that must hold during execution | Given (state) |
| When | Trigger—the event that initiates behavior | When |
| shall | Required behavior—what the subject must do | Then |

Brackets denote optional clauses. The original EARS uses "the system shall..." because it targeted system-level requirements. GEARS replaces this with `<subject>`—any noun: system, component, service, agent, function, artifact. This enables specs at all levels of decomposition.

The original EARS defines five patterns based on which keywords appear:

| Pattern | EARS Syntax (collapsed by GEARS) |
| ------- | ----------- |
| Ubiquitous | The `<system>` shall `<response>` |
| State-driven | While `<precondition>`, the `<system>` shall `<response>` |
| Event-driven | When `<trigger>`, the `<system>` shall `<response>` |
| Optional feature | Where `<feature>`, the `<system>` shall `<response>` |
| Unwanted behavior | If `<trigger>`, then the `<system>` shall `<response>` |

GEARS collapses these into one unified pattern, where the distinctions emerge from which optional clauses are present. This abstraction reduces cognitive burden and token cost for LLMs.

The "unwanted behavior" case deserves attention. EARS uses a distinctive pattern `If...then` to provide a visual signal that this is an edge case. GEARS drops this distinction and uses `shall not`. Structurally, error handling is just another trigger-response pair. The "unwantedness" lives in the semantics, not the syntax. GEARS prioritizes AI processing over human visual scanning.

The original EARS uses "where" for optional features and "while" for states. GEARS preserves both keywords but clarifies their semantics:

- "where" for static preconditions (configuration, deployment environment, feature flag);
- "while" for stateful preconditions (runtime condition that may change).

Examples of the distinction:

> Where the deployment is production, when a request fails, the service shall retry with exponential backoff.
>
> While the circuit breaker is open, when a request arrives, the service shall return a cached response.

The first is configuration—it won't change during execution. The second is state—it may transition at any moment.

## Examples of GEARS

- Ubiquitous: The `<subject>` shall `<behavior>`.

  > The mobile phone shall have a mass of less than 150 grams.

- State-Driven: While `<stateful precondition(s)>`, the `<subject>` shall `<behavior>`.

  > While no card is inserted, the ATM shall display "insert card to begin".

- Event-Driven: When `<trigger>`, the `<subject>` shall `<behavior>`.

  > When the user selects mute, the audio controller shall suppress all output.
  >
  > When the cache exceeds 80% capacity, the eviction policy shall remove the least recently used entries until capacity falls below 60%.

- Optional Feature: Where `<static precondition(s)>`, the `<subject>` shall `<behavior>`.

  > Where sunroof is installed, the vehicle shall include a sunroof control on the driver door.

- Complex (State + Event)

  > Where the user has granted file system access, when the user requests code generation, the coding agent shall write output to the specified directory.

- Error Handling

  > When an invalid credit card number is entered, the payment form shall display "please re-enter credit card details".

- Negative Expression

  > When an unauthenticated request arrives, the API shall not include stack traces in the response.

- Test Cases

  > Given the user is authenticated\
  > And the session is active\
  > When the user requests their profile\
  > Then the API returns the user's profile data

  Translated to GEARS:

  > While the user is authenticated and the session is active, when the user requests their profile, the API shall return the user's profile data.

## Application

To let LLM understand GEARS and use it for specs, simply put the following short text in your prompt or CLAUDE.md or AGENTS.md files.

```markdown
Each spec shall use the [GEARS](https://sublang.ai/ref/gears-ai-ready-spec-syntax) pattern:

[Where `<static precondition(s)>`] [While `<stateful precondition(s)>`] [When `<trigger>`] The `<subject>` shall `<behavior>`.

| Clause | Purpose | Example |
| ------ | ------- | ------- |
| Where | Static preconditions (features, config) | Where debug mode is enabled |
| While | Stateful preconditions (runtime state) | While the connection is active |
| When | Trigger event (at most one) | When the user clicks submit |
| shall | Required behavior | The form shall validate inputs |

Note: Clause keywords and punctuation follow natural language conventions.

Test specs shall use the same pattern, mapping Given-When-Then:

| GWT | Clause |
| --- | ------ |
| Given | Where + While |
| When | When |
| Then | shall |
```

To apply GEARS to your project, we've created a tool to help you get started.

```sh
npm install -g @sublang/spex
spex scaffold
```

Running the above, you will get a `specs` folder for scaffolding:

```sh
specs/
├── decisions/    # Decision Records (DRs)
├── iterations/   # Iteration Records (IRs)
├── user/         # User-facing specs
├── dev/          # System-internal specs
└── test/         # Verification specs
```

Spec files can be grouped into a directory hierarchy. Record files do not strictly follow GEARS.

⭐ If you find this tool useful, please star <https://github.com/sublang-ai/spex>. Thanks!

## Summary

GEARS extends EARS with four adaptations:

1. **Generalized subject**: Replace "the system" with any noun—system, component, agent, artifact—to fit the broader scope of specs.
2. **Unified pattern**: One syntax covers all cases. No separate patterns for features, states, events, or errors, reducing LLM cognitive burden and token cost.
3. **Clarified preconditions**: Where for static configuration, While for dynamic state, helping remove semantic ambiguity.
4. **Test-case equivalence**: The syntax maps directly to Given-When-Then, eliminating the need to maintain separate specification and testing languages.

The result is a spec syntax optimized for AI-native development: **consistent enough** for LLMs to parse reliably, **expressive enough** for humans or agents to write naturally, and **unified enough** that specs and tests are one.

## References

1. Mavin, A., Wilkinson, P., Harwood, A., & Novak, M. (2009). Easy Approach to Requirements Syntax (EARS). 17th IEEE International Requirements Engineering Conference, pp. 317–322. <https://doi.org/10.1109/RE.2009.9>
2. Mavin, A. (2009). Easy Approach to Requirements Syntax (EARS). <https://alistairmavin.com/ears>
3. North, D. (2006). Introducing BDD. <https://dannorth.net/introducing-bdd/>

> AI Usage Statement: Claude Opus 4.5 and GPT-5.2 used for language polishing only on the human-written full draft.
