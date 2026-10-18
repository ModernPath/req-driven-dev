# Requirement-driven delivery process

This document defines the delivery process. Skills apply it. The project's sanctioned process interface is the only way to read or change delivery state; its server is authoritative. This process does not define local ledger formats or add a second record system.

## Canonical model

```text
EPIC -> optional UR/SR requirements -> native code and test references
UR -> acceptance scenario -> TEST_CASE -> TEST_RESULT
UR acceptance scenario -- may require --> SR
SR -> CODE -> TEST_CASE -> TEST_RESULT

EPIC: PROPOSED -> IN_PROGRESS -> IN_REVIEW -> DONE
UR/SR: PROPOSED -> IN_PROGRESS -> IN_REVIEW -> DONE
        BLOCKED | DEFERRED | OBSOLETE when applicable

Human decisions: implementation approval -> completion approval
```

The Epic is the normal unit of authorized delivery. Requirements express
behavior and link to implementation and evidence; they do not replace the
Epic's saved plan or human approvals. Upper evidence exercises a user outcome;
lower evidence exercises a system behavior. Existing-baseline work follows
its dedicated source-scoped process below.

## Authority and sources

Humans decide product intent, scope, architecture, acceptance, priority, and
workflow. Agents establish facts, write and review plans, implement approved
work, and report evidence. They do not infer human approval from silence,
prior work, a passing test, a commit, or a repository state.

Use the project's sanctioned process interface to read the Epic and its
requirements, save a plan, obtain recorded approvals, and read back results.
If it lacks a needed read or write, report the tooling gap through the
project's named channel. Do not read or edit process state through a local
ledger, private database connection, or direct API call.

Ground product claims in product documents, code, tests, or observed runs.
When a document supplies a claim, read the relevant passage and quote or
faithfully summarize it with the file and location. Code proves existing
behavior, not intended behavior. Repository status and a change list describe
the repository; they do not establish process approval or completion.

The process interface attributes human decisions and approvals to the person
who made them. In the saved plan, cite product sources in ordinary prose with
links or file locations and enough quoted or summarized context for another
reviewer to inspect the claim. A link audit checks whether a reference
resolves; it does not prove that the source supports the claim.

## Items and traces

| Item | Owns |
|---|---|
| `EPIC` | Human-readable outcome, explicit scope, saved plan and exact proposed content, decisions, lifecycle, implementation and completion approvals |
| `UR` | Actor, context, user outcome, sources, acceptance scenarios, optional Epic relation |
| `SR` | One independently implementable system behavior, source, boundary, technical context, code and test links |
| `CODE` | Implementing files, symbols, revision, branch and changes |
| `TEST_CASE` | Stable test identity, target clause and expected observation |
| `TEST_RESULT` | Outcome, command/report, environment when relevant, tested revision and validity |

Requirement and Epic identifiers come from the authoritative process store.
Use those native IDs in plans, code/test links, review notes and evidence.
Never invent, derive, or substitute a path, slug, code, or external key for an
identity the store owns.

A trace records relationships, not execution order. An Epic plan names the
selected requirements and their expected code/test evidence. An UR trace is
its sourced outcome, scenarios, current upper evidence and each SR the
scenario requires. An SR trace is `SR -> CODE -> TEST_CASE -> TEST_RESULT`.
Do not invent parent relations or code links to make a trace look complete.
A code link identifies implementation; it does not prove behavior. A test
that covers several clauses identifies each clause and assertion it checks.

## Lifecycle

`PROPOSED` is a draft. Human implementation approval moves the Epic and its
named requirements directly to `IN_PROGRESS`, retaining the exact approved plan
and proposed requirement content separately from published content. It atomically
locks the whole requirement set to that Epic and one user. A conflicting owner
must leave the whole approval unchanged.

`IN_REVIEW` means implementation is complete and awaits human completion
approval. The ownership lock, approved proposal and prior published requirement
content remain unchanged. `DONE` follows human completion approval: atomically
publish the approved content, increment each requirement revision once, retain
an immutable accepted version with criteria and trace meaning, record the
actor, time, reason and originating Epic, and release ownership. A failed write
must roll back all effects; repeating completion must not publish twice.

