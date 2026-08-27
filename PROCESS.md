# Requirement-driven delivery process

This document is the sole process authority. Skills execute it; `file-state/`
is its flat-file serialization. Neither may redefine it.

Runtime sessions, user interfaces, queues, and tool transports are outside the
process model.

## Canonical model

```text
EPIC -- optionally groups --> UR and/or SR

UPPER (UR): UR -- contains --> acceptance scenario -> TEST_CASE -> TEST_RESULT
                                      |
                                      +-- may require --> SR

LOWER (SR): SR -> CODE -> TEST_CASE -> TEST_RESULT

EPIC: PROPOSED -[HUMAN]-> TODO -> IN_PROGRESS -> IN_REVIEW -[HUMAN]-> DONE

UR/SR: DERIVED -[HUMAN]-> PROPOSED -[HUMAN]-> TODO -> IN_PROGRESS -> IN_REVIEW -[HUMAN]-> DONE
UR/SR: DERIVED -[HUMAN]-> PENDING_VERIFICATION -[HUMAN]-> TODO -> IN_PROGRESS -> IN_REVIEW -[HUMAN]-> DONE

TRACE: PENDING -> PASS | FAIL; PASS | FAIL -> STALE -> PASS | FAIL

HUMAN: DRAFT -> OPEN -> ANSWERED -> CLOSED
       DRAFT | OPEN | ANSWERED -> SUPERSEDED
```

UR evidence is upper evidence, normally exercised through an acceptance/E2E
path. SR evidence is lower evidence, exercised at the appropriate unit, API,
component, contract, or integration boundary. Both are red-first. They are
evidence classes owned by different requirement types, not two arms of one
requirement.

## Authority

Humans decide product intent, scope, architecture, acceptance, priority,
release, and workflow. Agents establish facts and propose options; they do not
make those decisions by assumption. Ask humans only for decisions that cannot
be established from authoritative records, code, tests, or runtime evidence.

| Tag | Source |
|---|---|
| `USER:<date>:<summary>` | Attributable human fact, decision, or approval |
| `DOC:<path>#<section>` | Product, domain, architecture, or contract source |
| `CODE:<path>:<symbol>` | Observed implementation behavior |
| `TEST:<path>:<name>` | Stable test-case identity |
| `RUN:<command-or-report>` | Observed test or runtime result |
| `EPIC:<path>#<section>` | Existing Epic record |

Missing support is an open question. Conflicting support remains a conflict
until a human resolves it. Code proves existing behavior, not intended behavior.
Here, **material** means capable of changing correctness, security, data
integrity, a public contract, trace completeness, acceptance, or testability.

Session working notes — review write-ups, test plans, scratch alignment
records — are not authoritative sources and may be discarded at any time. A
durable record restates their content rather than pointing at them, and
identifiers internal to one (finding numbers, plan step ids, review round
labels) are never citable from records, code, or instructions. Provenance
for an applied change belongs to the change itself and its gate records.

## Item ownership

| Item | Owns |
|---|---|
| `EPIC` | Optional requirement grouping, human-readable outcome, shared scope and decisions, lifecycle, gates, aggregate views, completion record |
| `UR` | Actor, context, user outcome, source, inline acceptance scenarios, lifecycle, upper evidence, optional Epic membership |
| `SR` | Smallest independently implementable system behavior, source, boundary, scope, technical context, lifecycle, lower evidence, code/test links, optional UR and Epic relations |
| `CODE` | Implementing files, symbols, revisions, branches, and changes |
| `TEST_CASE` | Stable identity, targeted UR scenario or SR clause, expected observation |
| `TEST_RESULT` | Outcome, RED/passing role, validity, command/report, environment, and tested fingerprint |

Acceptance scenarios are UR content, not separate lifecycle records. Split an
SR that contains independently implementable behaviors. Projects may retain
`REQ-*` IDs if each record declares its canonical kind.

## Trace completeness

