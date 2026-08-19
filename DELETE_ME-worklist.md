# DELETE ME — Combined process-review worklist

```text
EPIC -> UR -> SCN -> SR -> TASK -> TEST -> CODE

TASK: PROPOSED -> READY -> IN_PROGRESS -> LOWER_VERIFIED

SCN:  PROPOSED -> READY -> IN_PROGRESS -> UPPER_VALIDATED

UR:   DERIVED -> PROPOSED -> READY -> IN_PROGRESS -> IN_REVIEW -> VALIDATED

SR:   DERIVED -> PROPOSED -> READY -> IN_PROGRESS -> IN_REVIEW -> VALIDATED
```

Temporary worklist for the semantic review of PRs #5–#9 on
`review/prs-5-9`. Delete this file after every item is resolved or moved into
the repository's permanent tracking system.

- Source: `USER:2026-08-19:record the combined review findings and tackle them one by one`
- Scope: root Markdown files and `process/`
- Status vocabulary: `OPEN | IN_PROGRESS | RESOLVED | DEFERRED`
- Rule: resolving an item requires updating every affected instruction, prompt,
  status definition, and projection mapping together.

## Queue

| ID | Severity | Status | Finding |
|---|---|---|---|
| DM-01 | HIGH | RESOLVED | `DERIVED` requirements wait for human confirmation before loop entry |
| DM-02 | HIGH | RESOLVED | `DERIVED` is represented on the requirement work-state axis, not the specification axis |
| DM-03 | HIGH | RESOLVED | Epic is the trace root and fast-lane work retains the complete trace |
| DM-04 | HIGH | IN_PROGRESS | Completion approval ordering is circular |
| DM-05 | HIGH | IN_PROGRESS | Terminal statuses are inconsistent by entity |
| DM-06 | MEDIUM | OPEN | Invalidated evidence has no defined status consequence |
| DM-07 | MEDIUM | OPEN | Gate lifecycle and answer channel are underspecified |
| DM-08 | MEDIUM | OPEN | The connected-workspace preflight is not an executable sequence |
| DM-09 | MEDIUM | OPEN | Commit-at-every-waypoint conflicts with no-op waypoints |

- Resolved in this repository: `DM-01`, `DM-02`, `DM-03`
- Next open item: `DM-04`
- Resolution commits:
  - `d477bf5` (`Hold DERIVED requirements for human confirmation`) — DM-01,
    DM-02
  - the commit containing this worklist update — DM-03

### External implementation follow-up

The process contract now requires `DERIVED` support in requirement parsing,
checks, synchronization, gate emission/holds, Mission Control projections, and
rollups. Those implementations live outside this repository and were not
changed by `d477bf5`. This does not reopen DM-01 or DM-02 within this worklist's
root/process review scope, but end-to-end platform support must not be claimed
until the external implementations satisfy the contract.

## DM-01 — Hold derived requirements before loop entry

- Status: `RESOLVED`
- Finding: the former `SPEC-DERIVED` marker treated as-built documentation as
  non-gating even when the inferred requirement itself had never been confirmed.
- Decision: `USER:2026-08-19:add DERIVED state for an inferred requirement and
  hold all further action for human confirmation`.
- Resolution: `DERIVED` is now a pre-lifecycle requirement state. It emits a
  confirmation gate, keeps proposed links candidate-only, and blocks epic,
  scenario, SR, task, test, implementation, verification, release, and delivery
  progression. Confirmation/correction enters the normal requirement lifecycle;
  rejection retires the candidate and its links.
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
- Resolution: ledgers, progress/work-list projections, prompts, templates,
  Mission Control mapping, gates, and the as-built verification skill now
  distinguish unconfirmed `DERIVED` requirements from confirmed
  `PENDING_VERIFICATION` requirements.
- References: `process/state-tracking.md#Requirement ledger`,
  `process/state-tracking.md#ModernPath reference projection model`,
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
  `EPIC -> UR -> SCN -> SR -> TASK -> TEST -> CODE`. Every full or fast-lane
  trace has an owning epic. The fast lane is a lightweight entry route within
  that epic: it may skip preparing and approving a new full epic specification
  set only when all fast-lane conditions hold, but it retains every trace level
  and both red-first evidence arms. Rows without a SCN return to planning rather
  than bypassing upper validation.
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

