# State tracking

This document defines the versioned records that carry V-model delivery state
and the rules that keep those records consistent. The lifecycle, trace, and
evidence semantics come from [`V-model-loop.md`](V-model-loop.md).

The records describe product work. Agent-process lifetime, control interfaces,
and tool transport are outside the process model and cannot redefine its states
or transitions.

## Authority matrix

| Concern | Authoritative record |
|---|---|
| Product intent, domain rules, architecture, and contracts | Versioned product documents and schemas |
| Requirement backlog and work status | Requirement ledger, normally `requirements/<CTX>-REQUIREMENTS.md` |
| Inferred requirement awaiting confirmation | `DERIVED` ledger row, candidate links, and its confirmation gates |
| Epic scope and delivery | Epic record under `epics/` |
| UR acceptance content and upper evidence | Owning UR within the epic record |
| SR behavior, implementation context, and lower evidence | Owning SR within the epic record and requirement ledger |
| Code, test cases, and test results | Implementation repository plus versioned evidence references |
| Human decision | Answer on the exact `OPEN` human-gate record, attributed to the real human |
| Active queue and cross-epic rollup | `WORKLIST.md` |
| Unrouted discoveries | `BACKLOG.md` |
| Aggregate counts | Generated `PROGRESS.md` or equivalent derived view |
| Release selection | Versioned release record with an attributable human source |

Derived views may summarize these records but own no lifecycle state. When a
derived view disagrees with its authoritative record, regenerate or repair the
view rather than treating it as a second source of truth.

## State flow

```text
product sources
      |
      v
EPIC -> UR -> SR -> CODE -> TEST_CASE -> TEST_RESULT
  |      |     |                         |
  +------+- records and evidence --------+
                 |
                 v
            TRACE gates
                 |
       PASS -----+----- FAIL/STALE
         |                 |
         v                 +-> hold, repair, or recheck
   HUMAN gate where required
         |
         v
  lifecycle transition -> reconcile ledger | epic | work-list | derived views
```

## Repository records

### Requirement ledger

The ledger holds the complete bounded-context backlog and the work status of
each UR and SR. When status is repeated in a dashboard row, detail block, and
totals line, all copies move in the same change. A mismatch is a defect.

Requirement status vocabulary:

| Status | Meaning |
|---|---|
| `DERIVED` | inferred requirement whose complete candidate packet awaits attributable human confirmation that it exists; candidate links are held and non-authoritative |
| `PENDING_VERIFICATION` | human-confirmed as-built description awaiting the normal entry approval and direct current evidence |
| `PROPOSED` | confirmed or directly sourced requirement whose entry trace is being fulfilled; not approved for implementation |
| `TODO` | entry trace passed and attributable human entry approval was applied; the requirement may be selected for implementation |
| `IN_PROGRESS` | one or both evidence loops are underway |
| `IN_REVIEW` | required evidence is complete; the requirement remains here through delivery and record reconciliation |
| `DONE` | the delivered trace passed its completion check and attributable human completion acceptance was applied |
| `BLOCKED` | cannot proceed; the blocker or gate is linked |
| `DEFERRED` | explicitly postponed; reason, owner, and target are recorded |
| `OBSOLETE` | rejected or superseded; human decision or replacement source is linked |

`DERIVED` is a pre-lifecycle hold, not a weaker spelling of `PROPOSED`. A
derived row records an inference from documents, code, existing requirements,
or analysis without claiming that the inferred requirement is real. First
complete its candidate statement, sources, proposed ancestry and downstream
links, conflicts, consequences, and confirmation brief. Until its human answer
is applied:

- it cannot enter `PROPOSED`, `TODO`, release scope, specification, testing,
  implementation, verification, or delivery;
- its proposed EPIC/UR/SR relationships remain candidate context and do not
  count toward authoritative trace, coverage, or progress;
- existing SRs and evidence remain intact, but they cannot establish that the
  inferred UR is valid user intent.

Confirmation or correction records a `USER:` source, enters `PROPOSED`, and
routes candidate links through normal planning. If the human also accepts the
as-built description of behavior that already ships, the requirement may take
the `PENDING_VERIFICATION` route. Rejection moves it to `OBSOLETE` and retires
its candidate links. None of these answers grants entry approval.

