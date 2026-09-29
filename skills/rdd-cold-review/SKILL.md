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

Record the reviewer and independent review context with the verdict; an
author's self-review is not a cold review. Run as a delegated pass, this skill
returns its findings and verdict and writes nothing to the store. The
orchestrating session records them with reviewer attribution
(`PROCESS.md` §Delegated passes). The
review audits the change the packet proposes, not the packet as a document.

## Procedure

1. Audit the authoritative graph and selected scope without relying on
   unstated author reasoning.
2. Verify the affected repositories, files, symbols, entry points, callers,
   writers, readers, and every changed control/data-flow hop. Where the packet
   carries a state inventory, check its writers, readers, concurrent updates,
   failure behavior, and mitigations. Record missing affected state. Where the change touches
   state and the packet carries no inventory, that absence is the first
   material finding. Check applicable existing requirement ownership and
   constraints. A contradiction with delivered acceptance needs a scope
   decision; absence of an existing owner does not itself block new behavior.
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
   question for that human, never a packet edit; a finding whose fix preserves
   a delivered acceptance or applies a stance the human has stated is not
   such a question — name the rule it applies instead. A `RESOLVED` disposition
   records the correction and evidence, or the scope decision and its `USER:`
   source. Changed scope or material decisions return to `rdd-plan`; technical
   corrections within scope update the packet and affected review inputs.
   A fix you propose is a claim for the author to verify
   at the revision, not an instruction; the round that follows re-verifies
   it as it does a carried closure.
7. Grade materiality by what the finding would change. A finding about the
   packet's wording, counts, or citations that alters none of the code, tests,
   interfaces, or risks is a note and never blocks; traceability is material
   only when a builder or a gate would act on the wrong citation
   (`PROCESS.md` §Planning and readiness).
8. Run at most two rounds on the selected planning scope. After a second
   failed round, report the remaining material findings to the human;
   do not start a third round automatically.
9. Return the cold-review trace gate `PASS` only when the material-finding rule
   in `PROCESS.md` is satisfied. Otherwise return `FAIL` with exact blockers.

Use `skills/rdd-audit/SKILL.md` to resolve the packet's citations and diff its
inventories against the code — scoped to the packet's affected surface. Its
findings enter this review's finding list with the same dispositions.

Do not edit implementation, answer a human gate, or treat this technical
verdict as entry approval.

## Report

Lead with material findings, then state the round number, reviewer and review
context, the reviewed fingerprints, finding dispositions
(notes separated from blockers), trace-gate verdict, and the exact handoff:
`rdd-plan` after the first failure, `rdd-entry-review` after a current pass,
or the human after a second failed round.
