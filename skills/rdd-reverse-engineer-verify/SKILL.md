---
name: rdd-reverse-engineer-verify
description: Verify existing reverse-engineered PENDING_VERIFICATION requirements against exact captured sources, complete semantic assertions, genuine test execution and repository integration proof. Use for an as-built baseline before human acceptance; does not implement missing behavior or approve requirements.
---

# Verify an existing baseline

Read PROCESS.md's "As-built verification and acceptance" and the consuming project's sanctioned CLI procedure. Keep the exact requested UR/SR scope; a standalone SR needs no invented parent or Epic. Check current PENDING_VERIFICATION state and persisted baseline provenance. DERIVED proposals require their own confirmation first. Reopened development work uses the normal development skills.

1. Read the current requirement and every active criterion. For each UR, include every required confirmed SR and evaluate the UR's own upper scenarios independently. Record an explicit denominator and omissions.
2. Resolve captured code and test citations against their exact IDs, revisions and hashes. Read the actual bytes through the supported source reader. Inspect the production subject and test assertions: a test name, citation, aggregate CI badge, self-generated assertion or test that never exercises the behavior is insufficient. Bind the exact executed test name to its registered TestCase or test citation
   `test_case_ref` on the captured file; an unrelated passing test in the same
   file is insufficient. Update missing citation identities through sanctioned
   fingerprinted authoring, then refresh the packet. Map every applicable criterion to an assertion that checks its expected behavior and the production subject it executes.
3. Run the existing tests against the exact captured revision, or inspect a genuine retained current execution report. Record command, environment, named executed test outcomes, and exact source/test/report identities. For CI, preserve provider, repository, run, job, attempt and tested commit. Record the per-clause results through the existing evidence store, LOWER for SRs and UPPER for URs. Never relabel an unexecuted test as passing, fabricate historical RED, or reuse an SR pass as UR proof.
4. Obtain a separate retained integration observation for every repository using the supported delivery collector. It must fetch the remote default branch, observe the tested clean revision at its tip, and match the captured snapshot. Passing branch tests alone do not establish delivery. Delivery means repository integration; it makes no deployment claim.
5. Preview the exact typed proof. Resolve missing, contradictory, stale, revoked or inaccessible evidence as gaps. Adding tests or changing behavior needs an explicitly scoped handoff to normal planning/build/verify. This skill changes no product or test code.
6. Retain the input and returned proof digest, complete coverage, source/execution/CI/integration identities and disclosed limits. Hand off an eligible exact packet to rdd-reverse-engineer-accept. Preview alone changes no lifecycle or compliance state.

Report eligible versus incomplete proof, all denominators/gaps and what evidence remains. Verification is not acceptance. If the installed CLI lacks a required operation, file the tooling gap through the sanctioned channel; do not call the API or edit the store directly.
