# State tracking and Mission Control integration

This document defines how delivery state is recorded and synchronized today.
It is deliberately separate from [`V-model-loop.md`](V-model-loop.md): the
V-model defines how work is specified and verified; this document defines
where the resulting state is written and how its representations converge.

The repository workflow works without ModernPath platform integration.
Mission Control adds a live shared view, attributable human gates, evidence
history, and activity, but it does not replace the versioned working records.

## Authority matrix

| Concern | Authoritative record |
|---|---|
| Product intent, domain rules, architecture, contracts | Versioned product documents and schemas |
| Requirement backlog and work status | Requirement ledger, normally `requirements/<CTX>-REQUIREMENTS.md` |
| Inferred requirement awaiting confirmation | `DERIVED` ledger row plus its confirmation gate; proposed links remain non-authoritative candidate context |
| Epic trace, UR acceptance content, thin system requirements with implementation context, technical reconnaissance, cold-review findings, decisions, evidence map, approval | Epic record under `epics/` |
| Active queue and cross-epic rollup | `WORKLIST.md` |
| Unrouted discoveries | `BACKLOG.md` |
| Generated aggregate counts | `PROGRESS.md` or the consuming project's equivalent; regenerate rather than hand-author |
| Code, test cases, and test results | Implementation source repository plus observed CI/runtime results |
| Human answer to a synchronized gate | First accepted server gate answer, attributed to the real human |
| Mission Control scope, queue, timeline, and evidence faces | Server projection built from synchronized records and runtime events |
| Release selection | Tracked release registry; local platform binding mirrors the selected release |

Repository records are the working process record. Mission Control is a
synchronized operational projection over those records plus server-originated
gate answers, evidence runs, sessions, and events. Neither side may silently
invent changes on the other side.

## State flow

```text
product sources
      |
      v
ledger <-> epic <-> WORKLIST ---- validate/check ----+
      |                                               |
      +---------------- automatic sync -------------->|
                                                      v
                                            Delivery System projection
                                                      |
                                      Mission Control observe/act faces
                                                      |
                                           human answers a gate
                                                      v
                                             pending server intent
                                                      |
                                      factory pull --apply
                                                      v
                                    repository records are materialized
```

A Mission Control answer records intent. It does not rewrite requirements,
specifications, tests, or code. The applying agent must pull the intent,
materialize its consequences through the affected trace, and let the next sync
publish the resulting repository state.

## Repository records

### Requirement ledger

The ledger holds the complete bounded-context backlog and the requirement work
status. When the format duplicates status in a dashboard row, detail block,
and `Totals:` line, all copies move in the same change. A mismatch is a defect.

Recommended status vocabulary:

| Status | Meaning |
|---|---|
| `DERIVED` | inferred requirement whose fulfilled candidate packet awaits attributable human confirmation that it exists; candidate links are held and non-authoritative |
| `PROPOSED` | confirmed or directly sourced requirement whose entry trace is being fulfilled; not approved for implementation |
| `TODO` | non-human entry prerequisites are fulfilled and attributable human entry approval is applied; the row may be selected for implementation |
| `IN_PROGRESS` | one or both evidence loops are underway |
| `IN_REVIEW` | evidence required by the requirement kind is complete; the row stays here through delivery and reconciliation until completion acceptance |
| `PENDING_VERIFICATION` | special route for a human-confirmed as-built description awaiting the same entry approval and direct current evidence |
| `DONE` | the full delivered trace was fulfilled before attributable human completion acceptance was applied |
| `BLOCKED` | cannot proceed; blocker or gate is linked |
| `DEFERRED` | consciously postponed; reason and tracking target are recorded |
| `OBSOLETE` | rejected or superseded; human decision or replacement source is linked |

`DERIVED` is a pre-lifecycle hold, not a weaker spelling of `PROPOSED`. A
derived row records an inference from `DOC:`, `CODE:`, existing requirements,
or analysis without claiming that the inferred requirement is real. First
complete its candidate statement, sources, proposed ancestry/downstream links,
conflicts, consequences, and confirmation brief; only then make its human
confirmation gate solicitable. Until that answer is applied:

- the row is not eligible for `PROPOSED`, `TODO`, release commitment, work
  selection, specification, testing, implementation, or verification;
- proposed EPIC/UR/SR relationships are candidate context in the row and
  gate brief, not authoritative links in epic scope, compliance traces, or
  rollups;
- existing SRs and their evidence remain intact, but the derived UR must not be
  presented as their validated user intent.

