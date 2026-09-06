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

ENGINEERING: selected scope -> applicable ACTIVE EC -> engineering trace gate

EPIC: PROPOSED -[HUMAN]-> TODO -> IN_PROGRESS -> IN_REVIEW -[HUMAN]-> DONE

UR/SR: DERIVED -[HUMAN]-> PROPOSED -[HUMAN]-> TODO -> IN_PROGRESS -> IN_REVIEW -[HUMAN]-> DONE
UR/SR: DERIVED -[HUMAN]-> PENDING_VERIFICATION -[HUMAN]-> TODO -> IN_PROGRESS -> IN_REVIEW -[HUMAN]-> DONE

EC: PROPOSED -[HUMAN]-> ACTIVE -[HUMAN]-> SUPERSEDED | RETIRED

TRACE: PENDING -> PASS | FAIL; PASS | FAIL -> STALE -> PASS | FAIL

HUMAN: DRAFT -> OPEN -> ANSWERED -> CLOSED
       DRAFT | OPEN | ANSWERED -> SUPERSEDED
```

UR evidence is upper evidence, normally exercised through an acceptance/E2E
path. SR evidence is lower evidence, exercised at the appropriate unit, API,
component, contract, or integration boundary. Both are red-first. They are
evidence classes owned by different requirement types, not two arms of one
requirement.

An engineering constraint (`EC`) is a persistent architectural, quality, or
engineering rule. It is not product behavior and does not use the UR/SR work
lifecycle. Applicable active ECs are evaluated independently by an engineering
trace gate during cold review and again against the delivered revision.

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
| `EC:<id>` | Active engineering constraint in the authoritative process store |

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
| `EC` | Persistent architecture, quality, or engineering constraint; proposal evidence, authority, explicit scope, rationale, lifecycle, and verification method |

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

Engineering conformance is a separate trace. For every selected scope, resolve
the complete flat set of `ACTIVE` ECs whose declared scope matches the affected
repository, language, service, domain, or path. ECs are not inherited through
profiles and are never copied onto URs or SRs. Resolve and fingerprint this set
after reconnaissance establishes the affected surface; initial resolution is
planning progress, not a change to the frozen work-selection fingerprint.

Engineering checks produce separate trace-gate results for the planning packet,
the pre-delivery candidate, and the delivered revision. Each result records the
exact applicable EC set and target fingerprint, and every member must pass its
declared verification. Ambiguous applicability, a missing verification method,
or an unmet active EC fails the trace. A proposed, superseded, or retired EC does
not apply.

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

When applying `BLOCKED` or `DEFERRED`, record the hold separately from each
affected item's suspended-from lifecycle state, with its gate/evidence basis.
Do not flatten differently progressed members into one scope-level prior state.
On release, restore only the strongest state supported by current gates and
evidence; the recorded prior state is provenance, not permission to restore
invalidated progress. Keep the hold and restoration history.

Acceptance scenarios, code, test cases, and planning artifacts have no work
lifecycle. Evidence conclusions are not completion states:

- `LOWER_VERIFIED`: current lower evidence for an SR.
- `UPPER_VALIDATED`: current upper evidence for UR acceptance content.

### Engineering-constraint states

| Status | Meaning |
|---|---|
| `PROPOSED` | Constraint statement, proposal evidence, scope, rationale, and verification method are being prepared for human activation |
| `ACTIVE` | Human-approved constraint included whenever its declared scope applies |
| `SUPERSEDED` | Terminal constraint version replaced by a named successor |
| `RETIRED` | Terminal constraint removed by an attributable human decision |

Activating, superseding, or retiring an EC is a human decision. Code can prove
an observed convention but cannot make it normative. Changing an active EC's
statement, scope, or verification method creates a successor rather than
silently changing the approved constraint. EC activation is prospective from
the effective release or store revision recorded by its activation gate. After
the initial post-reconnaissance resolution, a changed affected surface or
applicable set makes a nonterminal selection's engineering, cold-review, and
entry gates stale and returns it to planning. It does not reopen a `DONE` scope
delivered before that effective point unless the activation decision explicitly
names it for remediation.

### Derived requirement hold

While a requirement is `DERIVED`:

- record its candidate statement, inference sources, proposed relations,
  conflicts, consequences, and confirmation brief;
- label every proposed relation `CANDIDATE`;
- exclude it from authoritative trace, release, readiness, coverage, progress,
  and completion;
- do not use the candidate to authorize related requirements, acceptance
  content, implementation reconnaissance, tests, verification, or delivery.
  Read-only observation and independently sourced candidates with candidate-only
  links may be recorded during adoption; they confer no downstream authority.

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

### Fingerprint ownership

Fingerprint inputs are explicit and canonically ordered; each result records
the input manifest as well as its hash. Never hash an entire mutable record.
Lifecycle status, timestamps, and a gate's own result id, verdict, findings,
answer, or application state are not inputs to that gate. References to
prerequisite results are inputs where the table specifies them.

| Fingerprint | Inputs |
|---|---|
| Confirmation/policy/release decision | Exact candidate or decision packet, named item/release ids, sources, relevant input-record revisions and prerequisites; no resulting status or application revision |
| Selection | Selected item content, declared relations, exact scope, owner, and release; no EC resolution or lifecycle status |
| Planning | Selection fingerprint; Entry-packet items 1–6 and 8; named reconnaissance baseline and affected surface; exact applicable EC ids and approved versions |
| Cold review | Planning fingerprint and exact current planning-engineering result reference |
| Entry | Planning fingerprint and exact current engineering/cold-review result references, including their findings and dispositions; no entry verdict or answer |
| Candidate/delivered engineering | Target kind, selection/planning references, actual target code/configuration fingerprint and revision, affected surface, applicable EC ids/versions, and verification inputs |
| Completion | Exact named items, delivered revision, applicable evidence assessments, review findings/dispositions, delivered engineering result, and reconciled delivery facts; no completion verdict or answer |

Review outputs are attached records, not additions to planning inputs. Recording
cold-review findings does not stale planning engineering; changing the plan in
response does. Replacing a prerequisite review result stales dependent entry
review. Authorized implementation changes do not change the reconnaissance
baseline or planning inputs; new surface, changed policy, or material baseline
drift does. Preserve applied approvals as history and record whether they still
authorize the affected work. Result references never include their own dependent
gate, so fingerprint dependencies are acyclic.

### Strict human transitions

| Transition | Required trace `PASS` before human input |
|---|---|
| Requirement `DERIVED -> PROPOSED/PENDING_VERIFICATION/OBSOLETE` | Candidate packet and exact confirmation scope complete |
| EC `PROPOSED -> ACTIVE` | Statement, proposal evidence, exact scope, effective point, rationale, verification method, and impact are complete |
| EC `ACTIVE -> SUPERSEDED/RETIRED` | Successor or retirement effect and affected scope are complete |
| Requirement `PROPOSED/PENDING_VERIFICATION -> TODO` | Its Entry packet is complete at the exact fingerprint |
| Epic `PROPOSED -> TODO` | Its Entry packet and every selected member's entry trace are complete |
| Renew entry authority for invalidated approved work | Updated Entry packet and reviews pass for the exact affected subset; retain implementation history and resume at the strongest supported state |
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

The brief is self-contained and in plain product language: an authorized human
who has not read the packet decides from it alone. State the substance of every
decision, correction, finding, option, or requirement it rests on — an internal
identifier (a decision, correction, or finding code) never substitutes for its
meaning and may appear only as a trailing parenthetical breadcrumb. Prefer
concrete user-visible outcomes to process, code, or architecture shorthand, and
name any agent choices the answer will also ratify in those same plain terms.

### Automatic transitions

An agent or deterministic check may apply these only from a current trace-gate
`PASS`:

| Transition | Required proof |
|---|---|
| SR `TODO -> IN_PROGRESS` | Approved entry fingerprint and expected lower RED |
| UR `TODO -> IN_PROGRESS` | Expected upper RED or a required SR is `IN_PROGRESS` |
| Epic `TODO -> IN_PROGRESS` | An in-scope member is `IN_PROGRESS` |
| SR `IN_PROGRESS -> IN_REVIEW` | Its lower trace is current and passes; any required corrective rechecks pass |
| UR `IN_PROGRESS -> IN_REVIEW` | Required SRs are `IN_REVIEW/DONE`; current upper evidence passes |
| Epic `IN_PROGRESS -> IN_REVIEW` | Members are `IN_REVIEW/DONE`; applicable trace gates pass |

Agents may also apply evidence-invalidation and review-correction demotions,
and may apply `BLOCKED`
from an established impediment and release it when the impediment is gone.
Applying `DEFERRED` records a postponement decision and requires an
attributable human source. No automated transition creates or substitutes for
a human answer.

### Review corrections within approved scope

An observed upper-flow failure or an implementation/review/engineering finding
may reopen affected `IN_REVIEW` work as `IN_PROGRESS`. Record the direct source,
affected SRs and dependent UR/Epic items, correction boundary, unchanged entry
approval, and checks to rerun. This is a corrective demotion, not a forward
transition requiring a passing implementation trace. Propagate only through
declared dependencies; unaffected items retain their strongest supported state.
Stale affected implementation-review, candidate/delivered engineering, and
completion gates and supersede their unclosed human gates. Do not stale planning,
cold-review, or entry authority when their recorded inputs are unchanged.

Use `rdd-build` for the correction. For a behavior defect, establish a focused
reproduction RED against the approved clause or upper scenario. For a
behavior-preserving engineering correction, the recorded conformance failure
is the work target; do not invent a new behavioral requirement or RED. Preserve
admissible historical RED, rerun affected behavioral/regression evidence, and
rerun the failed review/check after correction. Integration stays blocked until
the pre-delivery audit and candidate engineering trace pass.

If already-delivered `DONE` work is proven defective, reopen only the affected
trace via the same scoped demotion; a new delivered fingerprint requires a
successor human completion gate. Prospective EC activation alone does not reopen
earlier `DONE` work. Changed intent, scope, EC applicability, or a material
decision returns to planning and renewed entry approval instead of this route.

## Work scope

| Scope | Use when | Required relations |
|---|---|---|
| Epic | Multiple requirements form one human-readable change, or shared product/architecture/contract/data decisions are required | Exact member UR/SR set; membership is grouping, not ancestry |
| Single SR | Exactly one independently verifiable system behavior changes | Authoritative SR source; Epic and UR relations optional |

Expand single-SR work to Epic scope when it changes user outcome or acceptance,
requires another SR, or introduces a cross-cutting decision. Related approved
items repeat entry approval only when their approved scope changes.

A selection may contain mixed lifecycle states. Evaluate prerequisites per
item and route only the unfinished or invalidated subset. Keep unaffected
`IN_REVIEW`/`DONE` items and their approvals; do not reset a whole Epic to make
its statuses uniform. Completion-ready selected requirements are `IN_REVIEW`
or `DONE` with their applicable traces satisfied; only eligible `IN_REVIEW`
items receive new completion transitions. An obsolete member requires an
authoritative scope/removal decision before it can be excluded from readiness.

## Planning and readiness

Planning consists of packet authoring, independent cold review, and entry
review, in that order. A changed fingerprint or failed result returns work to
the earliest affected pass; a downstream pass cannot repair an upstream gap.
Packet depth is proportional to the selected scope — a single-SR packet may
satisfy an item in a sentence where an Epic needs pages — but no packet item
may be omitted.

### Entry packet

The entry packet consists of planning inputs and attached review outputs:

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

Reconnaissance cites `DOC:`, `CODE:`, and `TEST:` sources. Generated context is
navigation only. Material revision drift makes the packet and its dependent
reviews stale. Once reconnaissance establishes the affected repository,
language, service, domain, and path surface, record the exact applicable active
EC ids and their set fingerprint in the work selection. This first resolution
does not alter the frozen selection fingerprint; changing the resolved surface
or EC set afterwards returns the packet to planning.

Cold review runs from a context independent of packet authoring and audits the
trace, scope, technical surface, changed flow, contracts, data, compatibility,
failure behavior, feasibility, dependency order, SR boundaries, RED strategy,
gates, and unauthorized decisions. Each finding records severity, source,
owner, and `OPEN`, `RESOLVED`, `DEFERRED`, or `REJECTED` disposition. Open or
in-scope deferred correctness, security, data-loss, contract, traceability, or
testability findings fail the cold-review trace gate. Technical review cannot
grant entry approval.

Cold review invokes `rdd-engineering-check` rather than embedding EC evaluation.
A current engineering trace `PASS` at the planning fingerprint is a prerequisite
for cold-review `PASS`. Engineering findings join the cold-review finding list,
but the broader technical review remains responsible for risks not expressed as
ECs; the flat EC set is not presumed complete.

Entry review evaluates the complete packet at its entry fingerprint. Only a
current entry trace `PASS` may open the human entry gate. Before changing tests
or implementation, every item whose tests or implementation will be affected needs
current applied entry approval and no active hold. New entrants become `TODO`;
already-approved work resumes in its strongest supported state. Review
corrections reopen affected items before edits; no scope-wide `TODO` reset is
required. A renewed entry gate may reauthorize invalidated approved work without
pretending its earlier implementation or approvals never existed.

## Development loop

```text
SOURCE -> PLAN -> COLD REVIEW -> HUMAN ENTRY -> AI TDD LOOP -> COMPLETE -> DONE
            ^                                          |
            +--------------- TRIAGE / REPLAN <----------+
