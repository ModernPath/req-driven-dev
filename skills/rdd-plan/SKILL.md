---
name: rdd-plan
description: Prepare an epic-scoped or single-SR planning packet for controlled implementation entry. Use for a new or changed requirement, stale technical context, or work that needs sourced acceptance content, technical reconnaissance, SR enrichment, RED strategy, decisions, and an entry brief. Stops before cold review and human entry approval.
---

# Plan a requirement trace

Read the project `AGENTS.md`, canonical `PROCESS.md`
(`.modernpath/rdd/PROCESS.md` in a consuming repository), relevant product
sources, requirement records, code, tests, and optional epic. Apply the Work
scope, Item ownership, and Planning and readiness sections of `PROCESS.md`.

## Procedure

1. Confirm every requirement and relation the proposed scope depends on is
   authoritative. Stop at the confirmation gate for `DERIVED` requirements or
   candidate-only links.
2. Choose epic scope or single-SR scope using `PROCESS.md`. Do not invent epic
   membership or a UR link to make the graph appear complete.
3. Create or update the selected item content: sourced UR outcomes and inline
   scenarios when user behavior is in scope, and thin testable SRs for system
   behavior.
4. Before parallel authoring of multiple Epics or packets, publish one sourced
   cross-packet contract table. For each shared module function and arity,
   endpoint, event kind, payload, or transition, record its exact input,
   output, and error shape; producer and consumers; authoritative `CODE:` or
   `DOC:` source; and owning Epic or SR. Every packet cites this table rather
   than restating an independent version of the contract.
5. Perform technical reconnaissance at a named repository revision. Record the
   affected surface, control/data flow, contracts, reuse targets, dependencies,
   risks, test infrastructure, failure modes, and unknowns.
   Open every cited shipped API, schema, or callable declaration. Verify the
   planned arguments, return value, errors, and nullability directly against
   the source. Any signature copied into the packet must match the cited
   declaration character-for-character.
6. Enrich every selected SR with its implementation context, explicit change
   boundary, and lower-RED strategy. Define a separate upper-RED strategy for
   every selected UR.
7. Complete the same coverage rubric cold review will evaluate: trace and
   scope; affected surface and flow; contracts, schemas, and compatibility;
   persistence; integrations; failure propagation and retries; concurrency;
   security; operational risks; feasibility and dependency order; SR
   boundaries and reuse; testability, expected RED reasons, and proportional
   gates; and human authority. Cite direct support or explain
   `NOT_APPLICABLE` for every area.
8. When a human authorizes remediation of a failed cold review, take its exact
   stable finding snapshot and address every authorized, agent-owned finding
   in one planning batch. Record the changed packet element and resolution
   evidence for each finding. Do not request re-review after fixing only a
   subset; return any finding that needs a scope or product decision to the
   human before handoff.
9. Route product, scope, architecture, acceptance, priority, release, and
   workflow decisions through exact human gates. Open them only after their
   trace prerequisites pass. Record blockers, conflicts, gaps, and deferrals
   rather than guessing.
10. Assemble Entry-packet items 1–6 and the product-language brief, calculate
    the plan-subject fingerprint, and reconcile planning records. Hand off to
    `rdd-cold-review` for item 7 only when the shared rubric is complete and,
    for remediation, every authorized finding has a recorded outcome.

## Report

Report the selected scope, authoritative graph, reconnaissance revision,
plan-subject fingerprint, cross-packet contract table when applicable, exact
contract checks, shared coverage rubric, planned evidence, remediation result
by finding id, unresolved decisions, blockers, and cold-review input.