The graph contains relationships, not execution order. Epic membership and
UR-to-SR links are optional. Never invent a parent to complete a trace.

| Selected item | Complete trace |
|---|---|
| Epic | Every in-scope member requirement satisfies its applicable trace; every declared Epic gate passes |
| UR | Sourced outcome, scenarios, current upper evidence, and every SR explicitly required by those scenarios |
| SR | Lower trace: `SR -> CODE -> TEST_CASE -> TEST_RESULT` |

Every declared relation must be authoritative, reciprocal where stored twice,
and covered by the gates that depend on it. A missing optional relation is not
a gap. A code link identifies implementation; it does not prove correctness.
A test covering multiple clauses must identify every target and assertion. A
UR-to-SR relation makes the SR part of the UR trace; it does not make UR upper
evidence part of the SR lower trace.

## Lifecycle states

UR and SR use the same status vocabulary.

| Status | Meaning |
|---|---|
| `DERIVED` | Inferred requirement awaiting human confirmation; all relations are candidate-only |
| `PENDING_VERIFICATION` | Human-confirmed as-built behavior awaiting entry approval and current direct evidence |
| `PROPOSED` | Confirmed or directly sourced requirement being prepared for entry |
| `TODO` | Entry trace passed and human entry approval was applied |
| `IN_PROGRESS` | Applicable red-first evidence work is underway |
| `IN_REVIEW` | Required evidence is complete; delivery, reconciliation, or completion acceptance remains |
| `DONE` | Delivered trace passed completion and human acceptance was applied |
| `BLOCKED` | Work cannot proceed; blocker and suspended status are recorded |
| `DEFERRED` | Work is postponed with reason, owner, target, and suspended status |
| `OBSOLETE` | Terminal rejection or supersession with decision/replacement linked |

A directly sourced requirement may start `PROPOSED`. An Epic uses
`PROPOSED -> TODO -> IN_PROGRESS -> IN_REVIEW -> DONE` and the same side states;
it has no `DERIVED` state.

On release from `BLOCKED` or `DEFERRED`, restore only the strongest state
supported by current gates and evidence.

Acceptance scenarios, code, test cases, and planning artifacts have no work
lifecycle. Evidence conclusions are not completion states:

- `LOWER_VERIFIED`: current lower evidence for an SR.
- `UPPER_VALIDATED`: current upper evidence for UR acceptance content.

### Derived requirement hold

While a requirement is `DERIVED`:

- record its candidate statement, inference sources, proposed relations,
  conflicts, consequences, and confirmation brief;
- label every proposed relation `CANDIDATE`;
- exclude it from authoritative trace, release, readiness, coverage, progress,
  and completion;
- do not create or advance related requirements, acceptance content,
  reconnaissance, tests, implementation, verification, or delivery.

```text
DERIVED -> confirmed/corrected ----------> PROPOSED
        -> confirmed accurate as-built --> PENDING_VERIFICATION
        -> rejected ---------------------> OBSOLETE
```

Confirmation proves the requirement exists. It does not approve entry, make
candidate links authoritative, prove behavior, or select a release.

## Gates

A trace gate evaluates non-human facts at an exact fingerprint. A human gate
records a decision by an authorized human. A human gate may become `OPEN` only
after every prerequisite trace gate is `PASS`.

```text
authoritative trace -> TRACE PASS -> HUMAN OPEN -> attributable answer
-> answer applied -> records reconciled -> HUMAN CLOSED

application: NOT_APPLICABLE -> PENDING -> APPLIED | FAILED
```

`PASS` and `FAIL` become `STALE` when inputs change. `STALE` never counts as
pass. The first answer to an exact `OPEN` gate is immutable; changed scope or
decision creates a successor and marks the old gate `SUPERSEDED`. An application
failure leaves the gate `ANSWERED` and preserves its holds.

Feedback not attached to an exact `OPEN` gate is a source or proposed decision,
not a gate answer.

