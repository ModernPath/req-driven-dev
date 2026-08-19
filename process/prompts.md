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
claim. Do not create implementation work or resolve ambiguity by assumption.

When code, existing SRs, documents, or analysis suggest a requirement that no
human has confirmed, record it as DERIVED. Record proposed links only as
candidate context. Fulfill its candidate statement, sources, ancestry/links,
consequences, and product-language confirmation brief, then record a `PASS` on
the confirmation trace gate before opening or soliciting the human gate. Stop
downstream planning until the attributed answer is applied.

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

Before planning, prove the outcome is confirmed. If it or any ancestor is
DERIVED, complete and report its candidate packet and held links, pass its
confirmation trace gate, then ensure its human gate is `OPEN` before soliciting
it. Stop without making candidate epic membership authoritative or creating or
advancing UR
acceptance content, an SR, test, release commitment, or implementation record.

Derive or update:
- the owning epic as the top-level delivery item;
- sourced URs held by that epic, with actor, intended use, and validation
  method;
- stories/journeys and Given/When/Then acceptance content within each UR;
- thin, testable SRs;
- sourced technical reconnaissance at a named repository revision, covering the
  affected surface, end-to-end control/data path, changed flow hops, boundaries,
  existing patterns, test infrastructure, applicable failure modes, risks, and
  unknowns;
- enriched SR implementation context with expected files/symbols, callers,
  owned flow segment and impact, reuse targets, dependencies, test paths,
  gates, and explicit change boundaries;
- upper-RED and lower-RED strategy;
- decisions, blockers, conflicts, gaps, and deferrals.

Verify generated context against actual DOC:/CODE:/TEST: sources. Publish
proposed state without granting approval. Choose the full specification path or
prove every fast-lane criterion within the owning epic. For the full path,
prepare the specification brief and stop for a cold technical review before the
human entry gate. For either path, evaluate the entry trace gate and require
`PASS` before opening or soliciting the human entry gate. Do not write tests or
implementation until the selected epic and requirements are `TODO`.
```

## 1a. Run a cold technical review

```text
Start from a separate context from the specification authoring conversation.
Read the project AGENTS.md, .modernpath/rdd/AGENTS.md,
.modernpath/rdd/process/V-model-loop.md, the product sources, epic and specs,
technical reconnaissance, enriched SRs, and current repository state at the
recorded revision.

Do not edit implementation or grant approval. Audit:
- trace and requirement-scope alignment;
- completeness of files, symbols, entry points, callers, writers, readers,
  contracts, data flows, and compatibility concerns;
- completeness of the path from trigger through calls, transformations,
  persistence/integrations, side effects, failure propagation, and output;
- reuse of established implementation and test patterns;
- failure behavior, feasibility, dependency ordering, and SR boundaries;
- testability, expected RED reasons, and adequacy of proportional gates;
- unauthorized product, architecture, acceptance, or scope choices.

Record findings as OPEN, RESOLVED, DEFERRED, or REJECTED with severity, direct
source, owner, and disposition evidence. Treat open correctness, security,
data-loss, contract, trace, or testability findings as material blockers. A
material finding may pass only when resolved, rejected with direct evidence, or
removed from current scope by an attributable human decision and routed.
Return a trace-gate `PASS` only when no material finding remains open or
deferred in scope; otherwise return `FAIL`. The author or owning agent resolves
findings and requests a new cold review before the human entry gate.
```

## 2. Review and approve entry

```text
Read the project AGENTS.md, .modernpath/rdd/AGENTS.md,
.modernpath/rdd/process/V-model-loop.md, .modernpath/rdd/process/state-tracking.md, the epic and all
specs, current human gates, and relevant product sources.

Audit every epic and requirement entry trace-gate condition. Lead with
contradictions, missing sources, ambiguous acceptance behavior, trace gaps,
untestable SRs, stale technical reconnaissance, missing SR implementation
context, and cold-review findings.
Reject specification entry when any linked requirement is DERIVED or any trace
link is still candidate context.
Confirm the cold review passed with no material finding open or deferred in
scope and every selected entity satisfies the non-human prerequisites for
`TODO`. Record the entry trace gate `PASS`; only then confirm the scoped human
entry gate is `OPEN`: in a connected workspace the record is committed, synced,
and present in the server gate list; otherwise the gate is repo-borne. Present
the plain-language brief, exact epic/requirement scope, and recommendation.

If the authorized human approves, record their actual identity, role, scope,
and USER:<date>:<summary>; move each named `PROPOSED` or
`PENDING_VERIFICATION` requirement and any proposed epic to TODO, then
reconcile the answer according to state-tracking.md. Otherwise record requested
changes/blocker and do not issue an implementation kickoff.
```

## 3. Execute one development-loop slice

```text
Read the project AGENTS.md, .modernpath/rdd/AGENTS.md,
.modernpath/rdd/process/V-model-loop.md, .modernpath/rdd/process/state-tracking.md, the active
epic/spec/SR, and relevant product/code/test sources. Converge state and
confirm every selected epic and requirement is TODO from attributable human
entry approval. Full-path work also requires specification approval; fast-lane
work requires every fast-lane criterion but cannot substitute those criteria
for entry approval. Refresh the SR context from the reconnaissance and current
repository; if material drift changes the affected surface, stop and repeat
reconnaissance, cold review, and entry approval before implementation.

Confirm every requirement in the trace is human-confirmed. If any item is
DERIVED or any link is candidate-only, stop at its confirmation gate; do not
write or run the RED test for that trace.

