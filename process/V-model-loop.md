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
  EPIC (top-level delivery item)                               |
       |                                                       |
       | holds                                                 |
       v                                                       |
  USER REQUIREMENT (UR)                                        |
       |                                                       ^
       +-- STORY/JOURNEY/SCENARIO CONTENT ---- BDD/E2E validation
       |
       | decomposes
       v
  SYSTEM REQUIREMENT (SR) -> implementation -> unit/component/API/
                                              contract/integration test
       |                                                       ^
       +---------------------- focused verification -----------+

  Canonical trace: EPIC -> UR -> SR -> TEST -> CODE

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
guessing. When existing code or documents suggest a requirement that no human
has confirmed, record it as `DERIVED`, expose its proposed trace only as
candidate context, emit a confirmation gate, and stop its downstream flow.

### 2. Plan

Establish the owning epic, then derive user requirements and system
requirements from the product sources. Write observable acceptance criteria,
establish release scope, and choose the full specification path or the fast
lane within that epic. Perform sourced technical reconnaissance, use it to
enrich each SR's implementation context, and run a cold technical review
before the human specification gate. Planning starts only from confirmed
requirements; a `DERIVED` requirement waits at its confirmation gate and is not
eligible for authoritative epic membership, acceptance content, test, or
implementation work.

### 3. Build and verify

Run both V-model arms red-first. Lower-loop SR slices make system behavior
correct; upper-loop scenarios prove the intended user workflow. After the
intended behavior is green, run a requirement-scoped boy-scout cleanup before
recording final evidence. Record evidence and human approval, deliver in the
implementation's source repository, and reconcile state according to
`state-tracking.md`.

Planning and building are iterative. Discoveries feed the planning loop without
silently expanding the current implementation slice.

## Trace hierarchy

### Epic (`EPIC-*`)

An epic is the top-level delivery item. It groups one coherent user-visible
capability and holds one or more user requirements with their complete delivery
traces. A technical-enabler epic still holds URs that state the user or
operational outcome it enables and links to the affected user-visible scope.

An epic owns:

- sourced user outcome and linked URs;
- actors, primary domain/bounded context, supporting contexts;
- key models, events, interfaces, and constraints;
- decisions and open questions;
- sourced technical reconnaissance and SR implementation context;
- cold technical review findings and dispositions;
- UR acceptance-scenario content and thin SRs;
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
```

Seed the reconnaissance from
[`templates/work/TECHNICAL-RECONNAISSANCE.md`](../templates/work/TECHNICAL-RECONNAISSANCE.md).

### User requirement (`UR-*`)

A user requirement is held by an owning epic and states an outcome for a named
actor in a real context. It contains no implementation choice unless the choice
is itself a user or regulatory constraint.

Minimum fields:

```markdown
## UR-<AREA>-NNN — <outcome>
- Owning epic: EPIC-<AREA>-NNN
- Actor: <role>
- Statement: <actor can achieve/experience outcome>
- Intended use: <context and value>
- Source: USER:/DOC:/CODE: (`CODE:` alone implies `DERIVED` until confirmed)
- Acceptance scenarios: <embedded Given/When/Then content>
- Upper RED: <acceptance test path/name/command and expected failure>
- Upper evidence: <passing user-flow/runtime evidence and revision>
- Status: DERIVED | PENDING_VERIFICATION | PROPOSED | READY | IN_PROGRESS | IN_REVIEW | VALIDATED | BLOCKED | DEFERRED | OBSOLETE
```

### Acceptance scenarios (UR content)

A scenario is observable upper-loop behavior, normally Given/When/Then. It is
content within a UR, not a separate trace entity or lifecycle record. A scenario
may have a stable label or heading so tests and evidence can cite it.

```gherkin
Scenario: <observable outcome>
  Given <sourced initial state>
  When <actor action or event>
  Then <observable result>
```

Each scenario states the UR behavior that its linked SRs must make pass.

### System requirement (`SR-*`)

A system requirement is the smallest independently implementable and verifiable
vertical slice of system behavior needed by UR acceptance content. Split an SR
when its behavior cannot be implemented, evidenced, owned, or delivered as one
coherent slice.

```markdown
## SR-<AREA>-NNN — <behavior>
- Owning epic: EPIC-<AREA>-NNN
- Statement: The system shall <testable behavior>.
- UR acceptance links: <UR id and scenario/criterion headings>
- Source: <USER/DOC/CODE source for normative behavior>
- Boundary: domain | API | UI | data | integration | operations
- Owner/release: <owner and delivery scope>
- Scope/change boundary: <included behavior and explicit non-goals>
- Technical reconnaissance: <artifact and inspected revision>
- Implementation context: <files/symbols, callers, flow impact, contracts,
  reuse targets, dependencies, risks>
