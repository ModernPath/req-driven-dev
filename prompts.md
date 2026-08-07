# Execution prompts

These prompts invoke the process in `AGENTS.md` and `V-model-loop.md`. Replace
placeholders; do not paste process rules into project prompts.

## 0. Discover product intent

```text
Read the project AGENTS.md and req-driven-dev/AGENTS.md.

Input: <user/customer/regulatory/incident sources>
Target product/context: <name>

Inspect existing product docs, code, tests, requirements, and Delivery System
state. Separate sourced facts, human decisions, conflicts, and open questions.
Create/update product/domain documentation, ubiquitous language, rules,
boundaries, contracts, and an open-question register. Cite every normative
claim. Do not create implementation tasks or resolve ambiguity by assumption.

Report changed sources, derived facts, human decisions still needed, conflicts,
and candidate user outcomes.
```

## 1. Plan a user outcome

```text
Read the project AGENTS.md, req-driven-dev/AGENTS.md, V-model-loop.md, and
delivery-system.md. Converge local and Delivery System state first.

Outcome/source: <reference>
Release/system: <scope>

Derive or update:
- a sourced UR with actor, intended use, and validation method;
- the owning epic (or prove every fast-lane criterion);
- stories/journeys and Given/When/Then SCNs;
- testable SRs and the first thin TASKs;
- upper-RED and lower-RED strategy;
- decisions, blockers, conflicts, gaps, and deferrals.

Publish proposed state without granting approval. If epic-path, prepare the
specification brief and stop at the human specification gate. Do not write
tests or implementation before specification approval.
```

## 2. Review and approve a specification

```text
Read the project AGENTS.md, req-driven-dev/AGENTS.md, V-model-loop.md, the epic
and all specs, current Delivery System gates, and relevant product sources.

Audit every specification-gate condition. Lead with contradictions, missing
sources, ambiguous acceptance behavior, trace gaps, and untestable SRs. Present
the plain-language brief and recommendation.

If the authorized human approves, record their actual identity, role, scope,
and USER:<date>:<summary> in the Delivery System and epic. Pull/apply or sync so
both representations agree. Otherwise record requested changes/blocker and do
not issue an implementation kickoff.
```

## 3. Execute one development-loop slice

```text
Read the project AGENTS.md, req-driven-dev/AGENTS.md, V-model-loop.md,
delivery-system.md, the active epic/spec/task, and relevant product/code/test
sources. Converge state and confirm specification approval.

Select exactly one READY trace:
UR -> EPIC -> SCN -> SR -> TASK.

1. Run or create the SCN's upper BDD/E2E test and record the expected RED.
2. Create the TASK/SR focused lower test and record the expected RED.
3. Implement the smallest vertical change that makes the lower test pass.
4. Run focused and proportional regression/contract/architecture gates.
5. Record lower evidence and move only proven TASK/SR items to LOWER_VERIFIED.
6. Run upper validation; for UI work use the live stack and inspect a screenshot.
7. Record passing upper evidence and move only proven SCNs to UPPER_VALIDATED.
8. Capture discoveries/deferrals/conflicts without silently expanding scope.
9. Update the full local trace, validate projections, preview sync, sync, and
   report evidence pinned to the current revision.
10. Stop at IN_REVIEW when completion approval is still pending.

Report RED and GREEN commands/results, code/test refs, status changes, sync
result, gaps, and the next READY item.
```

## 4. Triage and replan

```text
Read the project AGENTS.md, req-driven-dev/AGENTS.md, V-model-loop.md, backlog,
active release, requirements, epics, open gates, and Delivery System state.
This is planning work; do not implement product code.

For every backlog/discovery item:
- route clear behavior to a sourced PROPOSED UR/SR;
- route ambiguity or authority needs to a gate and BLOCKED trace;
- route future work to DEFERRED with reason/owner/target;
- route contradictions to a conflict;
- mark removed behavior OBSOLETE with replacement.

Reconcile product docs, requirement state, epics, release scope, and generated
rollups. Promote to READY only when the entry gate is proven. Sync and report
routed items, state changes, remaining human decisions, and next READY traces.
```

## 5. Evidence and completion review

```text
Read the project AGENTS.md, req-driven-dev/AGENTS.md, V-model-loop.md,
delivery-system.md, active epic/spec/tasks, current code/tests/PR, and Delivery
System state.

Treat completion as unproven. For every explicit UR, SCN, SR, TASK, gate, and
Definition-of-Done item, identify authoritative evidence and inspect its current
state. Classify each as proven, contradicted, incomplete, indirect, or missing.
Confirm RED-before-GREEN, runtime/browser proof, evidence SHA/drift, human
approval, source-repository delivery, release scope, and local/server
reconciliation.

If all checks pass, present the completion brief and request/record authorized
human approval. Mark DONE/VALIDATED only after delivery and synchronization.
Otherwise leave the strongest honest status and list exact missing evidence.
```

## 6. Integrate user feedback

```text
Read the project and shared instructions. Treat this input as a source, not an
automatic implementation order:

<feedback>

Find affected UR/SCN/SR/TASK traces and current behavior. Classify as defect,
new outcome, change request, decision, or ambiguity. Record a sourced proposed
change or gate, identify acceptance/evidence impact, and determine epic vs fast
lane. Do not silently change approved scope. Sync the proposal and report the
human decision needed or the next planning step.
```