```

Enter a session with `rdd-start`. Use `rdd-deliver` for end-to-end work. Use a
focused skill alone only when the requested scope explicitly ends at that pass.

| Phase | Skill | Required exit |
|---|---|---|
| Enter session | `rdd-start` | Store binding and single active release verified from the store; answered gates reconciled; frozen scope routed to its earliest unmet phase |
| Source/classify | `rdd-discover` | Authoritative input or an exact confirmation gate; no unconfirmed requirement proceeds |
| Plan/reconnaissance | `rdd-plan` | Entry-packet items 1–6 and the human brief at a named revision |
| Cold review | `rdd-cold-review` | Current cold-review trace verdict and finding dispositions |
| Entry | `rdd-entry-review` | Current applied approval for the affected subset; new entrants `TODO`, unchanged items preserved, or an explicit non-entry result |
| Execute changed SR | `rdd-build` | Current lower evidence; eligible SR in `IN_REVIEW`; selected UR evidence updated independently |
| Verify as-built requirement | `rdd-verify` | Current UR upper or SR lower evidence; eligible requirement in `IN_REVIEW` |
| Deliver/complete | `rdd-completion-review` | Delivered revision, reconciled records, completion trace, and applied human result |
| Route change | `rdd-triage` | Discovery assigned to the earliest phase it invalidates |

Before each phase, reconcile answered gates and state, then select the earliest
unmet prerequisite. A focused skill's exit is a handoff, not completion of the
full loop.

`rdd-engineering-check` is a shared utility, not a phase. Cold review invokes it
against the planning fingerprint. Completion review invokes it first against
the candidate code before integration, then records a separate result against
the delivered fingerprint. It evaluates EC conformance and records engineering
trace gates; it does not perform the rest of either review or change lifecycle
state. Approved implementation changes do not replace the fixed reconnaissance
baseline and therefore do not stale planning by themselves; they require the
separate candidate and delivered results.

### AI TDD inner loop

After applicable human entry approvals are applied, the AI owns the automatic
`TODO -> IN_PROGRESS -> IN_REVIEW` transitions and scoped review corrections.
It does not request human input while the approved fingerprint remains unchanged.

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

1. Establish the expected upper RED for every selected UR that lacks admissible
   historical RED. Reuse retained observations for unchanged clauses/assertions;
   do not recreate an already-observed failure for each subsequent SR. A
   standalone SR has no upper step.
2. If an SR trace is unmet, select one approved clause, establish its focused
   lower RED, implement the smallest passing behavior, and perform scoped
   behavior-preserving cleanup.
3. Run the SR's focused and boundary-appropriate regression gates on the
   cleaned content, then rerun each affected UR scenario.
4. Re-evaluate every selected SR lower trace and UR upper trace independently.
   A trace `FAIL` caused by unmet approved behavior starts another iteration;
   it does not request human input.
5. Exit to completion review only when every selected SR lower trace is current and
   `PASS`, and every selected UR upper trace is current and `PASS` with all of
   its required SRs in `IN_REVIEW` or `DONE`. Advance eligible unfinished items
   to `IN_REVIEW`; preserve unchanged `DONE` items.

Use a reviewable feature branch and preserve RED and passing fingerprints. For
`PENDING_VERIFICATION`, demonstrate regression sensitivity with a safe
temporary local mutation or equivalent targeted failure, then restore it. The
restored implementation may require no product-code change.

If an upper failure remains after all planned SR lower traces pass, diagnose it.
Use the review-correction route when the failure is within approved behavior,
including when all affected SRs already reached `IN_REVIEW`. Return to
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

A test observation is immutable. Rerunning creates a new result. Reassessment
appends its validity, basis, and time without rewriting the observed outcome,
test, fingerprint, revision, command, or report.

Roles are `BASELINE_RED`, `SENSITIVITY_RED`, `PASSING`, and `REGRESSION`.
Baseline RED records the expected failure before implementation. Sensitivity
RED records a safe temporary mutation or equivalent targeted failure, plus the
mutation/target and verified restoration. Each run has its own result record.

Outcome is `PASS`, `FAIL`, or `SKIP`. Validity is:

| Validity | Meaning |
|---|---|
| `CURRENT` | Passing/regression evidence matches the required clause/assertion, code/configuration fingerprint, environment, and candidate or delivered revision |
| `RETAINED` | Historical RED remains admissible for its unchanged clause/assertion and expected failure cause at its recorded baseline or mutation fingerprint |
| `STALE` | An input required for this result's role changed without a new run or confirming assessment |
| `INVALID` | The observation or failure cause is unsound, the subject is unreachable, restoration is unproven, or passing evidence claims code that was reverted, abandoned, or not delivered at the required target |
| `INHERITED_UNVERIFIED` | Carried from another revision or change without a confirming run |

Required RED is an observed `FAIL` assessed `RETAINED`; required passing and
regression runs must be `PASS` and `CURRENT`. A current lower/upper trace contains
both roles; it does not claim that historical RED ran at the delivered revision.
Approved implementation changes, successful GREEN, and verified restoration of
a sensitivity mutation do not invalidate historical RED. Changed clauses,
assertions, or an incorrect failure cause require reassessment and, when the
old observation no longer demonstrates the new target, a new RED. Retention
never substitutes for current passing evidence. Broad suites prove only
exercised assertions. Line numbers are navigation hints, not test identities.

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

Delivery may proceed only after the pre-delivery candidate has a current passing
engineering trace. A completion human gate may open only when items named for
new completion transitions are `IN_REVIEW`, code is delivered, passing/regression
evidence is current at the delivered revision, historical RED remains admissible,
state is reconciled, candidate relations are excluded, the separate delivered
engineering trace is current and passing, and gaps/deferrals/decisions are
disclosed. Unchanged `DONE` members may be referenced as satisfied dependencies
without receiving another completion transition.

| Item | `DONE` predicate after human acceptance |
|---|---|
| SR | Its lower trace is delivered, current, and reconciled; the delivered engineering trace passes |
| UR | All scenarios have current upper evidence; every required SR has a complete lower trace; result is delivered and reconciled; the delivered engineering trace passes |
| Epic | Every member is `DONE`; applicable member, Epic, and delivered engineering gates pass; Epic scope is delivered and reconciled |

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
  ENGINEERING-CONSTRAINTS.md
  GATES.md
  WORK-SELECTION.md
  BACKLOG.md
```

