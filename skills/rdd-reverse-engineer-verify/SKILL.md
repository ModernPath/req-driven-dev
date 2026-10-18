---
name: rdd-reverse-engineer-verify
description: Review existing source-scoped baseline behavior using captured source, semantic assertions, genuine test execution and repository integration evidence. Use as evidence input to ordinary Epic completion review; missing behavior requires normal development.
---

# Verify existing baseline behavior

## Purpose

Inspect actual evidence for published PENDING_VERIFICATION baseline
requirements. This pass changes no product/test code, requirement content,
lifecycle, or compliance approval. It does not fabricate RED or PASS and does
not create an acceptance decision. Its findings support the ordinary
`rdd-verify` and `rdd-completion-review` process for a selected Epic.

## Inputs

Read the project `AGENTS.md`, canonical `PROCESS.md`, and the project's
sanctioned process interface instructions. In ModernPath, use the installed
`mp-process-cli` skill and `.modernpath/cli-reference.md`.

Read the authoritative requirement and Epic records. Identify requirements by
native UUID and full kind. Confirm that selected baseline requirements are in
PENDING_VERIFICATION and have baseline provenance. Read their active criteria,
typed Traces, native source/run identities, and actual captured source bytes.
Include every required SR serving a selected UR. Do not invent parent
relationships or include a DERIVED proposal as an established baseline.

This review contributes evidence to an Epic's completion; it does not bypass
Epic scope, saved-plan approval, ownership, or the normal lifecycle. If there
is no Epic that can legitimately contain the work, report the process gap for
normal planning rather than inventing a direct-to-DONE path.

## Evidence review

1. **Set the denominator.** Inspect every active criterion on each selected
   UR and SR. Evaluate a UR's upper scenarios independently from its lower SR
   evidence. List omissions and unsupported criteria.
2. **Check semantic assertions.** Read captured code and tests at their actual
   SourceFile UUIDs, paths, revisions, and bytes. Map each criterion to the
   production behavior and meaningful assertion that exercises it. A test
   name, badge, adjacent passing test, or source link without an assertion is
   insufficient. Treat capture SHA-256 values as byte-integrity checks only;
   they do not authorize or approve content.
3. **Check execution.** Run only through the project's authorized test path or
   inspect a genuine retained result. Record the command, environment, tested
   revision, named outcomes, and report identity. Distinguish lower SR evidence
   from upper UR evidence; an SR pass does not prove its UR. Do not call an
   unexecuted reference a pass.
4. **Check integration where required.** For each repository, inspect genuine
   evidence that the tested clean revision is integrated at the remote default
   branch. Record the observed remote and any limits of the evidence. Passing
   branch tests alone do not prove integration, and integration is not a
   deployment claim.
5. **Report findings.** For each native requirement UUID and kind, state
   criterion coverage, exact supporting Traces and captures, execution and
   integration evidence, and gaps. Stale, contradictory, inaccessible, or
   revoked evidence remains a gap. Do not edit records to make evidence fit.

## Handoff

Return evidence findings to the normal Epic completion review. An incomplete
criterion, missing test, or changed behavior is a development gap for normal
scoped planning/build/verification. Only the ordinary human Epic completion
approval changes lifecycle and publishes completion history. If the process
interface lacks a needed read or write, report that tooling gap through the
sanctioned channel; do not call the API or edit process state directly.
