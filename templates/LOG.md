# «CTX» — «Context Name» — Build Log

Append-only, reverse-chronological. Most recent entries at the top.

---

## «YYYY-MM-DD» — Context initialized

**Done:** Requirements ledger created from `docs/«NN»-«domain».md` using Prompt 1.
**Decisions:** —
**Deferred:** —
**Discovered:** —
**Follow-ups:** Begin building from the READY queue.
**Gate:** N/A (planning only).

---

## Log Entry Template

```markdown
## YYYY-MM-DD — REQ-«CTX»-NNN «title» (STATUS → NEW_STATUS)

**Done:** What was implemented; which invariants/rules were enforced; tests written.

**Decisions:** Any design choices made that weren't in the spec; clarifications adopted.

**Deferred:** What was explicitly NOT built; link to the DEFERRED requirement row.

**Discovered:** New requirements surfaced; link to the PROPOSED row or /BACKLOG.md line.

**Follow-ups:** Any next steps that don't warrant a full requirement.

**Gate:** Test results; coverage; any fitness check results.
```
