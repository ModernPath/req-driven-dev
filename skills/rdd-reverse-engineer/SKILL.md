---
name: rdd-reverse-engineer
description: Bootstrap a requirement corpus from an existing codebase that has none — inventory observable behavior by bounded context against explicit denominators, create every inferred requirement as DERIVED with candidate-only relations, build exact confirmation packets, and hand confirmed scope to the normal delivery loop. Use to adopt a repository that has code but no authoritative requirement records; never for a workspace that already has them (use rdd-plan there), and never as a substitute for any phase — it creates no acceptance content, tests, release commitments, or authoritative relations.
---

# Bootstrap a corpus from an existing codebase

An optional orchestrator over the standard process, not another lifecycle. A
repository arrives with a hundred thousand lines and no requirement records;
this pass gives it a corpus that says what the code observably does, marks
every inferred statement as awaiting human confirmation, and routes what a
human confirms into the same loop every other requirement travels.

Read the project `AGENTS.md` and the canonical `PROCESS.md`
(`.modernpath/rdd/PROCESS.md` in a consuming repository) first. `PROCESS.md`
owns the `DERIVED` hold, the confirmation gate, and every status this pass may
apply; nothing here redefines them.

## Preflight — when this pass applies

1. **Stop if an authoritative requirement corpus exists** — a store binding
   with requirement records, or populated `file-state/REQUIREMENTS.md`
   equivalents. Re-deriving over a real corpus overwrites decisions people
   made deliberately; use `rdd-plan` to extend it instead. A bare `tasks/` or
   `docs/` directory proves nothing — other conventions use those names, so
   check for the records, not the directory.
2. **Identify the process store** per `PROCESS.md` — store-backed or
   file-backed — and serialize every record this pass creates through the
   `file-state/` shapes for that store. This pass never invents a third
   representation.
3. **Take what analysis exists as a lens.** A platform knowledge core, a
   maintained `ARCHITECTURE.md`, human-written guides — read them all before
   the code. Each proposes; the code decides. Every claim this pass records
   cites `CODE:`, `DOC:`, or `TEST:` sources it verified itself. A guide that
   cannot be confirmed in code becomes an open question naming the guide,
   never a silently adopted fact — and this pass never authors a guide, which
   would launder its assumptions into an input.

## Four phases, and the order is the method

```text
A  DOMAIN        schema and analysis        ->  entities, invariants, contexts
B  SURFACES      every view, its actors     ->  journeys carrying candidate URs
C  REQUIREMENTS  entry points, both halves  ->  DERIVED candidates, cross-linked
D  ARCHITECTURE  the shape around it all    ->  recovered design documents
```

A–C loop, one bounded context per pass, until the context map lists no
context without records; phase D runs **once per system**, after at least one
full A–C pass, because its documents need the context map and the data model.
A pass that starts at C produces a corpus of refusals with no statement of
what the product is for — that question is settled in the schema and the
views, which an endpoint walk never visits.

**Phase A** reads the schema directly — models, migrations, constraints —
beside whatever analysis exists. For each entity: what it is, who writes it,
and what the schema enforces; those constraints are invariants nobody wrote
down anywhere else. Contexts are drawn by **aggregate ownership** — who
writes which table — never by route-file layout.

**Phase B** walks every surface: which actors reach it (cite the **role
gate** — it is a fact in code), what each actor can do there, and which entry
points it calls. Group the views into user journeys; each journey is a
candidate epic carrying a candidate **user requirement** — an actor, an
outcome, and the views that serve it, every one cited. Candidate groupings
serialize to `file-state/EPICS.md` (ledger-format workspaces materialize an
`epics/` directory).

**Phase C** derives candidates from the entry-point inventory below.
**Phase D** writes the recovered design documents, further down.

## Inventory observable behavior — the denominators

Enumerate mechanically, by bounded context, before deriving anything. The
counts are denominators; coverage is measured against them, and no class may
be silently omitted — a genuinely inapplicable class (no client app, no jobs)
is a stated fact in the report, not a skipped row.

