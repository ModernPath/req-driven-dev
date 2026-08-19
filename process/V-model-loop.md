# Requirement-driven V-model delivery loop

This is the canonical lifecycle for turning human intent into verified,
delivered software. It combines three loops:

- **human loop** — supplies intent, resolves ambiguity, and approves gates;
- **development loop** — selects the next incomplete trace and iterates;
- **V-model evidence loops** — upper-loop acceptance of user behavior and
  lower-loop verification of system behavior.

State recording and Mission Control integration are deliberately specified
separately in [`state-tracking.md`](state-tracking.md).

## The model

```text
                         HUMAN LOOP
        product intent -> spec/decision gate -> approval/rejection
              ^                                      |
              |                                      v
              +-------- completion evidence <- completion gate

                       DEVELOPMENT LOOP
        ORIENT -> SPECIFY -> RECON -> COLD REVIEW -> RED -> GREEN
           ^                                                    |
           +-- CAPTURE <- REVIEW <- DELIVER/RECONCILE <- VALIDATE <- VERIFY <- CLEAN --+

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

                         STATE TRACKING
  ledgers | epics | work-list | checks | sync | gates | evidence
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
and route work into an epic or the fast lane. Perform sourced technical
reconnaissance, use it to enrich each task's implementation context, and run a
cold technical review before the human specification gate.

### 3. Build and verify

Run both V-model arms red-first. Lower-loop tasks make system behavior correct;
upper-loop scenarios prove the intended user workflow. After the intended
behavior is green, run a requirement-scoped boy-scout cleanup before recording
final evidence. Record evidence and human approval, deliver in the
implementation's source repository, and reconcile state according to
`state-tracking.md`.

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
- sourced technical reconnaissance and task context;
- cold technical review findings and dispositions;
- BDD scenarios, SRs, and thin tasks;
- specifications and both human gates;
- evidence map, gaps, discoveries, and completion record.

Use a folder for new epics:

```text
epics/EPIC-<AREA>-NNN-<slug>/
  EPIC.md
  specs/
    requirements.md        # required
    technical-reconnaissance.md # required
    architecture.md        # as needed
    api.md                  # as needed
    data.md                 # as needed
    testing.md              # as needed
  tasks/
    TASK-<AREA>-NNN-<slug>.md
```

Seed the reconnaissance from
[`templates/work/TECHNICAL-RECONNAISSANCE.md`](../templates/work/TECHNICAL-RECONNAISSANCE.md).

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
trace links, and the implementation context derived from technical
reconnaissance.

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

## Technical reconnaissance and cold review

Technical reconnaissance establishes how the approved product intent meets the
current repository before implementation begins. It is sourced discovery, not
an authority to select product behavior, architecture, or scope.

For epic-path work, record `specs/technical-reconnaissance.md` at a named source
revision. For fast-lane work, record the same information proportionally in the
task. The reconnaissance must identify:

- affected repositories, files, symbols, entry points, callers, writers, and
  readers;
- the relevant control and data flow from trigger through calls, transformations,
  persistence or integrations, side effects, failure propagation, and observable
  output, including which hops change;
- current boundary contracts, schemas, data flows, and compatibility concerns;
- existing implementation and test patterns that should be reused;
- relevant test infrastructure and proportional project gates;
- applicable failure modes and risks, including partial failure, retries,
  idempotency, concurrency, security, and operational behavior;
- unresolved technical unknowns and any repository evidence needed to answer
  them.

Search, indexes, generated context, and AI summaries may help locate sources,
but the reconnaissance cites and verifies the actual `DOC:`, `CODE:`, and
`TEST:` sources. A generated context pack is navigation support, not normative
evidence.

Use the reconnaissance to enrich every initial task with its expected files and
symbols, relevant callers and boundaries, owned control-flow segment and impact,
reuse target, dependencies, risks, test path, gates, and explicit change
boundary. Recheck that context when the source revision changes or
implementation discovers a material omission.

After reconnaissance and task enrichment, run a cold technical review in a
separate context from specification authoring. The reviewer receives the
versioned product sources, epic/specifications, tasks, reconnaissance, and
repository state, but does not rely on the author's conversation or unstated
reasoning. The review audits:

- trace and scope alignment;
- completeness of the affected technical surface;
- completeness of the end-to-end control/data path and every changed hop;
- contract, data, compatibility, and failure behavior;
- feasibility, dependency ordering, and task boundaries;
- testability, RED strategy, and adequacy of proposed gates;
- unintended behavior or architecture choices not authorized by a source.

Record each finding as `OPEN`, `RESOLVED`, `DEFERRED`, or `REJECTED` with
severity, source, owner, and disposition evidence. Correctness, security,
data-loss, contract, trace, or testability findings are material and block
implementation entry while open or deferred inside the proposed scope. A
material finding can pass only when resolved, rejected with direct evidence, or
removed from the current scope by an attributable human decision and routed.
Other deferrals require a sourced owner, reason, and target. The cold review is
technical evidence; it never grants human specification approval.

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

1. an epic record, `specs/requirements.md`, and current
   `specs/technical-reconnaissance.md`;
2. sourced user outcome, UR, actors, and release/scope;
3. sourced primary/supporting contexts, models, events, and contracts, or
   blocking open questions;
4. user story/journey and Given/When/Then scenarios covering the first slice;
5. testable SRs and thin tasks linked to those scenarios;
6. task technical context enriched from the reconnaissance;
7. upper-RED and lower-RED test strategy;
8. a cold technical review `PASS` with no material finding open or deferred in
   the proposed scope;
9. recorded gaps and deferrals with owner/reason;
10. visibility in the repository working records defined by
   `state-tracking.md`;
11. a plain-language decision brief;
12. explicit human specification approval.

Specification state:

```text
SPEC-DRAFT -> SPEC-READY -> SPEC-APPROVED
                  |              |
                  |              +-- attributable human approval
                  +-- open specification gate