An attributable confirmation or correction records its `USER:` source, moves
the requirement through `PROPOSED`, and sends every candidate link through
normal planning before it becomes authoritative. If the same decision
explicitly accepts an as-built description of behavior that already ships, the
row may then take the `PENDING_VERIFICATION` route. A rejection moves the row
to `OBSOLETE` and retires its candidate links. None of these answers
automatically makes a row `TODO`.

`PENDING_VERIFICATION` belongs only to rows reverse-engineered from code that
already ships **after** a human has confirmed that the requirement exists and
accepted the as-built description as accurate. Work this process built
red-first reaches `IN_REVIEW` instead, because its evidence existed before its
implementation. Keeping `DERIVED` and `PENDING_VERIFICATION` apart prevents an
inferred user outcome from becoming authoritative merely because code exists,
while still allowing a human to accept an as-built backlog without claiming the
behavior is tested.

Direct verification records `LOWER_VERIFIED` evidence for a confirmed as-built
system requirement.

Every ledger row selected for implementation or verification must first belong
to an authoritative `EPIC -> UR -> SR` ancestry. A confirmed as-built
row without that ancestry remains `PENDING_VERIFICATION` and returns to normal
planning before tests change. It must receive human entry approval and become
`TODO` before verification starts. An SR reaches `IN_REVIEW` when all of its
required lower evidence is complete. A UR reaches `IN_REVIEW` only when its
linked lower evidence and acceptance-content upper validation are complete.

Test evidence never moves a row directly to `DONE`. The row remains
`IN_REVIEW` through authoritative-source delivery and state reconciliation;
only the subsequent human completion acceptance moves it to `DONE`.

### Epic record

The epic is the top-level delivery record. It owns detailed internal completion:
`UR`, UR acceptance content, thin `SR` slices and their implementation context,
spec status, technical reconnaissance, cold-review findings and dispositions,
decisions, gaps, evidence, and approval.

Use these axes independently:

- requirement `work_status`: the ledger lifecycle above;
- epic `delivery_status`: `PROPOSED -> TODO -> IN_PROGRESS -> IN_REVIEW ->
  DONE`, with `BLOCKED`, `DEFERRED`, and `OBSOLETE` side states;
- epic `upper_loop_status`: derived UR acceptance-content evidence progress,
  `PROPOSED -> IN_PROGRESS -> UPPER_VALIDATED`;
- epic `lower_loop_status`: derived SR verification progress,
  `PROPOSED -> IN_PROGRESS -> LOWER_VERIFIED`;
- specification status: `SPEC-DRAFT -> SPEC-READY -> SPEC-APPROVED`;
- human-gate state: `DRAFT -> OPEN -> ANSWERED -> CLOSED`, with `SUPERSEDED`
  as a terminal side state and a separate application state;
- trace-gate state: `PENDING -> PASS | FAIL`, with `STALE` whenever its input
  fingerprint changes;
- board/card status: a product planning axis; workspace sync does not use it as
  the V-model lifecycle or move it to simulate loop progress.

The repository epic and work-list own `delivery_status`. Connected projections
carry it as a separate delivery field or derive the same value from the
synchronized entry gate, loop evidence, delivery, reconciliation, and
completion-acceptance facts. Never map it onto `initiatives.status`; an adapter
that cannot yet project it reports that limitation instead of substituting
board state.

### Strict transition records

Repository records must make the human-gated lifecycle transitions auditable:

| Entity transition | Required repository facts before the gate is solicitable |
|---|---|
| Requirement `DERIVED -> PROPOSED` | candidate statement, inference sources, candidate ancestry/links, consequences, confirmation brief, and gate scope |
| Requirement `PROPOSED -> TODO` or `PENDING_VERIFICATION -> TODO` | authoritative ancestry, sourced and testable content, release/owner/scope, required reconnaissance and cold review, test strategy, and no unresolved in-scope decision |
| Epic `PROPOSED -> TODO` | complete scoped entry packet and every selected requirement's entry trace gate passing |
| Requirement `IN_REVIEW -> DONE` | full `EPIC -> UR -> SR -> CODE -> TEST_CASE -> TEST_RESULT` trace, current delivered-revision evidence, reconciled records/projections, and disclosed gaps/deferrals |
| Epic `IN_REVIEW -> DONE` | every named requirement completion-eligible and the delivered epic scope reconciled |