| Class | Enumerate |
|---|---|
| Entry points | every HTTP route, RPC procedure, worker, scheduled job, webhook, event handler, CLI command — and every agent/LLM tool surface, which carries its own authorization and is the class most often missed |
| Data models | every table/model, with the invariants the schema enforces — uniqueness, foreign keys, nullability, state machines |
| Access control | every guard, middleware, policy, role gate |
| User-visible flows | every route/view/flow in each client application, and which actors reach it (cite the gate — it is a fact in code) |
| Integrations | every external system, enumerated from injected credentials and configuration, not only from named modules — an adapter wired in config has no module to find |
| Tests | every test file, so existing evidence can be traced rather than rewritten |

Draw context boundaries by who writes which aggregate, not by route-file
layout or deployment units — a map drawn from those describes the build
system, not the business. A table written by two contexts is a single-writer
violation: report it, never smooth it over.

Work the entry-point list, not the error branches. For each entry point,
derive both halves: what it does and for whom, and what it refuses — the
rejection branches are where invariants live, and they are the requirements
most worth having.

## Derive — one observable behavior, one candidate

A requirement is something a change could **breach**. A sentence that merely
describes how the code is shaped cannot be breached — it is documentation, and
it belongs in the recovered design documents this pass writes alongside the
corpus, not in a requirement record.

| Sentence | Verdict |
|---|---|
| "An event's type is at most 64 characters" | requirement — a change can breach it |
| "Only the lead may open a draft" | requirement |
| "An event's detail is unstructured JSON with no schema" | documentation — adding a schema breaches nothing |
| "The model and the migration agree, column for column" | a test, not a requirement |
| "Append-only is a convention, not a constraint" | a finding — record it as one |

- One behavior, one candidate — not one function, one candidate. A
  three-function validation chain enforcing one rule is one requirement; an
  endpoint with five distinct observable behaviors is five.
- State behavior, never implementation: *"a refund reverses the VAT it
  charged"*, not *"RefundService calls VatCalculator.reverse"*.
- Declare the canonical kind on every candidate: `UR` for an actor-outcome
  behavior served by identified surfaces, `SR` for a system behavior at a
  boundary. Group views into user journeys and derive candidate URs from
  them — a UR carries the same evidence burden as an SR and needs it more,
  because a user story reads as true even when nobody checked. Cite the view,
  the route, and the gate, or leave it out.
- A hardcoded threshold is either a business rule nobody wrote down (a
  candidate) or an accident (an open question). Never present an inferred
  intent as a derived fact: code answers *what*, rarely *why* — a threshold
  with no comment, a branch nobody can date, a rule contradicting another is
  an open question for the confirmation packet, not a guess.

While establishing these facts, prefer the artefact over the description of
it; read the whole expression, never the grep hit; search the entity alone
rather than conjoining verb and noun on one line (deletion code almost never
names its table beside the verb); exclude comment lines from behavioral
evidence while still citing a comment as evidence of what the code *says*;
and support an absence claim only with a named search — *"nothing does X"*
requires stating which files were opened to reject it, and a clean absence
after a real search is a finding to state plainly, with the search shown.
Where a decision is recorded but not deployed, write both halves labelled
**Decided** and **Deployed** — they are different facts with different
evidence.

Link candidate URs and SRs both ways, then report the **join report**: a view
calling an entry point that does not exist is a broken or unfinished surface;
an entry point no view calls is dead surface or an undocumented integration.
Neither is visible from one side alone, and an empty join over a codebase of
any size is a claim that needs its own evidence.

## Everything lands DERIVED

Every inferred requirement is created `DERIVED`, exactly as `PROCESS.md`
§Derived requirement hold prescribes: candidate statement, inference sources,
proposed relations all labelled `CANDIDATE`, conflicts, consequences, and a
confirmation brief — the **Candidate packet** slot in the requirement shape.
`DERIVED` rows are excluded from authoritative trace, release, readiness,
coverage, progress, and completion, and this pass never creates or advances
anything related to them.

The legacy failure this replaces: assigning `PENDING_VERIFICATION` directly
to derived rows. That status is human-confirmed as-built behavior; inference
is not confirmation, however good the citations. Only a human answer moves a
row out of `DERIVED`.

Three routings that are not `DERIVED` candidates:

- a **pre-existing red test** is work someone started, not shipped behavior —
  record it as a discovery for `rdd-triage`, and say the suite was already
  red there before this pass arrived;
- a code path that **provably cannot run as written** is a finding, not a
  behavior;
- a discovery with unclear ownership or a cross-cutting concern goes to the
  triage backlog shape, not the requirement shape.

## The coverage contract — the only definition of "done enough"