There is no READY/TODO entry step, requirement stage, evidence-conclusion status,
plan-revision token, fingerprint, generic gate or separate ownership framework.
Requirements keep their own native UUIDs and types; Epic membership and criterion
ownership are direct containment, while links among requirements, code,
documents and tests are traces. Requirement-to-document traces use `relates`.
`BLOCKED`, `DEFERRED` and `OBSOLETE` retain their actual reason and history when
applicable; none authorizes publication or erases an accepted version.

### Derived requirement hold

While a requirement is `DERIVED`:

- record its candidate statement, inference sources, proposed relations,
  conflicts, consequences, and confirmation brief;
- label every proposed relation `CANDIDATE`;
- exclude it from authoritative trace, release, readiness, coverage, progress,
  and completion;
- candidate statements may include proposed UR scenarios, related candidates,
  source links and references to existing tests so they are reviewable together;
  all such content and artifacts remain candidate-only, excluded from ordinary
  test lists, coverage, release snapshots and execution assignment;
- do not use a candidate to authorize implementation, test execution,
  verification, entry, release commitments or delivery.

```text
DERIVED -> confirmed/corrected ----------> PROPOSED
        -> confirmed accurate as-built --> PENDING_VERIFICATION
        -> rejected ---------------------> OBSOLETE
```

Confirmation records the reviewed candidate content and explicitly selected typed
relationships, using native requirement identities and kinds. Unselected links
remain candidate-only. Rejection publishes no links; deferral leaves the
candidate unchanged. Confirmation never overwrites an existing requirement or
its compliance approval and does not authorize implementation or completion.
Those decisions belong to the saved Epic plan and its human approvals.

Accepting as-built scope places it in Base/PENDING_VERIFICATION; accepting new
desired intent makes it PROPOSED and eligible for normal delivery planning.
Base is the store's destination for established as-built requirements, separate
from a delivery release; the project's store interface identifies that destination.
Neither action approves entry, verifies behavior, records a passing test result
or marks anything DONE. DERIVED proposals remain distinct from baselines and
normal delivery requirements until handled through the sanctioned Epic process.

### Source-scoped baseline onboarding

Reverse-engineering can establish a usable requirement base or propose additions
to an existing corpus. Before publication, present both modes and require an
explicit choice. Recommend baseline when the corpus is empty, is the sweep's
own earlier baseline, or the person has stated an as-built base as the purpose;
recommend DERIVED additions otherwise when it is populated. The choice is asked
once: the person's words settle it when they state the purpose or ask to
proceed on the recommendation shown, and the same question is not put again.
Existing content and approvals are preserved in both modes.

A baseline authorization names the authenticated actor, system/store, immutable
repository/file and document revision inventory, Base destination, permitted
relationship publication.
It authorizes derivation and publication of grounded as-built URs/SRs with
inline scenarios and canonical source/UR–SR/code/test relationships. It does
**not** assert the human reviewed statements that had not yet been generated.
No per-row or per-context confirmation is required within this approved scope.
URs are derived one per distinct actor outcome over an enumerated inventory of
the surfaces actors reach, never one per context or subsystem; file linkage
alone never shows that a sweep is complete. Each requirement is written from
the code it cites, with its actor, outcome and the code's own rules; text
generated by filling a template from identifiers is not a requirement. Every UR
is served by the SRs that implement it.

Publish coherent groups atomically. Out-of-scope sources or conflicting
existing content cannot silently expand the authorization. Unchanged existing
requirements may be reused only by native identity and kind.
Essential unresolved evidence remains an explicit DERIVED exception, never an
authoritative guess. Report partial publication and the exact remainder.

Baseline requirements are PENDING_VERIFICATION, not compliance-approved or
verified. They and their grounded confirmed graph appear in authoritative
requirement views; DERIVED additions appear only in candidate review. A test
reference or stub is not an execution result. Optional Epics need real intended
members; do not manufacture discovery-container Epics or membership.