Each applied transition records the gate id, exact entity scope, human actor,
role, answer, `USER:<date>:<summary>` source, and application revision. One
scoped answer may cover an epic and named requirements, but applying it records
each requirement transition before the epic transition. An already-`TODO`
epic does not repeat its entry transition when a new requirement is added; the
new requirement still needs its own entry approval.

`IN_REVIEW` is deliberately stable across delivery and reconciliation. The
completion gate is not solicitable until those operations and delivered-line
evidence are complete. Therefore completion acceptance records acceptance of
an already-delivered result; it never authorizes delivery.

### Gate records and state machines

There are two gate kinds. A `TRACE` gate evaluates facts that an independent
agent or deterministic check can establish from the canonical trace. A
`HUMAN` gate records a decision that requires attributable human interaction.
They are never interchangeable: a trace result cannot grant human authority,
and a human answer is not evidence that the trace is complete.

Every gate record carries:

- stable gate id and `TRACE` or `HUMAN` kind;
- purpose and, for lifecycle gates, the exact transition;
- exact entity and hold scope;
- prerequisite gate ids;
- input revision and content fingerprint;
- state, verdict or answer, and timestamps;
- evaluator or human actor, role, and source/evidence references;
- for human gates, application state and application revision;
- predecessor/successor ids when a gate is superseded.

A trace gate uses this state machine:

```text
PENDING -> PASS
        -> FAIL
PASS | FAIL -- input revision/fingerprint changes --> STALE
STALE ---------------------------------------------> PASS | FAIL (recheck)
```

`PASS` means every named fact is directly supported for the exact fingerprint.
`FAIL` names each missing, contradicted, or stale fact. `STALE` never counts as
pass. A trace gate may be evaluated without human interaction and is never
shown in the human action queue. When a check encounters a product, scope,
architecture, acceptance, priority, or workflow choice, it cannot infer the
answer: it fails or remains pending and routes that choice to a human gate.
Cold technical review is a trace gate whose evaluator must be separate from
the authoring context.

A human gate uses this state machine:

```text
DRAFT -- prerequisite TRACE gates PASS; publish --> OPEN
OPEN -- first attributable human answer ----------> ANSWERED
ANSWERED -- answer applied and read back ----------> CLOSED
DRAFT | OPEN | ANSWERED -- scope/fingerprint replaced --> SUPERSEDED
```

`DRAFT` may exist in repository records but is not solicitable or present in
the human action queue. `OPEN` is eligible and interactable. `ANSWERED` is
first-wins and no longer answerable; it leaves the human action queue and stays
visible only as pending application.
`CLOSED` means the answer was materialized, local checks passed, and repository
and any connected projections agree. It disappears from active/action queues but
remains in audit history. `SUPERSEDED` is terminal, non-actionable, and points
to its replacement; never apply an answer to changed scope, reopen, or silently
reuse a first-wins gate.

Human gates also carry `application_state`:

```text
NOT_APPLICABLE -- accepted answer --> PENDING -> APPLIED
                                      \--------> FAILED
```

`DRAFT` and `OPEN` use `NOT_APPLICABLE`. `ANSWERED` begins at `PENDING`.
Application failure leaves the gate `ANSWERED/FAILED`, preserves its holds,
and reports the failure; it does not request another answer. Only `APPLIED`
plus successful readback permits `CLOSED`.

Each strict lifecycle move is therefore a composition, not one overloaded
gate: its prerequisite trace gate must be `PASS` before its human gate becomes
`OPEN`. Trace invalidation before an answer supersedes the open human gate.
Trace invalidation after closure leaves the old decision in history but creates
a new trace gate and, when human authority is required again, a successor human
gate for the new fingerprint.

### Work-list and generated views

`WORKLIST.md` is the active queue and cross-epic rollup. It does not replace
the epic's evidence map or the ledger's backlog. `PROGRESS.md`, dashboards,
counts, digest views, and boards are projections and must agree with their
underlying records.

## ModernPath reference projection model

ModernPath projects the state axes above through existing `modernpath-core`
entities. This is an implementation adapter, not a second lifecycle or a
replacement for the repository authority matrix. The Ecto schemas under
`modernpath-core/apps/storage/lib/storage/schema/` remain authoritative for
field-level detail.

Do not collapse these concerns into one global `loop_state` field. “Current use”
describes the observed implementation today, not a target inferred from the
schema name.

