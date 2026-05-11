---
# SPDX-License-Identifier: CC-BY-SA-4.0
# SPDX-FileCopyrightText: 2026 SubLang International <https://sublang.ai>
title: 'GEARS：面向 AI 的规范语法'
description: 'Generalized EARS 简介——为 AI 软件开发设计的规范语法'
pubDate: 2026-05-11
heroImage: ../../../assets/gears-hero.png
heroImageAlt: 'GEARS 规范生命周期示意图'
categories:
  - engineering
---

亚马逊的 Kiro 在其“规范驱动开发”流程中采用了 EARS（Easy Approach to Requirements Syntax，简明需求语法）。它推广了一种实践：把模糊的提示或上下文转写为格式清晰的规范（spec），让人和智能体都能更好理解。

EARS 由 Alistair Mavin 和他在罗罗（Rolls-Royce）的同事们提出，已经成为编写清晰、可测需求的常用记法。其原始论文获得了 2019 年 IEEE 国际需求工程大会颁发的“十年最具影响力产业论文奖”。

然而，这套记法最初是为高层利益相关方需求而设计的，并未覆盖现代软件开发所需的完整规范谱系。在实际规范实践中使用 EARS，会暴露出一些摩擦点。

因此，我们提出 GEARS——Generalized EARS，或 Generalized Expression for AI-Ready Specs（面向 AI 规范的通用表达式）。它在保留 EARS 成功要素的同时，把语法扩展到 AI 编码时代下更广泛的规范用途。

## 什么是规范

规范（spec）是对系统需求和行为的自然语言描述。规范应当被版本管理，并与代码保持“最终一致”，从而成为 AI 理解系统的主要事实来源。从更宽泛的视角看，规范也可以描述对系统做出的决策、计划与变更，但 GEARS 不覆盖这些——它们属于辅助信息，在面向 AI 的提示或上下文中较少被引用。

规范是人类开发者的新“源代码”。我们认为，规范对 AI 时代的软件开发至关重要，原因有二：

- 没有清晰的规范，人与大语言模型（LLM）之间、人与人之间的误解就会持续存在。规范是人类和 AI 开发者之间沟通的自然语言载体。
- 即便有 AI 的能力加持，软件开发中仍然存在分工。清晰的规范有助于人和 LLM 理解并复用系统的各个组件。

规范是迭代式的。这并不是回归瀑布模型。规范与代码一起，逐次迭代地从零起步、不断成长。

规范可以由 AI 生成。这并不意味着每一行规范都要由人来写。通常，人类开发者从高层、有时甚至模糊的意图出发，与 AI 讨论；随后 AI 可以协助澄清要求、提出注意事项、补全细节，最后以合适的格式落笔成文。

## 为什么使用 GEARS

AI 需要一致性。结构可预期时，LLM 表现更好。规范格式充当了人类意图与 AI 执行之间的协议。缺少这一协议，误解就会在多轮迭代中扩散，带来不稳定和风险。

人类同样需要它。AI 编码的瓶颈很少在 LLM 的能力本身，而在于我们能否清晰表达自己想要什么。受限的语法反而带来清晰：你不会想用自由散漫的散文，正是结构帮助我们达成精确。

AI 降低了“最佳实践税”。GEARS 刻意保持轻量与直觉，无需繁重的工具或培训。正式规范、完整测试用例、可追溯需求——都很有价值，但都很昂贵。当 AI 起草、人类评审时，成本-收益的比率会发生显著变化。

测试用例应使用同一套语言。原始的 EARS 面向需求；测试框架则使用 BDD（行为驱动开发）风格的 Given-When-Then。维持两套心智模型会增加 LLM 的负担。GEARS 在同一语法下统一了两者。

## GEARS 语法

```markdown
[Where `<static precondition(s)>`]
[While `<stateful precondition(s)>`]
[When `<trigger>`]
The `<subject>` shall `<behavior>`
```

| 关键字 | 含义 | 对应 GWT |
| ------- | ------- | ----------- |
| Where | 静态前置条件——配置、特性开关、环境 | Given（设置） |
| While | 状态前置条件——执行期间必须成立的条件 | Given（状态） |
| When | 触发——引发行为的事件 | When |
| shall | 必需行为——主体必须做的事 | Then |

方括号表示可选子句。EARS 之所以使用 “the system shall…”，是因为它针对系统级需求。GEARS 把它替换为 `<subject>`——任意名词：系统、组件、服务、智能体、函数、产物。这样就允许在各种分解粒度上撰写规范。

EARS 根据出现的关键字定义了五种模式：

| 模式 | EARS 语法（被 GEARS 合并） |
| ------- | ----------- |
| 普适（Ubiquitous） | The `<system>` shall `<response>` |
| 状态驱动（State-driven） | While `<precondition>`, the `<system>` shall `<response>` |
| 事件驱动（Event-driven） | When `<trigger>`, the `<system>` shall `<response>` |
| 可选特性（Optional feature） | Where `<feature>`, the `<system>` shall `<response>` |
| 非预期行为（Unwanted behavior） | If `<trigger>`, then the `<system>` shall `<response>` |