Select exactly one TODO requirement path:
EPIC -> UR -> SR.
Maintain its full trace as work proceeds:
EPIC -> UR -> SR -> CODE -> TEST_CASE -> TEST_RESULT.

0. Work on a feature branch, never on the default branch's working tree.
   Commit at the loop's waypoints — specification, observed RED, GREEN,
   cleanup, reconciliation — running the project's process checks before each
   commit.
1. Run or create the UR acceptance scenario's upper BDD/E2E test and record the
   expected RED.
2. Create the SR's focused lower test and record the expected RED.
3. Implement the smallest vertical change that makes the lower test pass.
4. Run the focused test to establish GREEN.
5. Inspect the SR diff and perform behavior-preserving boy-scout cleanup only
   in touched or directly adjacent code needed by this requirement. Do not add
   behavior, change contracts/architecture, or absorb broader debt. Record the
   bounded cleanup or an explicit no-op; route wider debt as a discovery.
   Do not weaken tests or acceptance evidence during cleanup.
6. Run focused and proportional regression/contract/architecture gates against
   the final post-cleanup diff.
7. Record lower evidence and move an SR requirement to IN_REVIEW only when all
   of its lower evidence is complete.
8. Run upper validation; for UI work use the live stack and inspect a screenshot.
9. Record passing upper evidence against the UR acceptance content and epic
   upper-loop status.
10. Capture discoveries/deferrals/conflicts without silently expanding scope.
11. Update the full trace and reconcile its pre-delivery state according to
    state-tracking.md.
12. Stop at IN_REVIEW. Do not solicit completion approval before authoritative
    delivery and final reconciliation.

Report reconnaissance/context revision, cold-review verdict, RED and GREEN
commands/results, cleanup change or no-op, post-cleanup gates, code/test refs,
status changes, state reconciliation, gaps, and the next TODO item.
```

## 4. Triage and replan

```text
Read the project AGENTS.md, .modernpath/rdd/AGENTS.md,
.modernpath/rdd/process/V-model-loop.md, backlog, active release, requirements, epics, open
gates, and .modernpath/rdd/process/state-tracking.md.
This is planning work; do not implement product code.

For every backlog/discovery item:
- route a possible requirement inferred without human confirmation to DERIVED,
  record candidate links, and emit its confirmation gate;
- route clear behavior with an authoritative source to a sourced PROPOSED UR/SR;
- route ambiguity or authority needs to a gate and BLOCKED trace;
- route future work to DEFERRED with reason/owner/target;
- route contradictions to a conflict;
- mark removed behavior OBSOLETE with replacement.

Reconcile product docs, requirement state, epics, release scope, and generated
rollups. Promote to TODO only when the entry gate is proven. Reconcile state
per state-tracking.md and report routed items, changes, remaining human
decisions, and next TODO traces.
```

## 5. Deliver, reconcile, and review completion

```text
Read the project AGENTS.md, .modernpath/rdd/AGENTS.md,
.modernpath/rdd/process/V-model-loop.md, .modernpath/rdd/process/state-tracking.md, active
epic/spec/SRs, current code/tests/PR, and current working records/projections.

Treat completion as unproven. For every explicit EPIC, UR, UR acceptance
scenario, SR, gate, and Definition-of-Done item, identify authoritative
evidence and inspect its current state. Classify each as proven, contradicted,
incomplete, indirect, or missing.
Treat a DERIVED requirement or candidate trace link as a hard stop: it cannot
support readiness, verification, validation, completion, or delivery claims.
Confirm technical-reconnaissance freshness, enriched SR context, cold-review
dispositions, RED-before-GREEN, requirement-scoped cleanup, post-cleanup gates,
runtime/browser proof, evidence SHA/drift, entry approval, release scope, and
delivery readiness. Treat evidence carried
across a revert, an abandoned branch, or a closed unmerged PR as unverified
unless it was re-verified at the current revision or is explicitly marked
inherited.

If the pre-delivery audit passes, deliver through the project's normal
authorized integration path while keeping the epic and requirements IN_REVIEW.
Reconcile all repository records and projections, verify evidence against the
delivered revision, and audit the complete trace again. Only when every
non-human completion prerequisite is fulfilled, record the completion trace
gate `PASS`. Only then may the completion human gate become `OPEN` and the brief
be presented.

If the authorized human accepts the delivered result, record their actual
identity, role, exact epic/requirement scope, and USER:<date>:<summary>. Move
the named requirements and their epic to DONE in the same
reconciliation change. Otherwise leave the strongest honest non-final status
and list the exact missing evidence or requested change.
```

## 6. Integrate user feedback

```text
Read the project and shared instructions. Treat this input as a source, not an
automatic implementation order:

<feedback>

Find affected EPIC/UR/SR traces, UR acceptance content, and current
behavior. Classify as defect, new outcome, change request, decision, or
ambiguity. Record a sourced proposed change or gate, identify
acceptance/evidence and technical-reconnaissance impact, and choose the full
specification path or the fast lane within the owning epic. Mark affected cold
review and SR context stale when the technical surface changes. Do not
silently change approved scope. Reconcile the proposal according to
state-tracking.md and report the human decision needed or next planning step.

If the feedback confirms, corrects, or rejects a DERIVED requirement, treat it
as the gate answer only through the connected or repo-borne answer path. Record
the real USER source, apply the defined DERIVED transition, retire candidate
links that were rejected or replaced, and re-plan the surviving links before
they become authoritative.
```