- Verification method: unit | component | API | contract | integration
- Lower RED: <test path/name/command and expected failure>
- Regression gates: <commands>
- Evidence: <failing/passing runs and revision>
- Code: <files/symbols/commit/PR>
- Status: DERIVED | PENDING_VERIFICATION | PROPOSED | READY | IN_PROGRESS | IN_REVIEW | VALIDATED | BLOCKED | DEFERRED | OBSOLETE
```

When migrating existing `TASK-*` records, fold their normative scope,
implementation context, evidence, and code links into the owning SR, then
retire them as standalone lifecycle records. External planning boards may keep
task-shaped projections, but those projections own no process state.

## Trace lenses

The canonical trace is a relationship graph. Each lens projects the same
authoritative links without creating a second source of truth:

| Lens | Projection |
|---|---|
| Product | `EPIC -> UR -> acceptance scenarios` |
| System | `UR acceptance scenario -> SR` |
| Delivery | `EPIC -> active/validated URs and SRs` |
| Upper evidence | `UR acceptance scenario -> TEST -> result/revision` |
| Lower evidence | `SR -> TEST -> result/revision` |
| Implementation | `SR -> TEST -> CODE` |
| Reverse trace | `CODE -> TEST -> SR -> UR -> EPIC` |

An SR has one owning epic and may support multiple acceptance scenarios within
that epic. Tests may prove multiple clauses when each target and assertion is
explicit. Code references identify the files, symbols, commits, and PRs that
implement the SR; code does not define requirement intent.

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
- record a decision's consequence on affected EPIC/UR/SR items and UR acceptance
  content;
- an answer is not an implementation or a passing gate by itself.

## Derived requirement confirmation

`DERIVED` is a pre-lifecycle requirement state. It means repository evidence,
existing system requirements, or analysis suggests that a user or system
requirement may exist, but an authorized human has not confirmed that it is a
real requirement. Code can prove observed system behavior; it cannot prove the
user intent attributed to that behavior.

While a requirement is `DERIVED`:

- record its statement, inference sources, and a product-language confirmation
  brief;
- emit a decision gate that holds the requirement and every proposed downstream
  link;
- label proposed EPIC/UR/SR relationships as candidate context only;
- exclude the requirement and candidate links from authoritative trace closure,
  readiness, release commitment, coverage, progress, and completion rollups;
- do not make its candidate epic membership authoritative or create or advance
  its acceptance content, technical reconnaissance, system requirements,
  tests, implementation, verification, or delivery work.

The human answer controls the transition:

```text
DERIVED -> confirmed as stated -----------> PROPOSED
        -> corrected and confirmed -------> PROPOSED (replace candidate links)
        -> rejected as a requirement -----> OBSOLETE (retire candidate links)
