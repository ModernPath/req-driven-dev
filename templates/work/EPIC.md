# EPIC-«AREA»-«NNN» — «Capability»

- **Trace role:** top-level delivery item; holds the linked URs and their traces
- **Release/system:** «scope»
- **Delivery status:** PROPOSED
- **Upper status:** PROPOSED
- **Lower status:** PROPOSED
- **Entry approval:** —
- **Completion approval:** —
- **Authoritative delivery / reconciliation:** —
- **Requirement confirmation:** all linked requirements confirmed; no `DERIVED` or candidate link is eligible for active epic scope

## User outcome

«Observable outcome for a named actor.»

## Specification status

SPEC-DRAFT — «scope of the specs set»

## Linked user requirements

| UR | Actor | Statement | Source | Trace authority | Status |
|---|---|---|---|---|---|
| UR-«AREA»-«NNN» | «role» | «outcome» | USER:/DOC: | CONFIRMED | PROPOSED |

## Domain and interfaces

- **Primary context:** «context + source»
- **Supporting contexts:** «contexts + sources»
- **Models/events:** «models/events + sources»
- **Contracts:** «schemas/interfaces + sources»

## Technical reconnaissance

- **Artifact:** `specs/technical-reconnaissance.md`
- **Inspected revision:** «repository + branch/SHA»
- **Context pack:** «optional generated locator/report; verify against sources»
- **Affected surface:** «entry points/callers/writers/readers + CODE: sources»
- **Control/data-flow impact:** «trigger → changed hops → persistence/side effects → output»
- **Patterns to reuse:** «implementation/test patterns + CODE:/TEST: sources»
- **Contracts/data/compatibility:** «boundaries and constraints + sources»
- **Risks and failure modes:** «applicable risks + sources»
- **Freshness:** CURRENT | STALE — «reason/revision»

## Cold technical review

- **Review context:** «separate reviewer/context»
- **Reviewed revision:** «spec + repository revision»
- **Verdict:** PENDING | FAIL | PASS

| Finding | Severity | Statement/source | Disposition | Owner/evidence |
|---|---|---|---|---|
| CTR-«AREA»-«NNN» | material/non-material | «finding + DOC:/CODE:/TEST:» | OPEN/RESOLVED/DEFERRED/REJECTED | «owner + evidence» |

## Decisions and open questions

| ID | Kind | Statement | Source/trigger | Consequence/status |
|---|---|---|---|---|
| «DEC/OQ»-«AREA»-«NNN» | decision/question | «text» | USER:/DOC:/CODE: | «affects» |

## UR journeys and acceptance content

| UR / scenario heading | Journey | Given/When/Then | Code | Test case | RED/GREEN test results |
|---|---|---|---|---|---|
| UR-«AREA»-«NNN» / «heading» | «journey» | «G/W/T or link» | — | — | — |

## System requirements

| SR | Source UR/content | System behavior / scope | Boundary | Status |
|---|---|---|---|---|
| SR-«AREA»-«NNN» | UR-«AREA»-«NNN» / «heading» | «smallest independently deliverable behavior» | «boundary» | PROPOSED |

## SR implementation and evidence

| SR | Recon/revision | Technical context | Change boundary | Code | Test case | RED/GREEN test results/gates |
|---|---|---|---|---|---|---|
| SR-«AREA»-«NNN» | «artifact + SHA» | «surface/flow/reuse/dependencies/risks» | «in/out» | — | — | — |

## Evidence map

| Trace | Code | Test case | Failing result | Passing result | Validity/revision |
|---|---|---|---|---|---|
| EPIC → UR → SR → CODE → TEST_CASE → TEST_RESULT | — | — | — | — | INCOMPLETE |

## Loop trace gates

| Gate | Transition/waypoint | Exact scope | Input fingerprint | Evidence | State/evaluator |
|---|---|---|---|---|---|
| CHECK-START-«AREA»-«NNN» | TODO → IN_PROGRESS | «EPIC/UR/SR ids» | «revision + content hash» | «expected RED result» | PENDING |
| CHECK-LOWER-«AREA»-«NNN» | LOWER_VERIFIED / SR IN_REVIEW | «SR ids» | «revision + content hash» | «CODE/TEST/RUN refs» | PENDING |
| CHECK-UPPER-«AREA»-«NNN» | UPPER_VALIDATED / UR IN_REVIEW | «UR/scenario ids» | «revision + content hash» | «TEST/RUN refs» | PENDING |
| CHECK-REVIEW-«AREA»-«NNN» | Epic IN_REVIEW | «EPIC/UR/SR ids» | «revision + content hash» | «passed lower/upper trace gates» | PENDING |

## Entry approval — `PROPOSED -> TODO`

Do not solicit this gate until the scoped epic/requirement trace, specification
or fast-lane packet, reconnaissance, cold review, test strategy, and routed
decisions are fulfilled.

| Trace gate | Exact epic/requirement scope | Input fingerprint | Evidence | State/evaluator |
|---|---|---|---|---|
| CHECK-ENTRY-EPIC-«AREA»-«NNN» | «EPIC/UR/SR ids» | «revision + content hash» | «fulfilled trace + review refs» | PENDING |

| Human gate | Prerequisite trace gate | State/application | Approver/role | Source | Decision/application revision |
|---|---|---|---|---|---|
| APPROVE-ENTRY-EPIC-«AREA»-«NNN» | CHECK-ENTRY-EPIC-«AREA»-«NNN» PASS | DRAFT / NOT_APPLICABLE | — | — | pending |

## Completion approval — `IN_REVIEW -> DONE`

Do not solicit this gate until the exact trace is delivered, its evidence is
current at the delivered revision, all records and derived views are
reconciled, and the completion brief discloses gaps and deferrals.

| Trace gate | Exact epic/requirement scope | Input fingerprint | Delivered trace/evidence | State/evaluator |
|---|---|---|---|---|
| CHECK-COMPLETION-EPIC-«AREA»-«NNN» | «EPIC/UR/SR ids» | «delivered revision + content hash» | «CODE/TEST/RUN + reconciliation» | PENDING |

| Human gate | Prerequisite trace gate | State/application | Approver/role | Source | Decision/application revision |
|---|---|---|---|---|---|
| APPROVE-COMPLETION-EPIC-«AREA»-«NNN» | CHECK-COMPLETION-EPIC-«AREA»-«NNN» PASS | DRAFT / NOT_APPLICABLE | — | — | pending |

## Blocked / deferred / discovered

| Item | Status | Reason/source | Owner | Target | Affects |
|---|---|---|---|---|---|
| — | — | — | — | — | — |

## Completion record

- **Done:** —
- **Decisions:** —
- **Deferred:** —
- **Discovered:** —
- **Follow-ups:** —
- **Gate result:** —
