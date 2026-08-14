---
name: rdd-verify
description: Verify reverse-engineered PENDING_VERIFICATION requirements against real code and tests, add missing focused tests, and advance only evidence-backed state without bypassing approval or delivery. Use after an RDD reverse-engineering pass or whenever a derived ledger row needs direct current verification. Do not use for new behavior; run the normal red-first build loop instead.
---

# Verify derived behavior

Turn behavior that was described from shipped code into current, direct lower-loop evidence.

Read the repository `AGENTS.md`, `.modernpath/rdd/AGENTS.md`,
`.modernpath/rdd/process/V-model-loop.md`, and
`.modernpath/rdd/process/state-tracking.md` before changing a consuming
repository. The installed process owns status meanings and completion.

## Keep the transition honest

This skill verifies system behavior. It does not grant human approval or prove
delivery.

- Move a verified task or system requirement to `LOWER_VERIFIED`, or to the
  consuming repository's mapped `IN_REVIEW` state when it uses one combined
  work-status column.
- Never move an item to `DONE` from test evidence alone. `DONE` also requires
  the binding approval, authoritative-source delivery, and reconciliation
  conditions.
- If the implementation contradicts the row, record the discovery and route a
  separate red-first change. Do not silently change behavior during a
  verification pass.

## Establish the evidence bar

For each row, require all of the following:

1. Resolve its source, code, and test citations.
2. Split the statement and acceptance criteria into behavioral clauses.
3. Name an assertion that would fail if each clause regressed.
4. Confirm the test exercises the real subject rather than a mock that returns
   the expected answer.
5. Open and read the exact test and its assertions.
6. Run the exact test and confirm from verbose output or runner enumeration
   that it executed.
7. Observe the expected failure before the passing result. For already-shipped
   behavior, use a safe local mutation or equivalent targeted failure, restore
   it immediately, and inspect the diff before continuing.
8. Run proportional regression gates and record evidence against the current
   revision.
9. Cite evidence by stable test path and name, for example
   `TEST:path/to/file:TestName/Subtest`, plus the observed `RUN:` command and
   result. Treat line numbers as optional, unstable navigation hints.

A green suite is not evidence for every clause in a sentence. Underline every
verb and every "and"; a clause without a corresponding failure-producing
assertion remains unverified.

## Work one row at a time

1. Read the row, its acceptance criteria, and every cited source.
2. Search for an existing test by behavior and assertion, not just filename.
3. If a sufficient test exists, run it and demonstrate its relevant failure
   mode. Otherwise, add the smallest focused regression test.
4. Restore any temporary mutation, run the focused test green, then run the
   required regression gates.
5. Update the ledger row, detail block, totals, linked epic/task evidence, and
   work-list atomically.
6. Advance only the evidence state justified by the run. Leave approval and
   delivery pending until they actually occur.
7. Run the repository process check, commonly `modernpath check`.

## Detect verification traps

- **A filter matched nothing.** A runner can print success after executing zero
  tests. Use verbose output or list/count the selected test cases.
- **The source window hid the answer.** Before reporting a contradiction,
  inspect the complete function and its callers rather than a short excerpt.
- **The new test request is invalid.** Prove the production path was entered
  and inspect what collaborators received before blaming the implementation.
- **The test mocks the subject.** A stubbed service can verify the fixture while
  bypassing the behavior named by the row. Leave the row unverified.
- **An assertion is satisfied by surrounding UI or fixture data.** Ask what
  production regression would make the assertion fail. If none would, replace
  it.
- **A citation moved.** Prefer stable test names over `path:line`; re-check any
  retained line number after editing.
- **The endpoint was contacted with the wrong payload.** Assert the material
  values and protocol fields named by the requirement, not only a path, status,
  or non-empty response.

## Leave honest gaps

Do not weaken a test to promote a row.

- If the row is only a finding, keep or move it to `PROPOSED` and route the
  product decision.
- If the code cannot satisfy the row, record the contradiction and create a
  separate requirement or task for the fix.
- If verification needs unavailable infrastructure, record that exact blocker
  and leave the row `PENDING_VERIFICATION`.
- If only a mocked path is available, record `test run, subject mocked` and
  leave the row unverified.

## Report the pass

Report:

- rows that gained direct evidence and their new evidence/work state;
- rows left unchanged, grouped by reason;
- tests added or reused and confirmation that each relevant failure mode was
  observed before green;
- focused and regression commands run;
- contradictions, discoveries, pending approvals, delivery work, and
  synchronization gaps.

Exit only when every touched row has current direct evidence or an explicit
reason it remains unverified, all temporary mutations are gone, and repository
state passes its deterministic checks.