**The floor is 90% of every denominator class, the target is 100%, and the
claim is a script's exit code — never a sentence.** Two recorded failures
share one cause: a 46-row "complete" corpus over an 80-endpoint,
two-application estate, and a "110/110 endpoints routed" claim that audited
to 65/110 the same day. Both stated coverage as prose, and prose drifts
toward optimism.

- For each denominator class, write the enumeration and matching as a small
  script kept in the repository (e.g. `tools/endpoint-coverage-audit.py`)
  that prints `N/N` per context, lists every miss, and
  **exits non-zero below the floor** — coverage stays re-checkable by anyone, forever. The
  report **embeds the scripts' verbatim output**; a coverage claim without
  embedded audit output is invalid, and an orchestrator receiving one
  re-runs the audit rather than relaying the claim.
- **No row budgets exist.** There is no such thing as a row budget: the
  grain is one candidate per observable behavior, however many that yields.
  A reference estate correctly derived carried **978 requirements** across
  13 contexts, at per-context densities of 50–130; a context reporting 6
  rows over 30 endpoints is under-derived, full stop. Grouping is legal only
  where the observable behavior is genuinely one, and the grouped units are
  always enumerated on the row.
- **Below the floor, the pass is not done.** Keep deriving, or hand off an
  honest partial that names the precise remainder — a partial is a handoff,
  never an endpoint, and a silent truncation reads as "covered everything".
- **No silent fallbacks.** A tool that fails — an analysis export missing, a
  test runner broken, a script erroring — is named in the report with what
  it blocked; work continues on every path that does not depend on it.
- Where the workspace ships a standing coverage instrument (for ModernPath
  workspaces, `modernpath coverage --json`), run it before deriving anything
  and pin its output as the pass's *before*; take targets from its
  ranked uncovered directories rather than from taste, and passing over the
  top-ranked gap needs a stated reason. At the end of the pass
  the same command is the after — the delta is the pass's receipt, and a pass whose
  delta on its declared target is zero did not happen, whatever its prose
  says. An instrument's untraced test files list is standing input for
  `rdd-verify`: an existing green test nobody traced is the cheapest
  verification available once its row is confirmed.

Before claiming anything, invoke `skills/rdd-audit/SKILL.md` over what this
pass produced: every citation resolves from the repository root
(§"Citations — does every reference resolve?"), every inventory is diffed in
both directions, and the coverage numbers carry their populations
(§"The audit").

### The full sweep — every context, one run, stated cost

One context per pass is the default because it protects derivation rigor.
When the human explicitly asks for the complete adoption, the sweep is a
different contract, not a shortcut, and it runs unattended:
**one invocation loops** measure → target → derive → audit, taking the next ranked gap each
iteration, until every denominator-class floor passes **and** the
**file-coverage floor** passes — coverage lands **well over 50%** of the
source-file inventory (operationally, keep looping below 60%
cited-or-dispositioned; files legitimately outside the behavioral surface,
such as type barrels, migrations, and generated code, count only when
explicitly dispositioned in the report — a disposition is written, never
assumed). There is **no human checkpoint inside the loop**: candidates still
land `DERIVED`, and the confirmation gates open in the terminating report,
which embeds the final audit output as proof — deferring confirmation to the
end of the sweep is not skipping it. On an honest-partial handoff the
orchestrating agent **relaunches for the remainder** automatically rather
than reporting the partial and waiting; asking the human to notice
under-coverage is the failure mode this contract exists to prevent.

## Phase D — the recovered design documents, once per system

Phase C says what the system does; none of it says what the system *is*.
These are system-wide, written once — no per-context fan-out:

| Document | Answers |
|---|---|
| `docs/03-architecture.md` | key subsystems, external interfaces, datastores, the path one request takes — the document a reader opens first |
| `docs/20-deployment-topology.md` | what runs where and what a request crosses; fold into `03` for a single-stack estate |
| `docs/21-integrations.md` | each external system — direction, protocol, and **what happens when it is unreachable**, which no dependency list gives you |
| `docs/22-cross-cutting.md` | auth, tenancy, secrets, observability, resilience *as implemented*, each concern naming its enforcement point |
| `docs/23-data-flow.md` | where a value originates, what transforms it, where it lands, which trust boundaries it crosses |

