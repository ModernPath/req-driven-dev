# Human-input and review flows

Use these flows when work needs human intent, a product decision,
specification approval, or completion approval. They materialize answers into
the trace model in [`V-model-loop.md`](V-model-loop.md) and the ModernPath
Delivery System.

Do not interview for facts that can be read safely from product docs, code,
tests, or Delivery System state. Ask only for decisions that require human
authority.

## Common rules

- Establish the active workspace, release, epic, and gate before asking.
- Present current evidence and the exact decision needed.
- Attribute the actual human actor; never infer identity from a tool/session.
- Record `USER:<date>:<summary>` and the affected UR/EPIC/SCN/SR/TASK ids.
- An unanswered or ambiguous question keeps affected work `BLOCKED`.
- An answer changes intent only. Apply it to specs/requirements/tasks/code in a
  separate, traceable step.
- Mission Control and the CLI answer the same Delivery System gates. The
  server's first accepted answer wins; pull/apply before proceeding.
- Every opened gate includes the brief defined in `AGENTS.md`.

## 1. Session intake

Inspect rather than ask:

1. current repository and Delivery System state;
2. active release and selected epic/task;
3. open gates, blockers, deferrals, and conflicts;
4. evidence drift and items awaiting review;
5. the next `READY` traces.

Then identify the user's target: status, new outcome, existing epic,
requirement/scenario, system behavior, decision, gap, or evidence review.

Output:

```markdown
Current state: <release, epic/task, loop status>
Evidence/blockers: <direct summary>
Decision needed: <only if one exists>
Next executable item: <id or none>
```

## 2. New outcome / epic discovery

Use when the user wants new product behavior.

1. Search existing requirements and epics to avoid duplication.
2. Establish the actor, desired outcome, intended use, and source.
3. Identify the primary domain/bounded context and affected interfaces from
   product/code sources; ask only where sources are missing or conflicting.
4. Separate facts, decisions, assumptions, and open questions.
5. Draft the UR and initial user journey.
6. Determine whether the epic or fast lane applies using the canonical tests.
7. If epic-path, create its record/spec set and continue through scenario and
   system-decomposition flows.
8. Publish the proposal to Delivery System state without marking it approved.

Ask concisely:

```text
Which actor needs what outcome, and why?
What observable workflow would prove the outcome?
Which constraints or exclusions are deliberate decisions?
Who can approve the specification?
```

## 3. Decision capture

Use for scope, behavior, architecture, acceptance, priority, release, or
workflow decisions.

1. Show the gate brief and concrete options/tradeoffs.
2. State the recommendation separately from the decision.
3. Ask the authorized human to choose, revise, defer, or reject.
4. Record actor, role, option/free text, source tag, timestamp, and scope.
5. Pull/apply or sync the answer according to its origin.
6. Update all affected specifications and trace items; record consequences.
7. Re-run the specification gate if acceptance or scope changed.

Decision record:

```markdown
| Decision | Actor | Role | Source | Affects | Consequence |
|---|---|---|---|---|---|
| DEC-<AREA>-NNN | <name> | <role> | USER:<date>:<summary> | UR/SCN/SR/TASK | <change> |
```

A decision alone never grants an evidence status.

## 4. Acceptance-scenario interview

Use when observable user behavior is missing or disputed.

1. Open the linked UR, journey, product source, and epic.
2. Ask for the initial state, actor action, and observable result.
3. Draft Given/When/Then in product language.
4. Cite each normative claim or open a question for it.
5. Identify negative/edge behavior that is necessary to prove the outcome.
6. Record the SCN and its planned upper-RED test.
7. Link the SRs needed to satisfy it; do not turn the SCN into tasks.

```gherkin
Scenario: <observable behavior>
  Given <sourced state>
  When <actor action/event>
  Then <observable result>
```

## 5. System requirement and task decomposition

Use after a scenario is sourced.

For each system behavior:

1. identify its owning boundary/interface;
2. write one testable `SR-*` statement;
3. select the verification level;
4. define the smallest vertical `TASK-*` that advances a scenario;
5. name the expected lower-RED test and implementation path;
6. cite product/code/contract sources;
7. record blockers and technical enablers explicitly;
8. publish trace links to the Delivery System.

