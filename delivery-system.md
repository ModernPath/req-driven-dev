# ModernPath Delivery System state contract

The ModernPath Delivery System holds the durable state of the human,
development, upper, and lower loops. Repositories remain the source of code,
tests, and versioned product specifications; they are not a competing workflow
database.

This split implements the loop model in the design diagram:

- the human loop opens and answers specification, decision, and completion
  gates;
- the development loop selects work and drives it through RED/GREEN evidence;
- the V-model links user requirements to end-to-end validation and system
  requirements to focused verification;
- the Delivery System keeps status, audit history, evidence, and traceability
  across all three.

## Authority matrix

| Concern | Authoritative home | Local representation |
|---|---|---|
| Product intent, domain rules, architecture, and contracts | Versioned product docs and schemas in the product repository | `docs/`, contracts, ADRs |
| Code and automated tests | The implementation's source repository and CI/runtime result | source files, test files, commits, PRs |
| Loop state and relationships | ModernPath Delivery System | requirement ledgers, epic/spec/task files, local work-list |
| Human questions, decisions, and approvals | Delivery System gate with attributable human actor | sourced decision/approval record synced into the repository |
| Test and validation results | Delivery System evidence run pinned to code revision | command/report link in the relevant evidence map |
| Audit history | Delivery System events and immutable answer/evidence history | version-control history and concise epic completion log |
| Release membership | Delivery System release state selected by the workspace | tracked release registry plus local workspace binding |

The local files are intentionally first-class: agents can reason from them,
humans can review them in a PR, and the workspace can be rebuilt. Their status
fields are a synchronized representation of Delivery System state. A conflict
is an error to reconcile, not permission to declare two sources of truth.

## State graph

```text
Human input / product sources
          |
          v
  specification or decision gate ---------------------------+
          | approved                                        |
          v                                                 |
UR -> EPIC -> SCN -> SR -> TASK -> TEST -> CODE             |
|      |      |      |      |       |       |               |
+------+------ Delivery System trace graph ---+--------------+
          |                                   |
          v                                   v
 lower verification evidence          upper validation evidence
          |                                   |
          +---------------+-------------------+
                          v
                    completion gate
                          |
                          v
                  delivered / reconciled
```

The Delivery System stores at least:

- user and system requirements, acceptance criteria, and work statuses;
- epics, specifications, scenarios, tasks, and their trace links;
- open/answered gates, holds, actor identity, and applied state;
- evidence runs/results pinned to branch and commit SHA;
- releases and workspace/system scope;
- sessions/jobs and append-only work events where supported.

## Control surfaces

### Mission Control

Use Mission Control for human-facing work:

- understand active release scope and progress;
- review briefs, specifications, evidence, and trace links;
- answer questions and approve/reject gates;
- inspect conflicts, blocked work, and audit history.

### `modernpath` CLI

Use the CLI for local and automated work. Exact availability depends on the
consuming workspace, but a sync-enabled workspace normally supports:

```sh
modernpath factory status
modernpath factory pull --apply
modernpath factory gates
modernpath factory answer <gate-id> --text "..."
modernpath factory sync --dry-run
modernpath factory sync
modernpath factory evidence report --kind local_test --log "<command>" \
  --totals passed=<n>,failed=<n> --pass <trace-ids>
modernpath factory drift
```

The CLI and Mission Control are alternative interfaces to the same state, not
separate workflows. Use the surface that supports the action and preserves the
real actor. Human decisions must never be attributed to an agent or to a
hard-coded person.

## Start-of-session convergence

For a connected workspace:

1. inspect `git status` and preserve unrelated work;
2. run `modernpath factory status` to confirm server, workspace, system, and
   release binding;
3. run `modernpath factory pull --apply` when pending server intents exist;
4. inspect open gates, current epic/task, and latest evidence;
5. reconcile any local/server drift before selecting work.

If the workspace is temporarily offline, work from the last synced local
records, label new evidence as local/unpublished, and sync before review or
completion. Offline work does not transfer authority to Markdown.

## Write and sync sequence

Use this order for a material loop transition:

1. make the smallest coherent change to the local requirement/epic/task and
   implementation;
2. run the required tests or validation and capture the exact command/result;
3. update trace links and local status only as far as the evidence proves;
4. run the workspace's deterministic extractor/validator;
5. preview sync and inspect the op set;
6. sync requirements, epics, specs, gates, and events;
7. report evidence pinned to the current commit when a commit is required by
   the workspace;
8. re-read Delivery System state and confirm the transition landed.

Do not mark a repository record complete first and promise to sync later. A
handoff may say “verified locally, sync pending,” but that is not `DONE`.

## Human-input convergence

A decision may originate in Mission Control or in an attributable repository
conversation:

- Mission Control answer: the server wins the answer race. Pull/apply it into
  the versioned records, then acknowledge the intent.
- Repository-recorded answer: record the real human actor and `USER:` source,
  update the held records, then sync. If the gate was already answered on the
  server, keep the server winner and surface the conflict.

An answer records intent. It does not automatically rewrite specifications,
requirements, tasks, or code. The applying agent must materialize the decision
through the affected trace and record the consequence.

## Conflict and writer rules

- Only one writer mutates shared process records for a workspace at a time.
- Server answers are first-wins and are never overwritten by sync.
- Stop when local and server versions contain competing human decisions.
- Do not resolve identity, scope, or acceptance conflicts by timestamp alone.
- Preserve both sources, open a conflict gate, and request a human resolution.
- Never bypass tenant, workspace, system, or release scope to make sync pass.

## Evidence rules

Evidence is a typed result, not a prose claim. Record:

- target trace ids (`SCN`, `SR`, `TASK`, or requirement ids);
- test/validation kind;
- command or report URL;
- pass/fail/skip result and totals;
- branch and commit SHA when available;
- runner identity and timestamp;
- code and test references in the local evidence map.

Evidence decays when traced code changes. Run the workspace drift check before
reusing old evidence for completion. A broad passing suite proves only the
targets it actually exercises.

## Projection rules

Boards, work-lists, progress summaries, dashboards, and local Mission Control
snapshots are projections. They may optimize different views, but they must not
invent state.

After a transition, verify:

- the Delivery System entity and gate/evidence state;
- the versioned requirement and epic/task representation;
- generated rollups and counts;
- release and workspace scope;
- commit/PR delivery state.

Any disagreement keeps the work out of `DONE` until reconciled.
