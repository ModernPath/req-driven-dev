# Requirement-driven delivery — agent instructions

The `ModernPath/req-driven-dev` repository is the canonical authoring home of
the reusable V-model delivery process. Released instructions and templates are
embedded in the `modernpath` CLI and installed into consuming repositories
under `.modernpath/rdd/`; this process package never contains a consuming
project's live work state.

## Instruction ownership

- [`process/V-model-loop.md`](process/V-model-loop.md) defines lifecycle,
  traceability, gates, statuses, red-first evidence, and completion.
- [`process/state-tracking.md`](process/state-tracking.md) defines the
  repository working records, status axes, local checks, automatic
  synchronization, Mission Control, and state convergence.
- [`process/prompts.md`](process/prompts.md) contains reusable execution prompts.
- A consuming repository owns only project-specific rules such as architecture,
  repository topology, commands, environments, and test gates. Its agent entry
  points reference the installed `.modernpath/rdd/` release snapshot instead of
  copying or redefining the process.
- `CLAUDE.md` files are compatibility pointers; they do not override these
  instructions.

If project instructions conflict with a shared process rule, stop the affected
transition and report the conflict. Change the source in the canonical
`ModernPath/req-driven-dev` repository and publish it through a new CLI build
rather than creating a local variant.

## Required reading

Before planning, changing, reviewing, or delivering product work:

1. read the consuming project's root `AGENTS.md` for project-specific rules;
2. read this file, `process/V-model-loop.md`, and
   `process/state-tracking.md`;
3. read the relevant product sources, requirement ledger, epic/specs, and
   active work-list row.

## Non-negotiable rules

1. Every change traces through `UR -> EPIC -> SCN -> SR -> TASK -> TEST ->
   CODE`. A project may retain stable `REQ-*` ids, but their user/system/task
   meaning and links must remain explicit.
2. Humans decide product, scope, architecture, acceptance, priority, and
   workflow. Record the real actor with a `USER:<date>:<summary>` source. An
   agent may propose options but may not select one by assumption. Do not ask
   for facts that can be established safely from product docs, code, tests, or
   current working records; ask only for decisions requiring human authority.
3. Normative claims cite `USER:`, `DOC:`, `CODE:`, `TEST:`, `RUN:`, or `EPIC:`
   sources. Missing support becomes an open question; conflicting support
   remains a conflict.
4. Both V-model arms are red-first: BDD/E2E/user-flow evidence above and
   focused unit/component/API/contract/integration evidence below.
5. Epic-path implementation starts only after the specification gate is
   approved. Fast-lane work must satisfy every fast-lane condition.
6. `LOWER_VERIFIED`, `UPPER_VALIDATED`, `IN_REVIEW`, `DONE`, and `VALIDATED`
   require linked direct evidence. A label, checkbox, or unrelated green suite
   is not proof.
7. Humans approve epic specifications and epic/user-requirement completion.
   Tests cannot grant human approval.
8. Deferrals, discoveries, blockers, and deviations are explicit, sourced, and
   routed. Do not hide them in prose or TODO comments.
9. Boundary contracts are canonical. Derive boundary types from schemas where
   the project provides them.
10. Prefer thin vertical slices and the smallest implementation that makes the
    specified failing evidence pass.

## Working loop

1. **Orient** — inspect repository and process state according to
   `process/state-tracking.md`; select the next eligible trace.
2. **Specify** — derive sourced URs and SCNs, then testable SRs and thin tasks.
3. **Approve specification** — present a decision brief and record the human
   gate before epic-path RED tests.
4. **Upper RED** — observe the acceptance/user-flow test fail for the expected
   reason.
5. **Lower RED/GREEN** — write the focused failing test, implement the smallest
   slice, and pass proportional regression gates.
6. **Verify and validate** — link lower and upper evidence to the exact trace
   and revision. UI work also needs a live-browser run and inspected screenshot.
7. **Review** — audit criteria, evidence, gaps, and deferrals; record the real
   human completion decision.
8. **Deliver and reconcile** — land code in its source repository and reconcile
   every working record and projection according to
   `process/state-tracking.md`.
9. **Continue** — capture discoveries and take the next incomplete trace.

## Human gates

Every human gate carries a short product-language brief:

```markdown
**Brief:**
- What: <decision in product language>
- Why now: <trigger and what waits on it>
- Changes if approved: <visible outcome>
- Risk if wrong: <downside and reversibility>
- Recommendation: <option and rationale>
- Image: <optional supporting image>
```

Do not click mutating controls on real data merely to verify a UI. Inspect the
rendered control and prove its mutation path with isolated automated tests.

## Completion

Before claiming completion, audit every explicit requirement and scenario
against current sources: files, test/runtime/browser evidence, attributable
approval, implementation-repository delivery, and the state records defined in
`process/state-tracking.md`. Missing, stale, or indirect evidence means
incomplete work.

The detailed Definition of Done is in `process/V-model-loop.md`.