| State item | Current use | State role |
|---|---|---|
| `compliance_user_requirements` | Stores governed user-level needs created through compliance and planning/import flows; workspace sync can address it when an operation declares user-requirement kind, but the Mission Control Requirements face does not currently read it. | Carries stable external identity, repository `work_status` including `DERIVED`, `TODO`, and `DONE`, source citations, and a separate `draft`/`approved` content-approval status. A derived row is visible to confirmation workflows but excluded from authoritative trace and delivery rollups. |
| `compliance_system_requirements` | Receives the repository requirement-ledger rows through `Core.Sync.upsert_requirement/2`; the Mission Control Requirements face reads these rows directly and computes its rollup from the same result set. | Carries the authoritative synchronized `work_status` including `DERIVED`, `TODO`, and `DONE`, context, stage, sources, and release membership while keeping content approval separate. Rollups count `DERIVED` separately and never treat it as active or confirmed scope. |
| `initiatives` | Serves both as the product Epic/board-card entity and as the synchronized epic record returned to Mission Control with loop statuses, approval, acceptance content, specifications, requirement links, and release. | Carries `upper_loop_status` and `lower_loop_status` plus attributed completion approval. Repository `delivery_status` is a separate projected/derived delivery value; its open-set `status` remains the board column and is never sync-written to simulate lifecycle progress. |
| `acceptance_criteria` | Stores UR criteria and scenario content as addressable content rows. Sync applies replace-set semantics, superseding removed rows; Mission Control reads non-superseded rows for requirement and epic detail. | Its `active`/`superseded`/`retired` status describes content lifecycle, not a delivery lifecycle. Passing, failing, and stale upper evidence are derived from evidence runs. |
| `planning_artifacts` | Stores planner-generated artifacts and repository-synchronized epic specification files; the Mission Control epic read exposes only non-archived, external-id-bearing synchronized specifications. | Carries specification content status, version, approval, last synchronized content hash, and refused-conflict hash. The mapping from `draft`/`review`/`approved` to `SPEC-DRAFT`/`SPEC-READY`/`SPEC-APPROVED` must be explicit. |
| `decision_gates` | Backs synchronized human questions, decisions, roadblocks, completion/specification approvals, and triage in Mission Control’s action queue. Server answers are attributed and first-wins. | Projects `HUMAN` gates, separating the human-answer lifecycle (`state`) from repository application (`applied_state`) and recording the apply job reference. `TRACE` gates stay out of the human queue and require a distinct check/evidence projection. |
| `gate_holds` | Stores a gate's held external ids and types; Mission Control uses them to show the number and identity of affected items. | Defines a gate’s typed blast radius without changing the held entities’ own work status. Holds remain effective through `ANSWERED` and are released only after `APPLIED`; a derived-requirement gate holds the requirement and identifies every candidate link whose use is prohibited until confirmation is applied. |
| `evidence_runs` | Records CI, local-test, compliance-test, browser, or manual runs posted through the evidence path, including runner, branch/SHA, totals, status, and log reference. | Provides the attributed, revision-pinned run envelope used to derive current evidence state. |
| `evidence_results` | Stores each run’s per-target `pass`/`fail`/`skip` result for requirements, criteria, initiatives, or compliance test cases. | Projects `TEST_RESULT` outcomes consumed by `Core.Evidence.latest_state/2`; it does not directly grant a human-gated workflow transition. |
| `compliance_traces` | Powers compliance traceability between requirements, test cases, test results, documents, and implementation entities; re-analysis can mark affected links stale. | Records authoritative links that `implement`, `verify`, `derive`, or `relate`, plus active/stale trace state. Candidate links from a `DERIVED` requirement are not synchronized here until confirmation and normal planning establish them. Required-link staleness invalidates dependent trace gates and enforces the status-demotion rules below. |
| `initiative_user_requirements` | Records planning provenance between an initiative and governed user requirements for compliance/planning flows. It is not currently used by the Mission Control epic read. | Supplies an attributed epic-to-UR trace without overloading requirement or board status. A `DERIVED` UR is not linked until confirmation and planning establish authoritative scope. |
| `initiative_system_requirements` | Is reconciled by workspace epic sync from the epic’s requirement ids and read back by Mission Control when showing an epic’s held requirements. | Supplies the epic-to-synchronized-requirement trace used for scope and rollups. A `DERIVED` requirement or candidate link is excluded. |
| `sync_shadows` | Is consulted before every synchronized upsert to short-circuit identical content, remember origin/hash/time, and block conflicted entities until triage resolves them. | Owns `synced`/`pending_apply`/`conflict` transport state outside the domain tables. Successful synchronization is not completion evidence. |
| `factory_sessions` | Is registered and refreshed by workspace heartbeats; the Mission Control Now face reads sessions with clock-derived `live`/`idle`/`stale`/`closed` liveness. | Describes observable agent-loop activity, branch, and current reference without implying work completion. |
| `factory_jobs` | Tracks server-visible `apply_decision`, `plan_intake`, `verify`, and free-form jobs started and finished under a factory session, optionally linked to a gate. | Carries operational `running`/`done`/`error` state and result/log metadata; a completed job is not evidence unless an evidence run records its result. |
| `work_events` | Receives deduplicated events from sync, gates, evidence/drift, factory sessions, releases, and source-control bridges; Mission Control’s Timeline reads this append-only stream. | Explains who changed what and when and supports historical projections; it does not replace the current repository record. |
| `releases` | Represents both the product delivery target selected by synchronized workspace batches and the compliance Validation Bundle used for snapshot/freeze/reopen behavior. Mission Control uses the release link for active/base/all scoping. | Keeps user-curated delivery `status` separate from controlled `bundle_state`, snapshots, and verdicts. |
| `task_plans` | Holds planner-derived or integration-created work hierarchies under an initiative or system and supplies aggregate planning/estimate fields to planning and board views. | Its status is planning/board state, not an RDD lifecycle or trace level. |
| `task_epics` | Represents Task cards inside a task plan, populated by task derivation, board creation, or integration flows and moved through board columns. | Its status and progress counters drive planning UI only; source-requirement arrays provide planning provenance rather than canonical sync identity. |
| `task_stories` | Represents commit-sized tasks, bugs, or subtasks under a task epic and is rendered/moved on the board with acceptance and source-reference metadata. | Its status is a board column. It does not carry canonical SR lifecycle or lower evidence. |
| `task_items` | Represents the smallest nested implementation/subtask records, including checklist, affected files, branch, commits, and PR URL; board and initiative-task views read and update it. | It is an optional planning artifact, not a canonical trace entity. Any relevant scope, context, evidence, or code link belongs to the owning SR. |

