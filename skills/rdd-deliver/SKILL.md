---
name: rdd-deliver
description: Drive an Epic or single-SR scope through the complete requirement-driven delivery loop. Use when work is requested end to end rather than as one explicitly bounded process pass. Sequence discovery or confirmation, planning, cold review, human entry, red-first execution or as-built verification, delivery, reconciliation, human completion, and triage until the selected scope is DONE or OBSOLETE, or an exact human or external prerequisite prevents further progress.
---

# Deliver requirement scope end to end

Read the project `AGENTS.md`, canonical `PROCESS.md`
(`.modernpath/rdd/PROCESS.md` in a consuming repository), selected records and
sources, and each focused skill before executing its phase. `PROCESS.md` owns
all semantics; this skill owns phase order and continuation.

## Run the loop

1. Reconcile authoritative state, answered gates, evidence validity, and
   projections. Fix state disagreement before selecting work.
2. Freeze the selected Epic or single-SR scope and find its earliest unmet
   prerequisite. Never start from the most convenient phase.
3. If input is not authoritative or is `DERIVED`, apply `rdd-discover` and its
   confirmation gate. Continue only with confirmed requirements and relations.
4. For items lacking current entry authority, apply `rdd-plan`, independent
   `rdd-cold-review` with its engineering check, then `rdd-entry-review`. Repeat
   from the earliest stale or failed prerequisite until the affected subset has
   current applied approval. New entrants become `TODO`; preserve unchanged
   approved `IN_PROGRESS`, `IN_REVIEW`, and `DONE` items.
5. Run the AI TDD inner loop below. Apply `rdd-build` to changed SRs and
   `rdd-verify` to human-confirmed as-built URs or SRs. Continue until every
   selected requirement satisfies its applicable trace and is `IN_REVIEW` or
   `DONE`. Use the review-correction route for an in-scope failure on reviewed
   work; do not wait for an unmet lower clause when the failure is engineering
   conformance or an upper scenario.
6. Apply `rdd-completion-review` to audit, deliver, recheck the delivered
   revision, reconcile records, run the completion trace gate, and apply the
   human completion answer.
7. Apply `rdd-triage` whenever a discovery, contradiction, requested change,
   or invalidation alters the selected trace. Resume at the earliest phase it
   invalidates.

At an exact `OPEN` human gate, present its brief and wait. If an attributable
answer is already available, apply it and continue. Never infer or supply the
answer.

## Run the AI TDD inner loop

After entry approval, iterate without human input while the approved fingerprint
remains unchanged:

1. Evaluate every selected UR upper trace and SR lower trace. Establish any
   required initial RED observations.
2. Select the next unmet approved SR clause or recorded in-scope correction.
   Reopen affected reviewed items per `PROCESS.md` before edits. Apply
   `rdd-build` or `rdd-verify` until the required traces/checks pass.
3. Rerun affected UR scenarios and update their separate upper evidence.
4. Repeat for any failing or stale approved trace. Do not stop after the first
   GREEN result or completed SR while another selected trace remains unmet.
5. Move eligible requirements to `IN_REVIEW` only after all applicable trace
   gates pass.

If all planned SR lower traces pass while a UR upper trace still fails, diagnose
the mismatch. Continue the loop for an implementation defect within approved
scope. Apply `rdd-triage` and return to planning for a missing or changed
requirement, relation, acceptance rule, or material decision. Record an exact
external blocker when progress cannot continue.

## Continue honestly

- Treat a focused skill's exit as a handoff, not completion of this skill.
- Do not bypass a failed trace gate, a `DERIVED` hold, candidate relation,
  material finding, stale evidence, missing delivery, or failed reconciliation.
- Keep unchanged approved items at their strongest supported state; re-enter
  only the scope invalidated by changed inputs.
- Report `DONE` or `OBSOLETE` as terminal outcomes. Report an open human gate,
  `BLOCKED`, `DEFERRED`, `TODO`, or `IN_REVIEW` item as incomplete with its
  exact resume condition.

## Report

Report the selected scope and fingerprint, completed phases, current lifecycle
states, product/engineering/human gates, evidence and delivered revision,
discoveries, and either the terminal result or the exact next phase and
prerequisite.

## Execution contract

- Input: selected scope, per-item approvals, evidence assessments, review
  findings, and next-action record; mixed states are expected on resume.
- Writes: only the records and implementation authorized by each invoked pass.
- Exit: `DONE`/`OBSOLETE`, or an exact human/external hold. A failed review routes
  to scoped correction or the earliest invalidated planning pass, not an
  unexecutable handoff. Record affected ids, current inputs, and next action.