### Strict human transitions

| Transition | Required trace `PASS` before human input |
|---|---|
| Requirement `DERIVED -> PROPOSED/PENDING_VERIFICATION/OBSOLETE` | Candidate packet and exact confirmation scope complete |
| Requirement `PROPOSED/PENDING_VERIFICATION -> TODO` | Its Entry packet is complete at the exact plan-subject fingerprint |
| Epic `PROPOSED -> TODO` | Its Entry packet and every selected member's entry trace are complete at the exact plan-subject fingerprint |
| Requirement `IN_REVIEW -> DONE` | Its completion predicate is satisfied at the delivered fingerprint |
| Epic `IN_REVIEW -> DONE` | Every member is already `DONE` or named and completion-eligible in the same gate; the Epic completion predicate is satisfied |

One human answer may cover an exact Epic and named requirements. Apply member
requirement transitions before the Epic and record a `USER:` source for each.

Every human gate carries:

```markdown
**Brief:**
- What: <decision>
- Why now: <trigger and blocked work>
- Changes if approved: <visible outcome>
- Risk if wrong: <downside and reversibility>
- Recommendation: <option and rationale>
- Image: <optional evidence>
```

### Automatic transitions

An agent or deterministic check may apply these only from a current trace-gate
`PASS`:

| Transition | Required proof |
|---|---|
| SR `TODO -> IN_PROGRESS` | Approved entry fingerprint and expected lower RED |
| UR `TODO -> IN_PROGRESS` | Expected upper RED or a required SR is `IN_PROGRESS` |
| Epic `TODO -> IN_PROGRESS` | An in-scope member is `IN_PROGRESS` |
| SR `IN_PROGRESS -> IN_REVIEW` | Its lower trace is current and passes |
| UR `IN_PROGRESS -> IN_REVIEW` | Required SRs are `IN_REVIEW/DONE`; current upper evidence passes |
| Epic `IN_PROGRESS -> IN_REVIEW` | Members are `IN_REVIEW/DONE`; applicable trace gates pass |

Agents may also apply evidence-invalidation demotions, and may apply `BLOCKED`
from an established impediment and release it when the impediment is gone.
Applying `DEFERRED` records a postponement decision and requires an
attributable human source. No automated transition creates or substitutes for
a human answer.

## Work scope

| Scope | Use when | Required relations |
|---|---|---|
| Epic | Multiple requirements form one human-readable change, or shared product/architecture/contract/data decisions are required | Exact member UR/SR set; membership is grouping, not ancestry |
| Single SR | Exactly one independently verifiable system behavior changes | Authoritative SR source; Epic and UR relations optional |

Expand single-SR work to Epic scope when it changes user outcome or acceptance,
requires another SR, or introduces a cross-cutting decision. Related approved
items repeat entry approval only when their approved scope changes.

## Planning and readiness

Planning consists of packet authoring, independent cold review, and entry
review, in that order. A changed fingerprint or failed result returns work to
the earliest affected pass; a downstream pass cannot repair an upstream gap.
Packet depth is proportional to the selected scope — a single-SR packet may
satisfy an item in a sentence where an Epic needs pages — but no packet item
may be omitted.

A cold-review failure is the routing exception: it returns its complete result
to the human and does not authorize an automatic planning or review round.

Planning uses a **plan-subject fingerprint** over authoritative item content,
declared relations, selected scope, the named reconnaissance revision,
technical context and inventories, evidence strategies, sourced decisions and
unknowns, and the human entry brief. Cold-review findings, dispositions,
verdicts, and gate records are outputs linked to that fingerprint; they are not
inputs to it. Recording a review result therefore cannot stale its own gate.

### Entry packet

The Entry packet must contain:

1. authoritative item content, declared relations, scope, owner, and release;
2. UR scenarios and thin SRs where applicable;
3. reconnaissance at a named revision covering the affected surface,
   control/data flow, contracts, persistence, integrations, reuse targets,
   dependencies, failure modes, operational risks, test infrastructure, and
   project gates;
