---
name: rdd-legacy-closeout
description: Close already-implemented work in a recovered legacy Epic only when the human explicitly invokes this skill for that Epic. Retain historical proof and gaps, verify current behavior and obtain separate completion approval.
---

# Close explicitly selected legacy work

Run only when the human explicitly invokes `rdd-legacy-closeout` for the
selected Epic. Do not select this skill from missing RED, a failed gate, old
code or an ordinary request to finish work. Without that invocation, report
the unmet RED condition and leave normal delivery blocked.

Read `PROCESS.md` §Human-authorized legacy closeout, the project's instructions
and its CLI reference. This isolated workflow covers only already-implemented
recovered scope. It does not change the RED rules of other skills.

1. Read the selected Epic, recovery audit record, exact approved plan,
   requirements, current test definitions and any existing closeout decision.
   Confirm which behavior was already implemented in the recovered scope.
   If recovery is needed, use only the supported operation with the human's
   explicit recovery authorization. Recovery returns the Epic to planning;
   use `rdd-plan`, independent plan review and `rdd-entry-review` to obtain
   fresh implementation approval before recording a closeout exception.
2. Map each criterion proposed for the exception to a criterion in that
   Epic's recovered requirement scope. Explain changed wording or identities
   as the same existing behavior. Exclude new behavior from the exception.
   Inspect available historical reports for actual assertion failures and
   retain their original facts. Zero reports is allowed; record why proof
   is missing and which criteria lack it. Do not invent failures, backdate
   records or present a historical report as a preregistered execution.
3. Present the exact approved scope, mappings, current test definitions,
   optional reports, gaps and reason for the exception to the human. Obtain
   explicit authorization for that scope, or use an authorization already
   supplied for the same content. Approval of implementation or recovery
   alone does not authorize the historical RED exception.
4. Record the decision through the documented CLI operation as the current
   implementation approver. Read back the immutable decision and audit:
   recovery identity, approved plan, test definitions, mappings, retained
   proof, disclosed gaps, authorization source, actor and recording time.
   Reuse an identical applicable decision rather than recording a new one.
   Changed scope or test definitions require renewed authorization; do not
   refresh inputs silently to reuse an earlier answer.

5. Declare the current candidate and register each verification execution
   through the CLI before running it. Execute the owning focused, boundary,
   regression and user-flow checks; finalize each registered run with actual
   criterion/check results, test identities, command, environment and candidate
   revision, then read back. Require current GREEN for every obligation.
   Behavior outside the recorded exception still requires an actual assertion
   failure before implementation and before GREEN registration. A skipped
   test, build error or unrelated failure does not establish that behavior.
6. After evidence is finalized, retain the authoritative review bundle.
   Supply its exact approved content, exception, historical gaps and current
   evidence to a review context independent of the author. Record that
   implementation review with every criterion and obligation covered and
   scope implementation confirmed. Resolve and record material findings.
   Changed content or evidence requires renewed review.
7. Run the existing completion-review gate and resolve its blockers before
   submitting to IN_REVIEW. Run the completion gate there, then retain and
   present the exact completion bundle, including the exception, gaps, current
   evidence and remaining risks. Obtain separate explicit human completion
   approval; invoking this skill or authorizing the exception is not that
   approval.
8. Apply only the actual completion approval with the unchanged retained
   bundle through the CLI. If it changed, present it again before obtaining
   a new answer. Read back DONE, accepted requirement versions, one revision
   increment per requirement, released ownership and attributed audit. A
   failed action must leave the scope unchanged; an exact retry must not
   republish. Merge, deployment and release retain separate human authority.

Keep verification and completion within this skill; do not route an exception
through normal delivery skills. The existing four Epic gates still apply.

If the CLI cannot record or read back the exception, report the tooling gap
and leave the closeout incomplete. Never substitute a status update, direct
transport call or edited process record.
