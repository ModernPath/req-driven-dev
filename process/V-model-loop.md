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
    proposed trace -> TRACE PASS -> HUMAN entry gate -> TODO
    delivered trace -> TRACE PASS -> HUMAN completion gate -> DONE

                       DEVELOPMENT LOOP
  ORIENT -> SPECIFY -> RECON -> COLD REVIEW -> ENTRY TRACE -> HUMAN -> RED -> GREEN
     ^                                                                        |
     +-- CAPTURE <- HUMAN <- COMPLETION TRACE <- DELIVER/RECONCILE <- REVIEW <- VERIFY <- CLEAN --+

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

  Canonical trace: EPIC -> UR -> SR -> CODE -> TEST_CASE -> TEST_RESULT

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
enrich each SR's implementation context, and run a cold technical review.
Only after that proposed trace is fulfilled may the human entry decision be
solicited. Planning starts only from confirmed requirements; a `DERIVED`
requirement waits at its confirmation gate and is not eligible for
authoritative epic membership, acceptance content, test, or implementation
work.

### 3. Build and verify

Run both V-model arms red-first. Lower-loop SR slices make system behavior
correct; upper-loop scenarios prove the intended user workflow. After the
intended behavior is green, run a requirement-scoped boy-scout cleanup before
recording final evidence. Move the fulfilled trace to `IN_REVIEW`, deliver it
in the implementation's source repository, and reconcile state according to
`state-tracking.md`. Only then solicit human completion acceptance and apply
the final `DONE` transitions.

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
- Status: DERIVED | PENDING_VERIFICATION | PROPOSED | TODO | IN_PROGRESS | IN_REVIEW | DONE | BLOCKED | DEFERRED | OBSOLETE
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
- Status: DERIVED | PENDING_VERIFICATION | PROPOSED | TODO | IN_PROGRESS | IN_REVIEW | DONE | BLOCKED | DEFERRED | OBSOLETE
```

When migrating existing `TASK-*` records, fold their normative scope,
implementation context, evidence, and code links into the owning SR, then
retire them as standalone lifecycle records. External planning boards may keep
task-shaped projections, but those projections own no process state.

### Code (`CODE:`)

A code trace reference names the files, symbols, commit, branch, or PR that
implements an SR. Code owns no requirement intent or lifecycle. A revision is
not verified merely because the reference exists.

### Test case (`TEST_CASE`, cited as `TEST:`)

A test case is a stable test definition identified by path and test name. It
links to the exact UR acceptance scenario or SR clauses it exercises and names
the expected observation. One case may cover multiple clauses only when every
target and failure-producing assertion is explicit.

### Test result (`TEST_RESULT`, cited as `RUN:`)

A test result is an observed execution of a test case. It records the command
or report, `PASS/FAIL/SKIP` outcome and RED/GREEN role, branch/revision,
environment when relevant, and evidence validity. Results are immutable
observations; rerunning creates a new result rather than rewriting the old one.

## Trace lenses

The canonical trace is a relationship graph. Each lens projects the same
authoritative links without creating a second source of truth:

| Lens | Projection |
|---|---|
| Product | `EPIC -> UR -> acceptance scenarios` |
| System | `UR acceptance scenario -> SR` |
| Delivery | `EPIC -> active/done URs and SRs` |
| Implementation | `SR -> CODE` |
| Upper evidence | `UR acceptance scenario -> TEST_CASE -> TEST_RESULT` |
| Lower evidence | `SR -> CODE -> TEST_CASE -> TEST_RESULT` |
| Reverse trace | `TEST_RESULT -> TEST_CASE -> CODE -> SR -> UR -> EPIC` |

An SR has one owning epic and may support multiple acceptance scenarios within
that epic. A `TEST_CASE` is the stable test definition identified by `TEST:`;
a `TEST_RESULT` is an observed execution identified by `RUN:` and pinned to a
revision. Test cases may prove multiple clauses when each target and assertion
is explicit. Code references identify the files, symbols, commits, and PRs
that implement the SR; code does not define requirement intent. This graph is
relationship order, not execution order: red-first still observes the test
case fail before the code satisfies it.

## Strict human transitions

A strict human gate adds the human decision to an otherwise fulfilled
transition. It is not a request for the human to discover missing trace facts.
Do not solicit the answer until every non-human prerequisite for the target
state is recorded and current.

| Transition | Must be fulfilled before soliciting the human | Human decision |
|---|---|---|
| Requirement `DERIVED -> PROPOSED` | candidate requirement statement, inference sources, proposed ancestry and downstream links, conflicts, consequences, and confirmation brief | confirm that the requirement exists, correct it, or reject it |
| Requirement `PROPOSED -> TODO` | confirmed requirement; authoritative ancestry; sourced statement and acceptance content or system behavior; scope, owner, and release; required reconnaissance and cold review; test strategy; resolved or routed decisions | approve the named requirement for implementation entry |
| Epic `PROPOSED -> TODO` | complete in-scope proposed trace; every selected requirement entry trace passing; full specification or fast-lane packet; current reconnaissance; passing cold review; resolved or routed decisions | approve the named epic scope for implementation entry |
| Requirement `IN_REVIEW -> DONE` | complete `EPIC -> UR -> SR -> CODE -> TEST_CASE -> TEST_RESULT` trace; required lower/upper evidence; authoritative delivery; current delivered-revision evidence; reconciled records and projections; disclosed gaps and deferrals | accept the delivered requirement |
| Epic `IN_REVIEW -> DONE` | every in-scope requirement is completion-eligible, the complete epic trace is delivered and reconciled, and the completion brief names the exact scope | accept the delivered epic |

An entry or completion gate may cover an explicit epic and set of requirements
in one brief. The answer still records each entity transition and its
`USER:<date>:<summary>` source. When applying a scoped completion answer, move
the named requirements to `DONE` before moving their epic to `DONE` in the same
reconciliation change.

`PENDING_VERIFICATION` is a special as-built route and does not bypass these
gates. It follows human confirmation of existence and must receive the same
requirement entry approval before a test is changed. A gate marker may be
prepared before it is eligible, but it must not be presented in a human action
queue or otherwise solicited until the corresponding row above is fulfilled.

## Gate kinds

Every strict lifecycle transition composes two different gates:

```text
authoritative trace -> TRACE gate PASS -> HUMAN gate OPEN
-> attributable human answer -> transition applied
```

- A `TRACE` gate checks non-human facts against the canonical trace at an exact
  input revision or fingerprint. An independent agent or deterministic check
  may evaluate it as `PASS` or `FAIL`; changed inputs make the result `STALE`.
  A trace gate cannot make a product decision or grant human approval.
- A `HUMAN` gate records a decision that requires interaction with an
  authorized human. An agent may prepare and publish it only after its
  prerequisite trace gate passes. An agent or automated check may never answer
  it for the human.

Cold technical review, entry-readiness checks, lower/upper evidence checks,
delivery checks, and reconciliation checks are trace gates. Requirement
confirmation, entry approval, completion acceptance, and any product, scope,
architecture, acceptance, priority, or workflow choice are human gates. When a
trace check encounters one of those choices, it fails or remains pending and
routes the choice to a human gate instead of assuming an answer.

Trace gates also drive the non-human lifecycle transitions:

| Transition or waypoint | Required trace-gate proof |
|---|---|
| SR `TODO -> IN_PROGRESS` | approved entry fingerprint is current and the first expected lower or linked upper RED `TEST_RESULT` is recorded against its `TEST_CASE` |
| UR `TODO -> IN_PROGRESS` | its upper RED is recorded or one of its linked SRs is `IN_PROGRESS` |
| Epic `TODO -> IN_PROGRESS` | one of its in-scope URs or SRs is `IN_PROGRESS` |
| SR `IN_PROGRESS -> IN_REVIEW` | current red-first `SR -> CODE -> TEST_CASE -> TEST_RESULT` lower trace passes every required clause and post-cleanup gate |
| UR `IN_PROGRESS -> IN_REVIEW` | every required linked SR is `IN_REVIEW` and current red-first upper test results pass its acceptance content |
| Epic `IN_PROGRESS -> IN_REVIEW` | every in-scope UR and SR is `IN_REVIEW`, with required upper and lower trace gates passing |
| lower/upper evidence waypoint | the exact current results support `LOWER_VERIFIED` or `UPPER_VALIDATED` for the named trace and revision |

An agent or check may apply those forward transitions only from a current
`PASS`. It may apply the automatic demotions in `state-tracking.md` when a
previously supporting trace becomes stale or fails. Neither direction creates
or substitutes for a human answer.

## Sources and decisions

Use stable source tags:

| Tag | Meaning |
|---|---|
| `USER:<date>:<summary>` | attributable human fact, decision, or approval |
| `DOC:<path>#<section>` | product/domain/architecture source |
| `CODE:<path>:<symbol>` | observed existing behavior |
| `TEST:<path>:<name>` | stable `TEST_CASE` definition or target |
| `RUN:<command-or-report>` | observed `TEST_RESULT` or runtime evidence |
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
- complete its candidate ancestry, proposed downstream links, conflicts, and
  consequences, then emit the confirmation gate that holds them;
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
`TODO`. Re-evaluate every candidate link through the normal planning flow. A
confirmed as-built description may take the `PENDING_VERIFICATION` route after
the confirmation has established `PROPOSED`, but only when the human decision
explicitly accepts both the requirement and the description of the behavior
that already ships. It still requires entry approval before verification work.

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
technical evidence; it never grants human entry approval.

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
12. explicit human entry approval for the epic and every selected UR/SR.

