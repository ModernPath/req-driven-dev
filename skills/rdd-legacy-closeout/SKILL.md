---
name: rdd-legacy-closeout
description: Record a human-authorized historical RED exception for already-implemented scope in a recovered legacy Epic, retaining genuine proof and disclosing gaps before normal verification and completion review.
---

# Record a legacy closeout exception

Use this pass for already-implemented work in a recovered legacy Epic.
Read `PROCESS.md` §Human-authorized legacy closeout, the project's instructions
and its CLI reference. Ordinary Epics and new behavior use normal delivery.

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

Hand the recorded exception to `rdd-verify` for complete current GREEN and
normal RED for new behavior, then to `rdd-completion-review` for independent
review and separate human completion approval. The existing four Epic gates
still apply. This pass neither submits nor completes the Epic.

If the CLI cannot record or read back the exception, report the tooling gap
and leave the closeout incomplete. Never substitute a status update, direct
transport call or edited process record.