GEARS 把这些都合并为一个统一模式，其差异由出现哪些可选子句来体现。这种抽象同时降低了 LLM 的认知负担和 token 成本。

“非预期行为”这一情况值得专门提及。EARS 用 `If...then` 在视觉上把它标记成边界情况；GEARS 取消了这一区分。从结构上看，错误处理也只是一组触发-响应。“非预期”属于语义层面，而不属于语法层面。GEARS 优先考虑 AI 处理，而不是人眼扫读。

EARS 用 “where” 表示可选特性，用 “while” 表示状态。GEARS 保留这两个关键字，但把语义讲得更清楚：

- “where” 表示静态前置条件（配置、部署环境、特性开关）；
- “while” 表示状态前置条件（运行期可能变化的条件）。

区分示例：

> Where the deployment is production, when a request fails, the service shall retry with exponential backoff.
>
> While the circuit breaker is open, when a request arrives, the service shall return a cached response.

第一句是配置——执行期间不会改变；第二句是状态——可能在任意时刻发生转移。

## GEARS 示例

- 普适：The `<subject>` shall `<behavior>`.

  > The mobile phone shall have a mass of less than 150 grams.

- 状态驱动：While `<stateful precondition(s)>`, the `<subject>` shall `<behavior>`.

  > While no card is inserted, the ATM shall display "insert card to begin".

- 事件驱动：When `<trigger>`, the `<subject>` shall `<behavior>`.

  > When the user selects mute, the audio controller shall suppress all output.
  >
  > When the cache exceeds 80% capacity, the eviction policy shall remove the least recently used entries until capacity falls below 60%.

- 可选特性：Where `<static precondition(s)>`, the `<subject>` shall `<behavior>`.

  > Where sunroof is installed, the vehicle shall include a sunroof control on the driver door.

- 复合（状态 + 事件）

  > Where the user has granted file system access, when the user requests code generation, the coding agent shall write output to the specified directory.

- 错误处理

  > When an invalid credit card number is entered, the payment form shall display "please re-enter credit card details".

- 否定式表达

  > When an unauthenticated request arrives, the API shall not include stack traces in the response.

- 测试用例

  > Given the user is authenticated\
  > And the session is active\
  > When the user requests their profile\
  > Then the API returns the user's profile data

  转写为 GEARS：

  > While the user is authenticated and the session is active, when the user requests their profile, the API shall return the user's profile data.

## 应用

要让 LLM 理解 GEARS 并用它来写规范，只需把下面这段短文放进你的提示词，或 CLAUDE.md / AGENTS.md 文件即可。

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

要把 GEARS 应用到你的项目中，我们准备了一个脚手架工具：

```sh
npm install -g @sublang/spex
spex scaffold
```

运行上述命令后，你会得到如下结构的 `specs` 目录：

```sh
specs/
├── decisions/    # 决策记录（DRs）
├── iterations/   # 迭代记录（IRs）
├── user/         # 面向用户的规范
├── dev/          # 开发规范
└── test/         # 验证规范
```

规范文件可以按目录层级组织。记录类文件并不严格遵循 GEARS。

⭐ 如果你觉得这个工具有帮助，欢迎给 <https://github.com/sublang-ai/spex> 点个 Star。

## 总结

GEARS 在四个方面扩展了 EARS：

1. **通用化主体**：用任意名词——系统、组件、智能体、产物——替代 “the system”。
2. **统一模式**：一套语法覆盖所有情况；不再为特性、状态、事件、错误设置不同模式。
3. **明确的前置条件**：Where 表示静态配置，While 表示动态状态。
4. **测试用例的等价表达**：语法可以直接映射到 Given-When-Then，无须再为规范和测试维护两套语言。

由此得到的规范语法面向 AI 驱动的开发：**对 LLM 足够一致**以便可靠解析，**对人类足够富有表达力**以便自然书写，**足够统一**以使规范与测试合而为一。

## 参考文献

1. Mavin, A., Wilkinson, P., Harwood, A., & Novak, M. (2009). Easy Approach to Requirements Syntax (EARS). 17th IEEE International Requirements Engineering Conference, pp. 317–322. <https://doi.org/10.1109/RE.2009.9>
2. Mavin, A. (2009). Easy Approach to Requirements Syntax (EARS). <https://alistairmavin.com/ears>
3. North, D. (2006). Introducing BDD. <https://dannorth.net/introducing-bdd/>

> AI 使用声明：本文中文版由 Claude Opus 4.7 据英文原文翻译。英文原稿由人撰写，Claude Opus 4.5 与 GPT-5.2 仅用于其语言润色。