```

`SPEC-READY` requires current technical reconnaissance, enriched initial tasks,
and a cold-review `PASS` with no material finding open or deferred in scope.
`SPEC-APPROVED` adds the attributable human decision; the technical review
cannot make that transition.

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
- the task contains proportionate technical reconnaissance and enriched
  implementation context;
- a proportionate cold technical review has no material finding open or
  deferred in scope;
- it is visible in the repository work-list before implementation;
- the project defines the human review path for fast-lane completion.

The fast lane removes epic ceremony, not TDD, traceability, evidence, review,
or state reconciliation.

## Development loop

### Source control

The loop's record lives in version control, so the loop states where its work
is committed:

- specification and implementation work happens on a feature branch, never on
  the default branch's working tree; the consuming project chooses branch
  naming and integration mechanics;
- commit at the loop's own waypoints — specification/record changes,
  observed upper and lower RED, GREEN with its focused evidence, boy-scout
  cleanup, and state reconciliation. Committing the failing evidence before
  the change that satisfies it is what makes red-first auditable in history
  instead of a claim in a report;
- run the project's deterministic process checks before each commit.

### 0. Orient

- inspect repository state and preserve unrelated work;
- reconcile working records and pending human intents per
  `state-tracking.md`;
- confirm active release and current item;
- inspect blockers, open gates, evidence drift, and next `READY` trace;
- read the relevant product, code, test, epic/spec, and task sources.

### 1. Specify

- sharpen acceptance criteria without changing sourced intent;
- create or update UR -> EPIC -> SCN -> SR -> TASK links;
- route ambiguity to an open question/gate;
- pass the epic specification gate or prove every fast-lane criterion.

### 1a. Technical reconnaissance and task enrichment

- inspect the actual product, code, contract, data, and test surfaces at a
  named revision;
- record the affected surface, current patterns, test infrastructure, risks,
  control/data-flow impact, failure modes, and unknowns with direct sources;
- generate or refresh a context pack when useful, then verify its references
  against the repository;
- enrich each task with the technical context needed to execute its thin slice;
- stop for a human decision when reconnaissance exposes a new product,
  architecture, acceptance, or scope choice.

### 1b. Cold technical review

- review the specification, reconnaissance, and enriched tasks from a separate
  context without relying on the author's conversation;
- record sourced findings and explicit dispositions;
- resolve or evidence-reject every material finding, or obtain an attributable
  human decision that removes its affected work from the current scope;
- obtain human specification approval after the technical review passes; the
  review itself cannot approve the specification.

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
- run the focused test to establish the intended behavior is green;
- capture discoveries rather than silently expanding scope.

### 5. Requirement-scoped boy-scout cleanup

- inspect the task diff after the intended behavior is green;
- clean only code changed by the task or directly adjacent code required to
  express that behavior clearly;
- allow behavior-preserving improvements such as clearer names, simpler local
  structure, removed duplication, and dead code made obsolete by the task;
- do not add behavior, widen acceptance, change public contracts or
  architecture, or perform speculative refactoring;
- do not weaken tests or acceptance evidence to accommodate the cleanup;
- route broader debt as a discovery instead of absorbing it into the task;
- record either the bounded cleanup performed or an explicit no-op;
- return to RED and update the trace if cleanup exposes a correctness change;
  do not disguise that change as cleanup.

### 6. Lower verify

- run the focused test, then proportional regression/architecture/contract
  gates against the final post-cleanup diff;
- inspect the exact assertions clause by clause; every behavioral clause needs
  a named assertion that would fail if that clause regressed;
- link test result, code, command, branch/SHA, and task/SR;
- identify tests by stable path and test name; treat line numbers only as
  optional navigation hints;
- move TASK/SR to `LOWER_VERIFIED` only when all linked lower work passes.

### 7. Upper validate

- run the BDD/E2E/user-flow acceptance path;
- link failing-then-passing evidence and code to the SCN;
- for UI work, run against the live stack, assert assets loaded, and inspect an
  actual screenshot for layout/styling defects;
- never mutate real production-like data merely to verify a control's rendering.

### 8. Review

- audit every criterion against direct evidence;
- present the brief, visible behavior, risks, gaps, deferrals, and test results;
- set requirement/epic `IN_REVIEW` only after lower verification is complete and
  upper validation is complete or the row demonstrably owes none — a derived row
  with no scenario is the only routine case, and it records that rather than
  inferring it (see `state-tracking.md`);
- record the human completion decision with actual actor and scope.

### 9. Deliver and reconcile

- merge code in its source-of-truth repository;
- integrate any workspace snapshot according to project rules;
- update requirement, epic, task, evidence, and rollups atomically;
- reconcile ledger, epic, work-list, release, PR/commit, evidence, and any
  connected Mission Control projection before `DONE`/`VALIDATED`.

### 10. Capture and continue

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
| `IN_REVIEW` | lower verified, and upper validated or no scenario owed; completion approval/delivery pending |
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

## State records

Repository ledgers, epic folders, the work-list, backlog, generated progress
views, Mission Control projection, and their status axes are defined in
`state-tracking.md`. Keep state mechanics out of this lifecycle document.

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
5. reconcile the resulting working records per `state-tracking.md`.

## Definition of Done

A task/SR is `LOWER_VERIFIED` only when:

- source and trace links exist;
- technical reconnaissance is current and the task carries its relevant
  implementation context;
- the cold technical review has no material finding open or deferred in the
  task's scope;
- the expected lower test failed first for the expected reason;
- every behavioral clause maps to a named assertion that would fail on
  regression;
- the implementation is linked;
- boy-scout cleanup remained within the task's requirement and change boundary,
  with a recorded change or no-op;
- focused and required regression gates pass against the final post-cleanup
  diff;
- evidence is current for the code revision.

A scenario is `UPPER_VALIDATED` only when:

- its sourced observable behavior and trace links exist;
- the upper test failed before implementation satisfied it;
- the user-flow evidence now passes;
- runtime/browser evidence required by the behavior is inspected and linked;
- evidence is current for the code revision.

An epic is `DONE` only when:

1. current technical reconnaissance enriched its tasks;
2. cold technical review preceded specification approval and no material
   finding remains open or deferred in scope;
3. specification approval preceded implementation;
4. every SCN is `UPPER_VALIDATED`;
5. every linked SR/TASK is `LOWER_VERIFIED`;
6. relevant architecture, lint, contract, integration, build, and smoke gates
   pass;
7. known gaps are recorded and no undisclosed scope remains;
8. human completion approval is recorded with actor, scope, and source;
9. code is merged in the authoritative implementation repository;
10. state records and projections required by `state-tracking.md` agree;
11. evidence is pinned to the delivered revision and has not decayed.

A user requirement is `VALIDATED` only when its scenarios and linked epics meet
the same evidence bar and the human accepts the user outcome.

## Session ritual

Start:

1. read project and shared instructions;
2. reconcile working records and pending human intents per
   `state-tracking.md`;
3. inspect active scope, gates, evidence drift, and next `READY` trace;
4. inspect technical-reconnaissance and cold-review freshness;
5. read the relevant sources before editing.

End:

1. confirm boy-scout cleanup stayed within the requirement or was a no-op;
2. run proportional tests against the final diff and inspect required
   runtime/browser evidence;
3. update the complete trace and six completion facts;
4. capture discoveries/deferrals/conflicts;
5. validate and reconcile state according to `state-tracking.md`;
6. state exactly what is complete, awaiting review, blocked, or unsynced.
