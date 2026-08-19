# Requirement-driven delivery — agent instructions

This repository defines a reusable requirement-driven delivery process. It
contains canonical process instructions, procedural skills, and flat-file
fallback shapes; it does not contain a project's live delivery state.

## Instruction ownership

- [`PROCESS.md`](PROCESS.md) defines the canonical process, including authority,
  items, traces, lifecycles, gates, planning, development, evidence,
  completion, records, and reconciliation.
- [`skills/`](skills/) contains focused procedures that apply the process.
- [`file-state/`](file-state/) contains the flat-file fallback for Epic and
  requirement records.
- Project instructions own only project-specific rules such as architecture,
  repository topology, commands, environments, and test gates. They reference
  rather than redefine the process.
- `CLAUDE.md` files are compatibility pointers; they do not override these
  instructions.

If project instructions conflict with a process rule, stop the affected
transition and report the conflict rather than creating a silent local variant.

## Required reading

Before planning, changing, reviewing, or delivering product work:

1. read the project's root `AGENTS.md` for project-specific rules;
2. read this file and `PROCESS.md`;
3. use `skills/rdd-deliver/SKILL.md` for end-to-end delivery, or the applicable
   focused `skills/rdd-*/SKILL.md` when the request explicitly ends at one
   process pass; use `skills/rdd-verify/SKILL.md` for reverse-engineered
   `PENDING_VERIFICATION` rows;
4. read the relevant product sources, requirement records, optional epic, and
   active work-selection record.

## Binding process

Follow `PROCESS.md`. Skills apply it and `file-state/` serializes fallback
snapshots; neither redefines its rules.
