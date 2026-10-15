---
name: rdd-completion-review
description: Audit, deliver, reconcile, and complete an IN_REVIEW requirement or epic scope. Use after implementation evidence is complete to verify the applicable delivered trace, integrate through the project's authorized path, open the human completion gate only after non-human prerequisites pass, and apply an attributable acceptance answer.
---

# Review and complete delivered work

Read the project `AGENTS.md`, canonical `PROCESS.md`
(`.modernpath/rdd/PROCESS.md` in a consuming repository), every entity
explicitly in scope, current code/tests/change, gate records, authoritative
records, and derived views.

## Procedure

1. Apply `PROCESS.md` §Applicable requirements before evaluating completion.
   Exclude OBSOLETE and DEFERRED requirements from current obligations without
   deleting history or marking postponed work DONE. Preserve live obligations
   in mixed proof; an empty applicable delivery scope creates no acceptance.
   Treat completion as unproven. Audit every applicable requirement clause,
   acceptance scenario, declared relation, gate, evidence result, and
   completion condition against direct current sources. Already DONE members
   are proof dependencies; keep them DONE when their evidence is current and
   exclude them from new acceptance transitions. Obtain an independent code
   review of the built change for Epic scope. For single-SR scope, obtain one
   when required by project gates or requested by the user. For a slice, run
   this audit and one such review once, over the whole change
   (`PROCESS.md` §Slices). Use a context
   independent of implementation; record the reviewer, reviewed revision,
   findings, and verdict separately from planning review. Verify fixes against
   their commits and test evidence.
2. Stop for any `DERIVED` dependency, candidate link counted as authoritative,
   stale or inherited-unverified evidence, missing required RED observation
   (for a fix-first change, the reproduction proof `PROCESS.md` §Project gate
   rules names),
   missing required independent code review, unresolved material finding from
   planning or implementation review, undisclosed gap, or incomplete
   reconciliation.
3. If the pre-delivery audit passes, deliver through the project's authorized
   integration path while keeping awaiting entities `IN_REVIEW`. The path is
   the one `process/integration-path.md` declares: `merge`, the default when
   the file is absent, or `deploy` (`PROCESS.md` §Evidence and completion).
4. Re-run or confirm evidence against the delivered revision — the revision
   the authorized integration path produced, not the branch head that fed
   it; for a slice, its closeout full verification counts when the delivered
   revision contains its tested commit, and otherwise this re-run is the
   slice's one full verification — and reconcile all authoritative records and derived views.
   On `merge`, the delivered revision is the fetched remote default-branch
   tip, and it must contain every requirement's tested commit; the checkout
   need not sit on the tip. On `deploy`, name the deployed commit and record
   a deployment run with the environment and the smoke checks. A requirement
   whose latest evidence is failing, stale, or missing, or whose tested
   commit the delivered revision does not contain, stops completion by name
   before anything is written. After a squash or rebase merge, re-run the
   tests at the merged commit and record that run. Use
   `skills/rdd-audit/SKILL.md` to verify that delivered records, citations,
   and documents still describe the code; a finding it surfaces is a stop
   condition or routes through `rdd-triage`, never a silent correction.
   Then run `rdd-acceptance` for the acceptance test step (`PROCESS.md`
   §Evidence and completion) when the project's gate rules require the guide
   or a tester will check the change. For a slice, a missing, stale, or
   unfinished required guide stops completion here, as does a missing
   current acceptance pass where the tester's sign-off is required; outside a
   slice, a missing or stale guide is disclosed in one line.
5. Record completion trace `PASS` only for the exact eligible fingerprint, and
   before the human gate exists, so the gate names it as its prerequisite. An
   applicable `STALE` member-scoped cold-review trace from an earlier round blocks an
   epic's completion until it is re-evaluated at the current fingerprint; an
   epic-scoped pass does not stand in for it. Only then make the scoped human
   completion gate `OPEN` and present its brief and linked list of relevant
   working-set files before asking for acceptance, following `PROCESS.md` §Gates.
   Link the acceptance test guide and show its results beside the automated
   evidence.
   Small changes may be completed together in one lane-batch gate that lists
   each change with its evidence and review verdict; the human may reject
   single items, which stay `IN_REVIEW`. A slice presents one completion
   brief, carried by each member's completion gate and answered item by
   item.
6. Do not answer the gate for the human. Completion is a person's in both
   shipped gate rules presets; where a project's own rules give the
   `completion` row to the agent, prepare the answer with the disclosure
   `PROCESS.md` §Project gate rules describes, and a scope that touches an
   always-human area is still completed by a person. If the authorized human
   answers, record the real actor, role, exact scope, answer, and `USER:`
   source.
7. Apply `DONE` only to accepted named entities that independently satisfy the
   complete applicable predicate. The answer and its application are separate
   steps: apply member requirements before a named epic, and report an answer
   that is recorded but not yet applied as exactly that, never as completion.
   Route rejection or requested changes through `rdd-triage` to the earliest
   invalidated phase.

## Report

Report proven, contradicted, incomplete, indirect, and missing completion
facts; delivered revision; reconciliation result; gate states; applied
transitions; and remaining work.