4. each SR's owned flow segment, change boundary, dependencies, risks, and test
   path;
5. an upper-RED strategy for every selected UR, a lower-RED strategy for every
   selected SR, and proportional regression gates;
6. sourced decisions, conflicts, gaps, deferrals, blockers, and unknowns;
7. cold-review findings and verdict; and
8. the human entry brief.

Items 1–6 and 8 form the plan subject. Item 7 records the review of that
subject. A cold-review or entry trace is current only when its reviewed
plan-subject fingerprint equals the current plan-subject fingerprint.

Planning records a self-check against the same coverage rubric cold review
will evaluate. When multiple Epics or packets will be authored in parallel, it
also publishes one sourced cross-packet contract table before authoring fans
out. The table assigns an owning Epic or SR and exact input, output, error,
producer, and consumer shapes to every shared module function, endpoint, event,
payload, or transition; every dependent packet cites that shared definition.

Reconnaissance cites `DOC:`, `CODE:`, and `TEST:` sources. Generated context is
navigation only. Material revision drift makes the packet and its dependent
reviews stale.

Cold review runs from a context independent of packet authoring. The first
review of a selected scope and plan subject is exhaustive: it audits the trace,
scope, technical surface, changed flow, contracts, data, compatibility,
failure behavior, feasibility, dependency order, SR boundaries, RED strategy,
gates, and unauthorized decisions. It continues after the first blocker and
records every rubric area as `PASS`, `NOT_APPLICABLE`, or one or more finding
ids before returning a verdict.

Findings retain stable identities across review rounds. Every finding record
stores its classification (`ORIGINAL`, `INTRODUCED_BY_REMEDIATION`,
`REVIEW_ESCAPE`, `SCOPE_EXPANSION`, or `OUT_OF_SCOPE`), predecessor or
introduced-by lineage, affected domain, severity and materiality, direct
source, owner, required remediation, current disposition (`OPEN`, `RESOLVED`,
`DEFERRED`, or `REJECTED`), and current resolution evidence. Every cold-review
gate appends an immutable observation of each relevant finding's disposition,
evidence, and checked plan-subject fingerprint at that round; a re-review never
rewrites a predecessor gate's observation. An `OUT_OF_SCOPE` finding routes
through triage and does not fail the selected gate unless it is shown to affect
the selected trace.

Review mode follows the predecessor, not only its verdict. `FIRST` means no
predecessor exists, or selected scope or the affected-surface denominator
changed materially enough to start a new exhaustive review. `RE_REVIEW` means a
predecessor exists and those boundaries are unchanged. A predecessor whose
last evaluated verdict was `FAIL` requires an applied human continuation answer
for its exact finding snapshot, including when remediation has since made that
gate `STALE`. A predecessor whose last evaluated verdict was `PASS` and is now
`STALE` requires the attributable source that changed the plan subject, but not
a failed-review continuation decision.

A re-review verifies every prior finding against its resolution evidence,
audits the exact plan diff, and checks the immediate control/data-flow,
contract, persistence, integration, failure, security, operational, and test
boundaries touched by that diff. It carries forward unchanged coverage instead
of starting a new full audit.

Open or in-scope deferred correctness, security, data-loss, contract,
traceability, or testability findings fail the cold-review trace gate. A
re-review is non-converging when its open material finding count is greater
than or equal to its predecessor's, when the same stable finding or descendant
lineage remains open after the authorized remediation, or when its affected
domain count increases. Stop reviewing on any of those conditions and treat
the result as evidence that the packet does not converge. Recommend splitting
the scope, removing optional behavior, simplifying the design, or replanning
the shared boundary before another review.

