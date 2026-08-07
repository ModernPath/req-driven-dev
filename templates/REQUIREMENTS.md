# «CTX» — «Context Name» — Requirements projection

The ModernPath Delivery System owns loop state. This file is the versioned
repository representation synchronized with it.

## Dashboard — «CTX» («Context Name»)

> Totals: 0 DONE · 0 IN_REVIEW · 0 IN_PROGRESS · 0 READY · 0 PROPOSED · 0 DEFERRED · 0 BLOCKED

| ID | Kind | Title | Release/stage | Status | Source | Trace | Evidence | Code |
|----|------|-------|---------------|--------|--------|-------|----------|------|
| *Derive requirements using Prompt 1* | — | — | — | — | — | — | — | — |

---

## Requirements Detail

### Template: REQ-«CTX»-NNN — «Title»

```markdown
### REQ-«CTX»-NNN — «One-line title»
- **Status:** PROPOSED  ·  **Stage:** MVP  ·  **Priority:** must  ·  **Owner:** —
- **Kind:** system  ·  **Release:** —
- **Raised-by:** derived from `DOC:docs/«NN»#<section>`
- **Source:** `DOC:docs/«NN»#<section>` / `USER:<date>:<summary>`
- **Statement:** «One or two sentences describing what the requirement ensures»
- **Acceptance criteria:**
  - GIVEN «precondition» WHEN «action» THEN «expected outcome».
  - GIVEN «another precondition» WHEN «action» THEN «expected outcome».
  - GIVEN «failure case» WHEN «action» THEN «rejection with error code».
- **Trace:** `UR -> EPIC -> SCN -> SR/TASK`
- **Evidence:** —
- **Code:** —
- **Delivery System:** «workspace/system/entity reference»
- **Deferred / notes:** —
```

---

## Status Reference

| Status | Meaning |
|---|---|
| `PROPOSED` | Identified; acceptance criteria not yet written |
| `READY` | Sourced acceptance and entry gate complete |
| `IN_PROGRESS` | Tests written (red) and/or implementation underway |
| `IN_REVIEW` | Green + traced; awaiting human sign-off |
| `DONE` | Evidence, approval, source delivery, and state reconciliation complete |
| `VALIDATED` | User requirement accepted after all linked epics are DONE |
| `DEFERRED` | Not now — **must** carry reason, owner, and target |
| `BLOCKED` | Cannot proceed — **must** carry the blocking OQ id |
| `OBSOLETE` | Superseded — **must** carry the superseding ref |

---

## Status Hygiene Reminder

When changing status, update ALL THREE:
1. Dashboard table row
2. Detail block `Status:` line
3. Dashboard `Totals:` line

Then validate the projection and synchronize the Delivery System. If the two
disagree, reconcile before starting more work or claiming completion.
