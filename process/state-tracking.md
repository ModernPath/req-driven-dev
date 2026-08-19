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
| Requirement backlog and work status | Requirement ledger, normally `tasks/<CTX>-REQUIREMENTS.md` |
| Epic trace, scenarios, system requirements, tasks, technical reconnaissance, cold-review findings, decisions, evidence map, approval | Epic record under `epics/` |
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
specifications, tasks, tests, or code. The applying agent must pull the intent,
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
| `PROPOSED` | identified but not ready |
| `READY` | sourced criteria are ready for implementation entry |
| `IN_PROGRESS` | one or both evidence loops are underway |
| `IN_REVIEW` | lower verification is complete, and upper validation is complete or the row owes none; approval or delivery remains |
| `PENDING_VERIFICATION` | derived from shipped code: described and accepted as accurate, but not yet proven by a test |
| `DONE` | evidence, approval, source delivery, and reconciliation are complete |
| `BLOCKED` | cannot proceed; blocker or gate is linked |
| `DEFERRED` | consciously postponed; reason and tracking target are recorded |
| `OBSOLETE` | superseded; replacement source is linked |

`PENDING_VERIFICATION` belongs only to rows reverse-engineered from code that
already ships. Work this process built red-first reaches `IN_REVIEW` instead,
because its evidence existed before its implementation. Keeping the two apart is
what lets a human accept a derived backlog as an accurate description without
that acceptance claiming the behavior is tested.

Direct verification moves a derived system requirement to `LOWER_VERIFIED`.

A ledger with one combined work-status column may record that as `IN_REVIEW`
**only when the row carries no upper-loop obligation** — that is, no scenario
exists or is owed for it, so upper validation is not outstanding but absent. The
row states that fact; it is not inferred from the ledger's shape. A derived row
that does own a scenario stays `IN_PROGRESS` until upper validation, exactly like
built work.

The distinction matters because the column count is a property of the ledger and
the obligation is a property of the requirement. Mapping on the former lets a
schema decide what "reviewed" means, which is how `IN_REVIEW` comes to describe
two different amounts of evidence in one corpus.

Test evidence never moves a row directly to `DONE`; approval,
authoritative-source delivery, and state reconciliation remain separate gates.

### Epic record

The epic owns detailed internal completion: `UR`, `SCN`, `SR`, `TASK`, spec
status, technical reconnaissance, cold-review findings and dispositions,
decisions, gaps, evidence, and approval. Its upper and lower loop statuses are
separate from the requirement work status.

Use these axes independently:

- requirement `work_status`: the ledger lifecycle above;
- epic `upper_loop_status`: scenario/acceptance progress;
- epic `lower_loop_status`: task/system verification progress;
- specification status: `SPEC-DRAFT -> SPEC-READY -> SPEC-APPROVED`;
- gate state: server `open -> answered`, with a separate pending/applied intent
  state where the integration supports it;