A failed cold review also evaluates a continuation-readiness trace against a
**review-result fingerprint** over the failed gate id, complete coverage,
stable finding snapshot and observations, convergence result, structural
recommendation, and decision brief. That trace passes only when all of those
inputs are recorded. It is the sole prerequisite for the exact workflow human
gate; the failed cold-review trace is a source, not a prerequisite. The
orchestrator must not automatically remediate and start another review. Another
round requires the workflow gate's attributable answer and applied choice at
that review-result fingerprint. Applying `remediate` records the exact
authorized finding snapshot and routes work selection to planning; applying a
structural choice routes it to triage or planning with the chosen scope action;
applying `defer` or `stop` records the corresponding hold. Technical review
cannot grant entry approval, and human authorization for another round cannot
substitute for a cold-review `PASS`.

Entry review evaluates the complete packet and confirms that its current
plan-subject fingerprint matches the fingerprint reviewed by cold review. Only
a current entry trace `PASS` may open the human entry gate. Do not create or
change tests or implementation until every selected item is `TODO`.

## Development loop

```text
SOURCE -> PLAN -> COLD REVIEW -[PASS]-> HUMAN ENTRY -> AI TDD LOOP -> COMPLETE -> DONE
            ^              |
            |            [FAIL]
            |              v
            +------ HUMAN REVIEW DECISION
            |
            +---------------- TRIAGE / REPLAN <---------- AI TDD / COMPLETE
```

Enter a session with `rdd-start`. Use `rdd-deliver` for end-to-end work. Use a
focused skill alone only when the requested scope explicitly ends at that pass.

| Phase | Skill | Required exit |
|---|---|---|
| Enter session | `rdd-start` | Store binding and single active release verified from the store; answered gates reconciled; frozen scope routed to its earliest unmet phase |
| Source/classify | `rdd-discover` | Authoritative input or an exact confirmation gate; no unconfirmed requirement proceeds |
| Plan/reconnaissance | `rdd-plan` | Entry-packet items 1–6 and the human brief at a named revision |
| Cold review | `rdd-cold-review` | Exhaustive first-review or scoped re-review verdict, stable finding dispositions, and either entry handoff or an exact human continuation decision |
| Entry | `rdd-entry-review` | Applied human approval and selected items in `TODO`, or an explicit non-entry result |
| Execute changed SR | `rdd-build` | Current lower evidence; eligible SR in `IN_REVIEW`; selected UR evidence updated independently |
| Verify as-built requirement | `rdd-verify` | Current UR upper or SR lower evidence; eligible requirement in `IN_REVIEW` |
| Deliver/complete | `rdd-completion-review` | Delivered revision, reconciled records, completion trace, and applied human result |
| Route change | `rdd-triage` | Discovery assigned to the earliest phase it invalidates |

Before each phase, reconcile answered gates and state, then select the earliest
unmet prerequisite. A focused skill's exit is a handoff, not completion of the
full loop.

### AI TDD inner loop

After human entry places the selected scope in `TODO`, the AI owns the automatic
`TODO -> IN_PROGRESS -> IN_REVIEW` transitions. It does not request human input
while the approved fingerprint remains unchanged.

```text
establish selected UR upper RED
  -> select an unmet approved SR clause
  -> SR lower RED -> GREEN -> CLEAN -> lower verify
  -> rerun affected UR upper evidence
  -> all applicable trace gates PASS?
       no  -> repeat
       yes -> IN_REVIEW
```

Run the loop as follows:

1. Establish the expected upper RED for every selected UR requiring new
   evidence. A standalone SR has no upper step.
2. If an SR trace is unmet, select one approved clause, establish its focused
   lower RED, implement the smallest passing behavior, and perform scoped
   behavior-preserving cleanup.
3. Run the SR's focused and boundary-appropriate regression gates on the
   cleaned content, then rerun each affected UR scenario.
4. Re-evaluate every selected SR lower trace and UR upper trace independently.
   A trace `FAIL` caused by unmet approved behavior starts another iteration;
   it does not request human input.