Every requirement selected for implementation or verification must have
authoritative `EPIC -> UR -> SR` ancestry. It must receive human entry approval
and become `TODO` before a test is changed. Test evidence can move work through
the evidence waypoints and into `IN_REVIEW`; it cannot move a requirement to
`DONE` without completion acceptance.

### Epic record

The epic is the top-level delivery record. It owns the capability scope, linked
URs and SRs, acceptance content, technical reconnaissance, cold-review
findings, decisions, gaps, gates, evidence map, delivery, and completion.

Use these axes independently:

- requirement `work_status`: the ledger lifecycle above;
- epic `delivery_status`: `PROPOSED -> TODO -> IN_PROGRESS -> IN_REVIEW ->
  DONE`, with `BLOCKED`, `DEFERRED`, and `OBSOLETE` side states;
- epic `upper_loop_status`: `PROPOSED -> IN_PROGRESS -> UPPER_VALIDATED`;
- epic `lower_loop_status`: `PROPOSED -> IN_PROGRESS -> LOWER_VERIFIED`;
- specification status: `SPEC-DRAFT -> SPEC-READY -> SPEC-APPROVED`;
- trace-gate state: `PENDING -> PASS | FAIL`, with `STALE` on input change;
- human-gate state: `DRAFT -> OPEN -> ANSWERED -> CLOSED`, with
  `SUPERSEDED` as a terminal side state and a separate application state.

Acceptance scenarios remain UR content. Test cases have identity but no work
lifecycle. Test results carry outcome and validity rather than requirement
status.

### Strict transition records

The strict human-gated transitions are auditable records:

| Entity transition | Facts required for the prerequisite trace gate to pass |
|---|---|
| Requirement `DERIVED -> PROPOSED` | candidate statement, inference sources, candidate ancestry/links, conflicts, consequences, confirmation brief, and exact gate scope |
| Requirement `PROPOSED -> TODO` or `PENDING_VERIFICATION -> TODO` | authoritative ancestry, sourced and testable content, release/owner/scope, required reconnaissance and cold review, test strategy, and no unresolved in-scope decision |
| Epic `PROPOSED -> TODO` | complete scoped entry packet and every selected requirement's entry trace gate passing |
| Requirement `IN_REVIEW -> DONE` | full `EPIC -> UR -> SR -> CODE -> TEST_CASE -> TEST_RESULT` trace, current delivered-revision evidence, reconciled records, and disclosed gaps/deferrals |
| Epic `IN_REVIEW -> DONE` | every named requirement completion-eligible and the delivered epic scope reconciled |

Each applied transition records the gate id, exact entity scope, actor, role,
answer, `USER:<date>:<summary>` source, and application revision. One answer may
cover an epic and explicitly named requirements, but each requirement
transition is recorded before the epic transition. An already-`TODO` epic does
not repeat its entry transition when another requirement is added; the new
requirement still needs entry approval.

`IN_REVIEW` is stable across delivery and reconciliation. Completion
acceptance therefore accepts an already-delivered result; it never authorizes
delivery.

## Gate records and state machines

There are two gate kinds:

- `TRACE` evaluates facts an agent or deterministic check can establish from
  the canonical trace.
- `HUMAN` records a decision requiring attributable human interaction.

They are not interchangeable. A trace result cannot grant human authority, and
a human answer is not proof that the trace is complete.

Every gate record carries:

- stable gate id and kind;
- purpose and, for lifecycle gates, exact transition;
- exact entity and hold scope;
- prerequisite gate ids;
- input revision and content fingerprint;
- state, verdict or answer, and timestamps;
- evaluator or human actor, role, and source/evidence references;
- application state and revision for a human gate;
- predecessor and successor ids when superseded.

Trace-gate lifecycle:

```text
PENDING -> PASS
        -> FAIL
PASS | FAIL -- input revision/fingerprint changes --> STALE
STALE ---------------------------------------------> PASS | FAIL (recheck)
```

