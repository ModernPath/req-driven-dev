# Work-list projection template

Copy this file into a consuming project when a versioned work-list is needed.
Use the ownership, status, and reconciliation rules in
`.modernpath/rdd/process/state-tracking.md`.

Detailed epic contents live in the consuming repository's `epics/`. This file
is only the active queue and cross-epic rollup; it does not replace the parent
epic or requirement ledger.

## Derived Requirement Confirmation

`DERIVED` requirements appear only in this human-action queue. Do not include
them or their candidate links in the epic rollup or implementation work rows.

| Requirement | Ledger record | Inference source | Candidate links held | Confirmation gate | Human move |
|---|---|---|---|---|---|
| - | - | - | - | - | - |

## Epic Rollup

| Epic | Epic record | User requirements | UR acceptance content | System requirements | Upper status | Lower status | Delivery status | Human approval | Evidence / gaps |
|---|---|---|---|---|---|---|---|---|---|
| - | - | - | - | - | - | - | - | - | - |

## Work Rows

| SR / slice | Epic | Epic record | User requirement / acceptance content | Scope / implementation context | Status | Lower test evidence | Upper BDD/E2E evidence | Code reference | Notes |
|---|---|---|---|---|---|---|---|---|---|
| - | - | - | - | - | - | - | - | - | - |

## Blocked / Deferred

| Item | Status | Reason | Required decision | Owner |
|---|---|---|---|---|
| - | - | - | - | - |

Completion semantics come from `.modernpath/rdd/process/V-model-loop.md`; record
reconciliation comes from `.modernpath/rdd/process/state-tracking.md`.
