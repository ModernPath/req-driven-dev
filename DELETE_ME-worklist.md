# DELETE ME — Combined process-review worklist

```text
EPIC -> UR -> SR -> CODE -> TEST_CASE -> TEST_RESULT

EPIC: PROPOSED -[HUMAN]-> TODO -> IN_PROGRESS -> IN_REVIEW -[HUMAN]-> DONE

UR:   DERIVED -[HUMAN]-> PROPOSED -[HUMAN]-> TODO -> IN_PROGRESS -> IN_REVIEW -[HUMAN]-> DONE

SR:   DERIVED -[HUMAN]-> PROPOSED -[HUMAN]-> TODO -> IN_PROGRESS -> IN_REVIEW -[HUMAN]-> DONE

TRACE GATE: PENDING -> PASS | FAIL; PASS | FAIL -> STALE -> PASS | FAIL

HUMAN GATE: DRAFT -> OPEN -> ANSWERED -> CLOSED | DRAFT/OPEN/ANSWERED -> SUPERSEDED
```

## Item ownership

| Item | Owns |
|---|---|
| EPIC | Capability goal, delivery scope and lifecycle, UR/SR membership, cross-cutting specifications and decisions, human gates, aggregate evidence, and completion record |
| UR | Actor, context, user outcome, source, inline acceptance scenarios, requirement lifecycle, and upper-loop evidence |
| SR | The smallest independently implementable and verifiable system behavior, source UR/scenario links, boundary and contracts, owner/release, technical reconnaissance, implementation context, change boundary, requirement lifecycle, lower-loop evidence, test-case/result links, and code links |
| CODE | Files, symbols, commits, and PRs that implement the SR |
| TEST_CASE | Stable test identity and the targeted UR scenario or SR clause |
| TEST_RESULT | Observed PASS/FAIL/SKIP outcome and RED/GREEN role, command/report, validity, and tested branch/revision |

`TASK` has no distinct canonical ownership. Its former scope, context, test,
evidence, and code fields belong to the SR. If a proposed SR needs multiple
independent implementation units, split it into multiple SRs.

## Trace lenses

| Lens | Projection |
|---|---|
| Product | `EPIC -> UR -> acceptance scenarios` |
| System | `UR acceptance scenario -> SR` |
| Delivery | `EPIC -> active/done URs and SRs` |
| Implementation | `SR -> CODE` |
| Upper evidence | `UR acceptance scenario -> TEST_CASE -> TEST_RESULT` |
| Lower evidence | `SR -> CODE -> TEST_CASE -> TEST_RESULT` |
| Reverse trace | `TEST_RESULT -> TEST_CASE -> CODE -> SR -> UR -> EPIC` |

An SR has one owning epic and may support multiple UR scenario clauses within
that epic. A test may cover multiple clauses only when every target and
assertion is explicit. Every lens projects the same links; none creates a
second source of authority.

## Trace-gate examples

| Trace gate | What `PASS` proves | Consequence |
|---|---|---|
| Requirement confirmation | The `DERIVED` candidate statement, inference sources, proposed ancestry/links, conflicts, consequences, and brief are complete for the current fingerprint | The human confirmation gate may become `OPEN`; the trace remains candidate-only until its answer is applied |
| Entry | The confirmed ancestry, sourced requirement content, scope, reconnaissance, cold review, test strategy, and routed decisions are complete for the current fingerprint | The human entry gate may become `OPEN`; approval may move the named epic and requirements to `TODO` |
| Start | The approved entry fingerprint is still current and the expected RED `TEST_RESULT` exists against the intended `TEST_CASE` for the expected reason | The affected requirement may move from `TODO` to `IN_PROGRESS` without another human interaction |
| Lower/upper review | The current `CODE -> TEST_CASE -> TEST_RESULT` links prove the named SR clauses and UR acceptance content, including required RED-first and post-cleanup evidence | The evidence axes may reach `LOWER_VERIFIED`/`UPPER_VALIDATED`, and fulfilled SRs, URs, and their epic may move to `IN_REVIEW` |
| Completion | The full trace is delivered, its required results are current at the delivered revision, records and derived views are reconciled, and gaps/deferrals are disclosed | The human completion gate may become `OPEN`; acceptance may move the named requirements and epic to `DONE` |

A trace-gate `PASS` means its own condition is proven; it does not mean every
linked test result has outcome `PASS`. In particular, the start gate passes
when the expected `FAIL` result establishes RED for the expected reason.

Temporary worklist for the semantic review of PRs #5–#9 on
`review/prs-5-9`. Delete this file after every item is resolved or moved into
the repository's permanent tracking system.

