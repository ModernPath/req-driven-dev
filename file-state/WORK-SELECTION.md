# Work-selection flat-file state

> Canonical work-selection serialization for the authoritative process store.
> `PROCESS.md` defines scope selection, phase order, and lifecycle meanings. A
> store-backed repository materializes this file from the store; a file-backed
> repository versions it as the store. Never both.

- **Snapshot at:** «timestamp»
- **Source store/revision:** «database revision or repository SHA»
- **Active release:** «release with its USER: source for normal delivery; N/A for candidate confirmation or source-scoped baseline work»

Work selection is authoritative state, not a derived queue. It records which
scope is frozen, at which fingerprint, and which phase it is waiting on.
Rendered queues, progress counts, and dashboards are regenerated from the
authoritative store and are not recorded here.

## Current selection

- **Selected scope:** «EPIC id, single SR id, exact named UR/SR set, or source inventory»
- **Members:** «UR/SR ids in an Epic or named set; empty for single-SR scope or before publication»
- **Scope kind:** Epic / single SR / named UR/SR set / source inventory, per PROCESS.md
- **Source inventory:** «for onboarding: immutable sources, corpus fingerprint, mode, and authorization, marking pending decisions explicitly; otherwise N/A»
- **Frozen at fingerprint:** «approval-scope fingerprint, or source-inventory fingerprint before requirements exist»
- **Reconnaissance revision:** «named revision the packet was authored against»
- **Current phase:** «source / plan / cold review / entry / build / verify / completion / triage / reverse-engineer / reverse-engineer-verify / reverse-engineer-accept»
- **Waiting on:** «gate id, blocker, external prerequisite, or nothing»
- **Owner:** «who holds the selection»

## Suspended selections

One row per scope held at `BLOCKED` or `DEFERRED`, so the suspended state is
recoverable rather than inferred.

| Scope | Suspended status | Restored-to status | Reason | Owner | Target | Blocker/gate |
|---|---|---|---|---|---|---|
| «exact selected scope» | BLOCKED or DEFERRED | «strongest state supported when released» | «reason» | «owner» | «target» | «gate id or ref» |

## Selection history

Append-only. A delivery selection leaves the current slot when its scope reaches
`DONE` or `OBSOLETE`, or when triage returns it to an earlier phase. A source or
candidate selection records its publication/decision receipt and successor scope;
ending that pass does not mark the resulting requirements DONE.

| Scope | Selected at | Left at | Outcome | Successor selection |
|---|---|---|---|---|
| «exact selected scope» | «timestamp» | «timestamp» | DONE / OBSOLETE / returned to «phase» / publication or candidate-decision receipt | «scope or none» |