Specification state:

```text
SPEC-DRAFT -> SPEC-READY -> SPEC-APPROVED
                  |              |
                  |              +-- attributable human approval
                  +-- open specification gate
```

`SPEC-READY` requires current technical reconnaissance, enriched initial SRs,
and a cold-review `PASS` with no material finding open or deferred in scope.
Only then may the entry decision be solicited. `SPEC-APPROVED` adds the
attributable human decision; the same scoped answer records each named
requirement's entry transition and, when the epic is still `PROPOSED`, its
`PROPOSED -> TODO` transition. The technical review cannot make any of those
transitions.

No epic-path RED test is written before `SPEC-APPROVED` and every selected
entity is `TODO`. Writing the test is implementation-loop work, not
specification work.

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
- its scoped entry brief is fulfilled and receives human approval for every
  selected entity;
- its completion brief can identify the exact selected entity scope.

The fast lane avoids preparing and approving a new full epic specification set.
It does not remove epic ownership, any trace level, upper or lower red-first
evidence, the strict entity entry and completion gates, review, delivery, or
state reconciliation. Criteria alone never move an epic or requirement to
`TODO`.

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
- inspect blockers, gate eligibility, open gates, evidence drift, and next
  `TODO` trace;
- read the relevant product, code, test, epic/spec, and SR sources.

