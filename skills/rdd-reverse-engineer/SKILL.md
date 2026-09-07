---
name: rdd-reverse-engineer
description: Start or resume a bounded adoption campaign that derives requirement candidates from existing code. Inventory observable behavior, preserve confirmed records, record inferred URs/SRs as DERIVED with candidate-only relations, and hand confirmed scope to the standard delivery loop. Use for an empty corpus or explicitly authorized uncovered contexts, not to overwrite an established corpus or bypass entry.
---

# Adopt an existing codebase

Read the project `AGENTS.md`, canonical `PROCESS.md`, store binding, and any
existing adoption campaign in work selection. This is an optional orchestrator,
not a new lifecycle. Observed code establishes behavior, not intended authority.

## Execution contract

- Input: an authorized bounded adoption scope, repository baseline, store
  binding, context inventory, and existing campaign/requirement/gate records.
- Writes: observational inventories/documents, independently sourced DERIVED
  candidates, candidate-only relations, proposed ECs, confirmation packets,
  attributable confirmation applications, and durable campaign progress.
- Exit: a bounded context handed to the normal loop, an exact confirmation or
  external hold, or an honest partial with remaining observations and next action.
  No product code, tests, release commitments, or inferred approvals are created.

## Preflight and resume

1. Identify and validate the authoritative store. Use its supported adapter;
   file-backed projects write canonical shapes directly, store-backed projects
   use their record API and refresh projections. Never write a projection as if
   it were an import source.
2. Read the adoption campaign before testing whether records exist:
   - With no corpus, record a new campaign for the user's requested scope.
   - With the same campaign, resume uncovered or partial contexts. Existing
     candidates and confirmed records from earlier passes are expected.
   - With an unrelated established corpus, use discovery/planning unless the
     human explicitly authorized bounded adoption of uncovered surface.
3. Record campaign id, authority, original baseline, latest inspected revision,
   context inventory, stable observation-to-candidate keys, confirmation gates,
   and next action in `WORK-SELECTION.md`. Skip handed-off contexts. Reconcile
   partial contexts by id; never duplicate candidates or overwrite confirmed
   statements, relations, dispositions, or gate answers.
4. Recheck observations affected by revision drift before reusing them.
   Source changes that contradict confirmed records route through triage.
5. Read relevant existing architecture and product sources as context. Confirm
   as-built claims directly in code/tests; retain intended-versus-observed
   disagreement as a sourced question rather than rewriting human intent.

For a ModernPath ledger-backed project, read
[the ModernPath adapter](references/modernpath-adapter.md) before serializing or
running its commands. Other projects use their own adapter contract; do not
assume ModernPath tooling is installed.

## Inventory, then derive one bounded context

Work in this order:

1. **Domain:** inspect schemas, migrations, entities, invariants, writers and
   readers. Propose context boundaries from aggregate ownership and observed
   behavior, using existing authoritative boundaries when available.
2. **Surfaces:** enumerate actors, role gates, views and other interfaces, and
   the entry points they reach. Identify user journeys and candidate URs.
3. **Behavior:** walk entry points and the implementation they call. Describe
   both the successful outcome and material rejection/failure behavior. Derive
   one candidate per independently describable behavior, not per function.
4. **Recovered design:** after a context pass establishes the map and data model,
   update the system-wide observed design where useful. Read
   [recovered-design guidance](references/recovered-design.md) for this output.
   On later passes reconcile newly observed surface rather than creating
   competing per-context architecture documents.

Mechanically enumerate these populations before claiming coverage:

| Class | Population |
|---|---|
| Entry points | HTTP/RPC routes, workers/jobs, webhooks/events, CLI and agent/tool surfaces |
| Data models | Tables/models and schema-enforced constraints |
| Access control | Guards, middleware, policies and role gates |
| User-visible flows | Routes/views/flows in every relevant client and the actors who reach them |
| Integrations | External systems visible in configuration/credentials as well as modules |
| Tests | Existing test files and their observed targets; not yet verification evidence |

State genuinely inapplicable classes and why. Inspect implementation modules as
well as handlers. A table written by multiple contexts is an ownership question;
it is an EC violation only if an applicable active rule makes it one.

