---
name: rdd-cold-review
description: Independently audit a requirement planning packet before implementation entry. Use after technical reconnaissance and SR enrichment to review trace and scope alignment, affected code and data flow, contracts, failure behavior, feasibility, boundaries, and test strategy from a context separate from plan authoring. Produces technical findings and a trace-gate verdict; never grants human approval.
---

# Run a cold technical review

Start from a context independent of the planning-authoring conversation. Read
the project `AGENTS.md`, canonical `PROCESS.md` (`.modernpath/rdd/PROCESS.md`
in a consuming repository), versioned product sources, selected requirements,
optional epic/specifications, technical reconnaissance, and repository state at
the recorded revision.

The independent context is a recorded fact of the verdict, not a claim: the
verdict is recorded from that context, and a verdict recorded from the
authoring context is not a cold review. Run as a delegated pass, this skill
returns its findings and verdict and writes nothing to the store; the
orchestrating session records them (`PROCESS.md` §Delegated passes). The
review audits the change the packet proposes, not the packet as a document.

## Procedure

1. Audit the authoritative graph and selected scope without relying on
   unstated author reasoning.
2. Verify the affected repositories, files, symbols, entry points, callers,
   writers, readers, and every changed control/data-flow hop. Where the packet
   carries a state inventory, enumerate it: attack each cell and each
   transition between concurrent writers in both directions, and file a row
   the change touches that the inventory lacks. Where the change touches
   state and the packet carries no inventory, that absence is the first
   material finding.
3. Examine contracts, schemas, compatibility, persistence, integrations,
   failure propagation, retries, concurrency, security, and operational risks
   where applicable.
4. Assess feasibility, dependency order, SR boundaries, reuse of established
   patterns, testability, expected RED reasons, and proportional gates.
5. Identify any product, architecture, acceptance, or scope choice that lacks
   human authority.
6. Record each finding with severity, direct source, owner, and disposition as
   `OPEN`, `RESOLVED`, `DEFERRED`, or `REJECTED`. A `RESOLVED` closure carried
   from an earlier round is a claim: verify it against the current packet and
   code before accepting it. A finding that would change a human decision is a
   question for that human, never a packet edit. A `RESOLVED` disposition
   names its kind — packet edit, scope action with its record, or decision
   with its `USER:` source — and a packet edit only clarifies what the change
   already contained: a resolution that adds an acceptance criterion, widens
   a boundary, or adds a flow hop is a scope question returned to `rdd-plan`,
   never a resolution.
7. Grade materiality by what the finding would change. A finding about the
   packet's wording, counts, or citations that alters none of the code, tests,
   interfaces, or risks is a note and never blocks; traceability is material
   only when a builder or a gate would act on the wrong citation
   (`PROCESS.md` §Planning and readiness).
8. Bound the rounds: at most two on one change. On a second round whose new
   blocking findings are about the packet rather than the change, return
   `FAIL` with the instruction to cut the packet, not to expand it. Do not
   start a third round: stop and hand what is known to a human.
9. Return the cold-review trace gate `PASS` only when the material-finding rule
   in `PROCESS.md` is satisfied. Otherwise return `FAIL` with exact blockers.

Use `skills/rdd-audit/SKILL.md` to resolve the packet's citations and diff its
inventories against the code — scoped to the packet's affected surface. Its
findings enter this review's finding list with the same dispositions.

Do not edit implementation, answer a human gate, or treat this technical
verdict as entry approval.

## Report

Lead with material findings, then state the round number, the context the
verdict is recorded from, the reviewed fingerprints, finding dispositions
(notes separated from blockers), which findings fall on mechanisms an earlier
round's resolutions introduced, trace-gate verdict, and the exact handoff:
`rdd-plan` after a failure, `rdd-entry-review` after a current pass, or the
human after a bounded third round.