The repository's stable `TEST:` identity remains authoritative for each
`TEST_CASE`. A connected adapter that cannot project a distinct test-case node,
its `CODE -> TEST_CASE` link, and its `TEST_CASE -> TEST_RESULT` executions must
report that limitation. It must not collapse the case and mutable result into
one evidence label or claim the full canonical trace is synchronized.

Implementation sources, relative to the consuming ModernPath workspace:

- requirements, epics, criteria, specifications:
  `CODE:modernpath-core/apps/storage/lib/storage/schema/compliance/user_requirement.ex:Storage.Schema.Compliance.UserRequirement`,
  `CODE:modernpath-core/apps/storage/lib/storage/schema/compliance/system_requirement.ex:Storage.Schema.Compliance.SystemRequirement`,
  `CODE:modernpath-core/apps/storage/lib/storage/schema/initiative.ex:Storage.Schema.Initiative`,
  `CODE:modernpath-core/apps/storage/lib/storage/schema/initiative_user_requirement.ex:Storage.Schema.InitiativeUserRequirement`,
  `CODE:modernpath-core/apps/storage/lib/storage/schema/initiative_system_requirement.ex:Storage.Schema.InitiativeSystemRequirement`,
  `CODE:modernpath-core/apps/storage/lib/storage/schema/acceptance_criterion.ex:Storage.Schema.AcceptanceCriterion`,
  `CODE:modernpath-core/apps/storage/lib/storage/schema/planning_artifact.ex:Storage.Schema.PlanningArtifact`;
- gates, evidence, and trace:
  `CODE:modernpath-core/apps/storage/lib/storage/schema/decision_gate.ex:Storage.Schema.DecisionGate`,
  `CODE:modernpath-core/apps/storage/lib/storage/schema/gate_hold.ex:Storage.Schema.GateHold`,
  `CODE:modernpath-core/apps/storage/lib/storage/schema/evidence_run.ex:Storage.Schema.EvidenceRun`,
  `CODE:modernpath-core/apps/storage/lib/storage/schema/evidence_result.ex:Storage.Schema.EvidenceResult`,
  `CODE:modernpath-core/apps/storage/lib/storage/schema/compliance/trace.ex:Storage.Schema.Compliance.Trace`;
