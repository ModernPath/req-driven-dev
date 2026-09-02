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
4. Perform technical reconnaissance at a named repository revision. Record the
   affected surface, control/data flow, contracts, reuse targets, dependencies,
   risks, test infrastructure, failure modes, and unknowns. For any scope wider
   than a single SR, delegate reconnaissance per surface — affected code and
   flow, contracts and data, integrations, test infrastructure, project gates —
   as read-only passes under the Pass isolation rules of `PROCESS.md`. Each
   pass returns `DOC:`, `CODE:`, and `TEST:` citations with the fact observed
   at each; the packet author assembles citations rather than reading every
   surface in its own context.
5. Enrich every selected SR with its implementation context, explicit change
   boundary, and lower-RED strategy. Define a separate upper-RED strategy for
   every selected UR.
6. Route product, scope, architecture, acceptance, priority, release, and
   workflow decisions through exact human gates. Open them only after their
   trace prerequisites pass. Record blockers, conflicts, gaps, and deferrals
   rather than guessing.
7. Assemble Entry-packet items 1–6 and the product-language brief. Reconcile
   planning records, then hand off to `rdd-cold-review` for item 7.

## Report

Report the selected scope, authoritative graph, reconnaissance revision,
planned evidence, unresolved decisions, blockers, and cold-review input.