Questions:

```text
Which SCN does this behavior support?
What must the system do at which boundary?
What focused test should fail first, and why?
What is the smallest vertical change that can make it pass?
```

## 6. Specification review gate

Use before any epic-path RED test is written.

Audit the canonical specification-gate checklist, then present:

- user outcome and excluded scope;
- URs, journeys, and SCNs;
- contexts/models/events/interfaces;
- SR/task decomposition and RED strategy;
- open questions, risks, and deferrals;
- release and delivery path;
- brief and recommendation.

Ask the authorized human for one result:

- approve specification;
- request changes;
- defer;
- reject.

Record the result in the Delivery System and the epic's specification status.
Only approval unlocks upper/lower RED work.

## 7. Evidence review

Use before `IN_REVIEW`, `DONE`, or `VALIDATED`.

Audit each trace, not just status labels:

1. `UR -> EPIC -> SCN -> SR -> TASK -> TEST -> CODE` links exist;
2. upper RED failed for the expected missing behavior;
3. each lower RED failed for the expected missing behavior;
4. lower tests and required regression/contract gates now pass;
5. upper E2E/user-flow evidence now passes;
6. UI runtime/screenshot evidence was actually inspected where required;
7. evidence is pinned to the current code and has no drift;
8. implementation delivery and local/server synchronization are current;
9. gaps and deferrals are disclosed.

Classify every item:

- proven complete;
- contradicted;
- incomplete;
- evidence too indirect;
- missing evidence.

Only the first class can support completion.

## 8. Completion approval gate

Open only after the evidence review proves both arms.

Present the brief plus:

- visible outcome and scope delivered;
- SCN and SR/TASK result summary;
- runtime/browser evidence;
- known gaps/deferrals and risks;
- PR/commit/release/sync state.

Ask the human for approval, rejection, or changes requested. Record:

```markdown
| Approval | Approver | Role | Source | Scope | Decision | Conditions |
|---|---|---|---|---|---|---|
| APP-<AREA>-NNN | <name> | <role> | USER:<date>:<summary> | EPIC/UR | approved/rejected/changes requested | <gaps> |
```

Approval is necessary but not sufficient: code must also be delivered and all
state representations reconciled before `DONE`/`VALIDATED`.

## 9. Gap, conflict, or deferral

When a claim is unsourced, contradicted, or intentionally postponed:

1. do not record it as fact or silently narrow the requirement;
2. record source/trigger and affected traces;
3. classify as open question, conflict, blocker, deferral, or discovery;
4. name decision/owner and next point of review;
5. open a Delivery System gate if human authority is needed;
6. keep work at the strongest status current evidence supports.

Deferral record:

```markdown
| Item | Status | Reason | Source | Owner | Target/review point | Affects |
|---|---|---|---|---|---|---|
| <id> | DEFERRED | <why not now> | USER:/DOC:/RUN: | <owner> | <release/date/gate> | <trace ids> |
```

## 10. Implementation kickoff

After specification approval, provide a self-contained kickoff:

```markdown
Start `<EPIC-ID>` in `<repository>`.

Read:
- project `AGENTS.md`
- `req-driven-dev/AGENTS.md`
- `<epic>/EPIC.md` and specs
- active task records

State:
- release/system: <ids>
- specification gate: <approved source>
- next trace: UR -> EPIC -> SCN -> SR -> TASK

Evidence sequence:
1. run/record upper RED for <SCN>;
2. run lower RED/GREEN for <TASK> using <test command>;
3. run proportional regression gates;
4. run upper validation and required browser/runtime check;
5. update local trace records, sync, and report evidence;
6. stop at IN_REVIEW for human completion approval.
```

Do not issue a kickoff for a draft, blocked, or unapproved specification.

## 11. End-of-session handoff

Report:

- target and current release/trace;
- files/code changed;
- RED and GREEN evidence with commands/results;
- decisions/approvals with source and actor;
- Delivery System sync/evidence status;
- discoveries, deferrals, conflicts, and blockers;
- exact next `READY` item.

Use honest status language. “Implemented locally,” “verified,” “in review,”
and “done” are different states.
