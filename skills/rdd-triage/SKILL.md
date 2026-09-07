---
name: rdd-triage
description: Classify and route backlog discoveries, implementation findings, and user feedback without implementing them. Use to reconcile requirement state, optional epic scope, release selection, conflicts, DERIVED candidates, deferrals, blockers, or changed acceptance. Produce routed records, identify the earliest invalidated process phase, and name the skill that resumes the loop.
---

# Triage and replan

Read the project `AGENTS.md`, canonical `PROCESS.md`
(`.modernpath/rdd/PROCESS.md` in a consuming repository), backlog, requirement
records, optional epics, current release, gates, evidence, and affected product
sources. Treat user feedback as a source, not an automatic implementation
order.

## Procedure

1. Identify affected requirements, optional epic memberships, acceptance
   content, code, evidence, and approvals.
2. Route an inferred possible requirement to `DERIVED` with candidate links and
   a confirmation gate. Route directly sourced behavior to a `PROPOSED` UR or
   SR.
3. Route missing human authority or ambiguity to a decision gate and apply
   `BLOCKED` only when work cannot proceed honestly.
4. Route known future work to `DEFERRED` with an attributable human source for
   the postponement, capability/specification gaps to gap records, unclear
   ownership to backlog, and contradicted or removed behavior to an explicit
   conflict or `OBSOLETE` decision.
5. Route a proposed architecture, quality, language, service, domain, or code
   rule to a flat `PROPOSED` EC and its activation gate. It remains inactive
   until an attributable human answer is applied.
6. For feedback, identify whether the correction affects product implementation
   or only already-approved tests. Within current approval, record its boundary
   and required reruns and apply the scoped corrective demotion. Route test-only
   corrections to `rdd-verify` under their UR/SR owner, even when a UR has no
   required SR; route product implementation changes to `rdd-build` under an
   approved SR. Otherwise route changed scope or missing SR authority to planning.
7. Re-evaluate stale gates and evidence, then reconcile authoritative records,
   release scope, work selection, and derived views. Never promote to `TODO`
   without the strict entry gate.

Do not change product code in this pass.

## Report

Report each routed item, attributable source, changed state, stale evidence or
gates, remaining human decisions, and the exact focused skill that resumes the
loop.

## Execution contract

- Input: sourced discovery or feedback and affected state at any lifecycle point.
- Writes: routed candidates, decisions, findings, holds with per-item suspended-
  from state, justified demotions, and reconciled next-action records; no code.
- Exit: exact affected scope and next skill, or an attributable decision/external
  hold. Releasing a hold reassesses evidence; it does not blindly restore status.
