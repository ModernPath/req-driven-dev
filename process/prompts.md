# Execution prompts

These prompts invoke the process in `AGENTS.md` and `V-model-loop.md`. Replace
placeholders; do not paste process rules into project prompts.

## 0. Discover product intent

```text
Read the project AGENTS.md and .modernpath/rdd/AGENTS.md.

Input: <user/customer/regulatory/incident sources>
Target product/context: <name>

Inspect existing product docs, code, tests, and the working records defined in
state-tracking.md. Separate sourced facts, human decisions, conflicts, and open
questions.
Create/update product/domain documentation, ubiquitous language, rules,
boundaries, contracts, and an open-question register. Cite every normative
claim. Do not create implementation tasks or resolve ambiguity by assumption.

Report changed sources, derived facts, human decisions still needed, conflicts,
and candidate user outcomes.
```

## 1. Plan a user outcome

```text
Read the project AGENTS.md, .modernpath/rdd/AGENTS.md,
.modernpath/rdd/process/V-model-loop.md, and .modernpath/rdd/process/state-tracking.md. Reconcile
working records and pending human intents first.

Outcome/source: <reference>
Release/system: <scope>

Derive or update:
- a sourced UR with actor, intended use, and validation method;
- the owning epic (or prove every fast-lane criterion);
- stories/journeys and Given/When/Then SCNs;
- testable SRs and the first thin TASKs;
- sourced technical reconnaissance at a named repository revision, covering the
  affected surface, end-to-end control/data path, changed flow hops, boundaries,
  existing patterns, test infrastructure, applicable failure modes, risks, and
  unknowns;
- enriched TASK context with expected files/symbols, callers, owned flow
  segment and impact, reuse targets, dependencies, test paths, gates, and
  explicit change boundaries;
- upper-RED and lower-RED strategy;
- decisions, blockers, conflicts, gaps, and deferrals.

Verify generated context against actual DOC:/CODE:/TEST: sources. Publish
proposed state without granting approval. If epic-path, prepare the
specification brief and stop for a cold technical review before the human
specification gate. Do not write tests or implementation before specification
approval.
```

## 1a. Run a cold technical review

```text
Start from a separate context from the specification authoring conversation.
Read the project AGENTS.md, .modernpath/rdd/AGENTS.md,
.modernpath/rdd/process/V-model-loop.md, the product sources, epic and specs,
technical reconnaissance, enriched tasks, and current repository state at the
recorded revision.

Do not edit implementation or grant approval. Audit:
- trace and requirement-scope alignment;
- completeness of files, symbols, entry points, callers, writers, readers,
  contracts, data flows, and compatibility concerns;
- completeness of the path from trigger through calls, transformations,
  persistence/integrations, side effects, failure propagation, and output;
- reuse of established implementation and test patterns;
- failure behavior, feasibility, dependency ordering, and task boundaries;
- testability, expected RED reasons, and adequacy of proportional gates;
- unauthorized product, architecture, acceptance, or scope choices.

Record findings as OPEN, RESOLVED, DEFERRED, or REJECTED with severity, direct
source, owner, and disposition evidence. Treat open correctness, security,
data-loss, contract, trace, or testability findings as material blockers. A
material finding may pass only when resolved, rejected with direct evidence, or
removed from current scope by an attributable human decision and routed.
Return a PASS only when no material finding remains open or deferred in scope;
otherwise return CHANGES_REQUIRED. The author or owning agent resolves findings
and requests a new cold review before the human specification gate.
```

## 2. Review and approve a specification

```text
Read the project AGENTS.md, .modernpath/rdd/AGENTS.md,
.modernpath/rdd/process/V-model-loop.md, .modernpath/rdd/process/state-tracking.md, the epic and all
specs, current human gates, and relevant product sources.

Audit every specification-gate condition. Lead with contradictions, missing
sources, ambiguous acceptance behavior, trace gaps, untestable SRs, stale
technical reconnaissance, missing task context, and cold-review findings.
Confirm the cold review passed with no material finding open or deferred in
scope. Present the plain-language brief and recommendation.

If the authorized human approves, record their actual identity, role, scope,
and USER:<date>:<summary>, then reconcile the answer according to
state-tracking.md. Otherwise record requested changes/blocker and do not issue
an implementation kickoff.
```

## 3. Execute one development-loop slice

