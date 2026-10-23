---
name: rdd-reverse-engineer-verify
description: Verify reverse-engineered requirements against existing behavior and real test executions before human acceptance. Use when implementation already exists; route missing behavior or tests to normal development.
---

# Verify existing behavior

Read the project's instructions, current process and CLI reference.
Start from an explicit System and user/system requirement IDs. Read their
current content, active acceptance criteria and implementation/test traces.
Acceptance targets are PROPOSED. Existing DONE requirements may support the
trace, but are not accepted again. Verification does not change lifecycle state.

1. Identify what each acceptance criterion requires and where the existing
   implementation supplies it. Preserve the actual requirement, code and test
   identities. A source link or test name alone does not establish correctness.
2. Map every in-scope criterion to meaningful assertions. For a user requirement,
   assess its user-facing scenarios independently of lower-level system tests.
   Include the supporting system requirements actually required by those
   scenarios; do not invent relationships or parents to fill a diagram.
3. Inspect executable assertions and resolve each real test to a native TestCase.
   Reuse the same native UUID when one test supports several requirements or
   criteria. Preserve source-file, repository, runner and exact selector identity;
   titles and filenames alone cannot establish identity. Retain meaningful
   preconditions, ordered steps and expected observations from the inspected test.
4. Before a new non-Epic execution, reserve an empty running evidence run through
   the sanctioned CLI. Retain and read back its server-issued UUID before running
   tests. The authenticated reserving principal alone may finalize or replay that
   run; body-supplied runner fields never establish ownership. If a reservation
   response is lost before retaining its UUID, report the unresolved reservation
   and do not execute under an unknown identity. Epic work uses its existing
   registered-execution protocol and declared criterion/check mappings.
5. Execute the existing tests once and finalize under the retained run UUID.
   Record one EvidenceResult per executed test. Derive criterion coverage from
   its execution-specific criterion/assertion traces; do not store another
   criterion-conclusion result. Keep partial coverage unverified even when its
   supporting test passes. Preserve FAIL, SKIP, ERROR, INCONCLUSIVE, missing,
   running and stale evidence. Record command/report, environment, tested code revision, native
   identities, the executed TestCase definition revision and its complete
   procedure/assertion snapshot in EvidenceResult detail. A later definition edit
   does not rewrite history or make an earlier PASS prove changed assertions.
6. Record confirmed typed TRACEs from TestCase to the requirements and criteria
   it verifies, EvidenceResult relates TestCase for executed identity, and
   EvidenceResult verifies criterion with the assertions and full/partial coverage
   exercised by that execution. Mapping changes must not reinterpret older proof.
   Criterion ownership remains
   its existing requirement/Epic foreign key. Do not create parallel owners,
   duplicate TestCases, duplicate executions, or a second result model.
7. Recover a lost finalization response through scoped readback or exact replay
   under that same run UUID. Changed proof requires a new execution and reservation.
   Historical reconciliation is explicitly selected and additive: attach only
   inspected, unambiguous identities supported by retained actual reports. Keep
   original result UUIDs, conclusions, reports and execution times unchanged.
   Unsnapshotted history cannot be filled from today's edited TestCase. Missing
   per-test observations and ambiguous references remain unresolved.
8. Read back native TestCase, criterion owner, run, EvidenceResult and every
   required TRACE identity through the CLI. Confirm the stored assertions,
   definition snapshots, attribution, revisions, environment and outcomes. A
   file-only link, text reference or passing suite is insufficient. Check current
   applicable observations; never bypass a newer nonpassing or changed-definition
   observation with an old PASS. Report missing relationships explicitly.
9. Report uncovered criteria, failures, skipped checks and uncertainty. If tests
   or behavior need changing, leave the requirements PROPOSED and hand missing
   work to normal planning/build/verification. Do not change product or test code
   during this pass or fabricate RED evidence for existing behavior. Present the
   exact requirement set, derived criterion coverage, actual results, exclusions and remaining risks.
   Report complete verification only after the native chain is read back without
   unresolved required links. Complete evidence is ready for
   rdd-reverse-engineer-accept; it is not human acceptance or a DONE transition.

Record grounded requirements even when tests are missing; verification is a
subsequent requested operation, not a prerequisite for recording. Do not restore
source captures, authorization runs, publication groups, fingerprints, generic
gates or the DERIVED/PENDING_VERIFICATION states for this path.

Use verified capabilities from the current CLI reference. If evidence cannot be
stored or read back, report the tooling gap and retain the actual results as
reviewable evidence without claiming they are persisted. Do not call the gateway
or edit process state as a workaround.
