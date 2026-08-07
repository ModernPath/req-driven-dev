# Work-list projection template

Copy this file into a consuming project only when a versioned local work-list is
needed. The ModernPath Delivery System is authoritative for loop state; this is
its reviewable repository projection. Every active user requirement, epic,
acceptance scenario, system requirement, and task/slice must be traceable here
at rollup level.

Detailed epic contents live in the consuming repository's `epics/`. This file
summarizes epic-internal completion; it does not replace the parent epic or
Delivery System state.

## Projection ownership

- The Delivery System owns top-level progress and loop relationships.
- `WORKLIST.md` projects cross-epic status, active rows, blockers, approval
  summaries, and evidence links for version control.
- Parent epic records project internal trace/evidence detail.
- Task files, when present, own task-local execution detail only.
- After each transition, update the affected local records and synchronize the
  Delivery System.
- If the Delivery System, `WORKLIST.md`, epic, and task disagree, reconcile the
  drift before starting another row or claiming completion.

Both loops use TDD:

- Upper loop: write failing BDD/E2E/user-flow acceptance tests before the scenario is complete.
- Lower loop: write failing unit/component/API/contract/integration tests before implementation.

## Status Vocabulary

| Status | Meaning |
|---|---|
| `PROPOSED` | Identified but not ready for development |
| `READY` | Trace links and acceptance expectations are clear |
| `IN_PROGRESS` | Lower-loop implementation or upper-loop validation is underway |
| `IN_REVIEW` | Both evidence arms pass; human completion approval or delivery/reconciliation is pending |
| `LOWER_VERIFIED` | Red-first lower-loop tests pass for the linked task/system requirement |
| `UPPER_VALIDATED` | Red-first upper-loop BDD/E2E evidence passes for the linked scenario |
| `DONE` | Upper and lower evidence are complete, rolled up, and human-approved |
| `BLOCKED` | Cannot proceed; blocker must be recorded |
| `DEFERRED` | Consciously postponed; reason must be recorded |
| `OBSOLETE` | Superseded; replacement source is recorded |

## Epic Rollup

| Epic | Epic record | User requirements | Acceptance scenarios | System requirements | Tasks | Upper status | Lower status | Overall status | Human approval | Evidence / gaps |
|---|---|---|---|---|---|---|---|---|---|---|
| - | - | - | - | - | - | - | - | - | - | - |

## Work Rows

| Task / slice | Epic | Epic record / task file | User requirement | Acceptance scenario | System requirement | Scope | Status | Lower test evidence | Upper BDD/E2E evidence | Code reference | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| - | - | - | - | - | - | - | - | - | - | - | - |

## Blocked / Deferred

| Item | Status | Reason | Required decision | Owner |
|---|---|---|---|---|
| - | - | - | - | - |

## Completion Roll-Up Rules

- A task is `LOWER_VERIFIED` when its red-first lower-loop tests pass and code references are linked.
- A system requirement is `LOWER_VERIFIED` when all linked tasks are lower-verified and code/test references are linked.
- An acceptance scenario is `UPPER_VALIDATED` when its red-first BDD/E2E/user-flow evidence passes and code references are linked.
- An epic is `DONE` when all linked scenarios are upper-validated, all linked system requirements are lower-verified, and human approval is recorded.
- A user requirement is `VALIDATED` when all linked epics are done and human approval is recorded.
- A work-list row is `DONE` only when the linked task is `LOWER_VERIFIED`, the linked acceptance scenario is `UPPER_VALIDATED`, no unrecorded gap remains, and the parent epic has human approval before epic-level `DONE`.
- Local completion is not final until the Delivery System, source delivery,
  release scope, and this projection agree.
