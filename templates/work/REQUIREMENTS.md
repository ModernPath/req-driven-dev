# «CTX» — «Context Name» — Requirements ledger

This is the bounded-context backlog and requirement work record described in
`.modernpath/rdd/process/state-tracking.md`.

## Dashboard — «CTX» («Context Name»)

> Totals: 0 VALIDATED · 0 IN_REVIEW · 0 IN_PROGRESS · 0 READY · 0 PROPOSED · 0 PENDING_VERIFICATION · 0 DERIVED · 0 DEFERRED · 0 BLOCKED

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
- **Owning epic:** `EPIC-«CTX»-NNN`
- **Raised-by:** derived from `DOC:docs/«NN»#<section>`
- **Source:** `DOC:docs/«NN»#<section>` / `USER:<date>:<summary>`
- **Statement:** «One or two sentences describing what the requirement ensures»
- **Confirmation gate:** — / `CONFIRM-REQ-«CTX»-NNN` OPEN|ANSWERED
- **Confirmation facts:** NOT_FULFILLED | FULFILLED — «candidate packet refs»
- **Entry gate:** `APPROVE-ENTRY-REQ-«CTX»-NNN`
- **Entry facts:** NOT_FULFILLED | FULFILLED — «evidence»
- **Completion gate:** `APPROVE-COMPLETION-REQ-«CTX»-NNN`
- **Completion facts:** NOT_FULFILLED | FULFILLED — «evidence»
- **Gate records:** «gate id, exact scope, human actor/role, USER source, answer, application revision»
- **Acceptance criteria:**
  - GIVEN «precondition» WHEN «action» THEN «expected outcome».
  - GIVEN «another precondition» WHEN «action» THEN «expected outcome».
  - GIVEN «failure case» WHEN «action» THEN «rejection with error code».
- **Trace:** `EPIC-«CTX»-NNN -> UR-«CTX»-NNN -> SR-«CTX»-NNN`
- **UR acceptance links:** «scenario/criterion headings required for a system requirement»
- **Trace authority:** CONFIRMED | CANDIDATE (`CANDIDATE` is required while status is `DERIVED`)
- **Boundary:** «required for a system requirement»
- **Technical reconnaissance:** «artifact + inspected revision; required for a system requirement»
- **Implementation context:** «files/symbols, callers, flow impact, contracts, reuse, dependencies, risks»
- **Change boundary / non-goals:** «explicit in/out»
- **Lower RED / gates:** «test path/name/command, expected failure, regression commands»
- **Evidence:** —
- **Code:** —
- **Delivery / reconciliation:** —
- **Mission Control reference:** «optional workspace/system/entity reference»
- **Deferred / notes:** —

#### Derived confirmation brief (required only when status is `DERIVED`)

**Brief:**
- What: Confirm whether «inferred requirement» is a real requirement.
- Why now: «source/code/SR inference and held candidate links»
- Changes if approved: Establish `PROPOSED`, optionally route an explicitly accepted as-built description through `PENDING_VERIFICATION`, and re-plan candidate links.
- Risk if wrong: Invalid user intent would make «candidate EPIC/UR/SR links» misleading.
- Recommendation: «option and sourced rationale without selecting for the human»
- Image: «optional supporting image»
```

Use `DERIVED` rather than `PROPOSED` when no human has confirmed that the
requirement exists. A derived row must carry the confirmation gate and candidate
trace markers above; it is not eligible for the active implementation work-list.

Do not mark entry facts `FULFILLED` until the confirmed authoritative trace,
sourced content, scope, reconnaissance/review where required, and test strategy
are complete. Do not mark completion facts `FULFILLED` until the complete trace
is delivered, evidenced at that revision, and reconciled.

---

Status vocabulary and the three-place hygiene rule are defined once in
`.modernpath/rdd/process/state-tracking.md`.
