# «CTX» — «Context Name» — Build Guide

## Quick Reference

- **Design doc:** `docs/«NN»-«domain-name».md` (authoritative for this context)
- **Aggregates / events / rules:** `docs/01-bounded-contexts.md` §«N»; rule ids `INV/BR-«CTX»-*`
- **Contracts:** schemas in `./contracts/`; DB in `docs/data/40-data-model.md` §«N»; events in `docs/data/41-event-catalog.md` §«N»
- **Requirements:** `./REQUIREMENTS.md`
- **Log:** `./LOG.md`

## Boundaries

- **May import:** `@project/shared`, `@project/plt` (platform/common)
- **May NOT import:** Any other context's code
- **May NOT read:** Any other context's database tables

## Load-Bearing Invariants

These are the invariants you must NEVER break. Every change must preserve them:

1. **INV-«CTX»-001** — «Description of the first critical invariant»
2. **INV-«CTX»-002** — «Description of the second critical invariant»
3. *«Add more as needed»*

## Commands to Run

```bash
# Run tests for this context
npm test «ctx»

# Check traceability (all DONE requirements have tests)
npm run trace «ctx»

# Run architecture fitness checks
npm run lint «ctx»
```

## How to Work Here

1. **Start:** Open `REQUIREMENTS.md`, read the dashboard, pick the next `READY` requirement
2. **Loop:** Follow the build loop in root `CLAUDE.md` §6
3. **Done:** Update the ledger, write the LOG entry, update `PROGRESS.md`

## Definition of Done

See root `CLAUDE.md` §9. In brief:
- [ ] Every acceptance criterion has a passing, `REQ`-tagged test
- [ ] All `INV-*` enforced in code with annotation comments
- [ ] Tests green
- [ ] Ledger updated (dashboard row + detail block + Totals)
- [ ] LOG.md entry written
- [ ] Any deferral recorded as DEFERRED requirement
