# Requirement-driven V-model delivery loop

This is the canonical lifecycle for turning human intent into verified,
delivered software. It combines three loops:

- **human loop** — supplies intent, resolves ambiguity, and approves gates;
- **development loop** — selects the next incomplete trace and iterates;
- **V-model evidence loops** — upper-loop acceptance of user behavior and
  lower-loop verification of system behavior.

The ModernPath Delivery System holds their state. Mission Control and the
`modernpath` CLI expose it; repository artifacts provide the versioned local
representation. See [`delivery-system.md`](delivery-system.md).

## The model

```text
                         HUMAN LOOP
        product intent -> spec/decision gate -> approval/rejection
              ^                                      |
              |                                      v
              +-------- completion evidence <- completion gate

                       DEVELOPMENT LOOP
        ORIENT -> SPECIFY -> RED -> GREEN -> VERIFY -> VALIDATE
           ^                                                  |
           +---- CAPTURE <- REVIEW <- DELIVER <- RECONCILE ---+

                           V-MODEL

  UPPER LOOP                     BUILD                    UPPER LOOP
  user intent                                               evidence
       |                                                       ^
       v                                                       |
  USER REQUIREMENT (UR) ---------------------- BDD/E2E validation
       |                                                       ^
       v                                                       |
  EPIC -> STORY/JOURNEY -> SCENARIO (SCN) ---------------------+
       |
       | decomposes
       v
  SYSTEM REQUIREMENT (SR) ---------------- focused verification
       |                                                       ^
       v                                                       |
  TASK / VERTICAL SLICE -> implementation -> unit/component/API/
                                            contract/integration test

  Canonical trace: UR -> EPIC -> SCN -> SR -> TASK -> TEST -> CODE

                  MODERNPATH DELIVERY SYSTEM
  requirements | epics | specs | tasks | gates | evidence | traces
  statuses | releases | actors | audit events | sessions/jobs
```

The left side states what must be true. The right side proves it. Code in the
middle is necessary but never sufficient evidence by itself.

## Lifecycle

### 1. Discover

Input: user interviews, regulations, product goals, incidents, existing
behavior, and technical constraints.

Output: sourced product/domain documentation, vocabulary, rules, architecture,
contracts, and open questions. Do not turn ambiguity into a requirement by
guessing.

### 2. Plan

Derive user requirements and system requirements from the product sources.
Write observable acceptance criteria, establish ownership and release scope,
and route work into an epic or the fast lane.

### 3. Build and verify

Run both V-model arms red-first. Lower-loop tasks make system behavior correct;
upper-loop scenarios prove the intended user workflow. Record evidence and
human approval, deliver in the implementation's source repository, and
reconcile every state projection.

Planning and building are iterative. Discoveries feed the planning loop without
silently expanding the current implementation slice.

## Trace hierarchy

### User requirement (`UR-*`)

A user requirement states an outcome for a named actor in a real context. It
contains no implementation choice unless the choice is itself a user or
regulatory constraint.

Minimum fields:

```markdown
## UR-<AREA>-NNN — <outcome>
- Actor: <role>
- Statement: <actor can achieve/experience outcome>
- Intended use: <context and value>
- Source: USER:/DOC:
- Validation: <linked SCN ids>
- Status: PROPOSED | READY | IN_PROGRESS | IN_REVIEW | VALIDATED | BLOCKED | DEFERRED | OBSOLETE
```

### Epic (`EPIC-*`)

An epic groups one coherent user-visible capability. A technical-enabler epic
must identify the user-visible epic or requirement it enables.

An epic owns:

- sourced user outcome and linked URs;
- actors, primary domain/bounded context, supporting contexts;
- key models, events, interfaces, and constraints;
- decisions and open questions;
- BDD scenarios, SRs, and thin tasks;
- specifications and both human gates;
- evidence map, gaps, discoveries, and completion record.

Use a folder for new epics:

```text
epics/EPIC-<AREA>-NNN-<slug>/
  EPIC.md
  specs/
    requirements.md        # required
    architecture.md        # as needed
    api.md                  # as needed
    data.md                 # as needed
    testing.md              # as needed
  tasks/
    TASK-<AREA>-NNN-<slug>.md
```

### Acceptance scenario (`SCN-*`)

A scenario is observable upper-loop behavior, normally Given/When/Then. It is
not a task.

```gherkin
Scenario: <observable outcome>
  Given <sourced initial state>
  When <actor action or event>
  Then <observable result>
```

Each scenario links upward to a UR/epic and downward to the SRs/tasks needed to
make it pass.

### System requirement (`SR-*`)

A system requirement states testable system behavior, contract behavior, data
behavior, or a quality constraint needed by a scenario.

```markdown
## SR-<AREA>-NNN — <behavior>
- Statement: The system shall <testable behavior>.
- Source: <SCN/UR/DOC/CODE source>
- Boundary: domain | API | UI | data | integration | operations
- Verification method: unit | component | API | contract | integration
- Linked tasks: TASK-...
- Status: PROPOSED | READY | IN_PROGRESS | LOWER_VERIFIED | BLOCKED | DEFERRED | OBSOLETE
```

### Task or slice (`TASK-*`)

A task is the smallest useful vertical increment that implements and verifies
part of an SR. It records the expected failing test, passing test, code path,
and trace links.

A repository may retain an established `REQ-*` ledger id as the task/slice id.
In that case record whether the row represents a user or system requirement and
link it explicitly to the epic, SCN, and SR. Do not create a parallel id merely
to satisfy the diagram.

## Sources and decisions

Use stable source tags:

| Tag | Meaning |
|---|---|
| `USER:<date>:<summary>` | attributable human fact, decision, or approval |
| `DOC:<path>#<section>` | product/domain/architecture source |
| `CODE:<path>:<symbol>` | observed existing behavior |
| `TEST:<path>:<name>` | test definition or result target |
| `RUN:<command-or-report>` | observed command/runtime evidence |
| `EPIC:<path>#<section>` | trace to an existing epic record |

Rules:

- normative claims need a source;
- missing sources become open questions;
- conflicting sources remain conflicts until a human resolves them;
- record a decision's consequence on affected UR/SCN/SR/TASK items;
- an answer is not an implementation or a passing gate by itself.

## Epic entry and specification gate

An epic is required when any of these are true:

1. design or specification content is needed beyond one requirement's
   acceptance criteria;
2. a contract surface changes (API, schema, event, protocol, public component);
3. the work spans bounded contexts or repositories;
4. it needs more than one independently verified task or is expected to exceed
   one working day;
5. it changes product-visible behavior.

If one becomes true during a fast-lane change, stop and promote the work into
an epic.

Before implementation, an epic must have:

1. an epic record and `specs/requirements.md`;
2. sourced user outcome, UR, actors, and release/scope;
3. sourced primary/supporting contexts, models, events, and contracts, or
   blocking open questions;
4. user story/journey and Given/When/Then scenarios covering the first slice;
5. testable SRs and thin tasks linked to those scenarios;
6. upper-RED and lower-RED test strategy;
7. recorded gaps and deferrals with owner/reason;
8. visibility in the Delivery System and local projection;
9. a plain-language decision brief;
10. explicit human specification approval.

Specification state:

```text
SPEC-DRAFT -> SPEC-READY -> SPEC-APPROVED
                  |              |
                  |              +-- attributable human approval
                  +-- open specification gate
```

No epic-path RED test is written before `SPEC-APPROVED`. Writing the test is
implementation-loop work, not specification work.

## Fast lane

The fast lane is for a single spec-light requirement/task. All must hold:

- behavior is already unambiguous in a sourced requirement;
- no contract or product-visible behavior changes;
- one bounded context and source repository;
- one task, expected within one working day;
- no new product/architecture/acceptance decision;
- the row has Given/When/Then criteria, expected RED test, owner, and release;
- it is visible in the Delivery System before implementation;
- the project defines the human review path for fast-lane completion.

The fast lane removes epic ceremony, not TDD, traceability, evidence, review,
or sync.

## Development loop

### 0. Orient

- inspect repository state and preserve unrelated work;
- converge local/server state per `delivery-system.md`;
- confirm active release and current item;
- inspect blockers, open gates, evidence drift, and next `READY` trace;
- read the relevant product, code, test, epic/spec, and task sources.

### 1. Specify

- sharpen acceptance criteria without changing sourced intent;
- create or update UR -> EPIC -> SCN -> SR -> TASK links;
- route ambiguity to an open question/gate;
- pass the epic specification gate or prove every fast-lane criterion.

### 2. Upper RED

- create or identify the BDD/E2E/user-flow test for the SCN;
- run it against the incomplete behavior;
- record the expected failure and why it proves the missing outcome;
- reject false-red evidence caused by a broken harness or unrelated failure.

### 3. Lower RED

- select one thin task/SR;
- write the smallest focused unit/component/API/contract/integration test;
- run it and record the expected failure;
- link test id/name to the task/SR.

### 4. Green

- implement only the behavior needed by the failing test;
- keep domain logic at the owning boundary;
- derive from canonical contracts;
- capture discoveries rather than silently expanding scope.

### 5. Lower verify

- run the focused test, then proportional regression/architecture/contract
  gates;
- link test result, code, command, branch/SHA, and task/SR;
- move TASK/SR to `LOWER_VERIFIED` only when all linked lower work passes.

### 6. Upper validate

- run the BDD/E2E/user-flow acceptance path;
- link failing-then-passing evidence and code to the SCN;
- for UI work, run against the live stack, assert assets loaded, and inspect an
  actual screenshot for layout/styling defects;
- never mutate real production-like data merely to verify a control's rendering.

### 7. Review

- audit every criterion against direct evidence;
- present the brief, visible behavior, risks, gaps, deferrals, and test results;
- set requirement/epic `IN_REVIEW` only after lower verification and upper
  validation are complete;
- record the human completion decision with actual actor and scope.

### 8. Deliver and reconcile

- merge code in its source-of-truth repository;
- integrate any workspace snapshot according to project rules;
- update requirement, epic, task, evidence, and local rollups atomically;
- sync and report evidence to the Delivery System;
- confirm server state, local state, release, PR/commit, and generated views
  agree before `DONE`/`VALIDATED`.

### 9. Capture and continue

Record the six completion facts: **Done, Decisions, Deferred, Discovered,
Follow-ups, Gate result**. Route every new item, then return to Orient.

## Upper loop

Question: **Does the delivered workflow satisfy the user requirement?**

Required evidence:

- sourced SCN and expected observation;
- failing BDD/E2E/user-flow result before the implementation satisfied it;
- passing result after lower-loop slices;
- runtime/browser/manual evidence proportional to the behavior;
- linked code revision;
- human acceptance at epic/UR completion.

```text
UR -> EPIC -> SCN -> failing acceptance test
                         |
                         v
                   lower-loop slices
                         |
                         v
                   passing acceptance test -> UPPER_VALIDATED
```

## Lower loop

Question: **Does each system part satisfy its specified behavior and
interface?**

Choose evidence by boundary:

- domain rules: unit/property tests;
- UI units: component tests plus upper real-browser validation;
- APIs: endpoint and contract tests;
- persistence/integration: integration tests;
- cross-service contracts: consumer/provider or schema-conformance tests;
- operational behavior: harness/smoke tests.

```text
SR -> TASK -> failing focused test -> smallest implementation
                                      |
                                      v
                         focused + regression tests -> LOWER_VERIFIED
```

## Status model

Top-level work status:

| Status | Meaning |
|---|---|
| `PROPOSED` | identified, not ready |
| `READY` | sourced acceptance and entry gate complete |
| `IN_PROGRESS` | either evidence loop is underway |
| `IN_REVIEW` | lower verified + upper validated; completion approval/delivery pending |
| `DONE` | evidence, human approval, source delivery, and reconciliation complete |
| `BLOCKED` | cannot proceed; blocker/gate linked |
| `DEFERRED` | explicitly postponed; reason, owner, and target recorded |
| `OBSOLETE` | superseded; replacement source linked |

Evidence waypoints:

- `LOWER_VERIFIED` belongs to TASK/SR evidence;
- `UPPER_VALIDATED` belongs to SCN/epic upper evidence;
- `VALIDATED` belongs to a user requirement after its linked epics are done
  and the human acceptance is recorded.

A lower or upper waypoint does not independently make top-level work `DONE`.

## Requirement ledgers and local projections

A project may keep requirement ledgers, epic folders, a work-list, backlog,
and generated progress views for versioned collaboration. Project instructions
define their exact paths and parser-safe formats.

Minimum ledger content:

- stable id and kind (user/system/task adapter);
- statement, source, owner, release/scope, and status;
- Given/When/Then acceptance criteria;
- linked epic/SCN/SR/TASK;
- test/evidence and code/PR references;
- deferral/blocker/supersession metadata.

If a status is duplicated in a dashboard, detail block, totals line, or
generated projection, update all copies in one logical change and validate the
counts. The Delivery System remains authoritative for loop state.

## Planning and discoveries

Capture first, triage separately:

| Discovery | Route |
|---|---|
| clear requirement with owner | `PROPOSED` user/system requirement |
| missing human decision or ambiguity | open question/decision gate; `BLOCKED` if needed |
| known future work | `DEFERRED` with reason, owner, and target |
| capability/spec gap | gap record linked to affected traces |
| unclear owner/cross-cutting | triage backlog |
| contradicted or removed behavior | conflict or `OBSOLETE` with replacement |

At session start, after a slice, and after product-doc changes:

1. sweep the backlog;
2. reconcile product sources, requirements, and active epics;
3. reprioritize/promote only with sourced criteria;
4. update release/scope and record the planning event;
5. sync the resulting state.

## Definition of Done

A task/SR is `LOWER_VERIFIED` only when:

- source and trace links exist;
- the expected lower test failed first for the expected reason;
- the implementation is linked;
- focused and required regression gates pass;
- evidence is current for the code revision.

A scenario is `UPPER_VALIDATED` only when:

- its sourced observable behavior and trace links exist;
- the upper test failed before implementation satisfied it;
- the user-flow evidence now passes;
- runtime/browser evidence required by the behavior is inspected and linked;
- evidence is current for the code revision.

An epic is `DONE` only when:

1. specification approval preceded implementation;
2. every SCN is `UPPER_VALIDATED`;
3. every linked SR/TASK is `LOWER_VERIFIED`;
4. relevant architecture, lint, contract, integration, build, and smoke gates
   pass;
5. known gaps are recorded and no undisclosed scope remains;
6. human completion approval is recorded with actor, scope, and source;
7. code is merged in the authoritative implementation repository;
8. local records, generated views, release membership, and Delivery System
   state agree;
9. evidence is pinned to the delivered revision and has not decayed.

A user requirement is `VALIDATED` only when its scenarios and linked epics meet
the same evidence bar and the human accepts the user outcome.

## Session ritual

Start:

1. read project and shared instructions;
2. converge Delivery System and local state;
3. inspect active scope, gates, evidence drift, and next `READY` trace;
4. read the relevant sources before editing.

End:

1. run proportional tests and inspect required runtime/browser evidence;
2. update the complete trace and six completion facts;
3. capture discoveries/deferrals/conflicts;
4. validate local projections and sync/report evidence;
5. state exactly what is complete, awaiting review, blocked, or unsynced.
