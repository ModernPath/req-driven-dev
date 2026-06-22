# «CTX» — «Context Name» — Requirements Ledger

## Dashboard — «CTX» («Context Name»)

> Totals: 0 DONE · 0 IN_REVIEW · 0 IN_PROGRESS · 0 READY · 0 PROPOSED · 0 DEFERRED · 0 BLOCKED

| ID | Title | Stage | Status | Source | Tests | Code |
|----|-------|-------|--------|--------|-------|------|
| *Seed requirements using Prompt 1* | — | — | — | — | — | — |

---

## Requirements Detail

### Template: REQ-«CTX»-NNN — «Title»

```markdown
### REQ-«CTX»-NNN — «One-line title»
- **Status:** PROPOSED  ·  **Stage:** MVP  ·  **Priority:** must  ·  **Owner:** —
- **Raised-by:** seeded from `docs/«NN»` (Prompt 1)
- **Source:** INV-«CTX»-NNN (`docs/«NN»` §N)
- **Statement:** «One or two sentences describing what the requirement ensures»
- **Acceptance criteria:**
  - GIVEN «precondition» WHEN «action» THEN «expected outcome».
  - GIVEN «another precondition» WHEN «action» THEN «expected outcome».
  - GIVEN «failure case» WHEN «action» THEN «rejection with error code».
- **Tests:** —
- **Code:** —
- **Log:** —
- **Deferred / notes:** —
```

---

## Status Reference

| Status | Meaning |
|---|---|
| `PROPOSED` | Identified; acceptance criteria not yet written |
| `READY` | Acceptance criteria reviewed; ready to build |
| `IN_PROGRESS` | Tests written (red) and/or implementation underway |
| `IN_REVIEW` | Green + traced; awaiting human sign-off |
| `DONE` | Merged; all criteria pass; traced; logged |
| `DEFERRED` | Not now — **must** carry reason + tracking link |
| `BLOCKED` | Cannot proceed — **must** carry the blocking OQ id |
| `OBSOLETE` | Superseded — **must** carry the superseding ref |

---

## Status Hygiene Reminder

When changing status, update ALL THREE:
1. Dashboard table row
2. Detail block `Status:` line
3. Dashboard `Totals:` line