- sync, execution, history, and release:
  `CODE:modernpath-core/apps/storage/lib/storage/schema/sync_shadow.ex:Storage.Schema.SyncShadow`,
  `CODE:modernpath-core/apps/storage/lib/storage/schema/factory_session.ex:Storage.Schema.FactorySession`,
  `CODE:modernpath-core/apps/storage/lib/storage/schema/factory_job.ex:Storage.Schema.FactoryJob`,
  `CODE:modernpath-core/apps/storage/lib/storage/schema/work_event.ex:Storage.Schema.WorkEvent`,
  `CODE:modernpath-core/apps/storage/lib/storage/schema/release.ex:Storage.Schema.Release`,
  `CODE:modernpath-core/apps/storage/lib/storage/schema/task_plan.ex:Storage.Schema.TaskPlan`,
  `CODE:modernpath-core/apps/storage/lib/storage/schema/task_plan.ex:Storage.Schema.TaskEpic`,
  `CODE:modernpath-core/apps/storage/lib/storage/schema/task_plan.ex:Storage.Schema.TaskStory`,
  `CODE:modernpath-core/apps/storage/lib/storage/schema/task_plan.ex:Storage.Schema.TaskItem`;
- projection guards: `CODE:modernpath-core/apps/core/lib/core/sync.ex:upsert_epic/2`
  and `CODE:modernpath-core/apps/core/lib/core/evidence.ex:latest_state/2`.
- current read/write paths:
  `CODE:modernpath-core/apps/core/lib/core/sync.ex:upsert_requirement/2`,
  `CODE:modernpath-core/apps/core/lib/core/sync.ex:link_requirements/3`,
  `CODE:modernpath-core/apps/aiengine_web/lib/aiengine_web/controllers/sync_api_controller.ex:requirements/2`,
  `CODE:modernpath-core/apps/aiengine_web/lib/aiengine_web/controllers/sync_api_controller.ex:epics/2`,
  `CODE:modernpath-core/apps/core/lib/core/factory_sessions.ex:Core.FactorySessions`,
  `CODE:modernpath-core/apps/aiengine_web/lib/aiengine_web/controllers/board_api_controller.ex:AiengineWeb.BoardApiController`.

The resulting Mission Control read model composes, rather than conflates:

```text
requirement work_status
+ derived-requirement confirmation gate and candidate context
+ epic delivery_status
+ epic upper_loop_status and lower_loop_status
+ specification status
+ human gate state and application state
+ trace gate state and input fingerprint
+ evidence state derived from runs
+ synchronization state
+ factory session/job liveness
+ release scope
```

`initiatives.status` and the `task_*` status fields are planning-board axes.
Workspace synchronization must not move them to simulate V-model progress.
The `task_*` models may hold optional planner-local decomposition, but they do
not appear in the canonical trace and never own requirement scope, lifecycle,
evidence, or code attribution. Those stay on the SR and appear in Mission
Control through the synchronized requirement trace and rollups.

## Local checks

Run the consuming project's deterministic checks after state changes. A
ModernPath-enabled repository may provide:

```sh
modernpath check
```

Required project checks cover:

- ledger status hygiene: dashboard counts agree with `Totals:`;
- canonical trace hygiene: each evidence-backed claim resolves through
  `EPIC -> UR -> SR -> CODE -> TEST_CASE -> TEST_RESULT`, with stable case ids
  and revision-pinned result validity;
- gate consistency: only a passed, current trace gate may open its human gate,
  only an applied answer may close it, and stale fingerprints cannot advance a
  status;
- strict entry approval: no epic or requirement is `TODO` without the scoped,
  attributable human answer applied after its entry trace gate passed;
- fulfilled trace before final approval: no requirement or
  epic is `DONE` unless delivery, delivered-revision evidence, and
  reconciliation preceded the attributable completion answer;
- invalidation cascade: no evidence waypoint, `IN_REVIEW`, or `DONE` status may
  survive loss of evidence it requires.

Repositories adopting checks over existing records may keep a reviewed
baseline for existing violations. A baseline suppresses only those exact
violations; it is not proof that the underlying debt is fixed.

Project checks must also reject any `DERIVED` row that lacks a confirmation
trace gate and current human-gate record, any `OPEN` confirmation human gate
whose trace gate is not `PASS`, any active epic/work-list/trace relationship
sourced from a `DERIVED` requirement, and any rollup that counts a candidate
link as confirmed scope. Tooling that has not implemented these checks reports
that limitation; it must not silently treat `DERIVED` as `PROPOSED`.

## Automatic synchronization

In a connected ModernPath workspace, hooks normally run `factory sync` at
session start, session end, and agent-turn end. Sync is fire-and-forget,
debounced, and skipped while the repository is changing. Routine work should
not need a manual push.

Two consequences follow:

