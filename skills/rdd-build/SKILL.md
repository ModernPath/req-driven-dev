---
name: rdd-build
description: Build or correct one approved SR through current evidence and IN_REVIEW. Use after entry for changed behavior or an in-scope review/engineering failure, reopening reviewed work through the canonical correction route. Repeat focused RED/GREEN, cleanup, and separate upper validation as appropriate. Use rdd-verify for confirmed as-built evidence work.
---

# Build one SR slice

Read the project `AGENTS.md`, canonical `PROCESS.md`
(`.modernpath/rdd/PROCESS.md` in a consuming repository), selected SR,
applicable UR acceptance content, optional epic, technical reconnaissance,
code, tests, and current records.

## Procedure

1. Orient and select exactly one approved `TODO` or `IN_PROGRESS` SR with
   current planning and no active hold. For a reviewed item, first record and
   apply the scoped review-correction demotion in `PROCESS.md`, including the
   unchanged approval and required reruns. Work on a reviewable feature branch
   and preserve unrelated changes.
2. Before its first implementation iteration, establish every selected affected
   UR's upper RED for the expected reason unless admissible retained RED already
   covers the unchanged scenario/assertions. Keep that evidence on the UR.
3. Select one unmet approved SR clause, establish its focused lower RED for the
   expected reason, and link the stable test identity to the clause. For a
   behavioral review defect, reproduce the approved lower or upper failure.
   For a behavior-preserving engineering correction, select the recorded EC or
   review finding instead; preserve retained RED and do not invent a clause.
4. Implement the smallest behavior that makes the focused evidence pass.
   Capture discoveries instead of silently expanding scope.
5. Perform requirement-scoped cleanup or record a no-op. Return to RED if the
   cleanup exposes a correctness change.
6. Run focused and proportional post-cleanup gates and record current SR lower
   evidence. Separately rerun affected UR scenarios and update their upper
   evidence, including live-browser and screenshot evidence for UI behavior.
7. Re-evaluate the selected SR clauses and affected UR scenarios. Repeat from
   step 3 while an unmet result is caused by approved behavior in this SR.
   Rerun the failed engineering/review check and resolve its finding before
   closing a correction; candidate checks evaluate the final corrected code.
8. Move the SR to `IN_REVIEW` when its lower trace passes and its corrective
   findings are resolved by the required rechecks. An affected UR moves
   to `IN_REVIEW` only when its upper trace passes and every required SR is
   `IN_REVIEW` or `DONE`, with any UR-owned corrective rechecks also passing.
9. Reconcile the affected graph and derived views. Return remaining approved
   trace failures to `rdd-deliver` for another AI iteration. Hand fully eligible
   `IN_REVIEW` scope to `rdd-completion-review`; do not deliver or solicit
   completion here.

Do not ask for human input inside the loop. Return to planning only when drift
creates a new product, scope, architecture, acceptance, priority, release,
workflow, or material technical decision. Record an external blocker exactly.

## Report

Report the planning revision, RED and passing observations, code and test
references, cleanup, final gates, status changes, discoveries, gaps, and the
exact next skill or hold.

## Execution contract

- Input: one SR with current entry authority, no hold, and an unmet approved
  clause or sourced correction; reviewed work is reopened before edits.
- Writes: scoped code/tests, immutable run observations and assessments,
  correction results, automatic transitions, and affected graph/next action.
- Exit: eligible `IN_REVIEW` work to completion, another approved correction,
  or a precise changed-scope/human/external prerequisite. Never integrate here.