### 1. Specify

- stop if any requirement in the proposed trace is `DERIVED`;
- sharpen acceptance criteria without changing sourced intent;
- create or update EPIC -> UR -> SR links and the UR acceptance content;
- route ambiguity to an open question/gate;
- fulfill the epic-path or fast-lane entry packet without soliciting its human
  gate early.

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
- mark the entry packet fulfilled only after the technical review passes; the
  review itself cannot approve an epic or requirement.

### 1c. Entry approval

- evaluate the entry trace gate for each proposed `TODO` transition and require
  a current `PASS`;
- only then publish or activate the scoped human entry gate;
- present the brief and solicit the authorized human decision;
- apply the attributable answer to each named requirement and the epic;
- do not start RED until every selected entity is `TODO`.

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
- set an SR `IN_REVIEW` only after its lower verification is complete;
- set a UR/epic `IN_REVIEW` only after lower verification and upper validation
  are complete;
- assemble the completion brief, visible behavior, risks, gaps, deferrals, and
  test results, but do not solicit human completion acceptance yet.

### 9. Deliver and reconcile

- keep the epic and requirements `IN_REVIEW`;
- merge code in its source-of-truth repository;
- integrate any workspace snapshot according to project rules;
- update requirement, epic, evidence, and rollups atomically;
- reconcile ledger, epic, work-list, release, PR/commit, evidence, and any
  connected Mission Control projection;
- re-run or confirm evidence against the delivered revision, evaluate the
  completion trace gate, and require a current `PASS` before opening the human
  completion gate.

### 10. Completion acceptance

- only now present the completion brief and solicit the authorized human;
- record the real actor, exact epic/requirement scope, decision, and
  `USER:<date>:<summary>` source;
- if accepted, move the named requirements and epic from `IN_REVIEW` to `DONE`
  in the same reconciled change;
- if rejected or changed, keep the strongest honest non-final state and route
  the requested change through planning.

### 11. Capture and continue

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

Primary lifecycles and their strict human transitions:

```text
EPIC: PROPOSED -[HUMAN]-> TODO -> IN_PROGRESS -> IN_REVIEW -[HUMAN]-> DONE

UR:   DERIVED -[HUMAN]-> PROPOSED -[HUMAN]-> TODO -> IN_PROGRESS -> IN_REVIEW -[HUMAN]-> DONE

SR:   DERIVED -[HUMAN]-> PROPOSED -[HUMAN]-> TODO -> IN_PROGRESS -> IN_REVIEW -[HUMAN]-> DONE
```