5. Exit to `IN_REVIEW` only when every selected SR lower trace is current and
   `PASS`, and every selected UR upper trace is current and `PASS` with all of
   its required SRs in `IN_REVIEW` or `DONE`.

Use a reviewable feature branch and preserve RED and passing fingerprints. For
`PENDING_VERIFICATION`, demonstrate regression sensitivity with a safe
temporary local mutation or equivalent targeted failure, then restore it. The
restored implementation may require no product-code change.

If an upper failure remains after all planned SR lower traces pass, diagnose it.
Repeat the inner loop when the failure is within approved behavior. Return to
the earliest planning pass when satisfying it requires a new or changed
requirement, relation, scope, architecture, acceptance rule, priority, release,
workflow, or material technical decision. Record an external impediment as a
blocker. These are the only exits before the trace gates pass.

Move an eligible item to `IN_REVIEW`, then use completion review to audit,
deliver, re-evaluate evidence at the delivered revision, reconcile records,
open the human completion gate, and apply the answer. UI evidence requires the
live stack, loaded assets, and an inspected screenshot; do not mutate real
production-like data to verify rendering.

The full loop terminates only when the selected scope is `DONE` or `OBSOLETE`.
An unanswered human gate, `BLOCKED`, `DEFERRED`, `TODO`, or `IN_REVIEW` state is
an explicit incomplete handoff, not completion.

## Evidence and completion

A test result is immutable. Rerunning creates a new result.

Outcome is `PASS`, `FAIL`, or `SKIP`. Validity is:

| Validity | Meaning |
|---|---|
| `CURRENT` | Matches the exact clause, content/code fingerprint, and revision |
| `STALE` | A traced input changed after the result |
| `INVALID` | The tested content is unreachable, reverted, abandoned, or not delivered |
| `INHERITED_UNVERIFIED` | Carried from another revision or change without a confirming run |

Only `CURRENT` evidence linked to the exact clause, test case, code/content
fingerprint, and revision counts. Broad suites prove only exercised assertions.
Line numbers are navigation hints, not test identities.

| Requirement/evidence | Required evidence |
|---|---|
| SR lower — `LOWER_VERIFIED` | Sourced SR clause; expected focused failure; named regression-sensitive assertions; linked code; passing focused and proportional post-cleanup gates at the cited revision |
| UR upper — `UPPER_VALIDATED` | Sourced UR scenario; expected user-flow failure; passing result; required runtime/browser observation; linked revision |

Choose evidence by boundary: unit/property for domain rules, component plus
browser for UI, endpoint/contract for APIs, integration for persistence and
integrations, schema conformance for cross-service contracts, and harness/smoke
for operations.

Invalidating required evidence atomically:

1. changes result validity;
2. makes dependent trace gates `STALE` and supersedes dependent unclosed human
   gates;
3. removes affected evidence conclusions;
4. demotes dependent `IN_REVIEW`/`DONE` Epic, UR, and SR items to `IN_PROGRESS`;
5. propagates only through declared relations.

Supplemental evidence causes no demotion. Re-verification may restore
`IN_REVIEW`; restoring `DONE` at a new fingerprint requires a successor human
completion gate. Material approved-scope changes stale entry approval and send
work back to planning.

A completion human gate may open only when named items are `IN_REVIEW`, code is
delivered, evidence is current at the delivered revision, state is reconciled,
candidate relations are excluded, and gaps/deferrals/decisions are disclosed.

| Item | `DONE` predicate after human acceptance |
|---|---|
| SR | Its lower trace is delivered, current, and reconciled |
| UR | All scenarios have current upper evidence; every required SR has a complete lower trace; result is delivered and reconciled |
| Epic | Every member is `DONE`; applicable member and declared Epic gates pass; Epic scope is delivered and reconciled |

Completing one item never advances an optional related item unless that item
independently satisfies its predicate and is named in the human gate.

## State records and reconciliation

