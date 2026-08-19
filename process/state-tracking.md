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
| Code and automated tests | Implementation source repository plus observed CI/runtime result |
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
| `DERIVED` | inferred requirement awaiting attributable human confirmation that it exists; candidate links are held and non-authoritative |
| `PROPOSED` | identified but not ready |
| `READY` | sourced criteria are ready for implementation entry |
| `IN_PROGRESS` | one or both evidence loops are underway |
| `IN_REVIEW` | evidence required by the requirement kind is complete; applicable approval or delivery remains |
| `PENDING_VERIFICATION` | human-confirmed as-built requirement: described and accepted as accurate, but not yet proven by a test |
| `VALIDATED` | required evidence, applicable approval, source delivery, and reconciliation are complete |
| `BLOCKED` | cannot proceed; blocker or gate is linked |
| `DEFERRED` | consciously postponed; reason and tracking target are recorded |
| `OBSOLETE` | rejected or superseded; human decision or replacement source is linked |

`DERIVED` is a pre-lifecycle hold, not a weaker spelling of `PROPOSED`. A
derived row records an inference from `DOC:`, `CODE:`, existing requirements,
or analysis without claiming that the inferred requirement is real. It carries
an open human confirmation gate. Until that answer is applied:

- the row is not eligible for `PROPOSED`, `READY`, release commitment, work
  selection, specification, testing, implementation, or verification;
- proposed EPIC/UR/SR relationships are candidate context in the row and
  gate brief, not authoritative links in epic scope, compliance traces, or
  rollups;
- existing SRs and their evidence remain intact, but the derived UR must not be
  presented as their validated user intent.

An attributable confirmation or correction records its `USER:` source, moves
the requirement into `PROPOSED`, and sends every candidate link through normal
planning before it becomes authoritative. If the same decision explicitly
accepts an as-built description of behavior that already ships, the row may
enter `PENDING_VERIFICATION` instead. A rejection moves the row to `OBSOLETE`
and retires its candidate links. None of these answers automatically makes a
row `READY`.

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
planning before tests change. An SR reaches `IN_REVIEW` when all of its required
lower evidence is complete. A UR reaches `IN_REVIEW` only when its linked lower
evidence and acceptance-content upper validation are complete.

Test evidence never moves a row directly to `VALIDATED`; applicable approval,
authoritative-source delivery, and state reconciliation remain separate gates.

### Epic record

The epic is the top-level delivery record. It owns detailed internal completion:
`UR`, UR acceptance content, thin `SR` slices and their implementation context,
spec status, technical reconnaissance, cold-review findings and dispositions,
decisions, gaps, evidence, and approval.

Use these axes independently:

- requirement `work_status`: the ledger lifecycle above;
- epic `delivery_status`: `PROPOSED -> READY -> IN_PROGRESS -> IN_REVIEW ->
  DONE`, with `BLOCKED`, `DEFERRED`, and `OBSOLETE` side states;
- epic `upper_loop_status`: derived UR acceptance-content evidence progress,
  `PROPOSED -> IN_PROGRESS -> UPPER_VALIDATED`;
- epic `lower_loop_status`: derived SR verification progress,
  `PROPOSED -> IN_PROGRESS -> LOWER_VERIFIED`;
- specification status: `SPEC-DRAFT -> SPEC-READY -> SPEC-APPROVED`;
- gate state: server `open -> answered`, with a separate pending/applied intent
  state where the integration supports it;
- board/card status: a product planning axis; workspace sync does not use it as
  the V-model lifecycle or move it to simulate loop progress.

