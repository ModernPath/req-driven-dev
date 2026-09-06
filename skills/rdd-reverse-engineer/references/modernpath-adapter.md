# ModernPath adoption adapter

Read only for a project whose instructions identify ModernPath ledger ingestion
as its supported process-store adapter. These are adapter conventions, not
process authority. Check the installed CLI/adapter contract before using a
command or import shape; version differences must be surfaced rather than
silently changing canonical semantics.

## Required operations

The adapter must read/validate binding and registry state, upsert stable record
ids without overwriting newer versions, preserve explicit UR/SR kinds and
candidate relation status, apply attributable gate answers idempotently, run
process checks, and refresh revision-stamped snapshots. If an operation cannot
preserve these facts, report the adapter gap and stop that write.

## Ledger imports and projections

Where the installed ingestion contract reads `tasks/<CTX>-REQUIREMENTS.md`, use
that import shape for candidates and the approved sync operation to reach the
store. `file-state/` working-set snapshots are projections, not a second input.
Do not independently author both representations as authorities.

Prefer `UR-`/`SR-` prefixes and retain the canonical kind explicitly. A legacy
`REQ-` id is valid only when its canonical kind survives the adapter round trip;
if the installed reader defaults it to SR, do not use it to encode a UR. Use an
adapter-supported id/shape or report the mismatch.

Some ledger readers accept these candidate-packet relation forms:

```text
Proposed relations (CANDIDATE): requires SR-KERNEL-030, SR-KERNEL-031.
Proposed relations (CANDIDATE): serves UR-KERNEL-002.
```

The first proposes that a UR requires the named SRs; the second proposes that an
SR serves the named UR. Verify candidate status after import. A dedicated
authoritative relation field must not be populated merely to make an inferred
link parse. Conflicting fields are a reconciliation failure, not permission to
overwrite a confirmed relation. Undefined ids are reported, never dropped.

Use an `epics/` or NFR ledger import only when that project adapter supports it.
Quality-attribute behavior follows the same canonical UR/SR hold as other
behavior; observed engineering rules belong in PROPOSED EC records. A legacy
`REQ-NFR-NNN` convention must not change either rule.

## Commands and measurement

Typical installed commands are `modernpath factory sync`, `modernpath check`,
and `modernpath coverage --json`. Confirm local help/project instructions and
authorization before executing them; this reference does not grant publication
or synchronization authority.

Run configured deterministic checks before committing records and verify the
store's resulting revisions after authorized synchronization. Capture standing
coverage before/after, with per-app breakdowns and the tool's actual population.
If it excludes DERIVED rows, use a separate observation inventory for adoption
progress; do not promote candidates or fabricate rows to increase coverage.
