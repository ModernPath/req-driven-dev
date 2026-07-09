# Agent Instructions

Follow the V-model loop process in `V-model-loop.md`.

All work-progress artifacts belong in the main repository being changed. Do not keep a separate local `epic/` or `epics/` folder in this instruction repository. Treat `WORKLIST.md`, `epics/`, epic files, epic folders, task files, and validation artifacts as paths relative to the main repository.

Before starting work:

1. Read `V-model-loop.md`.
2. In the main repository, read `WORKLIST.md`.
3. In the main repository, read `epics/README.md` if it exists.
4. Read `interview-flows.md` when user interaction, epic creation, or epic review is involved.
5. Open the relevant epic file or epic folder under the main repository's `epics/` if one exists.

Working rules:

- Start from the main repository's `WORKLIST.md`; do not begin implementation outside the work-list.
- Store epic details under the main repository's `epics/`.
- Epics may be either a single `EPIC-<AREA>-NNN-<title>.md` file or an `EPIC-<AREA>-NNN-<title>/` folder with a main epic file plus task files.
- Use epic task files for subagent handoff when useful. The main chat keeps oversight by monitoring task-file progress and keeping `WORKLIST.md` and the parent epic synchronized.
- Epic creation or review must end with an implementation kickoff prompt when the epic satisfies the Epic Specification Gate. The prompt must start implementation from the next `READY` work-list rows, follow the V-model loops, and delegate independent task files to subagents when useful.
- Record facts, decisions, requirements, scenarios, tasks, and status changes only when they have source references.
- Unsourced claims become open questions.
- Both loops use TDD:
  - upper loop: failing BDD/E2E/user-flow test first;
  - lower loop: failing unit/component/API/contract/integration test first.
- Do not mark anything `LOWER_VERIFIED`, `UPPER_VALIDATED`, `DONE`, or `VALIDATED` without linked code and test/validation evidence.
- Treat passing tests as the validation gate for upper and lower loops: upper-loop statuses require passing BDD/E2E/user-flow evidence, and lower-loop statuses require passing unit/component/API/contract/integration evidence.
- Do not mark an epic `DONE` or a user requirement `VALIDATED` until human approval is recorded in the parent epic.
- Keep `WORKLIST.md` and the parent epic record in sync.

If the user wants to discuss scope, behavior, decisions, epic creation, or epic review, use the interview flows in `interview-flows.md`.