`PENDING_VERIFICATION` is the special confirmed-as-built route described below;
it still joins `TODO` through the human entry gate.

Requirement work status for both UR and SR:

| Status | Meaning |
|---|---|
| `DERIVED` | inferred requirement whose fulfilled candidate packet awaits attributable human confirmation; candidate links are non-authoritative and downstream work is held |
| `PENDING_VERIFICATION` | special route for a confirmed as-built description awaiting the same human entry approval and direct current evidence |
| `PROPOSED` | confirmed or directly sourced requirement whose entry trace is being fulfilled; not approved for implementation |
| `TODO` | every non-human entry prerequisite is fulfilled and the attributable human entry approval is applied; the requirement may be selected for implementation |
| `IN_PROGRESS` | either evidence loop is underway |
| `IN_REVIEW` | required evidence is complete; the requirement stays here through delivery and reconciliation until completion acceptance |
| `DONE` | the full delivered trace was fulfilled before the attributable human completion acceptance was applied |
| `BLOCKED` | cannot proceed; blocker/gate linked |
| `DEFERRED` | explicitly postponed; reason, owner, and target recorded |
| `OBSOLETE` | rejected or superseded; human decision or replacement source linked |

Epic `delivery_status`:

| Status | Meaning |
|---|---|
| `PROPOSED` | epic scope exists and its entry trace is being fulfilled; it is not approved for implementation |
| `TODO` | every non-human entry prerequisite is fulfilled and the attributable human entry approval is applied; the epic may be selected for implementation |
| `IN_PROGRESS` | one or more contained traces are in an evidence loop |
| `IN_REVIEW` | every in-scope requirement has its required evidence; the epic stays here through delivery and reconciliation until completion acceptance |
| `DONE` | the full delivered epic trace was fulfilled before the attributable human completion acceptance was applied |
| `BLOCKED` | the epic cannot proceed; blocker or gate linked |
| `DEFERRED` | the epic is explicitly postponed with owner and target |
| `OBSOLETE` | the epic is rejected or superseded with a source or replacement |

Epic evidence rollups are derived from their contained work:

```text
upper_loop_status: PROPOSED -> IN_PROGRESS -> UPPER_VALIDATED
lower_loop_status: PROPOSED -> IN_PROGRESS -> LOWER_VERIFIED
```

Acceptance scenarios are UR content and have no lifecycle status. Test cases
have stable identity but no work lifecycle; test results carry outcome and
validity rather than requirement status.

Evidence waypoints:

- `LOWER_VERIFIED` belongs to SR lower evidence;
- `UPPER_VALIDATED` belongs to UR acceptance content and epic upper evidence;
- `DONE` belongs to both requirement and epic work status, not to an evidence
  axis.

A lower or upper waypoint does not independently make a requirement
`DONE`.

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

A completion gate becomes eligible for human input only when:

1. every named requirement and the epic are `IN_REVIEW` with their required
   lower and upper evidence complete;
2. code is merged in the authoritative implementation repository;
3. evidence is current and pinned to the delivered revision;
4. ledger, epic, work-list, release, PR/commit, evidence, and connected
   projections are reconciled;
5. no `DERIVED` item or candidate trace link is counted as authoritative;
6. gaps, deferrals, decisions, and the exact acceptance scope are disclosed in
   the completion brief.

Before these facts hold, prepare or refresh the brief but do not solicit the
human decision. The answer is acceptance of the delivered result, not
authorization to deliver it.

After the completion answer is applied, an epic is `DONE` only when:

1. every linked UR and SR is `DONE`, no item is `DERIVED`, and no candidate
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

A UR is `DONE` only when its acceptance content and linked lower trace meet
the evidence bar, the trace was delivered and reconciled, and the human then
accepted the user outcome. An SR is `DONE` only when its lower evidence
meets the same bar, its approved parent trace was delivered and reconciled, and
the human then accepted the requirement in the scoped completion decision.

## Session ritual

Start:

1. read project and shared instructions;
2. reconcile working records and pending human intents per
   `state-tracking.md`;
3. inspect `DERIVED` confirmation holds, active scope, gates, evidence drift,
   and the next confirmed `TODO` trace;
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