Source capture preserves immutable repository/revision/path/digest identity,
including local changes. A historical read never substitutes latest code.
Unavailability or explicit source revocation is shown honestly while retaining
audit identity. Source/store read-backs and explicit coverage denominators are
part of onboarding completion, not evidence of product verification.

## Human approvals

The human reviews a saved Epic plan and its exact proposed requirement
content, criteria and traces. Implementation approval retains that content and
the decision's actor, time and reason. Read back the approval and requirement
ownership through the sanctioned interface before implementation. A later
changed intent needs fresh human approval; never silently change what an
existing approval accepted.

Present the outcome, included requirements, exclusions, sources, test strategy,
decisions and risks in plain language. An approval refers to saved content that
the human can read, not a technical hash or plan-revision token.

Human completion approval is separate. Present the approved proposal beside the
still-published baseline, the implementation evidence, review findings, known
failures and remaining risks. Only that approval publishes the approved
requirement content, raises revisions, retains immutable accepted versions,
records audit history and releases ownership in one transaction. Implementation
approval, review, an autopilot grant, a commit, merge or silence is not a
completion answer.

Apply and report a human's answer, then continue through the phases of the
requested work. Stop only at an open human approval, a question only the human
can answer, or a stop the human requested. Confirmed implementation approval
lets the build start without another request. A focused pass ends with its
report. Merging, deploying and releasing still require the human's word.

Git and PR/CI systems own code revisions, commits, merges and conflicts. Retain
links and tested code revisions for traceability; their hashes do not define
requirement identity, versions or approval validity. Never describe a code
branch as merged or deployed without inspecting that external state.

## Work scope

Work on the Epic scope the user selected. If scope is missing, ask which Epic
to use or whether to prepare a sourced proposal. Read its native ID, saved plan,
approved proposal, human decisions and affected requirements from the sanctioned
interface. Choosing work creates no separate selection record or Epic lock.
Requirement ownership is acquired by implementation approval, not session entry.

Keep work within the approved outcome and exclusions. Disclose changed intent,
acceptance or scope and obtain fresh human approval before implementing it.
Do not infer scope from a branch, latest activity, changed files or a search
result.

## Autopilot

Autopilot is a human-granted way to continue implementation across a bounded
sprint; it is not a completion approval. The grant names the Epic or Epics,
end date and excluded areas and is recorded with its `USER:` source through
the sanctioned interface. Under a current grant, the agent may continue
within an approved saved plan and may record ordinary, reversible product
assumptions for later human confirmation. Unless already explicitly authorized, it must stop for decisions whose
wrong answer is hard to undo, including deletion or migration of existing
data, security or authorization, billing or legal terms, and external-party
contracts. It must not expand the approved Epic scope on its own.

Autopilot does not waive red-first testing, security, tenant isolation, data
integrity, project commit checks, independent completion review, accepted-content
read-back, or explicit human completion approval. The human remains in
control of merge, deployment and release. Report assumptions, exclusions,
failures and incomplete work at sprint closeout.

## Planning and readiness

Planning produces a saved, reviewable Epic plan and exact proposed content. It is useful to a
builder and an independent reviewer without depending on session memory. It
contains:

- the Epic's native ID, desired user outcome, included requirements and
  explicit exclusions;
- authoritative sources and the claims they support, unresolved decisions,
  assumptions, conflicts and risks;
- relevant architecture, state, data-flow, integration and failure-mode
  reconnaissance at identified source revisions;
- the change boundary, affected code and interfaces, dependencies, and what
  must remain unchanged;
- acceptance scenarios and the lower-level requirements they exercise;
- expected failing tests for changed behavior, plus focused and proportional
  regression checks;
- operational, migration, accessibility, security and tenant-isolation
  considerations that apply to the change;
- the proposed content, criteria and traces that completion would publish,
  and how implementation and accepted content will be reviewed.

Read actual source documents, code and tests before making claims. Search for
existing ownership and constraints, then verify each relevant match in its
source. A source inventory is not an implementation plan. For persisted or
shared state, inspect the actual writers, readers, existing data shapes,
partial-failure behavior and recovery; document the risks and mitigation in
the saved plan. Do not replace reconnaissance with a citation list.

