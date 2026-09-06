# Lifecycle forward-test scenarios

These fixtures exercise instructions, not a production state-store engine.
Use a fresh reviewer context with `PROCESS.md`, the affected skills and canonical
record shapes. Give it the initial facts and event first, then compare its
derived next actions to the expectations below. Do not supply prior review
conclusions as evidence. Live stores, integration and human answers are simulated.

For every scenario, record the next legal skill/action, changed records,
preserved approvals, evidence assessments, stale gates, and exact stop condition.
A path that needs an invented transition, invented human answer, or omitted
check fails. Frontmatter and text-matching checks do not evaluate these cases.

## New behavior, retained RED, and delivery

Initial facts: SR-S and linked UR-U have current applied entry approval and
status TODO. Their lower/upper expected failures were observed at revision R0.
Both traces pass after implementation and cleanup at R1. Candidate engineering
passes. Integration produces R2 with equivalent relevant code/configuration and
environment, confirmed with direct evidence.

Event: Continue delivery through the human completion gate.

Expected: Separate immutable RED and passing/regression results retain their
actual fingerprints. RED is assessed RETAINED; passing evidence is CURRENT at
R1, then confirmed or rerun for R2 with an append-only assessment. Planning and
entry remain valid for approved implementation. Candidate engineering precedes
integration, a separate delivered result follows, and human completion opens
only after reconciliation and delivered predicates pass. No DONE before the
attributable answer is applied.

Negative variation: The assertions or approved clause materially change. Old
RED is not automatically reusable; reassess its relevance and establish new
RED when it no longer demonstrates the target. Changed approved scope replans.

## As-built sensitivity mutation

Initial facts: A confirmed as-built SR has entered TODO with current approval.
Its real subject is reachable with production-valid inputs. A safe temporary
mutation produces the expected failure; the original implementation is restored.

Event: Record evidence and continue verification.

Expected: Record SENSITIVITY_RED with tested mutation fingerprint, failure cause,
original/restored fingerprints and restoration proof. Assess it RETAINED rather
than INVALID merely because the mutation is gone. Run the restored subject and
regression gates; advance through the normal automatic states, then hand off to
completion. No claim that the mutation was delivered.

Negative variation: Restoration is unproven, or the test invokes an input that
cannot reach the subject in production. Evidence remains invalid/unverified and
cannot advance review readiness.

## Mixed-state Epic resume

Initial facts: Selected Epic E contains SR-A DONE, SR-B IN_REVIEW, and SR-C TODO.
A and B have unchanged current approvals and supporting evidence. C's required
entry approval is applied. The selection and declared dependencies are unchanged.

Event: Resume end-to-end delivery.

Expected: Route C to its unmet execution prerequisite. Do not reset A/B, repeat
their entry answers, or wait for the whole Epic to become TODO. Readiness accepts
members IN_REVIEW or DONE with their applicable traces. Completion transitions
name only eligible unfinished items; A is a satisfied dependency.

Negative variation: C changes an approved shared contract on which A depends.
Invalidate only the affected scope and dependent evidence/approvals, including A
where the declared dependency actually makes it affected.

## Candidate engineering correction

Initial facts: SR-S is IN_REVIEW; all behavioral evidence passes. An active EC
requires a naming convention. Candidate engineering finds a nonconforming name.
The correction is behavior-preserving and within current scope and decisions.

Event: Continue from failed candidate engineering.

Expected: Do not integrate. Record the direct finding, correction boundary,
unchanged entry authority, affected item ids and reruns. Apply the corrective
demotion to IN_PROGRESS. Build uses the finding as its target without inventing
behavioral requirements or artificial RED. Preserve retained RED, rerun affected
behavioral/regression evidence and candidate engineering after the correction,
then return to completion. Unchanged planning/cold/entry authority is preserved.