Cite complete repository-relative paths and inspect the whole relevant expression,
call chain and production input path. Code comments establish what was written,
not that the described behavior runs. An absence claim needs a named search
population and method. Keep decided and deployed facts separate.

## Candidate authority and relations

Every inferred behavior starts `DERIVED`, with canonical kind UR or SR,
candidate statement, direct sources, conflicts/questions, consequences,
confirmation brief, and proposed relations explicitly labelled `CANDIDATE`.
Use the canonical Candidate packet, not live acceptance content or implementation
reconnaissance. Independently observed candidates may be linked to each other as
proposals; none authorizes downstream work before confirmation.

A UR describes an actor/outcome grounded in observed surfaces; an SR describes
a system behavior at a boundary. An observed engineering convention routes to a
flat `PROPOSED` EC, not a behavioral requirement. A bare constant whose intent
is unknown remains a candidate/question, not an invented normative target or a
`BLOCKED` requirement in place of the DERIVED hold.

Compare proposed UR/SR joins both ways. A view calling a missing entry point and
an entry point with no identified caller are findings to investigate, not
automatic proof of dead code. Preserve legitimate integrations without views.
Serialize proposed links in the canonical candidate packet; only an applicable
adapter may specify an import grammar, and it must preserve candidate status.
Do not invent a parent to raise a relation count.

Pre-existing failing tests, unreachable paths, and unclear-ownership discoveries
route to triage/backlog with direct evidence. They are not verified shipped
behavior. Candidate groups may be recorded on a PROPOSED Epic with membership
labelled CANDIDATE; they do not establish authoritative readiness.

## Measure observation coverage

Record before/after inventories, matching rules, numerators, denominators and
misses for the selected context. Use the project's standing instrument when it
measures that population; otherwise retain a small reproducible inventory audit.
Do not interpret zero authoritative coverage as a failed derivation: DERIVED
candidates are deliberately excluded from delivery-readiness coverage.

Use declared project coverage targets. In their absence, the default adoption
target is 100% inspected/dispositioned observations, with a completion floor of
90% in every applicable denominator class; a full-system sweep also requires
60% of its source-file inventory cited or explicitly dispositioned. Record the
population and any human-approved target changes before claiming completion.
Do not apply a whole-system denominator to a one-context pass. Exclusions must
be explicit; generated code or presentation-only files are not silent credits.

Run `rdd-audit` over the pass's output, including citations and both inventory
directions. Report exact command output and misses. A partial remains partial
even if many candidates were written. On resume, a zero new-row delta can be
correct when existing candidates were reconciled or confirmed; report the actual
progress rather than requiring duplicate records to make a metric increase.

For an explicitly requested full adoption, repeat bounded passes over the
recorded remaining contexts until the declared floors pass or an exact human/
external prerequisite blocks further work. Candidates may remain DERIVED while
independent contexts are observed; confirmation is still required before any
downstream delivery. An interruption preserves campaign progress and exact
resume input, rather than restarting from an empty-corpus guard.

## Confirmation and handoff

Prepare exact confirmation gates with complete candidate packets and plain
product-language briefs. A batch may name multiple exact ids, never a wildcard
or range. Apply attributable answers only through `PROCESS.md`:

- confirmed accurate as-built → `PENDING_VERIFICATION`;
- confirmed/corrected intended behavior → `PROPOSED`;
- rejected → `OBSOLETE`.

Confirmation does not approve entry, validate behavior, authorize candidate
relations, or select a release. Hand confirmed scope to `rdd-plan`, independent
`rdd-cold-review`, and `rdd-entry-review`, followed by `rdd-verify` or
`rdd-build`, then completion review. Standard session preflight applies before
delivery selection; observational campaign progress itself is not a release
commitment.

Persist context progress as PARTIAL, AWAITING_CONFIRMATION, or HANDED_OFF with
exact candidate/gate ids and remaining work. A later invocation resumes another
context using the same campaign; the confirmed corpus is preserved.

## Report

Report campaign/baseline, selected and remaining contexts, each population's
coverage and misses, source/authority conflicts, candidate and proposed-EC ids,
audit results and limitations, confirmation gates, and the exact next action.