```

Record a confirmation or correction with its real actor and
`USER:<date>:<summary>` source. Confirmation establishes that the requirement
exists; it does not automatically approve a specification, validate candidate
links, prove current behavior, select a release, or make the requirement
`READY`. Re-evaluate every candidate link through the normal planning flow. A
confirmed as-built description may enter `PENDING_VERIFICATION` instead of
`PROPOSED` only when the human decision explicitly accepts both the requirement
and the description of the behavior that already ships.

`DERIVED` and `PENDING_VERIFICATION` are not synonyms: `DERIVED` lacks human
confirmation that the requirement exists; `PENDING_VERIFICATION` has that
confirmation but lacks direct current test evidence.

## Technical reconnaissance and cold review

Technical reconnaissance establishes how the approved product intent meets the
current repository before implementation begins. It is sourced discovery, not
an authority to select product behavior, architecture, or scope.

For epic-path work, record `specs/technical-reconnaissance.md` at a named source
revision. For fast-lane work, record the same information proportionally in the
SR. The reconnaissance must identify:

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

Use the reconnaissance to enrich every initial SR with its expected files and
symbols, relevant callers and boundaries, owned control-flow segment and impact,
reuse target, dependencies, risks, test path, gates, and explicit change
boundary. Recheck that context when the source revision changes or
implementation discovers a material omission.

After reconnaissance and SR enrichment, run a cold technical review in a
separate context from specification authoring. The reviewer receives the
versioned product sources, epic/specifications, SRs, reconnaissance, and
repository state, but does not rely on the author's conversation or unstated
reasoning. The review audits:

- trace and scope alignment;
- completeness of the affected technical surface;
- completeness of the end-to-end control/data path and every changed hop;
- contract, data, compatibility, and failure behavior;
- feasibility, dependency ordering, and SR boundaries;
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

## Epic ownership and specification gate

Every trace has an owning epic. The full epic specification path, rather than
the fast lane, is required when any of these are true:

1. design or specification content is needed beyond one requirement's
   acceptance criteria;
2. a contract surface changes (API, schema, event, protocol, public component);
3. the work spans bounded contexts or repositories;
4. it needs more than one independently verified SR or is expected to exceed
   one working day;
5. it changes product-visible behavior.

If one becomes true during a fast-lane change, stop the fast lane and enter or
refresh the full specification path for the owning epic.

Before full epic-path implementation, the epic must have:

1. an epic record, `specs/requirements.md`, and current
   `specs/technical-reconnaissance.md`;
2. sourced user outcome, UR, actors, and release/scope;
3. sourced primary/supporting contexts, models, events, and contracts, or
   blocking open questions;
4. each UR's user story/journey and Given/When/Then acceptance content covering
   the first slice;
5. thin, testable SRs linked to that acceptance content;
6. SR implementation context enriched from the reconnaissance;
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

`SPEC-READY` requires current technical reconnaissance, enriched initial SRs,
and a cold-review `PASS` with no material finding open or deferred in scope.
`SPEC-APPROVED` adds the attributable human decision; the technical review
cannot make that transition.

No epic-path RED test is written before `SPEC-APPROVED`. Writing the test is
implementation-loop work, not specification work.

## Fast lane

The fast lane is a lightweight execution route inside an owning epic for a
single spec-light SR. It never creates an epicless or shortened
trace. All must hold:

- an owning epic exists and the complete
  `EPIC -> UR -> SR` trace is authoritative;
- the requirement is confirmed and is not `DERIVED`;
- behavior is already unambiguous in a sourced requirement;
- no contract or product-visible behavior changes;
- one bounded context and source repository;
- one SR, expected within one working day;
- no new product/architecture/acceptance decision;
- the row has Given/When/Then criteria, expected upper and lower RED tests,
  owner, and release;
- the SR contains proportionate technical reconnaissance and enriched
  implementation context;
- a proportionate cold technical review has no material finding open or
  deferred in scope;
- it is visible in the repository work-list before implementation;
- the project defines the human review path for fast-lane completion.

The fast lane avoids preparing and approving a new full epic specification set.
It does not remove epic ownership, any trace level, upper or lower red-first
evidence, review, or state reconciliation.

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
- inspect `DERIVED` requirements and their confirmation gates; apply any
  answered gate before selecting work and never select a held candidate trace;
- confirm active release and current item;
- inspect blockers, open gates, evidence drift, and next `READY` trace;
- read the relevant product, code, test, epic/spec, and SR sources.

### 1. Specify

- stop if any requirement in the proposed trace is `DERIVED`;
- sharpen acceptance criteria without changing sourced intent;
- create or update EPIC -> UR -> SR links and the UR acceptance content;
- route ambiguity to an open question/gate;
- pass the epic specification gate or prove every fast-lane criterion.

### 1a. Technical reconnaissance and SR enrichment

- inspect the actual product, code, contract, data, and test surfaces at a
  named revision;
- record the affected surface, current patterns, test infrastructure, risks,
  control/data-flow impact, failure modes, and unknowns with direct sources;
- generate or refresh a context pack when useful, then verify its references
  against the repository;
- enrich each SR with the technical context needed to execute its thin slice;
- stop for a human decision when reconnaissance exposes a new product,
  architecture, acceptance, or scope choice.

### 1b. Cold technical review

- review the specification, reconnaissance, and enriched SRs from a separate
  context without relying on the author's conversation;
- record sourced findings and explicit dispositions;
- resolve or evidence-reject every material finding, or obtain an attributable
  human decision that removes its affected work from the current scope;
- obtain human specification approval after the technical review passes; the
  review itself cannot approve the specification.

### 2. Upper RED

- create or identify the BDD/E2E/user-flow test for the UR acceptance scenario;
- run it against the incomplete behavior;
- record the expected failure and why it proves the missing outcome;
- reject false-red evidence caused by a broken harness or unrelated failure.

### 3. Lower RED

- select one thin SR;
- write the smallest focused unit/component/API/contract/integration test;
- run it and record the expected failure;
- link test id/name to the SR.

### 4. Green

- implement only the behavior needed by the failing test;
- keep domain logic at the owning boundary;
- derive from canonical contracts;
- run the focused test to establish the intended behavior is green;
- capture discoveries rather than silently expanding scope.

### 5. Requirement-scoped boy-scout cleanup

- inspect the SR diff after the intended behavior is green;
- clean only code changed by the SR or directly adjacent code required to
  express that behavior clearly;
- allow behavior-preserving improvements such as clearer names, simpler local
  structure, removed duplication, and dead code made obsolete by the SR;
- do not add behavior, widen acceptance, change public contracts or
  architecture, or perform speculative refactoring;
- do not weaken tests or acceptance evidence to accommodate the cleanup;
- route broader debt as a discovery instead of absorbing it into the SR;
- record either the bounded cleanup performed or an explicit no-op;
- return to RED and update the trace if cleanup exposes a correctness change;
  do not disguise that change as cleanup.

### 6. Lower verify

- run the focused test, then proportional regression/architecture/contract
  gates against the final post-cleanup diff;
- inspect the exact assertions clause by clause; every behavioral clause needs
  a named assertion that would fail if that clause regressed;
- link test result, code, command, branch/SHA, and SR;
- identify tests by stable path and test name; treat line numbers only as
  optional navigation hints;
- record an SR's `LOWER_VERIFIED` evidence only when all linked lower work
  passes;
- move the SR requirement `work_status` to `IN_REVIEW` when all of its required
  lower evidence is complete.

### 7. Upper validate

- run the BDD/E2E/user-flow acceptance path;
- link failing-then-passing evidence and code to the UR acceptance content;
- for UI work, run against the live stack, assert assets loaded, and inspect an
  actual screenshot for layout/styling defects;
- never mutate real production-like data merely to verify a control's rendering.

### 8. Review

- audit every criterion against direct evidence;
- present the brief, visible behavior, risks, gaps, deferrals, and test results;
- set an SR `IN_REVIEW` only after its lower verification is complete;
- set a UR/epic `IN_REVIEW` only after lower verification and upper validation
  are complete;
- record the human completion decision with actual actor and scope.

### 9. Deliver and reconcile

- merge code in its source-of-truth repository;
- integrate any workspace snapshot according to project rules;
- update requirement, epic, evidence, and rollups atomically;
- reconcile ledger, epic, work-list, release, PR/commit, evidence, and any
  connected Mission Control projection before `DONE`/`VALIDATED`.

### 10. Capture and continue

Record the six completion facts: **Done, Decisions, Deferred, Discovered,
Follow-ups, Gate result**. Route every new item, then return to Orient.

## Upper loop

Question: **Does the delivered workflow satisfy the user requirement?**

Required evidence:

- sourced UR acceptance scenario and expected observation;
- failing BDD/E2E/user-flow result before the implementation satisfied it;
- passing result after lower-loop slices;
- runtime/browser/manual evidence proportional to the behavior;
- linked code revision;
- human acceptance at epic/UR completion.

```text
EPIC -> UR acceptance scenario -> failing acceptance test
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
SR -> failing focused test -> smallest implementation
                               |
                               v
                  focused + regression tests -> LOWER_VERIFIED