`PASS` means every named fact is directly supported for the exact fingerprint.
`FAIL` identifies missing, contradicted, or stale facts. `STALE` never counts
as pass. When a trace check encounters a product, scope, architecture,
acceptance, priority, or workflow choice, it fails or remains pending and
routes the decision to a human gate instead of assuming an answer.

Human-gate lifecycle:

```text
DRAFT -- prerequisite TRACE gates PASS; mark eligible --> OPEN
OPEN -- first attributable human answer ----------> ANSWERED
ANSWERED -- answer applied and records agree ------> CLOSED
DRAFT | OPEN | ANSWERED -- scope/fingerprint replaced --> SUPERSEDED
```

- `DRAFT` is prepared but not solicitable.
- `OPEN` is eligible and interactable.
- `ANSWERED` is no longer answerable and awaits application.
- `CLOSED` means the answer was applied, checks passed, and records agree. It
  leaves active queues but remains in history.
- `SUPERSEDED` is terminal and points to its replacement. Never apply an
  answer to changed scope or reuse a first-wins gate.

Human-gate application state:

```text
NOT_APPLICABLE -- accepted answer --> PENDING -> APPLIED
                                      \--------> FAILED
```

`DRAFT` and `OPEN` use `NOT_APPLICABLE`. `ANSWERED` begins at `PENDING`.
Application failure leaves the gate `ANSWERED/FAILED`, preserves its holds,
and reports the failure. Only `APPLIED` plus successful checks permits
`CLOSED`.

Each strict lifecycle move composes the two gate kinds:

```text
trace facts -> TRACE PASS -> HUMAN OPEN -> human answer
-> ANSWERED/PENDING -> apply -> ANSWERED/APPLIED -> checks -> CLOSED
```

Trace invalidation before closure supersedes the human gate. Trace invalidation
after closure leaves the old decision in history but requires a new trace gate
and, where human authority is required again, a successor human gate for the
new fingerprint.

## Human answers and application

Only the real human may answer an `OPEN` human gate. The interaction channel is
irrelevant to the process, but the resulting record must identify the exact
gate, actor, role, time, answer, and `USER:` source. Free-form feedback that is
not attached to an `OPEN` gate is a source or proposed decision, not an applied
gate answer.

The first recorded answer is immutable. A later change of mind creates a
successor gate and preserves the original decision in history.

Before applying an answer:

1. confirm the gate is `ANSWERED/PENDING` and its fingerprint still matches;
2. materialize the answer through every affected EPIC/UR/SR record;
3. record the exact transitions, consequences, sources, and application
   revision;
4. run the deterministic process checks;
5. reconcile every affected record and derived view;
6. mark the application `APPLIED` and the gate `CLOSED` only when they agree.

For a derived-requirement answer, confirmation or correction enters planning;
rejection marks the requirement `OBSOLETE`. Candidate links never become
authoritative merely because the gate was answered.

For a completion answer, recheck the delivered trace against the gate
fingerprint before application. Apply accepted named requirements to `DONE`,
then their epic to `DONE`. If the trace changed, supersede the gate and recheck
instead of applying the stale answer.

## Work-list and derived views

`WORKLIST.md` is the active queue and cross-epic rollup. It does not replace the
epic evidence map or requirement ledger. Its human-gate queue contains only
`OPEN` human gates whose prerequisite trace gates are currently `PASS`.
`ANSWERED`, `CLOSED`, and `SUPERSEDED` gates are not human moves.

`PROGRESS.md`, dashboards, counts, and digest views are derived. Regenerate
them from authoritative records; never hand-author a conflicting status.

## Local checks

Run the consuming repository's deterministic process checks after state
changes. They must cover:

- ledger status hygiene and aggregate counts;
- canonical trace hygiene through
  `EPIC -> UR -> SR -> CODE -> TEST_CASE -> TEST_RESULT`;
- stable test-case identities and revision-pinned result validity;
- gate consistency: only a current trace-gate `PASS` may open its human gate,
  and only an applied human answer may close it;
- strict entry approval: no epic or requirement is `TODO` without the scoped
  human answer applied after its entry trace gate passed;
- strict completion acceptance: no requirement or epic is `DONE` unless
  delivery, delivered-revision evidence, and reconciliation preceded the human
  answer;
