# Work-selection flat-file state

> Canonical work-selection serialization for the authoritative process store.
> `PROCESS.md` defines scope selection, phase order, and lifecycle meanings. A
> store-backed repository materializes this file from the store; a file-backed
> repository versions it as the store. Never both.

- **Snapshot at:** «timestamp»
- **Source store/revision:** «database revision or repository SHA»
- **Active release:** «release with its USER: source»

## Release registry

Record every release and its selection decision; the active-release field above
references the sole active row after reconciliation. Apply current answered
release decisions before checking that exactly one row is active.

| Release id | State | USER source | Selection gate | Applied at revision |
|---|---|---|---|---|
| «id» | INACTIVE / ACTIVE | «attributable release decision» | «gate id» | «application revision or pending» |

Work selection is authoritative state, not a derived queue. It records which
scope is frozen, at which fingerprint, and which phase it is waiting on.
Rendered queues, progress counts, and dashboards are regenerated from the
authoritative store and are not recorded here.

## Current selection

- **Selected scope:** «EPIC id, or the single SR id»
- **Members:** «UR/SR ids in the frozen scope; empty for single-SR scope»
- **Scope kind:** Epic or single SR
- **Frozen at fingerprint:** «selected content/scope fingerprint; EC applicability is unresolved here»
- **Reconnaissance revision:** «named revision the packet was authored against»
- **Applicable EC set / fingerprint:** «unresolved before reconnaissance; then exact active EC ids and set fingerprint»
- **Planning inputs / fingerprint:** «manifest and hash per PROCESS.md; excludes attached review outputs»
- **Review attachments:** «engineering/cold-review result ids, findings/dispositions, independent reviewer context and reviewed fingerprint»
- **Entry fingerprint / approvals:** «planning + prerequisite review references; per-item current applied approvals, not a shared lifecycle status»
- **Next action:** «affected item subset, next legal action, required inputs, and exact resume condition»
- **Current phase:** «source / plan / cold review / entry / build / verify / completion / triage»
- **Waiting on:** «gate id, blocker, external prerequisite, or nothing»
- **Owner:** «who holds the selection»

## Suspended selections

One row per held item, including differently progressed members of a held
scope. Preserve each suspended-from state and its gate/evidence basis. Append
release facts after reassessment; do not overwrite the prior-state record.

| Scope / item | Hold state | Suspended from / basis | Held at | Reason / owner / target | Blocker/gate | Released at / restored to / basis |
|---|---|---|---|---|---|---|
| «scope id / EPIC, UR or SR id» | BLOCKED or DEFERRED | «prior lifecycle status + gate/evidence refs» | «timestamp/revision» | «reason, owner, target» | «gate id or ref» | «pending, or timestamp/revision + strongest supported state + current gate/evidence refs» |

## Adoption campaigns

Adoption progress is not release commitment or delivery readiness. Retain the
campaign after a context is handed to the normal loop, so another context can
resume without re-deriving confirmed records.

- **Campaign id / authority:** «stable id and USER request authorizing the bounded surface»
- **Original baseline / latest inspected revision:** «repository revisions»
- **Context inventory / scope:** «explicit context set and inventory references»

| Context | Progress | Observation keys / candidate ids | Confirmation gates | Remaining work / next action |
|---|---|---|---|---|
| «context id» | NOT_STARTED / PARTIAL / AWAITING_CONFIRMATION / HANDED_OFF | «stable source/behavior keys and exact candidate ids» | «gate ids» | «uncovered observations, drift to recheck, or next delivery pass» |

## Selection history

Append-only. A selection leaves the current slot when its scope reaches `DONE`
or `OBSOLETE`, or when triage returns it to an earlier phase.

| Scope | Selected at | Left at | Outcome | Successor selection |
|---|---|---|---|---|
| «EPIC/SR id» | «timestamp» | «timestamp» | DONE / OBSOLETE / returned to «phase» | «scope id or none» |