`EPICS.md` stores optional grouping records. `REQUIREMENTS.md` stores URs, SRs,
declared relations, and trace references. `ENGINEERING-CONSTRAINTS.md` stores
the flat EC set and its lifecycle. `GATES.md` stores every trace and human gate
record. `WORK-SELECTION.md` stores the release registry, frozen scope, per-item
holds, adoption campaigns, and selection history. `BACKLOG.md` stores unrouted
triage items and gap records.
Derived queues and progress views — including the pending human-decision
projection — are regenerated, not backed up separately.

| Concern | Authority |
|---|---|
| Product/domain/architecture/contracts | Product documents and schemas |
| Epic, requirement, relation, EC, gate, decision, release, and work-selection state | Authoritative process store |
| Code, test cases, and results | Implementation repository plus exact evidence references |
| Aggregate progress and human queues | Generated projections; never lifecycle authority |

Every gate record stores id, kind, transition/purpose, exact scope, prerequisites,
fingerprint, state/verdict/answer, actor/evaluator, sources, timestamps,
application state/revision, and predecessor/successor.

Every evidence record stores an immutable result id, targeted clause/assertion
fingerprint, stable test case, outcome, role, command/report, environment when
relevant, tested fingerprint/revision, and code link. Its append-only validity
assessments record the assessment target, basis, and time. Sensitivity results
also record the mutation and restoration proof. A delivered confirmation names
the prior run and proves equivalent relevant code/configuration and environment
at the new target; otherwise rerun. A matching file hash alone cannot confirm a
runtime-dependent result.

