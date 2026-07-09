# Epics

This folder stores the authoritative parent artifacts for V-model loop development.

Each epic owns its main bounded context, key domain models, key domain events, user stories, BDD acceptance scenarios, system requirements, tasks/slices, evidence map, human approval record, and blocked/deferred items.

`WORKLIST.md` is the cross-epic development index. It must link back to these epic files for detail.

Both loops use TDD:

- Upper-loop acceptance scenarios require failing-then-passing BDD/E2E/user-flow evidence.
- Lower-loop tasks require failing-then-passing unit/component/API/contract/integration evidence.

## File Naming

Use:

```text
EPIC-<AREA>-NNN-<kebab-title>.md
```

Example:

```text
EPIC-AUTH-001-password-reset.md
```

## Epic Template

```markdown
# EPIC-<AREA>-NNN - <capability name>

## User outcome
<What the user can do when this epic is complete.>

## Linked user requirements
| User requirement | Statement | Status |
|---|---|---|
| UR-<AREA>-NNN | <user-level requirement> | PROPOSED |

## Users / actors
- <user role>
- <system actor if applicable>

## Domain ownership
**Main bounded context:** <context name / code>
**Supporting bounded contexts:** <context name / code, if any>

## Key domain models
| Model | Type | Context | Source |
|---|---|---|---|
| <model name> | aggregate/entity/value object/read model/external model | <context> | SRC-<AREA>-NNN |

## Key domain events
| Event | Direction | Producer | Consumer | Source |
|---|---|---|---|---|
| <event name> | emitted/consumed/observed | <producer> | <consumer> | SRC-<AREA>-NNN |

## Source material
| Source id | Type | Reference | Notes |
|---|---|---|---|
| SRC-<AREA>-NNN | USER/DOC/CODE/TEST/RUN/EPIC | <reference> | <why it matters> |

## Grounded facts
| Fact id | Fact | Source |
|---|---|---|
| FACT-<AREA>-NNN | <fact> | SRC-<AREA>-NNN |

## Decisions
| Decision id | Decision | Source | Consequence |
|---|---|---|---|
| DEC-<AREA>-NNN | <decision> | SRC-<AREA>-NNN | <impact on epic/scenario/task> |

## Open questions
| Question id | Question | Source / trigger | Needed to proceed |
|---|---|---|---|
| OQ-<AREA>-NNN | <question> | SRC-<AREA>-NNN | yes/no |

## User stories / journeys
| Story | User / actor | Goal | Outcome |
|---|---|---|---|
| STORY-<AREA>-NNN | <user> | <goal> | <outcome> |

## BDD acceptance scenarios
| Scenario | Story | Gherkin file / text | Failing E2E evidence | Passing E2E evidence | Code reference | Status |
|---|---|---|---|---|---|---|
| SCN-<AREA>-NNN | STORY-<AREA>-NNN | <link or inline section> | - | - | - | PROPOSED |

## System requirements
| System requirement | Source scenario | Interface / component | Verification method | Test evidence | Code reference | Status |
|---|---|---|---|---|---|---|
| SR-<AREA>-NNN | SCN-<AREA>-NNN | API/UI/service/data/integration/domain | unit/component/API/contract/integration/E2E support | - | - | PROPOSED |

## Tasks / slices
| Task / slice | System requirement | Scope | Failing test first | Passing tests | Code reference | Status |
|---|---|---|---|---|---|---|
| TASK-<AREA>-NNN | SR-<AREA>-NNN | API/UI/service/data/integration/vertical | - | - | - | PROPOSED |

## Evidence map
| Acceptance scenario | System requirements | Tasks / slices | Lower test evidence | Upper BDD/E2E evidence | Code reference |
|---|---|---|---|---|---|
| SCN-<AREA>-NNN | SR-<AREA>-NNN | TASK-<AREA>-NNN | - | - | - |

## Human approval
| Approval id | Approver | Role | Source | Scope | Decision |
|---|---|---|---|---|---|
| APP-<AREA>-NNN | <name> | product/domain/QA/owner | USER:<date>:<summary> | EPIC-<AREA>-NNN | approved/rejected/changes requested |

## Blocked / deferred
| Item | Status | Reason | Required decision | Owner |
|---|---|---|---|---|
| - | - | - | - | - |

## Done when
- All linked user requirements are covered by BDD acceptance scenarios.
- All BDD acceptance scenarios have failing-then-passing E2E/user-flow evidence.
- All linked system requirements are `LOWER_VERIFIED`.
- All linked tasks are `LOWER_VERIFIED`.
- Evidence links are complete from epic to scenario to system requirement to task to test and code.
- Human approval is recorded for the epic.
- `WORKLIST.md` rollup is updated.
```