- board/card status: a product planning axis; workspace sync does not use it as
  the V-model lifecycle or move it to simulate loop progress.

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
| `compliance_user_requirements` | Stores governed user-level needs created through compliance and planning/import flows; workspace sync can address it when an operation declares user-requirement kind, but the Mission Control Requirements face does not currently read it. | Carries stable external identity, repository `work_status`, source citations, and a separate `draft`/`approved` content-approval status. |
| `compliance_system_requirements` | Receives the repository requirement-ledger rows through `Core.Sync.upsert_requirement/2`; the Mission Control Requirements face reads these rows directly and computes its rollup from the same result set. | Carries the authoritative synchronized `work_status`, context, stage, sources, and release membership while keeping content approval separate. |
| `initiatives` | Serves both as the product Epic/board-card entity and as the synchronized epic record returned to Mission Control with loop statuses, approval, scenarios, specifications, requirement links, and release. | Carries `upper_loop_status` and `lower_loop_status` plus attributed completion approval. Its open-set `status` remains the board column and is never sync-written to simulate loop progress. |
| `acceptance_criteria` | Stores requirement criteria and epic scenarios as addressable rows. Sync applies replace-set semantics, superseding removed rows; Mission Control reads non-superseded rows for requirement and epic detail. | Its `active`/`superseded`/`retired` status describes criterion-content lifecycle. Passing, failing, and stale verification are derived from evidence. |
| `planning_artifacts` | Stores planner-generated artifacts and repository-synchronized epic specification files; the Mission Control epic read exposes only non-archived, external-id-bearing synchronized specifications. | Carries specification content status, version, approval, last synchronized content hash, and refused-conflict hash. The mapping from `draft`/`review`/`approved` to `SPEC-DRAFT`/`SPEC-READY`/`SPEC-APPROVED` must be explicit. |
| `decision_gates` | Backs synchronized questions, decisions, roadblocks, completion/specification approvals, and triage in Mission Control’s action queue. Server answers are attributed and first-wins. | Separates the human-answer lifecycle (`state`) from repository application (`applied_state`) and records the apply job reference. |
| `gate_holds` | Stores the external ids and types released by answering a gate; Mission Control uses them to show the number and identity of affected items. | Defines a gate’s typed blast radius without changing the held entities’ own work status. |
| `evidence_runs` | Records CI, local-test, compliance-test, browser, or manual runs posted through the evidence path, including runner, branch/SHA, totals, status, and log reference. | Provides the attributed, revision-pinned run envelope used to derive current evidence state. |
| `evidence_results` | Stores each run’s per-target `pass`/`fail`/`skip` result for requirements, criteria, initiatives, or compliance test cases. | Supplies the target outcomes consumed by `Core.Evidence.latest_state/2`; it does not directly advance workflow status. |
| `compliance_traces` | Powers compliance traceability between requirements, tests, documents, and implementation entities; re-analysis can mark affected links stale. | Records whether a link `implements`, `verifies`, `derives`, or `relates`, plus active/stale trace state. Staleness is an evidence concern, not an automatic work-status transition. |
| `initiative_user_requirements` | Records planning provenance between an initiative and governed user requirements for compliance/planning flows. It is not currently used by the Mission Control epic read. | Supplies an attributed epic-to-UR trace without overloading requirement or board status. |
| `initiative_system_requirements` | Is reconciled by workspace epic sync from the epic’s requirement ids and read back by Mission Control when showing an epic’s held requirements. | Supplies the epic-to-synchronized-requirement trace used for scope and rollups. |
| `sync_shadows` | Is consulted before every synchronized upsert to short-circuit identical content, remember origin/hash/time, and block conflicted entities until triage resolves them. | Owns `synced`/`pending_apply`/`conflict` transport state outside the domain tables. Successful synchronization is not completion evidence. |
| `factory_sessions` | Is registered and refreshed by workspace heartbeats; the Mission Control Now face reads sessions with clock-derived `live`/`idle`/`stale`/`closed` liveness. | Describes observable agent-loop activity, branch, and current reference without implying work completion. |
| `factory_jobs` | Tracks server-visible `apply_decision`, `plan_intake`, `verify`, and free-form jobs started and finished under a factory session, optionally linked to a gate. | Carries operational `running`/`done`/`error` state and result/log metadata; a completed job is not evidence unless an evidence run records its result. |
| `work_events` | Receives deduplicated events from sync, gates, evidence/drift, factory sessions, releases, and source-control bridges; Mission Control’s Timeline reads this append-only stream. | Explains who changed what and when and supports historical projections; it does not replace the current repository record. |
| `releases` | Represents both the product delivery target selected by synchronized workspace batches and the compliance Validation Bundle used for snapshot/freeze/reopen behavior. Mission Control uses the release link for active/base/all scoping. | Keeps user-curated delivery `status` separate from controlled `bundle_state`, snapshots, and verdicts. |
| `task_plans` | Holds planner-derived or integration-created work hierarchies under an initiative or system and supplies aggregate planning/estimate fields to planning and board views. | Its status is planning/board state, not the repository V-model task lifecycle. |
| `task_epics` | Represents Task cards inside a task plan, populated by task derivation, board creation, or integration flows and moved through board columns. | Its status and progress counters drive planning UI only; source-requirement arrays provide planning provenance rather than canonical sync identity. |
| `task_stories` | Represents commit-sized tasks, bugs, or subtasks under a task epic and is rendered/moved on the board with acceptance and source-reference metadata. | Its status is a board column. It does not carry the repository task’s lower-loop evidence state. |
| `task_items` | Represents the smallest nested implementation/subtask records, including checklist, affected files, branch, commits, and PR URL; board and initiative-task views read and update it. | It lacks the stable workspace-sync identity and direct SR/evidence linkage needed to become the canonical repository task/slice record. |

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
+ epic upper_loop_status and lower_loop_status
+ specification status
+ gate state and applied_state
+ derived evidence state
+ synchronization state
+ factory session/job liveness
+ release scope
```

`initiatives.status` and the `task_*` status fields are planning-board axes.
Workspace synchronization must not move an initiative card to simulate V-model
progress. The existing `task_items` model can represent planner-local work, but
it does not currently provide the stable workspace-sync identity and direct
SR/evidence linkage required to become the canonical repository task/slice
record. Until that contract is deliberately extended, task/slice state remains
in the repository epic/task records and appears in Mission Control only through
the synchronized trace and rollups.

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

Gate content is normally extracted from epic/open-question records and synced
to the server. Gate emission currently depends on parser-visible markers and
work-list wording, so a record saying “awaiting approval” is not proof that a
gate exists. Read the gate list back when a human action is expected.

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

1. update the affected spec, requirement, scenario, system requirement, and
   tasks as required by the decision;
2. record the `USER:<date>:<summary>` source and consequence;
3. run local process checks;
4. let automatic sync publish the materialized state;
5. confirm the server intent is applied and the gate/projection agrees.

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

## Release state

A project release registry contains exactly one active release. The local
platform binding mirrors that selection; drift is a defect. Sync stamps the
batch at workspace level rather than adding release columns to every ledger
row. Selecting or changing the active release is a human product decision and
requires a `USER:` source.

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
4. reconcile contradictory repository records before selecting the next item.

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