- invalidation cascade: no evidence waypoint, `IN_REVIEW`, or `DONE` status
  survives loss of evidence it requires;
- `DERIVED` integrity: confirmation gates exist, candidate links do not count
  as authoritative scope, and an `OPEN` human gate has a passing trace gate.

A reviewed baseline may suppress known legacy violations only by exact
identity. It is not evidence that the underlying debt is fixed.

## Evidence state

Epic and ledger records link exact code, test cases, commands or reports,
results, and revisions. A broad suite proves only the trace clauses it actually
exercises.

A `TEST_RESULT` has two independent axes:

- outcome: `PASS | FAIL | SKIP`;
- validity: `CURRENT | STALE | INVALID | INHERITED_UNVERIFIED`.

Only a `CURRENT` result linked through the exact
`CODE -> TEST_CASE -> TEST_RESULT` trace counts as direct evidence. A change to
traced code or a required test case makes the old result `STALE`. A revert, an
abandoned branch, or a closed unmerged change makes a result pinned only to the
unreachable revision `INVALID` for delivered-line claims. A new record may
carry it as `INHERITED_UNVERIFIED`, preserving its origin, but may not present
it as current. Re-verifying part of an inherited set does not refresh the rest.

Evidence invalidation is an integrity transition that an agent or check may
apply without human interaction. It atomically:

1. updates the affected result validity;
2. moves dependent passed trace gates to `STALE` and re-evaluates them;
3. supersedes unclosed human gates whose fingerprint depended on that trace;
4. rolls affected `LOWER_VERIFIED` or `UPPER_VALIDATED` evidence back to
   `IN_PROGRESS`;
5. demotes an affected SR in `IN_REVIEW` or `DONE` to `IN_PROGRESS` when lower
   evidence is lost;
6. demotes an affected UR in `IN_REVIEW` or `DONE` to `IN_PROGRESS` when upper
   evidence or linked lower evidence is lost;
7. demotes an affected epic in `IN_REVIEW` or `DONE` to `IN_PROGRESS` when any
   in-scope requirement loses required evidence.

Supplemental evidence that no active gate or status requires causes no status
demotion. Invalidation alone does not imply `BLOCKED`. After re-verification,
the entity returns to `IN_REVIEW`; a successor human completion gate is required
for `DONE` at the new fingerprint.

Material changes to approved product scope, acceptance, or architecture also
stale the entry trace gate. A not-yet-started `TODO` entity returns to
`PROPOSED`; active work returns to planning from `IN_PROGRESS`. A change inside
approved scope that merely implements or repairs the requirement does not
repeat entry approval.

## Release state

The versioned release record identifies exactly one active release. Selecting
or changing it is a human product decision and requires a `USER:` source.

`DERIVED` requirements are not release commitments. Base, closed-release, and
active-release work must not be mixed in the active view. Deferral means later
within the active release unless a human decision moves the work elsewhere.

## Conflict rules

- Preserve unrelated work and use one writer for shared records.
- Stop when authoritative records contain competing human intent.
- Do not resolve identity, scope, acceptance, or release conflicts by timestamp
  alone.
- Preserve both sources, expose the conflict, and request human resolution.
- Never weaken trace or gate requirements to make records appear consistent.

## Work selection and reconciliation

Before selecting work:

1. inspect repository status and preserve unrelated changes;
2. read `WORKLIST.md`, the target ledger, active epic, and relevant sources;
3. apply or route any answered human gate that holds candidate work;
4. exclude `DERIVED` requirements and candidate links;
5. reevaluate stale trace gates and evidence required by candidate work;
6. confirm release scope and select only a `TODO` trace with no active hold.

After any transition:

1. update the complete affected trace and every duplicated status field;
2. record direct evidence, trace-gate verdicts, and attributable decisions;
3. run deterministic process checks;
4. reconcile ledger, epic, work-list, release record, and derived views in the
   same change.

Before handoff:

1. leave all authoritative records and derived views consistent;
2. record discoveries, deferrals, blockers, and remaining human moves;
3. distinguish `verified`, `approved`, `delivered`, and `DONE`; they are
   different claims;
4. state exactly what is complete, in review, blocked, or unreconciled.
