---
name: rdd-cold-review
description: Independently audit a requirement planning packet before implementation entry. Use after technical reconnaissance and SR enrichment to review trace and scope alignment, affected code and data flow, contracts, failure behavior, feasibility, boundaries, and test strategy from a context separate from plan authoring. Produces technical findings and a trace-gate verdict; never grants human approval.
---

# Run a cold technical review

Start from a context independent of the planning-authoring conversation. Read
the project `AGENTS.md`, canonical `PROCESS.md` (`.modernpath/rdd/PROCESS.md`
in a consuming repository), versioned product sources, selected requirements,
optional epic/specifications, active engineering constraints, technical
reconnaissance, and repository state at the recorded revision.

Use a fresh reviewer session/context that did not author the plan, or a separate
human reviewer. Supply the frozen planning manifest, authoritative sources,
selected records, EC set, and repository revision. Do not supply the author's
private reasoning as evidence. Record reviewer identity/context and reviewed
fingerprint. If an independent context cannot be obtained, report that unmet
prerequisite; loading this skill in the authoring conversation is insufficient.

## Procedure

1. Audit the authoritative graph and selected scope without relying on
   unstated author reasoning.
2. Invoke `skills/rdd-engineering-check/SKILL.md` with target `PLANNING`
   against the exact planning fingerprint and post-reconnaissance EC set. Import
   its findings and require its current trace gate to pass; do not reproduce its
   EC-by-EC procedure here.
3. Verify the affected repositories, files, symbols, entry points, callers,
   writers, readers, and every changed control/data-flow hop.
4. Examine contracts, schemas, compatibility, persistence, integrations,
   failure propagation, retries, concurrency, security, and operational risks
   where applicable.
5. Assess feasibility, dependency order, SR boundaries, reuse of established
   patterns, testability, expected RED reasons, and proportional gates.
6. Identify any product, architecture, acceptance, or scope choice that lacks
   human authority.
7. Record each finding with severity, direct source, owner, and disposition as
   `OPEN`, `RESOLVED`, `DEFERRED`, or `REJECTED`. Attach findings and verdict to
   the reviewed inputs; do not mutate the planning snapshot to store outputs.
8. Return the cold-review trace gate `PASS` only when the engineering trace is
   current and passing and the material-finding rule in `PROCESS.md` is
   satisfied. Otherwise return `FAIL` with exact blockers.

Use `skills/rdd-audit/SKILL.md` to resolve the packet's citations and diff its
inventories against the code — scoped to the packet's affected surface. Its
findings enter this review's finding list with the same dispositions.

Do not edit implementation, answer a human gate, or treat this technical
verdict as entry approval.

## Report

Lead with material findings, then state the reviewed fingerprints, finding
dispositions, engineering and cold-review trace-gate verdicts, and the exact
handoff: `rdd-plan` after a failure or `rdd-entry-review` after a current pass.

## Execution contract

- Input: frozen planning inputs and independently inspectable sources in a
  non-authoring reviewer context; item status alone is not proof of readiness.
- Writes: engineering/cold-review results, sourced findings and dispositions,
  reviewer provenance, and next action; no plan or implementation correction.
- Exit: current PASS to entry review, or FAIL with the earliest affected
  prerequisite. Plan changes require a new snapshot and dependent reviews.