```text
Read the project AGENTS.md, .modernpath/rdd/AGENTS.md,
.modernpath/rdd/process/V-model-loop.md, .modernpath/rdd/process/state-tracking.md, the active
epic/spec/task, and relevant product/code/test sources. Converge state and
confirm current technical reconnaissance, a passing cold technical review, and
specification approval or every fast-lane criterion. Refresh the task context
from the reconnaissance and current repository; if material drift changes the
affected surface, stop and repeat reconnaissance and cold review before
implementation.

Select exactly one READY trace:
UR -> EPIC -> SCN -> SR -> TASK.

1. Run or create the SCN's upper BDD/E2E test and record the expected RED.
2. Create the TASK/SR focused lower test and record the expected RED.
3. Implement the smallest vertical change that makes the lower test pass.
4. Run the focused test to establish GREEN.
5. Inspect the task diff and perform behavior-preserving boy-scout cleanup only
   in touched or directly adjacent code needed by this requirement. Do not add
   behavior, change contracts/architecture, or absorb broader debt. Record the
   bounded cleanup or an explicit no-op; route wider debt as a discovery.
   Do not weaken tests or acceptance evidence during cleanup.
6. Run focused and proportional regression/contract/architecture gates against
   the final post-cleanup diff.
7. Record lower evidence and move only proven TASK/SR items to LOWER_VERIFIED.
8. Run upper validation; for UI work use the live stack and inspect a screenshot.
9. Record passing upper evidence and move only proven SCNs to UPPER_VALIDATED.
10. Capture discoveries/deferrals/conflicts without silently expanding scope.
11. Update the full trace and reconcile state according to state-tracking.md.
12. Stop at IN_REVIEW when completion approval is still pending.

Report reconnaissance/context revision, cold-review verdict, RED and GREEN
commands/results, cleanup change or no-op, post-cleanup gates, code/test refs,
status changes, state reconciliation, gaps, and the next READY item.
```

## 4. Triage and replan

```text
Read the project AGENTS.md, .modernpath/rdd/AGENTS.md,
.modernpath/rdd/process/V-model-loop.md, backlog, active release, requirements, epics, open
gates, and .modernpath/rdd/process/state-tracking.md.
This is planning work; do not implement product code.

For every backlog/discovery item:
- route clear behavior to a sourced PROPOSED UR/SR;
- route ambiguity or authority needs to a gate and BLOCKED trace;
- route future work to DEFERRED with reason/owner/target;
- route contradictions to a conflict;
- mark removed behavior OBSOLETE with replacement.

Reconcile product docs, requirement state, epics, release scope, and generated
rollups. Promote to READY only when the entry gate is proven. Reconcile state
per state-tracking.md and report routed items, changes, remaining human
decisions, and next READY traces.
```

## 5. Evidence and completion review

```text
Read the project AGENTS.md, .modernpath/rdd/AGENTS.md,
.modernpath/rdd/process/V-model-loop.md, .modernpath/rdd/process/state-tracking.md, active
epic/spec/tasks, current code/tests/PR, and current working records/projections.

Treat completion as unproven. For every explicit UR, SCN, SR, TASK, gate, and
Definition-of-Done item, identify authoritative evidence and inspect its current
state. Classify each as proven, contradicted, incomplete, indirect, or missing.
Confirm technical-reconnaissance freshness, enriched task context, cold-review
dispositions, RED-before-GREEN, requirement-scoped cleanup, post-cleanup gates,
runtime/browser proof, evidence SHA/drift, human approval, source-repository
delivery, release scope, and state reconciliation. Treat evidence carried
across a revert, an abandoned branch, or a closed unmerged PR as unverified
unless it was re-verified at the current revision or is explicitly marked
inherited.

If all checks pass, present the completion brief and request/record authorized
human approval. Mark DONE/VALIDATED only after delivery and state
reconciliation.
Otherwise leave the strongest honest status and list exact missing evidence.
```

## 6. Integrate user feedback

```text
Read the project and shared instructions. Treat this input as a source, not an
automatic implementation order:

<feedback>

Find affected UR/SCN/SR/TASK traces and current behavior. Classify as defect,
new outcome, change request, decision, or ambiguity. Record a sourced proposed
change or gate, identify acceptance/evidence and technical-reconnaissance
impact, and determine epic vs fast lane. Mark affected cold review and task
context stale when the technical surface changes. Do not silently change
approved scope. Reconcile the proposal according to state-tracking.md and
report the human decision needed or next planning step.
```
