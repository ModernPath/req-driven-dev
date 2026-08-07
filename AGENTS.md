# Requirement-driven delivery — agent instructions

This repository defines the reusable delivery process for ModernPath projects.
It is process guidance, not a product workspace and not a second place to keep
live project state.

## Instruction ownership

- This file is the canonical agent entry point for the delivery process.
- [`V-model-loop.md`](V-model-loop.md) defines lifecycle, traceability, gates,
  statuses, TDD, and completion.
- [`delivery-system.md`](delivery-system.md) defines state ownership and the
  Mission Control/CLI sync flow.
- [`interview-flows.md`](interview-flows.md) defines human-input and review
  flows.
- A consuming repository's root `AGENTS.md` owns only project-specific rules:
  architecture, repository topology, commands, test gates, and local safety.
- A consuming repository may specialize paths and commands, but it must not
  copy or redefine this process. Change shared process here first.
- `CLAUDE.md` files are compatibility pointers. They do not override
  `AGENTS.md`.

If project instructions conflict with a shared loop invariant, stop the
affected transition and record the conflict. Do not choose an interpretation
silently.

## Required reading order

Before planning, changing, reviewing, or delivering product work:

1. read the consuming repository's root `AGENTS.md`;
2. read this file and `V-model-loop.md`;
3. read `delivery-system.md` when the workspace is connected to ModernPath;
4. inspect current loop state in the ModernPath Delivery System through
   Mission Control or the `modernpath` CLI;
5. read the relevant product sources, requirement, epic/specs, and task;
6. read `interview-flows.md` when human input or a gate is involved.

## Non-negotiable rules

1. Every change traces through `UR -> EPIC -> SCN -> SR -> TASK -> TEST ->
   CODE`. A repository may use a stable `REQ-*` id as its requirement or task
   adapter, but the user/system meaning must remain explicit.
2. Product, scope, architecture, acceptance, priority, and workflow decisions
   are made by humans. Record the real actor and a `USER:<date>:<summary>`
   source. An agent may propose options; it may not select one by assumption.
3. Facts and normative claims cite `USER:`, `DOC:`, `CODE:`, `TEST:`, `RUN:`,
   or `EPIC:` sources. Missing support becomes an open question; conflicting
   support becomes a conflict.
4. Both V-model arms are red-first:
   - upper loop: failing BDD/E2E/user-flow evidence before implementation can
     satisfy the scenario;
   - lower loop: failing unit/component/API/contract/integration evidence
     before the implementation that makes it pass.
5. Implementation begins only after the work is visible in the Delivery
   System and has passed the applicable specification gate.
6. `LOWER_VERIFIED`, `UPPER_VALIDATED`, `IN_REVIEW`, `DONE`, and `VALIDATED`
   require linked evidence. A status label, checked box, or passing unrelated
   suite is not proof.
7. Human approval is required for specification approval and for epic/user-
   requirement completion. Test results cannot grant human approval.
8. Deferrals and discoveries are explicit. Record a reason, owner, source, and
   affected trace; do not hide them in prose or TODO comments.
9. Boundary contracts are canonical. Derive boundary types from schemas where
   the project provides them.
10. Prefer thin vertical slices and the smallest implementation that makes the
    specified failing evidence pass.

## State ownership

The ModernPath Delivery System is the system of record for loop state:
requirements, epics, scenarios, system requirements, tasks, gates, evidence,
human input, trace links, releases, events, sessions, and statuses.

Mission Control and the `modernpath` CLI are control surfaces over that state.
Mission Control is suited to human review and decisions; the CLI is suited to
agents, local workflows, and automation. Neither is a separate source of truth.

Workspace Markdown is the versioned, reviewable local representation used for
agent context and deterministic sync. Keep it coherent with server state:

- pull and apply server-originated decisions before planning from stale files;
- edit the requirement/epic/task records together with the implementation;
- sync after material changes and before handoff;
- stop on a sync conflict; never overwrite a winning human answer or fabricate
  identity to make records converge.

See `delivery-system.md` for the authority matrix and command flow.

## Working loop

1. **Orient** — inspect Delivery System state, repository status, active
   release, next `READY` item, blockers, and evidence drift.
2. **Specify** — derive sourced URs and SCNs, then testable SRs and thin tasks.
   Use an epic for spec-worthy work; use the fast lane only when all fast-lane
   criteria hold.
3. **Approve specification** — present a decision brief and record the human
   gate before writing RED tests for epic-path work.
4. **Upper RED** — write/identify the BDD or user-flow test and observe the
   intended behavior fail for the expected reason.
5. **Lower RED/GREEN** — per task, write the focused failing test, implement
   the smallest slice, and run focused plus proportional regression gates.
6. **Lower verify** — link command/result, test, code, commit/PR, and trace ids.
7. **Upper validate** — run the live user path or equivalent acceptance test;
   UI work also needs a real-browser run and an inspected screenshot.
8. **Review** — move verified work to `IN_REVIEW`, present the evidence and
   gaps, and record the actual human completion decision.
9. **Deliver and reconcile** — merge in the code's source repository, integrate
   workspace snapshots where applicable, update local records, sync the
   Delivery System, and confirm every projection agrees.
10. **Continue** — capture discoveries, select the next incomplete item, and
    repeat.

## Gate rules

Every human gate carries a short decision brief:

```markdown
**Brief:**
- What: <decision in product language>
- Why now: <trigger and what is waiting>
- Changes if approved: <visible outcome>
- Risk if wrong: <downside and reversibility>
- Recommendation: <option and rationale>
- Image: <optional supporting image>
```

Do not click mutating controls on real data merely to verify a UI. Render and
inspect the control; prove its mutation path with isolated automated tests.

## Record synchronization

When state changes, update the full affected trace in one logical change:

- requirement status and acceptance criteria;
- epic/specification, SCN, SR, TASK, evidence, decision, and approval records;
- local work-list/rollup if the project keeps one;
- generated projections required by the project;
- Delivery System state through sync/evidence commands.

If any two representations disagree, reconcile before starting the next item
or claiming completion. Only one writer should mutate shared process records at
a time.

## Completion

Before claiming completion, perform an evidence audit against every explicit
requirement and acceptance scenario. Verify current files, test results,
runtime/browser behavior, Delivery System state, approval, source-repository
delivery, and sync status. Missing or indirect evidence means incomplete work.

Use the detailed Definition of Done in `V-model-loop.md`.