1. A successful hook process does not prove that the intended records landed.
   After extractor/schema changes or before a consequential handoff, read the
   server projection back.
2. The extractor and CLI must match the repository format. A separately
   installed stale binary can report success while omitting newly supported
   fields. Prefer the repository-pinned/current tool when validating changes
   to extraction or process formats.

Use manual sync only for setup, diagnosis, or recovery:

```sh
modernpath factory status
modernpath factory sync --dry-run
modernpath factory sync
```

## Mission Control and gates

Mission Control has two kinds of surface:

- **observe**: digest, current activity, whole scope, requirements, evidence,
  and timeline;
- **act**: the “Your move” queue for decisions, entry/specification approvals,
  completion approvals, roadblocks, and triage.

Human-gate content is normally extracted from requirement, epic, and
open-question records and synced to the server. A strict transition's human
gate becomes `OPEN` only after its prerequisite trace gate is `PASS`. A
`DERIVED` confirmation trace gate checks that the candidate packet and brief
are complete; only then may its human gate hold the requirement and candidate
links in the action queue. Gate emission depends on parser-visible markers and
work-list wording, so prose saying “awaiting confirmation” is not proof that an
eligible gate exists. Read the gate list back when a human action is expected.

Do not solicit a human answer for a gate that does not exist in `OPEN` state.
An answer collected outside that exact gate attaches to no valid transition.
In a connected workspace, the full sequence is:

```text
HUMAN gate DRAFT + trace facts -> TRACE gate PASS -> sync -> HUMAN gate OPEN
-> human answers (attributed, first-wins) -> ANSWERED/PENDING
-> factory pull --apply -> ANSWERED/APPLIED -> checks + sync + readback -> CLOSED
```

The first accepted server answer is authoritative in a connected workspace.
Mission Control or another human-facing client is a valid answer channel only
when it submits to the exact `OPEN` gate and preserves the real actor. A chat or
free-form answer becomes authoritative only when recorded through that same
gate; an agent must not infer an answer, fabricate the actor, or apply prose to
a different gate.

Without a platform connection, the gate is repo-borne: the human decision is
recorded directly against the exact `OPEN` gate in the record it approves,
with the same actor, role, timestamp, answer, scope, and `USER:<date>`
attribution. Either way the gate exists before the question is asked.

Server gate answers are first-wins. Once answered, later repository sync may
update descriptive gate content but must not overwrite the answer. Preserve
the actual human actor; never attribute a human decision to an agent or a
hard-coded user. An answer that fails to apply remains `ANSWERED/FAILED` and
continues to hold its scope until repaired and read back; it is not asked
again. Closed and superseded gates leave active/action queues but remain in
history.

Pull server-originated answers before continuing held work:

```sh
modernpath factory gates
modernpath factory pull --apply
```

After applying an answer:

1. update the affected spec, requirement acceptance content, and system
   requirements as required by the decision;
2. record the gate id, exact entity transitions, application revision,
   `USER:<date>:<summary>` source, and consequence;
3. run local process checks;
4. let automatic sync publish the materialized state;
5. confirm the server intent is applied and the gate/projection agrees, then
   confirm the canonical projection reports `CLOSED`.

For a derived-requirement answer, apply the transition defined under
“Requirement ledger” before any held work continues. Confirmation or correction
adds the `USER:` source and routes candidate links through planning; rejection
marks the requirement `OBSOLETE` and retires the candidates. Do not convert
candidate links into authoritative relationships merely because the gate was
answered.

For a completion answer, first prove that the delivered trace and projections
still satisfy the gate snapshot. Apply accepted named requirements to
`DONE`, then their epic to `DONE`. If the trace changed after the gate
became eligible, do not solicit or apply the stale decision; refresh the facts
and gate brief first.

## Evidence state

Local epic and ledger records link the exact tests, commands, code paths, and
results used for a status claim. A connected workspace may additionally post a
typed evidence run:

```sh
modernpath factory evidence report --kind local_test --log "<command>" \
  --totals passed=<n>,failed=<n> --pass <trace-ids>
modernpath factory drift
```

Server evidence is pinned to a branch and commit when available and derives
`passing`, `failing`, or `stale` state per target. It supplements rather than
replaces the repository evidence map. A broad suite proves only the trace ids
it actually exercises, and evidence becomes stale when traced code changes.
Technical reconnaissance records its inspected source revision; material drift
stales the reconnaissance and its cold review until the affected surface and
findings are refreshed. Boy-scout cleanup changes precede final evidence, so
only post-cleanup runs support `LOWER_VERIFIED` or `UPPER_VALIDATED`.

