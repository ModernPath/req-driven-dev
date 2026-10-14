# Slice file

> Canonical shape of a slice file. `PROCESS.md` §Slices defines the slice.
> A slice file is a tracked project file at `process/slices/<SLICE-id>.md`,
> versioned in the repository and changed the way the project reviews any
> other repository change, in a store-backed and a file-backed repository
> alike. It is coordination, not a store record: it never states a lifecycle
> status, and where it and a record disagree, the record holds.

The work-selection record carries no slice field. Which slice names a scope is
read from the open slice files.

```markdown
# SLICE-«id» — «title in plain product language»

- **Status:** open | closed
- **Opened by:** «person» («USER: source»)
- **Closed by:** — | «person» («USER: source»)

## Members
- «EPIC id»
- «UR or SR id»

## Stages
1. «stage» — «the members or clauses it lands, in build order»

## Decisions
- «USER: source» — «decision in plain words»

## Entry brief
- What: «decision»
- Why now: «trigger and blocked work»
- Changes if approved: «visible outcome»
- Risk if wrong: «downside and reversibility»
- Recommendation: «option and rationale»

## Completion brief
- What: «decision»
- Why now: «trigger and blocked work»
- Changes if approved: «visible outcome»
- Risk if wrong: «downside and reversibility»
- Recommendation: «option and rationale»
```

- The heading's id matches the file name.
- **Status** is `open` or `closed`. The developer opens and closes the slice;
  it has no dates.
- **Members** lists Epic and requirement ids, one per line, at least one,
  none repeated. A requirement whose Epic is also a member is not listed: it
  enters and completes with its Epic. Backlog, gap and gate ids are not
  members. A member is added by a change to this file while the slice is
  open, and gets its own review and entry through its normal gates. A member
  leaves only by becoming `DEFERRED` or `OBSOLETE`; its line stays and the
  loop skips it.
- **Stages** is optional: the order in which the members' connected batches
  are built, across members. Each member's own plan names its stages
  (`PROCESS.md` §Entry packet item 5).
- **Decisions** is optional and records slice-wide decisions with their
  `USER:` sources. A decision about one member is also recorded on that
  member.
- **Entry brief** and **Completion brief** are optional until the slice
  reaches entry or completion. A brief carries the five bullets of the gate
  brief (`PROCESS.md` §Gates). Each member's gate carries the brief, and the
  human answers each gate with its own confirmation.
