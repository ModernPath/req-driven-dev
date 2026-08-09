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
| Epic trace, scenarios, system requirements, tasks, decisions, evidence map, approval | Epic record under `epics/` |
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
| `IN_REVIEW` | lower verification and upper validation are complete; approval or delivery remains |
| `DONE` | evidence, approval, source delivery, and reconciliation are complete |
| `BLOCKED` | cannot proceed; blocker or gate is linked |
| `DEFERRED` | consciously postponed; reason and tracking target are recorded |
| `OBSOLETE` | superseded; replacement source is linked |

### Epic record

The epic owns detailed internal completion: `UR`, `SCN`, `SR`, `TASK`, spec
status, decisions, gaps, evidence, and approval. Its upper and lower loop
statuses are separate from the requirement work status.

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
3. in connected workspaces, inspect pending gates/intents and apply any answer
   that holds the selected work;
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
