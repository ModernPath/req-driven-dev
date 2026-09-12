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

## Procedure

1. Resolve the current plan-subject fingerprint and predecessor. Use `FIRST`
   when there is no predecessor or selected scope or the affected-surface
   denominator changed materially. Use `RE_REVIEW` for any predecessor with
   unchanged boundaries. A predecessor whose last evaluated verdict was
   `FAIL` requires an applied workflow human-gate answer authorizing the exact
   finding snapshot, even if remediation made that gate `STALE`. A predecessor
   whose last evaluated verdict was `PASS` and is now `STALE` requires the
   attributable source of the plan-subject change. Do not start a re-review
   without its applicable authority.
2. For `FIRST`, audit the authoritative graph and selected scope without
   relying on unstated author reasoning. Verify the affected repositories,
   files, symbols, entry points, callers, writers, readers, and every changed
   control/data-flow hop.
3. Complete the shared planning/review coverage rubric: trace and scope;
   affected surface and flow; contracts, schemas, and compatibility;
   persistence; integrations; failure propagation and retries; concurrency;
   security; operational risks; feasibility and dependency order; SR
   boundaries and reuse; testability, expected RED reasons, and proportional
   gates; and unauthorized product, architecture, acceptance, or scope
   choices. Mark every area `PASS`, `NOT_APPLICABLE`, or with finding ids.
   Continue after the first blocker so the first verdict contains the complete
   material-finding set.
4. For `RE_REVIEW`, begin with the predecessor's stable finding set. Verify
   every claimed resolution against direct evidence, inspect the exact plan
   diff, and audit the immediate callers, readers, writers, contracts,
   persistence paths, integrations, failure paths, security/operational
   boundaries, and tests touched by that diff. Carry forward unaffected
   coverage; do not restart the full audit. If the selected scope or
   affected-surface denominator changed materially, supersede this re-review
   and require a new `FIRST` review.
5. Give every finding a stable id and maintain its classification, lineage,
   affected domain, severity and materiality, direct source, owner, required
   remediation, current disposition, and current resolution evidence. Append
   an immutable observation for this gate with the finding's checked
   plan-subject fingerprint, disposition, and evidence; never update a
   predecessor gate's observation. Classify successor discoveries per
   `PROCESS.md`; route `OUT_OF_SCOPE` findings without allowing them to reset
   this review.
6. Compare a re-review with its predecessor by open material finding count,
   unresolved stable-id or descendant lineage, and affected-domain count.
   Return a non-convergence recommendation when the count is not lower, a
   lineage remains open after remediation, or the domain count increases:
   split the scope, remove optional behavior, simplify the design, or replan
   the shared boundary.
7. Return the cold-review trace gate `PASS` only when the material-finding rule
   in `PROCESS.md` is satisfied. Otherwise record `FAIL` with exact blockers
   and complete coverage; calculate the review-result fingerprint and evaluate
   the continuation-readiness trace; and only after that trace passes, open the
   exact workflow human gate for the next action scoped to the current finding
   snapshot and review-result fingerprint. Record the failed review as a source
   of that human gate, not as its prerequisite.

For a `FIRST` review, use `skills/rdd-audit/SKILL.md` to resolve the packet's
citations and diff its inventories against the code across the frozen affected
surface. For `RE_REVIEW`, scope that audit to changed citations and inventories
plus their immediate dependencies. Its findings enter this review's stable
finding set with the same classifications and dispositions.

Do not edit implementation, answer a human gate, or treat this technical
verdict as entry approval.

## Report

Lead with material findings, then state the review mode, reviewed plan-subject
fingerprint, predecessor and plan diff when applicable, coverage results,
stable finding dispositions and lineage, convergence result, and trace-gate
verdict. On `FAIL`, also report the review-result fingerprint and continuation
gates. A current `PASS` hands off to `rdd-entry-review`. A `FAIL` returns the
complete findings and recommendation to the human; do not invoke `rdd-plan` or
another cold review until the workflow gate's attributable answer authorizes
and applies the exact next action.
