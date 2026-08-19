# Requirement-driven delivery

Reusable agent instructions for delivering software through human gates,
user/system requirements, red-first TDD, and V-model traceability.

The process connects:

```text
human intent
  -> epic
  -> user requirement + acceptance scenario
  -> system requirement + thin task
  -> technical reconnaissance + cold review
  -> failing tests
  -> implementation
  -> requirement-scoped cleanup
  -> passing lower and upper evidence
  -> human approval
  -> delivered, synchronized state
```

Product repositories hold the versioned working records, specifications, code,
and tests. In a connected workspace, automatic sync turns those records into a
live Mission Control view; Mission Control also records attributable human gate
answers, evidence runs, sessions, and events.

## Read first

1. [`AGENTS.md`](AGENTS.md) — binding agent rules.
2. [`process/V-model-loop.md`](process/V-model-loop.md) — lifecycle, V-model,
   TDD, gates, status, and Definition of Done.
3. [`process/state-tracking.md`](process/state-tracking.md) — repository
   records, status axes, checks, automatic sync, Mission Control, evidence, and
   conflicts.
4. [`process/prompts.md`](process/prompts.md) — reusable execution prompts.

## Core invariants

- One trace: `EPIC -> UR -> SR -> TASK -> TEST -> CODE`; acceptance scenarios
  are content within the UR.
- Inferred requirements stay `DERIVED`; their links remain candidate context
  and all downstream work waits for attributable human confirmation.
- Both arms are red-first: BDD/E2E above, focused verification below.
- Sourced technical reconnaissance enriches task context before implementation,
  and a cold technical review resolves material findings before approval.
- Boy-scout cleanup is behavior-preserving, limited to the current requirement,
  and followed by final evidence runs.
- Humans own product decisions and specification/completion gates.
- Repository ledgers, epics, and the work-list are the working process record;
  Mission Control is their synchronized operational projection.
- No completion claim without current code, test/runtime evidence, delivery,
  approval, and state reconciliation.
- Discoveries, conflicts, and deferrals are explicit and sourced.

## Distribution and adoption

The `ModernPath/req-driven-dev` repository is the authoring source. A released
`modernpath` CLI embeds a byte-identical snapshot of its Markdown instruction
and template files, and `modernpath install` writes that snapshot under the
tool-neutral `.modernpath/rdd/` path in the consuming repository. Consuming
repositories do not vendor the source repository.

The consuming repository should:

1. run `modernpath install` and commit the installed process snapshot and agent
   entry-point adapters;
2. retain only project-specific architecture/repository rules outside the
   installer's managed blocks in root `AGENTS.md`;
3. configure its requirement, epic/spec/task, backlog, and generated-projection
   paths;
4. optionally bind the workspace to its ModernPath workspace/system/release;
5. provide deterministic checks and, when connected, extraction/sync;
6. use the required work-record templates from
   `.modernpath/rdd/templates/work/`;
7. keep any `CLAUDE.md` as a compatibility pointer, not a second manual.

Do not keep live product epics or work state in this process package.

## Repository contents

| Path | Purpose |
|---|---|
| `AGENTS.md` | shared agent policy and canonical entry point |
| `CLAUDE.md` | root compatibility entry required for Claude discovery |
| `process/` | lifecycle, state contract, and execution prompts |
| `skills/` | reusable, tool-neutral procedures for specialized process passes |
| `templates/work/` | backlog, requirement, epic, technical-reconnaissance, task, work-list, and progress templates |

## Process maintenance

Changes to lifecycle, status meanings, gate requirements, evidence rules, or
state ownership belong in the canonical `ModernPath/req-driven-dev` source
repository. Validate internal links and search for competing authority
statements before release. Then refresh the CLI asset snapshot from the
accepted source revision, verify byte alignment, and ship a new CLI build.
Consuming repositories receive the version through `modernpath install` and
remove any duplicated process text.

License: MIT.