- Source: `USER:2026-08-19:record the combined review findings and tackle them one by one`
- Scope: root Markdown files, `process/`, `skills/`, and `templates/`
- Status vocabulary: `OPEN | IN_PROGRESS | RESOLVED | DEFERRED`
- Rule: resolving an item requires updating every affected instruction, prompt,
  status definition, and record template together.

## Queue

| ID | Severity | Status | Finding |
|---|---|---|---|
| DM-01 | HIGH | RESOLVED | `DERIVED` requirements wait for human confirmation before loop entry |
| DM-02 | HIGH | RESOLVED | `DERIVED` is represented on the requirement work-state axis, not the specification axis |
| DM-03 | HIGH | RESOLVED | Epic is the trace root and fast-lane work retains the complete trace |
| DM-04 | HIGH | RESOLVED | Strict human gates run only after their transition traces are fulfilled |
| DM-05 | HIGH | RESOLVED | Epic owns delivery; scenarios are UR content; SR owns the executable slice |
| DM-06 | MEDIUM | RESOLVED | Invalidated evidence has no defined status consequence |
| DM-07 | MEDIUM | RESOLVED | Gate lifecycle and answer channel are underspecified |
| DM-08 | MEDIUM | RESOLVED | Agent-process start was incorrectly treated as a process boundary |
| DM-09 | MEDIUM | OPEN | Commit-at-every-waypoint conflicts with no-op waypoints |

- Resolved in this repository: `DM-01`, `DM-02`, `DM-03`, `DM-04`, `DM-05`,
  `DM-06`, `DM-07`, `DM-08`
- Next unresolved item: `DM-09`
- Resolution commits:
  - `d477bf5` (`Hold DERIVED requirements for human confirmation`) — DM-01,
    DM-02
  - the commit containing this worklist update — DM-03
  - the commit containing the DM-04 resolution — DM-04
  - the commit containing the DM-05 resolution — DM-05
  - the commit containing the DM-06/DM-07 resolution and lifecycle/trace
    vocabulary update — DM-06, DM-07
  - the commit removing runtime/UI concepts from the process model — DM-08

### Process boundary

Agent-process lifetime, control interfaces, and transport mechanisms are not
process concepts. They may consume the canonical records, but they cannot
redefine the items, gates, traces, lifecycle states, or evidence rules
documented here.

## DM-01 — Hold derived requirements before loop entry

- Status: `RESOLVED`
- Finding: the former `SPEC-DERIVED` marker treated as-built documentation as
  non-gating even when the inferred requirement itself had never been confirmed.
- Decision: `USER:2026-08-19:add DERIVED state for an inferred requirement and
  hold all further action for human confirmation`.
- Resolution: `DERIVED` is now a pre-lifecycle requirement state. It emits a
  confirmation gate, keeps proposed links candidate-only, and blocks epic,
  acceptance content, SR, test, implementation, verification, release,
  and delivery progression. Confirmation/correction enters the normal
  requirement lifecycle; rejection retires the candidate and its links.
- References: `AGENTS.md#Non-negotiable rules`,
  `process/V-model-loop.md#Derived requirement confirmation`,
  `process/state-tracking.md#Requirement ledger`.
- Resolution record: `d477bf5` on `review/prs-5-9`.

## DM-02 — Represent derived state on the requirement axis

- Status: `RESOLVED`
- Finding: the former marker was placed on the specification axis even though
  uncertainty belongs to the inferred requirement and its trace.
- Decision: use requirement `work_status: DERIVED`; retain only
  `SPEC-DRAFT -> SPEC-READY -> SPEC-APPROVED` on the specification axis.
- Resolution: ledgers, progress/work-list views, prompts, templates, gates, and
  the as-built verification skill now
  distinguish unconfirmed `DERIVED` requirements from confirmed
  `PENDING_VERIFICATION` requirements.
- References: `process/state-tracking.md#Requirement ledger`,
  `templates/work/REQUIREMENTS.md`, `skills/rdd-verify/SKILL.md`.
- Resolution record: `d477bf5` on `review/prs-5-9`.

## DM-03 — Define the fast-lane trace

- Status: `RESOLVED`
- Finding: the binding rules inverted ownership as `UR -> EPIC` and planning
  treated an epic and the fast lane as alternatives, even though an epic is the
  top-level delivery item that holds URs.
- Decision: `USER:2026-08-19:Epic is the top-level item that holds UR; update
  the binding rule throughout the instructions and its loops`.
