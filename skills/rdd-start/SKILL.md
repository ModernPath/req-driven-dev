---
name: rdd-start
description: Enter a product-delivery session, confirm the selected Epic and its authoritative plan, and route work to the next needed phase. Use when starting, resuming, or asking what delivery work is active.
---

# Enter the delivery session

Read the consuming project's root instructions and `.modernpath/rdd/PROCESS.md`
(or this repository's `PROCESS.md`). Use the project's sanctioned process
interface for all process reads.

1. Confirm the user-selected Epic by its native ID. If no Epic is selected,
   ask which one to work on; do not infer scope from the branch or worktree.
2. Read the Epic, its latest saved plan, implementation approval,
   lifecycle, linked requirements, recent evidence and completion state.
3. If implementation is not approved for the current saved content, route to
   `rdd-plan`, `rdd-cold-review` or `rdd-entry-review`, whichever is first
   incomplete. Do not start implementation or test changes before approval.
4. If implementation is approved, route to `rdd-build` or `rdd-verify` based
   on current evidence. If ready for delivery, route to
   `rdd-completion-review`.
5. If scope or acceptance changed, route back to planning and obtain renewed
   human approval before affected work continues.

If the interface cannot read the current state, report the missing capability
through the project's tooling-gap channel. Do not recreate state from notes,
branches, local files or memory. Report the selected Epic, saved plan and proposed content,
approval state, evidence and next phase.