When migrating combined RED/passing records, preserve the original observations
and split only facts established by their run reports. Missing per-run metadata
is unverified, not permission to copy the passing revision onto historical RED.
Re-establish evidence when the original observation cannot be recovered.

Apply a human answer only when its `ANSWERED` gate fingerprint is current:

1. update every named item and consequence;
2. record actor, scope, source, transitions, and application revision;
3. run deterministic checks and reconcile projections;
4. mark application `APPLIED` and gate `CLOSED` only after records agree.

After every transition, update the complete affected graph and run checks for:

- valid identities/statuses and reciprocal declared relations;
- stable test identities, role-specific validity, and invalidation cascades;
- exact gate fingerprints and legal gate/state transitions;
- exact applicable active EC sets and current engineering-trace results;
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
| Observed or requested architecture, quality, or engineering rule | `PROPOSED` EC; inactive until its human activation gate closes |
| Missing human decision or ambiguity | Decision gate; `BLOCKED` only when work cannot proceed |
| Known future work | `DEFERRED` with reason, owner, and target |
| Capability/specification gap | Gap linked to affected traces |
| Unclear ownership/cross-cutting concern | Triage backlog |
| Contradicted or removed behavior | Conflict or `OBSOLETE` with replacement |

A project's release registry holds exactly one active release before work
selection, and release selection requires a `USER:` source. After checking the
store binding, reconcile applicable already-answered release decisions before
enforcing that invariant. Validate their recorded prerequisites, registry input
revision, scope, and human source; do not require their intended output (an
active release) as an input prerequisite. Reconcile other answered gates before
selection. Apply answers idempotently; stale answers require successor gates.
Drift between repository records and the
store binding is a defect to report, not a variance to work around. `DERIVED`
items are not release commitments. Preserve competing authoritative sources
and request a human decision; never resolve intent by timestamp or weaken a
trace to make records agree.

### Resumable adoption

Reverse engineering may start when no requirement corpus exists, or resume a
recorded adoption campaign over explicitly uncovered contexts. Record campaign
identity, original baseline, latest inspected revision, context inventory,
per-context progress, candidate ids, confirmation gates, and remaining work in
work selection. Existing records from that campaign are not a preflight failure.
Skip completed contexts and reconcile partial contexts by stable ids; never
overwrite confirmed content or duplicate a candidate on resume. Revision drift
requires rechecking affected observations. An unrelated established corpus uses
discovery/planning unless a human explicitly authorizes bounded adoption of its
uncovered surface. Adoption coverage counts inspected/dispositioned observations,
not authoritative requirement readiness; `DERIVED` items remain held.
