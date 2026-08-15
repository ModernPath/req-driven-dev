# Technical reconnaissance — «EPIC/TASK»

- **Trace:** «EPIC/SCN/SR/TASK ids»
- **Repository/revision:** «repository + branch/SHA»
- **Prepared by:** «agent/person/session»
- **Context pack:** «optional generated locator/report; never normative evidence»
- **Freshness:** CURRENT | STALE — «reason/revision»

## Requirement boundary

- **Intended behavior:** «sourced outcome and acceptance scope»
- **Explicit non-goals:** «behavior and surfaces outside this change»
- **Human decisions still needed:** «gate ids or none»

## Affected surface

| Kind | File/symbol or boundary | Why it is affected | Source |
|---|---|---|---|
| entry point/caller/writer/reader | «path:symbol» | «relationship to trace» | CODE:/DOC:/TEST: |

## Control and data flow impacts

Trace only the path relevant to this requirement. Show how control and data
move today and identify every hop the proposed work adds, removes, or changes.

- **Current flow:** «trigger → calls/queues → transformations → stores/integrations → side effects → observable output»
- **Intended flow:** «trigger → calls/queues → transformations → stores/integrations → side effects → observable output»

| Hop | Trigger/from | Handler/to | Data or state transition | Side effects/failure propagation | Impact | Source |
|---|---|---|---|---|---|---|
| «N» | «source» | «destination» | «input → output/state» | «effect/error path» | unchanged/added/removed/changed | CODE:/DOC:/TEST: |

## Contracts, data, and compatibility

| Boundary | Current contract/flow | Constraint or compatibility concern | Source |
|---|---|---|---|
| «API/schema/event/UI/data/operations» | «current behavior» | «must preserve/change per source» | CODE:/DOC:/TEST: |

## Existing patterns and reuse

| Concern | Existing implementation/test pattern | Intended reuse | Source |
|---|---|---|---|
| «concern» | «path:symbol/test» | «how it informs the task» | CODE:/TEST: |

## Test infrastructure and gates

- **Upper path:** «SCN test/runtime path and expected RED»
- **Focused lower path:** «test location/type and expected RED»
- **Project gates:** «proportional test/lint/type/contract/architecture commands»
- **Runtime/browser needs:** «environment and observation, or not applicable»

## Failure modes and risks

Record only applicable dimensions; mark the rest not applicable rather than
inventing work.

| Dimension | Expected behavior/risk | Planned evidence | Source |
|---|---|---|---|
| partial failure/retry/idempotency/concurrency/security/operations | «behavior or N/A» | «test/observation» | DOC:/CODE:/TEST: |

## Task context enrichment

| TASK | Expected files/symbols | Callers/boundaries | Flow segment/impact | Reuse target | Dependencies/order | Risks/tests/gates | Change boundary |
|---|---|---|---|---|---|---|---|
| TASK-«AREA»-«NNN» | «surface» | «paths» | «owned hops/change» | «pattern» | «sequence» | «relevant proof» | «in/out» |

## Unknowns and discoveries

| Item | Source/trigger | Consequence | Route/status |
|---|---|---|---|
| «unknown/discovery» | DOC:/CODE:/TEST: | «affected trace» | «gate/backlog/task/blocker» |

## Freshness check

- **Rechecked revision:** «repository + branch/SHA»
- **Affected surface still complete:** yes/no — «evidence»
- **Task context refreshed:** yes/no — «task refs»
- **Cold review required/refreshed:** yes/no — «review ref»