A `TEST_RESULT` records two independent axes:

- outcome: `PASS | FAIL | SKIP`;
- validity: `CURRENT | STALE | INVALID | INHERITED_UNVERIFIED`.

Only a `CURRENT` result linked through the exact
`CODE -> TEST_CASE -> TEST_RESULT` trace counts as direct evidence. A change to
traced code or a required test case makes the old result `STALE`. A revert, an
abandoned branch, or a closed unmerged PR makes a result pinned only to that
unreachable revision `INVALID` for delivered-line claims. A record may retain
it as `INHERITED_UNVERIFIED`, preserving its origin revision, but it may not
present it as current. Re-verifying part of an inherited set does not refresh
the rest.

Evidence invalidation is an integrity transition and may be applied by an
independent agent or deterministic check without human interaction. It causes
all of the following atomically:

1. mark the affected test result validity;
2. move every dependent passed trace gate to `STALE`, then re-evaluate it;
3. supersede any unclosed human gate whose snapshot depended on that trace;
4. roll `LOWER_VERIFIED` or `UPPER_VALIDATED` back to `IN_PROGRESS` when its
   required evidence is no longer current;
5. demote an affected SR in `IN_REVIEW` or `DONE` to `IN_PROGRESS` when required
   lower evidence is lost;
6. demote an affected UR in `IN_REVIEW` or `DONE` to `IN_PROGRESS` when required
   upper evidence or linked lower evidence is lost; and
7. demote an affected epic in `IN_REVIEW` or `DONE` to `IN_PROGRESS` when any
   in-scope requirement loses required evidence.

Invalidation of supplemental evidence that no active gate or status requires
does not demote work status. Invalidation alone does not create `BLOCKED`; use
that side state only when an actual blocker prevents repair. A prior human
answer remains attributable history, but it cannot sustain a claim whose trace
has decayed. After re-verification, the entity returns to `IN_REVIEW` and a new
completion human gate for the new fingerprint is required before `DONE`.

Material changes to approved product scope, acceptance, or architecture stale
the entry trace gate as well. A not-yet-started `TODO` entity then returns to
`PROPOSED`; an active entity returns to planning from `IN_PROGRESS`. The old
entry answer remains history and a successor entry gate is required. A change
inside approved scope that merely implements or repairs the requirement does
not repeat entry approval.

## Release state

A project release registry contains exactly one active release. The local
platform binding mirrors that selection; drift is a defect. Sync stamps the
batch at workspace level rather than adding release columns to every ledger
row. Selecting or changing the active release is a human product decision and
requires a `USER:` source.

`DERIVED` requirements are not release commitments and are excluded from active
release delivery scope until confirmation and normal planning assign them.

Base or closed-release work must not be mixed into the default active-release
view. Deferral means later within the current release unless an attributable
decision moves the work elsewhere.

## Conflict rules

- Preserve unrelated work and use one writer for shared process records.
- Stop when local records and a server answer contain competing human intent.
- Do not resolve identity, scope, acceptance, or release conflicts by timestamp
  alone.
- Preserve both sources, surface the conflict, and request human resolution.
- Never bypass tenant, workspace, system, release, or actor scope to make sync
  pass.
- Offline work may continue from repository records, but label server evidence
  or gate state as unconfirmed until the workspace reconnects.

## Session sequence

Start:

1. inspect `git status` and preserve unrelated changes;
2. read `WORKLIST.md`, the target ledger, and the active epic;
3. in connected workspaces, run the platform preflight before selecting work:
   `modernpath factory status`; open gates and pending intents, applying any
   answer that holds the selected work; and the local release binding checked
   against the registry's single active release. Report binding drift and
   unsynced state instead of carrying them silently;
4. inspect `DERIVED` requirements and confirmation gates; never select a trace
   with a `DERIVED` ancestor or candidate link;
5. reconcile contradictory repository records before selecting the next item.

After a transition:

1. update the complete affected trace and every duplicated status field;
2. record direct evidence and attributable decisions;
3. run repository process checks and required tests;
4. allow automatic sync, then read back consequential gate/evidence changes.

End:

1. leave ledger, epic, work-list, and generated projections consistent;
2. record discoveries, deferrals, blockers, and remaining human moves;
3. distinguish `verified locally`, `synced`, `approved`, `delivered`, and
   `DONE`; they are different claims;
4. report any unavailable binding, stale tool, failed sync, or unconfirmed
   server state explicitly.
