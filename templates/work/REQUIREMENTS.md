# «CTX» — «Context Name» — Requirements ledger

This is the bounded-context backlog and requirement work record described in
`.modernpath/rdd/process/state-tracking.md`.

## Dashboard — «CTX» («Context Name»)

> Totals: 0 DONE · 0 IN_REVIEW · 0 IN_PROGRESS · 0 READY · 0 PROPOSED · 0 DERIVED · 0 DEFERRED · 0 BLOCKED

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
- **Confirmation gate:** — / `CONFIRM-REQ-«CTX»-NNN` OPEN|ANSWERED
- **Acceptance criteria:**
  - GIVEN «precondition» WHEN «action» THEN «expected outcome».
  - GIVEN «another precondition» WHEN «action» THEN «expected outcome».
  - GIVEN «failure case» WHEN «action» THEN «rejection with error code».
- **Trace:** `UR -> EPIC -> SCN -> SR/TASK`
- **Trace authority:** CONFIRMED | CANDIDATE (`CANDIDATE` is required while status is `DERIVED`)
- **Evidence:** —
- **Code:** —
- **Mission Control reference:** «optional workspace/system/entity reference»
- **Deferred / notes:** —

#### Derived confirmation brief (required only when status is `DERIVED`)

**Brief:**
- What: Confirm whether «inferred requirement» is a real requirement.
- Why now: «source/code/SR inference and held candidate links»
- Changes if approved: Move to `PROPOSED` (or explicitly accepted `PENDING_VERIFICATION`) and re-plan candidate links.
- Risk if wrong: Invalid user intent would make «candidate UR/EPIC/SCN/SR links» misleading.
- Recommendation: «option and sourced rationale without selecting for the human»
- Image: «optional supporting image»
```

Use `DERIVED` rather than `PROPOSED` when no human has confirmed that the
requirement exists. A derived row must carry the confirmation gate and candidate
trace markers above; it is not eligible for the active implementation work-list.

---

Status vocabulary and the three-place hygiene rule are defined once in
`.modernpath/rdd/process/state-tracking.md`.
