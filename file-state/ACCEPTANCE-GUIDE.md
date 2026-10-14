# Acceptance test guide

> Canonical shape of an acceptance test guide. `PROCESS.md` §Evidence and
> completion defines the acceptance test step; `rdd-acceptance` runs it. A
> guide is a tracked project file — `process/slices/<SLICE-id>/acceptance-guide.md`
> beside the slice file, or `process/acceptance/<scope>.md` for an Epic or
> requirement outside a slice — versioned in the repository in a store-backed
> and a file-backed repository alike. It is not a store record and not a
> packet section: it moves no aggregate, review, or approval.

The guide is written for a human tester who has not read the records, in plain
product language. Where the agent must still write, the draft carries a fill
marker, `[[fill: <what to write>]]`; a guide with an open fill marker is not
finished.

```markdown
---
scope: «SLICE id, Epic id, or requirement id»
drafted_at: «timestamp, UTC»
aggregates:
  «covered scope id»: «its packet aggregate at drafting»
draft_body: sha256:«hash of the body as drafted»
---

# Acceptance test guide — «scope title in plain product language»

## 1. What changed
«per user requirement, in product language»

## 2. Where to test
- Environment: «name»
- Revision: «revision deployed there»
- Build: «build or version»
- Test data: «what to use, and what never to touch»
- Sign-in: «which account or role»

## 3. Manual checks
### «UR scenario id» — «scenario in plain words»
- Given: «starting state»
- When: «what the tester does»
- Then: «what the tester observes»
- Steps:
  1. «step»
- Expected result: «what counts as a pass»

## 4. What the automated tests prove
| Criterion | Proving run |
|---|---|
| «criterion or scenario id» | «pass or fail — revision and time», «via «requirement id»: pass or fail — revision», or not covered |

## 5. Criteria
| Criterion | Coverage | Automated result | Acceptance test result and tester |
|---|---|---|---|
| «criterion or scenario id» | automated / via «requirement id» / manual / not covered | «result» | «pass or fail — tester (USER: source), environment, revision» |

## 6. Known gaps, assumptions, and out of scope
- «gap, assumption taken during the work, or exclusion»
```

## Header

- `scope` names the slice, Epic, or requirement the guide covers.
- `drafted_at` is when the guide was drafted. Tester passes recorded before it
  are not current for this guide.
- `aggregates` records the packet aggregate of every covered scope at
  drafting — for a slice, each member's. When a covered scope's aggregate
  moves, the guide is stale; draft it again after the last record edit.
- `draft_body` is the hash of the body as drafted. A guide whose body no
  longer matches it has been edited and is never overwritten by a new draft.

## Sections

1. **What changed** — per user requirement, in product language.
2. **Where to test** — environment, revision, build, test data, sign-in. On a
   deploy path, the environment's latest recorded deployment names the
   revision.
3. **Manual checks** — per user scenario, steps with the expected result.
4. **What the automated tests prove** — per criterion, the run that proves
   it. Only automated evidence fills this section; acceptance test results,
   manual notes, migrations, and deployments never do.
5. **Criteria** — every applicable SR criterion and UR scenario of the covered
   scopes once, excluding `DEFERRED` and `OBSOLETE` requirements, with its
   coverage, automated result, and latest acceptance test result.
6. **Known gaps, assumptions, and out of scope** — including the assumptions
   taken during the work and anything not covered.

Acceptance test results are recorded as evidence of kind `acceptance`, never
in this file; the criteria table shows them as read at drafting or refresh.
