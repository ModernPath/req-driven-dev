# Engineering-constraint flat-file state

> Canonical EC serialization for the authoritative process store. `PROCESS.md`
> defines EC ownership, lifecycle, applicability, and engineering trace rules.
> A store-backed repository materializes this file from the store; a file-backed
> repository versions it as the store. Never both.

- **Snapshot at:** «timestamp»
- **Source store/revision:** «database revision or repository SHA»
- **Context / release:** «scope»

This is one flat set. There are no profiles, inheritance rules, or implicit
service defaults. Every constraint declares its own applicability.

## EC-«AREA»-«NNN» — «Title»

- **Kind:** ARCHITECTURE / QUALITY / ENGINEERING
- **Status:** PROPOSED / ACTIVE / SUPERSEDED / RETIRED
- **Statement:** «one normative rule»
- **Proposal evidence:** «USER:/DOC:/CODE:/TEST:/RUN: observations supporting the proposal»
- **Authority:** «applied human activation gate and optional normative DOC: source; none while unapproved»
- **Rationale:** «why the constraint exists and the consequence it prevents»
- **Scope:** «global, or explicit repository/language/service/domain/path targets»
- **Effective from:** «release or store revision established by the activation gate»
- **Owner:** «person or team responsible for the rule»
- **Verification:** «deterministic command/check, architecture test, static analysis, or exact review observation»
- **Activation/retirement gates:** «GATES.md gate ids»
- **Supersedes / superseded by:** «EC id or none»
- **Notes:** «ambiguities or none»

Code may support a proposal as evidence of an observed convention, but only an
attributable human source and applied activation gate make an EC `ACTIVE`.
Changing an active statement, scope, or verification method creates a successor.