```

## Status model

Requirement work status for both UR and SR:

| Status | Meaning |
|---|---|
| `DERIVED` | inferred requirement awaiting attributable human confirmation; candidate links are non-authoritative and downstream work is held |
| `PENDING_VERIFICATION` | human-confirmed as-built requirement awaiting normal planning and direct current evidence |
| `PROPOSED` | identified, not ready |
| `READY` | sourced acceptance and entry gate complete |
| `IN_PROGRESS` | either evidence loop is underway |
| `IN_REVIEW` | evidence required by the requirement kind is complete; applicable approval or delivery remains |
| `VALIDATED` | required evidence, applicable human approval, source delivery, and reconciliation are complete |
| `BLOCKED` | cannot proceed; blocker/gate linked |
| `DEFERRED` | explicitly postponed; reason, owner, and target recorded |
| `OBSOLETE` | rejected or superseded; human decision or replacement source linked |

Epic `delivery_status`:

| Status | Meaning |
|---|---|
| `PROPOSED` | epic scope exists but an implementation-entry route is not ready |
| `READY` | the active scope has full specification approval or satisfies every fast-lane entry condition |
| `IN_PROGRESS` | one or more contained traces are in an evidence loop |
| `IN_REVIEW` | every in-scope requirement has its required evidence; completion approval, delivery, or reconciliation remains |
| `DONE` | completion approval, authoritative delivery, and reconciliation are complete |
| `BLOCKED` | the epic cannot proceed; blocker or gate linked |
| `DEFERRED` | the epic is explicitly postponed with owner and target |
| `OBSOLETE` | the epic is rejected or superseded with a source or replacement |

Epic evidence rollups are derived from their contained work:

```text
upper_loop_status: PROPOSED -> IN_PROGRESS -> UPPER_VALIDATED
lower_loop_status: PROPOSED -> IN_PROGRESS -> LOWER_VERIFIED
```

Acceptance scenarios are UR content and have no lifecycle status.

Evidence waypoints:

- `LOWER_VERIFIED` belongs to SR lower evidence;
- `UPPER_VALIDATED` belongs to UR acceptance content and epic upper evidence;
- `VALIDATED` belongs to UR/SR requirement work status, not to an evidence axis.

A lower or upper waypoint does not independently make a requirement
`VALIDATED` or an epic `DONE`.

## State records

Repository ledgers, epic folders, the work-list, backlog, generated progress
views, Mission Control projection, and their status axes are defined in
`state-tracking.md`. Keep state mechanics out of this lifecycle document.

## Planning and discoveries

Capture first, triage separately:

| Discovery | Route |
|---|---|
| inferred possible requirement without human confirmation | `DERIVED` requirement plus confirmation gate; proposed links remain candidate only |
| clear requirement with authoritative source and owner | `PROPOSED` user/system requirement |
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

An SR has `LOWER_VERIFIED` evidence only when:

- its requirement ancestry is confirmed and contains no `DERIVED` item or
  candidate trace link;
- source and trace links exist;
- technical reconnaissance is current and the SR carries its relevant
  implementation context;
- the cold technical review has no material finding open or deferred in the
  SR's scope;
- the expected lower test failed first for the expected reason;
- every behavioral clause maps to a named assertion that would fail on
  regression;
- the implementation is linked;
- boy-scout cleanup remained within the SR's requirement and change boundary,
  with a recorded change or no-op;
- focused and required regression gates pass against the final post-cleanup
  diff;
- evidence is current for the code revision.

UR acceptance content has `UPPER_VALIDATED` evidence only when:

- its requirement ancestry is confirmed and contains no `DERIVED` item or
  candidate trace link;
- its sourced observable behavior and trace links exist;
- the upper test failed before implementation satisfied it;
- the user-flow evidence now passes;
- runtime/browser evidence required by the behavior is inspected and linked;
- evidence is current for the code revision.

An epic is `DONE` only when:

1. every linked UR and SR is `VALIDATED`, no item is `DERIVED`, and no candidate
   trace link is counted as authoritative;
2. current technical reconnaissance enriched its SRs;
3. cold technical review preceded specification approval and no material
   finding remains open or deferred in scope;
4. specification approval preceded implementation;
5. every UR acceptance scenario has `UPPER_VALIDATED` evidence;
6. every linked SR has `LOWER_VERIFIED` evidence;
7. relevant architecture, lint, contract, integration, build, and smoke gates
   pass;
8. known gaps are recorded and no undisclosed scope remains;
9. human completion approval is recorded with actor, scope, and source;
10. code is merged in the authoritative implementation repository;
11. state records and projections required by `state-tracking.md` agree;
12. evidence is pinned to the delivered revision and has not decayed.

A UR is `VALIDATED` only when its acceptance content and linked lower trace meet
the evidence bar, the human accepts the user outcome, and delivery and
reconciliation are complete. An SR is `VALIDATED` only when its lower evidence
meets the same bar and its approved parent trace is delivered and reconciled.

## Session ritual

Start:

1. read project and shared instructions;
2. reconcile working records and pending human intents per
   `state-tracking.md`;
3. inspect `DERIVED` confirmation holds, active scope, gates, evidence drift,
   and the next confirmed `READY` trace;
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