- Resolution: the canonical trace is now
  `EPIC -> UR -> SR -> CODE -> TEST_CASE -> TEST_RESULT`. Every full or
  fast-lane trace has an owning epic. Acceptance scenarios are content within a
  UR, not separate trace or lifecycle entities. The fast lane is a lightweight
  entry route within that epic: it may skip preparing and approving a new full epic
  specification set only when all fast-lane conditions hold, but it retains
  every trace level and both red-first evidence arms.
- References: `AGENTS.md#Non-negotiable rules`, `README.md#Core invariants`,
  `process/V-model-loop.md#Trace hierarchy`,
  `process/V-model-loop.md#Epic ownership and specification gate`,
  `process/V-model-loop.md#Fast lane`,
  `process/prompts.md#1. Plan a user outcome`,
  `process/prompts.md#3. Execute one development-loop slice`,
  `process/state-tracking.md#Requirement ledger`,
  `skills/rdd-verify/SKILL.md#Enter through the same gate as any other change`.
- Resolution record: commit containing this worklist update on
  `review/prs-5-9`.

## DM-04 — Establish completion-gate ordering

- Status: `RESOLVED`
- Finding: the lifecycle records the human completion decision before delivery,
  while the completion-review prompt requires human approval and source
  delivery to be confirmed before requesting that approval.
- References: `AGENTS.md#Working loop`,
  `process/V-model-loop.md#Strict human transitions`,
  `process/V-model-loop.md#Development loop`,
  `process/prompts.md#5. Deliver, reconcile, and review completion`.
- Decision: `USER:2026-08-19:strict human gates are requirement
  DERIVED-to-PROPOSED, epic/requirement PROPOSED-to-TODO, and
  epic/requirement IN_REVIEW-to-DONE; do not request human input until the
  traces for the transition are fulfilled`.
- Resolution: a strict gate now contributes only the human decision after every
  non-human prerequisite for its target state is recorded. Evidence moves the
  epic and requirements to `IN_REVIEW`; they remain there through authoritative
  delivery, delivered-revision evidence, and state reconciliation. Only then is
  the completion brief solicited. An accepted scoped answer moves the named
  requirements and their epic to `DONE`. Completion acceptance
  therefore accepts an already-delivered result and never authorizes delivery.
  Entry and derived-confirmation gates follow the same fulfilled-before-asking
  rule. One scoped answer may cover explicitly named entities, but each entity
  transition and `USER:` source is recorded.
- Resolution boundary: this defines gate placement, eligibility, and transition
  ordering. DM-07 defines the gate state machines and answer record.
- Resolution record: commit containing this resolution on `review/prs-5-9`.

## DM-05 — Define status vocabularies per entity

- Status: `RESOLVED`
- Finding: the former model let UR, SR, ledger, and epic lifecycle vocabularies
  disagree about their final state and mixed lifecycle status with separate
  upper/lower evidence axes.
- References: `process/V-model-loop.md#Trace hierarchy`,
  `process/V-model-loop.md#Status model`,
  `process/state-tracking.md#Requirement ledger`,
  `process/state-tracking.md#Epic record`.
- Decision: `USER:2026-08-19:align the requirement lifecycles to match the UR`.
  UR and SR use the same requirement work-status sequence; `LOWER_VERIFIED`
  remains SR evidence rather than an SR work status.
- Decision: `USER:2026-08-19:Epic should get the lifecycle and SCN is just
  content for a UR`.
- Decision: `USER:2026-08-19:Task has no distinct purpose beyond collecting SR,
  test, and code; remove it and put its execution content on SR`.
- Decision: `USER:2026-08-19:extend the trace from CODE through TEST_CASE and
  TEST_RESULT; rename the entity entry state to TODO and the requirement final
  state to DONE`.
- Resolution: EPIC owns repository `delivery_status` through
  `PROPOSED -> TODO -> IN_PROGRESS -> IN_REVIEW -> DONE`; UR and SR share the
  requirement work lifecycle; acceptance scenarios are UR content with upper
  evidence but no independent status; and SR is the smallest independently
  implementable and verifiable slice. SR absorbs the former TASK scope,
  technical context, change boundary, lower RED, evidence, tests, and code
  links. The canonical trace is
  `EPIC -> UR -> SR -> CODE -> TEST_CASE -> TEST_RESULT`. Epic delivery status
  remains separate from the upper and lower evidence axes.
- Resolution record: commit containing this resolution on `review/prs-5-9`.

## DM-06 — Define consequences of invalidated evidence

