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

1. Treat completion as unproven. Audit every scoped requirement clause,
   acceptance scenario, declared relation, gate, evidence result, and
   completion condition against direct current sources.
   Use `rdd-audit` on the candidate records, citations, and affected inventories
   during this pre-delivery audit; its findings must be routed before integration.
2. Stop for any `DERIVED` dependency, candidate link counted as authoritative,
   stale or inherited-unverified required evidence, missing retained RED, material
   cold-review finding, undisclosed gap, or incomplete reconciliation.
3. Invoke `skills/rdd-engineering-check/SKILL.md` with target `CANDIDATE`
   against the completed pre-delivery code. Do not integrate unless the complete
   applicable active EC set has a current engineering trace `PASS`.
   On an in-scope implementation/test failure, record the correction and reopen
   affected reviewed items per `PROCESS.md`. Hand product implementation changes
   to `rdd-build` under an approved SR, and test-only corrections to `rdd-verify`,
   including UR-owned acceptance tests with no required SR. Do not fabricate an
   SR for a test correction; a product change without approved SR scope replans.
   Changed scope/policy goes through triage to planning. Do not manufacture
   an evidence invalidation merely to make a correction eligible.
4. If the pre-delivery audit and candidate engineering check pass, deliver
   through the project's authorized integration path while keeping awaiting
   entities `IN_REVIEW`.
5. Re-run or confirm passing/regression evidence against the delivered revision;
   reassess historical RED for retention, without rerunning it on delivered
   code. Reconcile authoritative records and derived views. Use
   `skills/rdd-audit/SKILL.md` to
   verify that delivered records, citations, and documents still describe the
   code; a finding it surfaces is a stop condition or routes through
   `rdd-triage`, never a silent correction.
6. Invoke `skills/rdd-engineering-check/SKILL.md` with target `DELIVERED` and
   rerun or confirm the candidate checks against the delivered fingerprint.
   Record a separate delivered engineering result and stop unless it is current
   and `PASS`. Route a failure through the same correction/planning decision;
   a delivered failure requires a corrective delivery, not completion approval.
7. Record completion trace `PASS` only for the exact eligible fingerprint. Only
   then make the scoped human completion gate `OPEN` and present its brief.
8. Do not answer the gate for the human. If the authorized human answers,
   record the real actor, role, exact scope, answer, and `USER:` source.
9. Apply `DONE` only to accepted named entities that independently satisfy the
   complete applicable predicate. Apply member requirements before a named
   epic. Route rejection or requested changes through `rdd-triage` to the
   earliest invalidated phase.

## Report

Report proven, contradicted, incomplete, indirect, and missing completion
facts; delivered revision; reconciliation result; gate states; applied
transitions; applicable ECs and planning/candidate/delivered engineering
verdicts; and remaining work.

## Execution contract

- Input: a completion-ready selection with `IN_REVIEW`/unchanged `DONE` members,
  role-appropriate evidence, review results, and an authorized integration path.
- Writes: candidate/delivered results, authorized integration, reconciled records,
  completion gates and attributable applications; preserve already-DONE members.
- Exit: accepted named items DONE, an exact OPEN human gate, or correction/plan/
  external hold with affected ids and next action. No integration after a failed
  candidate audit or engineering check.