The repository epic and work-list own `delivery_status`. Connected projections
carry it as a separate delivery field or derive the same value from the
synchronized entry gate, loop evidence, completion approval, delivery, and
reconciliation facts. Never map it onto `initiatives.status`; an adapter that
cannot yet project it reports that limitation instead of substituting board
state.

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
| `compliance_user_requirements` | Stores governed user-level needs created through compliance and planning/import flows; workspace sync can address it when an operation declares user-requirement kind, but the Mission Control Requirements face does not currently read it. | Carries stable external identity, repository `work_status` including `DERIVED`, source citations, and a separate `draft`/`approved` content-approval status. A derived row is visible to confirmation workflows but excluded from authoritative trace and delivery rollups. |
| `compliance_system_requirements` | Receives the repository requirement-ledger rows through `Core.Sync.upsert_requirement/2`; the Mission Control Requirements face reads these rows directly and computes its rollup from the same result set. | Carries the authoritative synchronized `work_status` including `DERIVED`, context, stage, sources, and release membership while keeping content approval separate. Rollups count `DERIVED` separately and never treat it as active or confirmed scope. |
| `initiatives` | Serves both as the product Epic/board-card entity and as the synchronized epic record returned to Mission Control with loop statuses, approval, acceptance content, specifications, requirement links, and release. | Carries `upper_loop_status` and `lower_loop_status` plus attributed completion approval. Repository `delivery_status` is a separate projected/derived delivery value; its open-set `status` remains the board column and is never sync-written to simulate lifecycle progress. |
| `acceptance_criteria` | Stores UR criteria and scenario content as addressable content rows. Sync applies replace-set semantics, superseding removed rows; Mission Control reads non-superseded rows for requirement and epic detail. | Its `active`/`superseded`/`retired` status describes content lifecycle, not a delivery lifecycle. Passing, failing, and stale upper evidence are derived from evidence runs. |
| `planning_artifacts` | Stores planner-generated artifacts and repository-synchronized epic specification files; the Mission Control epic read exposes only non-archived, external-id-bearing synchronized specifications. | Carries specification content status, version, approval, last synchronized content hash, and refused-conflict hash. The mapping from `draft`/`review`/`approved` to `SPEC-DRAFT`/`SPEC-READY`/`SPEC-APPROVED` must be explicit. |
| `decision_gates` | Backs synchronized questions, decisions, roadblocks, completion/specification approvals, and triage in Mission Control’s action queue. Server answers are attributed and first-wins. | Separates the human-answer lifecycle (`state`) from repository application (`applied_state`) and records the apply job reference. |
| `gate_holds` | Stores the external ids and types released by answering a gate; Mission Control uses them to show the number and identity of affected items. | Defines a gate’s typed blast radius without changing the held entities’ own work status. A derived-requirement gate holds the requirement and identifies every candidate link whose use is prohibited until confirmation. |
| `evidence_runs` | Records CI, local-test, compliance-test, browser, or manual runs posted through the evidence path, including runner, branch/SHA, totals, status, and log reference. | Provides the attributed, revision-pinned run envelope used to derive current evidence state. |
| `evidence_results` | Stores each run’s per-target `pass`/`fail`/`skip` result for requirements, criteria, initiatives, or compliance test cases. | Supplies the target outcomes consumed by `Core.Evidence.latest_state/2`; it does not directly advance workflow status. |
| `compliance_traces` | Powers compliance traceability between requirements, tests, documents, and implementation entities; re-analysis can mark affected links stale. | Records authoritative links that `implement`, `verify`, `derive`, or `relate`, plus active/stale trace state. Candidate links from a `DERIVED` requirement are not synchronized here until confirmation and normal planning establish them. Staleness is an evidence concern, not an automatic work-status transition. |
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
+ gate state and applied_state
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

The current check covers:

- ledger status hygiene: dashboard counts agree with `Totals:`;
- approval before `DONE`: a completed work-list epic links a record containing
  an attributable `USER:` approval.

Repositories adopting checks over existing records may keep a reviewed
baseline for existing violations. A baseline suppresses only those exact
violations; it is not proof that the underlying debt is fixed.

Project checks must also reject any `DERIVED` row that lacks an open or answered
confirmation gate, any active epic/work-list/trace relationship sourced from a
`DERIVED` requirement, and any rollup that counts a candidate link as confirmed
scope. Tooling that has not implemented these checks reports that limitation;
it must not silently treat `DERIVED` as `PROPOSED`.

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
- **act**: the “Your move” queue for decisions, specification approvals,
  completion approvals, roadblocks, and triage.

Gate content is normally extracted from requirement, epic, and open-question
records and synced to the server. Every `DERIVED` requirement emits a
confirmation gate whose holds identify the requirement and its candidate links.
Gate emission depends on parser-visible markers and work-list wording, so a
record saying “awaiting confirmation” is not proof that a gate exists. Read the
gate list back when a human action is expected.

Do not solicit a human answer for a gate that does not exist yet; an answer
collected outside an existing gate attaches to nothing. In a connected
workspace, the path from record to applied answer is one sequence, and asking
comes only after the second step:

```text
record emits the gate -> sync publishes it -> human answers (attributed,
first-wins) -> factory pull --apply -> answer materialized into the record
with its USER:<date> source -> next sync closes the gate
```

Without a platform connection, the gate is repo-borne: the human decision is
recorded directly in the record it approves, with the same `USER:<date>`
attribution. Either way the gate exists before the question is asked.

Server gate answers are first-wins. Once answered, later repository sync may
update descriptive gate content but must not overwrite the answer. Preserve
the actual human actor; never attribute a human decision to an agent or a
hard-coded user.

Pull server-originated answers before continuing held work:

```sh
modernpath factory gates
modernpath factory pull --apply
```

After applying an answer:

1. update the affected spec, requirement acceptance content, and system
   requirements as required by the decision;
2. record the `USER:<date>:<summary>` source and consequence;
3. run local process checks;
4. let automatic sync publish the materialized state;
5. confirm the server intent is applied and the gate/projection agrees.

For a derived-requirement answer, apply the transition defined under
“Requirement ledger” before any held work continues. Confirmation or correction
adds the `USER:` source and routes candidate links through planning; rejection
marks the requirement `OBSOLETE` and retires the candidates. Do not convert
candidate links into authoritative relationships merely because the gate was
answered.

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

A revert, an abandoned branch, or a closed unmerged PR is such a change:
evidence pinned to a revision that no longer reaches the delivered line is
invalidated with it. When a record carries that evidence forward, either
re-verify it at the current revision or mark it explicitly as inherited and
unverified at the current revision. A record may carry inherited evidence; it
may not present it as fresh, and re-verifying part of an inherited set does not
make the rest re-verified. Statuses that require linked direct evidence accept
only the re-verified portion.

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