An independent cold review checks the saved plan against its sources, scope,
acceptance, architecture, state boundaries, risks and test strategy. Record
material findings and correct the plan before asking for implementation
approval. Re-review material plan changes. The review audits the planned
change, not the amount of prose or the presence of links.

## Development loop

```text
CHOOSE EPIC -> SAVE PLAN AND PROPOSED CONTENT -> INDEPENDENT REVIEW
-> HUMAN IMPLEMENTATION APPROVAL / IN_PROGRESS + REQUIREMENT OWNERSHIP
-> RED -> GREEN -> CLEANUP -> VERIFY -> IN_REVIEW
-> HUMAN COMPLETION APPROVAL / ATOMIC PUBLICATION + REVISION + AUDIT + UNLOCK
```

Enter with `rdd-start`. Use `rdd-deliver` for an end-to-end request, and a
focused skill only when the user explicitly ends the task at that pass. Each
skill uses the project's sanctioned process interface; it does not prescribe
or invent CLI verbs. A missing interface capability is reported as a tooling
gap.

| Phase | Skill | Exit |
|---|---|---|
| Session entry and scope | `rdd-start` | Explicit Epic scope and current saved plan read; next needed phase identified |
| Discover and classify | `rdd-discover` | Sources and proposed scope/decisions recorded for the selected Epic |
| Plan | `rdd-plan` | Saved plan and exact proposed content ready for independent review |
| Cold review | `rdd-cold-review` | Findings resolved or clearly disclosed; reviewed content identified |
| Implementation approval | `rdd-entry-review` | Human implementation approval read back for the exact saved plan and exact proposed content |
| Implement | `rdd-build` | Red-first implementation and focused checks complete |
| Verify | `rdd-verify` | Required lower and upper evidence passes at the candidate revision |
| Review, publish and complete | `rdd-completion-review` | Human-approved content atomically published/versioned/audited, ownership released, or incomplete work reported |
| Discoveries and blockers | `rdd-triage` | Discovery routed into the saved plan or reported as a decision/blocker |

A focused pass is a handoff, not whole-task completion. Stop when its exit is
reached and report what remains.

### Verification of an as-built baseline

A published source-scoped baseline starts in `PENDING_VERIFICATION`.
Publication establishes authority for the as-built statements, not test PASS,
delivery, or compliance approval. Review each active criterion against the
captured source and genuine execution evidence; evaluate UR outcomes separately
from their required SR behavior. Preserve source capture integrity digests and
the native typed Traces that identify the actual requirements, SourceFiles,
documents, tests, and evidence.

Baseline evidence is input to ordinary Epic planning, verification, and
completion review. It does not create a separate lifecycle transition or
permit requirements to move directly to `DONE`. The selected Epic must have
its normally saved and human-approved plan and exact proposed content; required
tests pass under `rdd-verify`; `rdd-completion-review` presents the evidence for
the ordinary human completion approval. That approval publishes the accepted
content and audit history and releases Epic ownership. Compliance approval
remains separate. Missing tests or changed behavior are gaps for normal scoped
development. If the sanctioned process cannot place baseline evidence and
requirements into the ordinary Epic lifecycle, report that tooling/process gap
rather than inventing a gate, receipt, key, or direct-completion path.

### AI TDD inner loop

After implementation approval, establish each changed clause's expected
failure before implementing it. For each clause:

1. Write or select a focused assertion that expresses the approved behavior.
2. Run it against the current implementation and confirm the expected failure;
   a build error or unrelated failure is not RED evidence.
3. Implement the smallest change that makes the assertion pass.
4. Run the focused test, then proportional boundary and regression checks.
5. Clean up without changing behavior and rerun affected checks.
6. Re-run affected user scenarios and verify the complete changed trace.

Do not reconstruct RED or passing evidence after the fact. Preserve the test
output, command, environment and revision for each result. Never skip or
weaken a failing assertion to pass a project commit gate. Deletion checks prove scoped machinery is absent and retained data is preserved.
When the human explicitly accepts broken affected paths, report their actual
failures; do not restore removed machinery, invent replacements, weaken tests
of retained behavior or manufacture RED/GREEN evidence.