- Status: `IN_PROGRESS`
- Finding: the lifecycle records the human completion decision before delivery,
  while the completion-review prompt requires human approval and source
  delivery to be confirmed before requesting that approval.
- References: `AGENTS.md#Working loop`,
  `process/V-model-loop.md#Development loop`,
  `process/prompts.md#5. Evidence and completion review`.
- Decision needed: decide whether the human completion gate authorizes delivery
  or accepts an already-delivered result.
- Resolution target: the lifecycle, Definition of Done, human brief, and
  completion prompt use one non-circular sequence.
- Resolution record: _pending_

## DM-05 — Define status vocabularies per entity

- Status: `IN_PROGRESS`
- Finding: a UR permits `VALIDATED` but not `DONE`; the ledger permits `DONE`
  but not `VALIDATED`; and the lifecycle assigns `IN_REVIEW` to an epic even
  though the projection model gives epics separate upper/lower axes and reserves
  initiative status for board state.
- References: `process/V-model-loop.md#Trace hierarchy`,
  `process/V-model-loop.md#Status model`,
  `process/state-tracking.md#Requirement ledger`,
  `process/state-tracking.md#Epic record`,
  `process/state-tracking.md#ModernPath reference projection model`.
- Decision: `USER:2026-08-19:align the requirement lifecycles to match the UR`.
  UR and SR use the same requirement work-status sequence; `LOWER_VERIFIED`
  remains SR evidence rather than an SR work status.
- Decision still needed: define the authoritative status field, allowed values,
  and transitions for EPIC, SCN, and TASK, plus the remaining epic projection
  mapping.
- Resolution target: repository records and synchronized projections can map
  every lifecycle transition deterministically.
- Resolution record: _pending_

## DM-06 — Define consequences of invalidated evidence

- Status: `OPEN`
- Finding: evidence on an unreachable revision becomes invalid, but trace
  staleness is not an automatic work-status transition and no explicit demotion
  or propagation rule is defined. A row can therefore retain a status that
  requires current direct evidence after its evidence is invalidated.
- References: `AGENTS.md#Non-negotiable rules`,
  `process/state-tracking.md#ModernPath reference projection model`,
  `process/state-tracking.md#Evidence state`.
- Decision needed: define which evidence and work statuses change after a
  revert, abandoned branch, closed unmerged PR, or other reachability loss.
- Resolution target: demotion, cascading effects, re-verification, and the
  concrete inherited-evidence marker are explicit and enforceable.
- Resolution record: _pending_

## DM-07 — Complete the gate state machine

- Status: `OPEN`
- Finding: the server lifecycle defines `open -> answered` plus applied state,
  but the connected flow says a later sync “closes” the gate without defining a
  closed state. The approval prompt also does not specify whether connected
  answers must be entered through Mission Control or may originate in another
  human channel. A repo-borne gate has no defined record shape.
- References: `process/state-tracking.md#Epic record`,
  `process/state-tracking.md#Mission Control and gates`,
  `process/prompts.md#2. Review and approve a specification`.
- Decision needed: define gate states, applied states, answer authority and
  channel, repo-borne representation, and what makes a gate disappear from the
  action queue.
- Resolution target: connected and disconnected approval flows are complete,
  attributable, first-wins where applicable, and mechanically distinguishable.
- Resolution record: _pending_

## DM-08 — Specify the session-start preflight

- Status: `OPEN`
- Finding: the preflight names factory status, open-gate and pending-intent
  inspection/application, and release-binding verification, but gives no single
  ordered command/read-back sequence. It also does not define how to avoid
  racing the fire-and-forget session-start sync.
- References: `process/state-tracking.md#Automatic synchronization`,
  `process/state-tracking.md#Mission Control and gates`,
  `process/state-tracking.md#Session sequence`.
- Decision needed: define the exact connected preflight commands, their order,
  expected observations, failure handling, and offline fallback.
- Resolution target: a fresh session can deterministically establish whether
  work selection is safe before selecting a trace.
- Resolution record: _pending_

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