- Status: `RESOLVED`
- Finding: evidence on an unreachable revision becomes invalid, but trace
  staleness is not an automatic work-status transition and no explicit demotion
  or propagation rule is defined. A row can therefore retain a status that
  requires current direct evidence after its evidence is invalidated.
- References: `AGENTS.md#Non-negotiable rules`,
  `process/state-tracking.md#Evidence state`.
- Decision: `USER:2026-08-19:non-human gates for independent AI in the V-loop
  rely on checking the traces`.
- Resolution: test result outcome (`PASS | FAIL | SKIP`) is separate from
  validity (`CURRENT | STALE | INVALID | INHERITED_UNVERIFIED`). Only a
  `CURRENT` result on the exact `CODE -> TEST_CASE -> TEST_RESULT` trace counts.
  Invalidation stales and re-evaluates dependent trace gates, supersedes
  unclosed human gates, rolls back affected evidence axes, and demotes affected
  SRs, URs, and epics from `IN_REVIEW` or `DONE` to `IN_PROGRESS`. A new current
  result can return the item to `IN_REVIEW`, but `DONE` requires a successor
  human completion gate for the new fingerprint. Supplemental evidence causes
  no demotion, and invalidation alone does not imply `BLOCKED`.
- References: `process/state-tracking.md#Evidence state`,
  `process/state-tracking.md#Gate records and state machines`.
- Resolution record: commit containing this resolution on `review/prs-5-9`.

## DM-07 — Complete the gate state machine

- Status: `RESOLVED`
- Finding: gate lifecycle and answer authority were mixed with UI and transport
  mechanics, while closed state, application state, and the canonical gate
  record were underspecified.
- References: `process/state-tracking.md#Epic record`,
  `process/state-tracking.md#Gate records and state machines`,
  `process/prompts.md#2. Review and approve entry`.
- Decision: `USER:2026-08-19:humans require interaction; gates for independent
  AI in the V-loop rely on checking the traces`.
- Resolution: `TRACE` gates use `PENDING -> PASS | FAIL`, become `STALE` when
  their input fingerprint changes, and never enter the human queue. `HUMAN`
  gates use `DRAFT -> OPEN -> ANSWERED -> CLOSED`, with `SUPERSEDED` for a
  replaced snapshot and `NOT_APPLICABLE/PENDING/APPLIED/FAILED` as the separate
  application axis. A human gate opens only after prerequisite trace gates
  pass. An answer is authoritative only when the real human response is
  recorded against the exact `OPEN` gate. `CLOSED` requires applied state plus
  successful checks and reconciled records; closed and superseded gates leave
  active queues but remain audit history.
- References: `process/V-model-loop.md#Gate kinds`,
  `process/state-tracking.md#Gate records and state machines`,
  `process/state-tracking.md#Human answers and application`,
  `templates/work/EPIC.md`, `templates/work/REQUIREMENTS.md`.
- Resolution record: commit containing this resolution on `review/prs-5-9`.

## DM-08 — Remove agent-process boundaries from the process model

- Status: `RESOLVED`
- Finding: agent-process start and control-interface availability were treated
  as delivery-process boundaries even though work selection is governed by
  persistent records and gates.
- Decision: `USER:2026-08-19:agent-process and UI concepts are not needed;
  describe only the items, gates, and loops required to create software in a
  controlled manner`.
- Resolution: agent-process activity, control surfaces, transport, and startup
  commands are outside the process model. `Orient` evaluates the persistent
  records:
  apply or route answered human gates, respect holds, recheck stale trace gates
  and evidence, confirm release scope, and select only an eligible `TODO` trace.
  This rule applies whenever work is selected; it is not tied to runtime start.
- References: `process/V-model-loop.md#Development loop`,
  `process/state-tracking.md#Work selection and reconciliation`.
- Resolution record: commit containing this resolution on `review/prs-5-9`.

## DM-09 — Clarify commit cadence for run-only and no-op waypoints

- Status: `OPEN`
- Finding: agents are told to commit at RED, GREEN, cleanup, and reconciliation
  waypoints, while cleanup may be a no-op and an observed test result may create
  no tracked change.
- References: `process/V-model-loop.md#Source control`,
  `process/V-model-loop.md#Requirement-scoped boy-scout cleanup`,
  `process/prompts.md#3. Execute one development-loop slice`.
- Decision needed: decide whether empty commits are required, or whether a
  waypoint is committed only when its evidence record or implementation changes.
- Resolution target: the process states exactly what versioned artifact makes
  each waypoint auditable and when no commit is expected.
- Resolution record: _pending_
