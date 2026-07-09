# Agent Instructions

Follow the V-model loop process in `V-model-loop.md`.

Before starting work:

1. Read `V-model-loop.md`.
2. Read `WORKLIST.md`.
3. Read `epics/README.md`.
4. Read `interview-flows.md` when user interaction, epic creation, or epic review is involved.
5. Open the relevant epic file under `epics/` if one exists.

Working rules:

- Start from `WORKLIST.md`; do not begin implementation outside the work-list.
- Store epic details under `epics/`.
- Record facts, decisions, requirements, scenarios, tasks, and status changes only when they have source references.
- Unsourced claims become open questions.
- Both loops use TDD:
  - upper loop: failing BDD/E2E/user-flow test first;
  - lower loop: failing unit/component/API/contract/integration test first.
- Do not mark anything `LOWER_VERIFIED`, `UPPER_VALIDATED`, `DONE`, or `VALIDATED` without linked code and test/validation evidence.
- Treat passing tests as the validation gate for upper and lower loops: upper-loop statuses require passing BDD/E2E/user-flow evidence, and lower-loop statuses require passing unit/component/API/contract/integration evidence.
- Do not mark an epic `DONE` or a user requirement `VALIDATED` until human approval is recorded in the parent epic.
- Keep `WORKLIST.md` and the parent epic file in sync.

If the user wants to discuss scope, behavior, decisions, epic creation, or epic review, use the interview flows in `interview-flows.md`.