If an upper/user-flow failure remains after lower-level requirements pass,
diagnose it. Repeat the loop when it is within approved behavior. Return to
planning and obtain renewed approval when fixing it requires changed scope,
acceptance, architecture, priority or a material technical decision. Record an
external impediment as blocked. UI evidence requires the live stack, loaded
assets and inspected browser output; never mutate production-like data to
verify rendering.

### Delegated passes

A cold review or verification pass may run in an independent context. It
returns findings, verdict and sources to the orchestrating session; the
orchestrator records them through the sanctioned process interface. A
reviewer's returned verdict does not turn the orchestrator into an independent
reviewer. A delegated pass that encounters a permission, authentication or
process-tool refusal stops and returns it verbatim; it does not retry by
rewriting or splitting the refused action.

## Evidence and completion

A test result records its stable test identity, target requirement, outcome,
command/report, environment when relevant and exact code revision. Outcomes
are `PASS`, `FAIL` or `SKIP`. A rerun is a new observation. Only a passing
result that actually exercises the cited assertion at the identified revision
supports the trace. A broad suite proves only assertions it exercised. RED
and passing evidence are separate results; a RED demonstrates regression
sensitivity at its recorded revision, not execution of the passing
implementation.

Choose evidence by boundary: unit/property for domain rules, component and
browser for UI, endpoint or contract tests for APIs, integration for
persistence and external integrations, schema conformance for cross-service
contracts, and harness/smoke for operations. Run project-required checks and
proportional regression suites after cleanup. Keep test identities and
requirement links native and stable; file line numbers are navigation aids,
not identities.

Before completion review, run the required checks and record their actual
outcomes. Review from a context independent of the author. Resolve material
correctness, security, data-loss, contract, traceability and testability
findings; explain remaining limits. Keep code integration in version control
under the project's rules and the human's PR-specific merge approval.

Audit the approved Epic, exact proposed content, implementation and traces.
Identify what each result actually proves. Disclose exclusions, failures,
assumptions and deferred items. For explicitly authorized deletion, broken
features or checks remain reported cleanup outcomes; they never justify
restoring removed machinery or claiming a working runtime without proof.

Submit implementation for review while retaining published requirement content
and ownership. Present the review and evidence for the human's completion
answer. After explicit approval, read back the atomically published requirement
content and immutable versions, incremented revisions, actor/time/reason/Epic
audit and released ownership. Never infer that answer or claim `DONE` from
code, test, review or repository state. Merge and deployment remain separate
human decisions.

## Process state and reconciliation

The server-backed process interface is the sole authority for the Epic,
requirements, saved plan and exact proposed content, implementation and completion approvals,
and their native relationships. This process defines no file-backed ledger,
local process snapshot, generic gate format, local plan authority, or
synchronization/reconciliation protocol. Ordinary product documents remain
in their project repositories and are read or refreshed by that project's
documented documentation workflow; they do not become delivery state.

After each process operation, read back the authoritative result and confirm
that the expected Epic, saved/approved content, approval, native requirement links or
completion state is present. If a write outcome is uncertain, read the server
before repeating the operation. Never construct or edit a replacement record
locally. If an expected server read or transition is unavailable, surface the
tooling gap and leave the item explicitly incomplete.

## Discoveries and conflicts

| Discovery | Route |
|---|---|
| New behavior or changed user outcome | Add sourced scope to the Epic plan and obtain renewed human implementation approval before affected work |
| Missing human decision or ambiguous intent | Ask the human and record the answer with its source before relying on it |
| Technical failure inside approved behavior | Continue red-first implementation and verification |
| External impediment | Report the blocker, its owner and the next action |
| Known future work outside the approved scope | Disclose it and leave it for a separately authorized Epic |
| Contradicted or removed behavior | Explain the conflict and ask the human how the approved outcome changes |

Preserve competing authoritative sources and ask for a human decision; never
resolve intent by timestamp, branch state, or a convenient test result.