Negative variation: Correcting the finding requires a new architecture decision
or expands EC applicability. Route to planning and the exact human decision;
the in-scope correction route cannot authorize the expansion.

## Upper failure after all lower traces pass

Initial facts: All planned SR lower traces pass and SRs are IN_REVIEW. UR-U's
upper scenario fails due to an implementation defect in SR-S within current
approval; other SRs are unaffected.

Event: Continue the inner loop.

Expected: Record the upper failure and reopen S with its dependent items as
needed. Reproduce the approved failure, correct S, and rerun lower/regression
and upper evidence. Do not require a new unrelated lower clause or demote every
SR. Move U to IN_REVIEW only after its upper evidence and required-SR predicates
pass. A defect discovered in `rdd-verify` uses triage to this same route, not
mandatory replanning when existing authority already covers the correction.

## Review-output fingerprint stability

Initial facts: Planning snapshot P has a current planning-engineering PASS. A
fresh independent reviewer checks P and produces findings, dispositions and a
cold-review verdict without altering planned inputs.

Event: Attach the review output and evaluate entry.

Expected: P and its engineering result remain current. Cold review references P
and its engineering prerequisite. Entry references those prerequisite results
and their dispositions, excluding its own answer/application. The reviewer
context and inspected revision are recorded.

Negative variations: Editing the plan stales dependent reviews. Replacing a
prerequisite review result stales entry. Loading cold-review instructions in the
author's existing context does not satisfy reviewer independence.

## Answered release selection on startup

Initial facts: The store binding is correct and reachable. Registry revision V0
has no active release. A human release-selection gate is ANSWERED, its V0 input
and prerequisite trace remain applicable, and consequences have not been applied.

Event: Start or resume a session.

Expected: Validate and apply the recorded answer before requiring one active
release, reconcile consequences, close the applied gate, then enforce the
single-active-release invariant and select work. The next startup does not
apply the answer twice or ask the same question again.

Negative variation: The answer's input is stale. Do not apply it or infer a
replacement decision; report the successor-gate requirement before selection.

## Adoption campaign resume

Initial facts: Campaign X records context A as handed off with confirmed
requirements. Context B is uncovered. Context C is partially observed with
stable candidate ids and an open confirmation gate. The campaign is authorized.

Event: Resume X in a new session.

Expected: Existing records do not fail the empty-corpus guard. Preserve A's
confirmed statements and answers. Continue B or the recorded next partial
context; reconcile C by id without duplicate candidates. Record original and
current inspected revisions, per-context progress, remaining observations and
next action. Candidate coverage is not authoritative delivery readiness.

Negative variations: An unrelated established corpus has no bounded-adoption
authorization; use discovery/planning. Revision drift affecting an existing
observation requires rechecking it and routing conflicts with confirmed content.

## Hold and partial invalidation

Initial facts: Epic E is held, with A previously IN_REVIEW and B previously
IN_PROGRESS. Each item's hold row records its suspended-from state and evidence
basis. A's required passing evidence becomes stale during the hold.

Event: The external impediment clears.

Expected: Preserve each prior-state record, reassess current approvals/evidence,
and append release facts. A resumes IN_PROGRESS while B keeps its supported
progress. Other unaffected members are not reset. No blind restoration of A to
IN_REVIEW and no loss of the reason it was previously eligible.

## Prospective EC activation and delivered failures

Initial facts: Scope A was DONE before a new EC's effective point; B is a
nonterminal selection whose resolved applicability now includes that EC.

Event: Apply the attributable EC activation decision.

Expected: Replan B and stale its dependent engineering/cold/entry results. Do
not reopen A unless the activation decision explicitly names remediation.

Separate event: A delivered revision fails an EC that already applied to that
delivery. Record the failure and prevent completion. Use the correction or
planning route according to scope, deliver the correction, and recheck the new
target. If previously DONE work was proven defective, a successor human
completion gate is needed after correction; acceptance is not reused at a new
delivered fingerprint.
