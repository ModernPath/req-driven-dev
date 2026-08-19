# Work-list projection template

Copy this file into a consuming project when a versioned work-list is needed.
Use the ownership, status, and reconciliation rules in
`.modernpath/rdd/process/state-tracking.md`.

Detailed epic contents live in the consuming repository's `epics/`. This file
is only the active queue and cross-epic rollup; it does not replace the parent
epic or requirement ledger.

## Human Gate Queue

List only gates whose non-human transition prerequisites are fulfilled. A gate
may be prepared earlier, but it is not a human move until it is eligible.
`DERIVED` requirements and candidate links stay out of the epic rollup and
implementation work rows until confirmation and normal planning make them
authoritative.

| Entity scope | Transition | Prerequisite trace gate (`PASS`) | Human gate (`OPEN`) | Human move |
|---|---|---|---|---|
| - | DERIVED→PROPOSED / PROPOSED→TODO / IN_REVIEW→DONE | - | - | - |

## Epic Rollup

| Epic | Epic record | User requirements | UR acceptance content | System requirements | Upper status | Lower status | Delivery status | Entry approval | Completion approval | Evidence / gaps |
|---|---|---|---|---|---|---|---|---|---|---|
| - | - | - | - | - | - | - | - | - | - | - |

## Work Rows

| SR / slice | Epic | Epic record | User requirement / acceptance content | Scope / implementation context | Status | Entry approval | Code/delivery reference | Lower test case/result | Upper test case/result | Completion approval | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| - | - | - | - | - | - | - | - | - | - | - | - |

## Blocked / Deferred

| Item | Status | Reason | Required decision | Owner |
|---|---|---|---|---|
| - | - | - | - | - |

Completion semantics come from `.modernpath/rdd/process/V-model-loop.md`; record
reconciliation comes from `.modernpath/rdd/process/state-tracking.md`.
