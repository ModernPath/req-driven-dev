# Requirement-driven delivery

Reusable agent instructions for delivering software through human gates,
user/system requirements, red-first TDD, and V-model traceability.

The process connects:

```text
human intent
  -> user requirement
  -> epic + acceptance scenario
  -> system requirement + thin task
  -> failing tests
  -> implementation
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
2. [`V-model-loop.md`](V-model-loop.md) — lifecycle, V-model, TDD, gates,
   status, and Definition of Done.
3. [`state-tracking.md`](state-tracking.md) — repository records, status axes,
   checks, automatic sync, Mission Control, evidence, and conflicts.
4. [`interview-flows.md`](interview-flows.md) — human decision and approval
   flows.
5. [`prompts.md`](prompts.md) — reusable execution prompts.

## Core invariants

- One trace: `UR -> EPIC -> SCN -> SR -> TASK -> TEST -> CODE`.
- Both arms are red-first: BDD/E2E above, focused verification below.
- Humans own product decisions and specification/completion gates.
- Repository ledgers, epics, and the work-list are the working process record;
  Mission Control is their synchronized operational projection.
- No completion claim without current code, test/runtime evidence, delivery,
  approval, and state reconciliation.
- Discoveries, conflicts, and deferrals are explicit and sourced.

## Adopting in a project

Import or vendor this repository at a stable path such as `req-driven-dev/`.
The consuming repository should:

1. make its root `AGENTS.md` point to `req-driven-dev/AGENTS.md` for the shared
   process and retain only project-specific architecture/repository rules;
2. configure its requirement, epic/spec/task, backlog, and generated-projection
   paths;
3. optionally bind the workspace to its ModernPath workspace/system/release;
4. provide deterministic checks and, when connected, extraction/sync;
5. copy only the needed templates from [`templates/`](templates/);
6. keep any `CLAUDE.md` as a compatibility pointer, not a second manual.

Do not keep live product epics or work state in this instruction repository.

## Repository contents

| Path | Purpose |
|---|---|
| `AGENTS.md` | shared agent policy |
| `V-model-loop.md` | canonical process manual |
| `state-tracking.md` | current repository/Mission Control state contract |
| `interview-flows.md` | human-input/gate workflows |
| `prompts.md` | phase and execution prompts |
| `templates/` | copyable project, product-doc, epic/task, and projection artifacts |

## Process maintenance

Changes to lifecycle, status meanings, gate requirements, evidence rules, or
state ownership belong in this repository. Validate internal links and search
for competing authority statements before release. Consuming repositories then
import the accepted version and remove any duplicated process text.

License: MIT.
