# «CTX» — «Context Name» local instructions

This file specializes the shared process; it does not redefine it.

- **Shared process:** `req-driven-dev/AGENTS.md`
- **Domain source:** `docs/«NN»-«domain-name».md`
- **Contracts:** «schema/API/event paths»
- **Requirements:** «ledger or Delivery System query»
- **Epics/tasks:** `epics/`
- **Primary code:** «paths/repositories»

## Boundary

- Owns: «models, tables, events, APIs»
- May depend on: «allowed contexts/libraries»
- Must not read/write: «forbidden boundaries»

## Load-bearing invariants

1. `INV-«CTX»-001` — «rule» (`DOC:<path>#<section>`)
2. `INV-«CTX»-002` — «rule» (`DOC:<path>#<section>`)

## Commands

```sh
«focused test command»
«contract/integration command»
«lint/architecture command»
```

## Local verification

- «runtime/browser/smoke requirement»
- «generated projection or sync validation command»

Start from the next `READY` Delivery System trace and follow
`req-driven-dev/V-model-loop.md`.