Exactly one process store is authoritative per repository, and the
`file-state/` shapes are the canonical serialization of its records in either
case:

- **Store-backed.** A database or platform owns the records. Tooling
  materializes shape files locally as working-set snapshots and projections;
  a materialized file records the store revision it came from, is never
  committed, is never an authority, and never overwrites newer store state.
  Conflicting syncs are surfaced for a decision, never resolved silently.
- **File-backed.** The versioned `file-state/` records are the store.

A repository is one or the other, never both at once. Every serialized file
carries its snapshot header — `Snapshot at` and `Source store/revision` — so
currency is checkable per file.

```text
file-state/
  EPICS.md
  REQUIREMENTS.md
  GATES.md
  WORK-SELECTION.md
  BACKLOG.md
```

`EPICS.md` stores optional grouping records. `REQUIREMENTS.md` stores URs, SRs,
declared relations, and trace references. `GATES.md` stores every trace and
human gate record. `WORK-SELECTION.md` stores the frozen scope, suspended
selections, and selection history. `BACKLOG.md` stores unrouted triage items
and gap records. Derived queues and progress views — including the pending
human-decision projection — are regenerated, not backed up separately.

| Concern | Authority |
|---|---|
| Product/domain/architecture/contracts | Product documents and schemas |
| Epic, requirement, relation, gate, decision, release, and work-selection state | Authoritative process store |
| Code, test cases, and results | Implementation repository plus exact evidence references |
| Aggregate progress and human queues | Generated projections; never lifecycle authority |

Every gate record stores id, kind, transition/purpose, exact scope, prerequisites,
fingerprint, state/verdict/answer, actor/evaluator, sources, timestamps,
application state/revision, and predecessor/successor. A cold-review gate also
stores its review mode, coverage rubric, predecessor review, reviewed plan diff
for a re-review, attributable authorization for the round, and immutable
finding observations. `GATES.md` also stores stable cold-review finding records
with classifications, lineage, owners, current dispositions, and resolution
evidence, plus the continuation-readiness and workflow decision gates for a
failed review.

Every evidence record stores targeted clause, stable test case, outcome, role,
validity, command/report, environment when relevant, fingerprint, revision, and
code link.

Apply a human answer only when its `ANSWERED` gate fingerprint is current:

1. update every named item and consequence;
2. record actor, scope, source, transitions, and application revision;
3. run deterministic checks and reconcile projections;
4. mark application `APPLIED` and gate `CLOSED` only after records agree.

After every transition, update the complete affected graph and run checks for:

- valid identities/statuses and reciprocal declared relations;
- stable test identities, revision-pinned validity, and invalidation cascades;
- exact gate fingerprints and legal gate/state transitions;
- no `TODO` without applied entry approval;
- no `DONE` without delivered evidence, reconciliation, and applied completion;
- isolation of `DERIVED` items and candidate links from authoritative scope;
- agreement between authoritative state and generated projections.

Only `OPEN` human gates with current passing prerequisites appear as pending
human decisions.

## Discoveries, releases, and conflicts

| Discovery | Route |
|---|---|
| Inferred possible requirement | `DERIVED` plus confirmation gate; links remain candidate-only |
| Directly sourced requirement | `PROPOSED` UR or SR |
| Missing human decision or ambiguity | Decision gate; `BLOCKED` only when work cannot proceed |
| Known future work | `DEFERRED` with reason, owner, and target |
| Capability/specification gap | Gap linked to affected traces |
| Unclear ownership/cross-cutting concern | Triage backlog |
| Contradicted or removed behavior | Conflict or `OBSOLETE` with replacement |

A project's release registry holds exactly one active release, and release
selection requires a `USER:` source. Drift between repository records and the
store binding is a defect to report, not a variance to work around. `DERIVED`
items are not release commitments. Preserve competing authoritative sources
and request a human decision; never resolve intent by timestamp or weaken a
trace to make records agree.