Alongside them, `docs/adr/` gets one record per decision the code has plainly
already made — datastore, transport, isolation, deployment shape — with
status **`observed`**, a third status beside accepted and superseded: the
pass can prove a decision was made, never that anyone ratified it, and an
ADR claiming a ratification the repository never performed is the same lie
as a completion with no evidence.

Read `docs/guides/` — every human-written guide — before phase A begins. A
guide is a **lens**, never a source: it directs attention, every claim still
cites the code or config it came from, a guide that cannot be confirmed
becomes an open question naming the guide, and the pass never writes one.

Before writing any document, look for what the repository **already covers**
— a maintained architecture document, existing ADRs. Adopt it or extend it
in place rather than writing a competing file, and supersede only
deliberately, with a coverage diff proving nothing is lost.

Quality attributes get their own context — `NFR-REQUIREMENTS.md` in
ledger-format workspaces — one category per row from exactly eight:
`performance` · `scalability` · `availability` · `security` · `privacy` ·
`operability` · `maintainability` · `compatibility`; an open list becomes
forty overlapping labels within two passes. Sweep for latent thresholds
(timeouts, pool sizes, retry counts, rate limits, cache TTLs, payload caps),
but first check whether the behavior **already has a requirement** — an NFR
row for a threshold another row owns is a duplicate wearing a different id.
Every remaining bare constant becomes a candidate held as a question —
`BLOCKED` on the only thing that matters: is the value a target, a measured
limit, or the first number someone typed? A `timeout: 30_000` gives the
value, never the intent, and asserting intent from a constant is the same
failure the `DERIVED` hold exists to prevent.

**D5 — when phase D is done:** the five documents present or explicitly
folded, every integration carrying a failure entry or an open question,
every ADR at `observed`, the NFR sweep run with every bare-constant row held
as a question, and **citations resolve** across all of it — checked, not
trusted. Phase D is idempotent — ADRs key by slug, NFR rows by the
`file:symbol` the threshold lives at — and it measures nothing: configured
thresholds are read, latencies are never invented, and threat models are a
person's to write, seeded by `22`, never substituted by this pass.

## Confirmation — the only exit for a candidate

Build exact confirmation gates per `PROCESS.md` §Strict human transitions:
the candidate packet and exact confirmation scope complete before the gate
opens, each gate carrying the standard brief. One human answer may cover
explicitly named candidates — batch confirmation over a context's candidates
is the expected shape; a gate per row is a denial-of-service on the person
this pass is meant to help. Never batch by wildcard or range: the gate names
every id it covers.

Apply answers exactly as `PROCESS.md` routes them:

```text
confirmed accurate as-built --> PENDING_VERIFICATION
confirmed/corrected intent ---> PROPOSED
rejected ---------------------> OBSOLETE
```

Confirmation proves the requirement exists. It does not approve entry, make
candidate links authoritative, prove behavior, or select a release — a
derived corpus describes what already ships and is never stamped into an
active release.

## Handoff

Confirmed scope enters the standard loop and this orchestrator's job ends:
`rdd-plan` → `rdd-cold-review` → `rdd-entry-review`, then `rdd-verify` for
`PENDING_VERIFICATION` rows or `rdd-build` for `PROPOSED` behavior — those
passes own the advance to `IN_REVIEW` — then `rdd-completion-review`.
`rdd-start`'s session discipline binds throughout: run the project's
deterministic process checks (for ModernPath workspaces, `modernpath check`)
before every commit of derived records, chained so a failure stops the
commit. Comprehensive is reached by repetition — one bounded
context per pass, confirmed and handed off, until the context map lists no
context without records — not by one enormous unreviewable pass.

## This pass never

- creates or advances acceptance content, tests, implementation,
  verification, or delivery while its candidates are `DERIVED`;
- assigns `PENDING_VERIFICATION`, `TODO`, or any status past `DERIVED`
  without an applied human answer;
- makes a candidate relation authoritative, or invents a parent to complete
  a trace;
- commits derived items to a release;
- edits product code — a pass that edits code can be reviewed as neither
  documentation nor a change;
- guesses a business rule to avoid recording an open question.

## Report

Report the contexts inventoried and the one derived; every denominator class
as `N/N` with misses and stated-inapplicable classes; candidates created by
kind; conflicts, open questions, and backlog discoveries routed; the audit
result over the pass's own output; the confirmation gates now open and the
exact ids each covers; and which contexts remain, with the one this pass
would take next.
