# Execution Prompts

Copy-paste prompts that drive the development process defined in `CLAUDE.md`. The prompts follow the three-phase lifecycle:

- **Prompt 0A** — Discovery: Customer requirements → Design docs (run once per project/major feature)
- **Prompt 0B** — Bootstrap: Stand up the development harness (run once)
- **Prompt 1** — Planning: Design docs → Requirements ledger (run once per context)
- **Prompt 2** — Build: Requirements → Tests → Code (run repeatedly)
- **Prompt 3** — Triage: Backlog sweep and replan (run between slices)

Replace `«PLACEHOLDERS»` with your project-specific values.

---

## Deviation Tracking Discipline (CRITICAL)

**Every deferral must create a requirement.** When you defer work, you MUST:

1. **Create a PROPOSED/DEFERRED requirement** in the owning context's `REQUIREMENTS.md` with:
   - Clear statement of what's missing
   - What depends on it
   - The blocking dependency (what needs to exist first)

2. **Never use vague pointers.** Each deferred capability needs its OWN requirement.

3. **Code comments are NOT requirements tracking.** "TODO" or "HONEST DEVIATION" comments must be DUPLICATED as requirement rows.

---

## Status Hygiene Discipline (CRITICAL)

**Status lives in THREE places in every `REQUIREMENTS.md`.** A status change is INCOMPLETE unless all three are updated atomically:

1. **Dashboard table row** — `| REQ-XXX-NNN | ... | STATUS | ... |`
2. **Detail block Status line** — `- **Status:** STATUS · ...`
3. **Dashboard Totals line** — `Totals: N DONE · M IN_REVIEW · ...`

**Verification (run after any batch of status changes):**
```bash
grep "^\- \*\*Status:\*\*" libs/<ctx>/REQUIREMENTS.md | awk -F'·' '{print $1}' | sed 's/.*Status:\*\* //' | sort | uniq -c
# Compare to the Totals: line — they MUST match
```

---

## Prompt 0A — Discovery: Customer Requirements → Design Docs

Use this prompt to transform raw customer requirements, user stories, and business rules into structured design documentation.

```
Read /CLAUDE.md §2 (Development Lifecycle) and §4 (Requirements Derive from Design Docs).

**Input provided:**
- Customer requirements / user stories: «paste or reference the customer input»
- Technology stack choices: «e.g., TypeScript, PostgreSQL, React, etc.»
- Target domain: «e.g., e-commerce, healthcare, fintech»

**Your task:** Transform this input into the canonical design documentation structure.

Create the following docs/ files:

1. **docs/00-overview.md** — System overview containing:
   - One-paragraph system description
   - Core capabilities (bulleted)
   - Key constraints and non-negotiables
   - Glossary of domain terms (ubiquitous language)
   - Conventions (IDs, timestamps, money representation, etc.)

2. **docs/01-bounded-contexts.md** — Context map containing:
   - List of bounded contexts with 3-letter codes (e.g., USR, ORD, PAY)
   - What each context owns (aggregates, events)
   - Integration points between contexts
   - Single-writer rules (who may write what)

3. **docs/10-«domain».md** (one per major domain) — Domain specification containing:
   - §1 Purpose and scope
   - §2 Aggregates with their state machines
   - §3 Value objects
   - §4 Invariants (INV-«CTX»-NNN) — rules that must NEVER be violated
   - §5 Business rules (BR-«CTX»-NNN) — rules that govern behavior
   - §6 Commands (inputs, outputs, which events they emit)
   - §7 Events (canonical payloads)
   - §8 Policies (event → command reactions)
   - §9 Read models / queries
   - §10 Integration points with other contexts
   - §11 API endpoints (if applicable)
   - §12 Open questions (ambiguities to resolve)

4. **docs/data/40-data-model.md** — Database schema containing:
   - Table definitions per context
   - Column types and constraints
   - Foreign key relationships
   - Indexes
   - Triggers and check constraints

5. **docs/data/41-event-catalog.md** — Event payloads containing:
   - Event name and owning context
   - Payload schema (JSON structure)
   - Producers and consumers
   - Idempotency keys

6. **docs/api.md** — API conventions containing:
   - URL structure
   - Authentication/authorization approach
   - Request/response formats
   - Error handling conventions
   - Pagination approach

7. **docs/tech-stack.md** — Technology choices containing:
   - Language and runtime
   - Frameworks
   - Database(s)
   - Message broker (if any)
   - Key libraries
   - ADRs (Architecture Decision Records) for significant choices

8. **docs/open-questions.md** — Initialize with any ambiguities found
9. **docs/gap-register.md** — Initialize with any known capability gaps

**Rules:**
- Extract EVERY business rule from the customer input — nothing implicit
- Number all invariants and business rules (INV-«CTX»-NNN, BR-«CTX»-NNN)
- Flag ambiguities as open questions, don't guess
- Use the customer's terminology in the glossary
- Keep domain docs independent — each should be readable standalone

Report: summary of contexts identified, count of invariants/rules per context, any open questions raised.
```

---

## Prompt 0B — Bootstrap the Harness (run once)

```
Read /CLAUDE.md and docs/tech-stack.md.

Stand up the development harness skeleton ONLY — no business features:
- Monorepo structure with libs/ per bounded context (from docs/01 context codes) and apps/ deployables
- Local development environment (Docker Compose or equivalent)
- Schema-first codegen wiring (if applicable: schemas → types, migrations, API handlers)
- Test harness (unit, property-based, integration, contract)
- CI pipeline that runs all tests and blocks merge on failure
- Per-context CLAUDE.md generator from the template in CLAUDE.md §10

Exit criteria: a trivial end-to-end test passes (create entity → persist → query → return); all test rings run in CI.
Report: what you created, how to run it, and confirm exit criteria.
```

---

## Prompt 1 — Turn Docs into Tasks (seed one context's requirements ledger)

```
Read /CLAUDE.md (§4–5, §10). Target context: «USR».
Read its design doc docs/«10-user-management».md in full, plus docs/01 (its aggregates/events), and docs/data/40/41 (its contracts).

Derive the requirements ledger for «USR». For every invariant (INV-*), business rule (BR-*), command, event, and read model in the design doc, create a REQ-«USR»-NNN requirement with:
- a one-line statement,
- Given/When/Then acceptance criteria,
- source rule ids / doc §,
- stage (MVP / Phase 2 / etc.) and priority (must/should/could),
- status: READY if the criteria are unambiguous, else PROPOSED.

Where the doc is ambiguous, mark the requirement BLOCKED and add the question to docs/open-questions.md.
Where it's consciously out of scope, mark DEFERRED with a reason.

Write libs/«usr»/REQUIREMENTS.md (dashboard table + one detail block per requirement, exactly the format in CLAUDE.md §5).
Create libs/«usr»/LOG.md with an initial entry.
Generate libs/«usr»/CLAUDE.md from the §10 template.

Do NOT write implementation code.
Report: status counts, the requirement list, and any open questions raised.
```

---

## Prompt 2 — Execute the Build Loop (run repeatedly)

```
Read /CLAUDE.md §1 (non-negotiables), §6 (the loop), §9 (Definition of Done). Target context: «USR».
Open libs/«usr»/REQUIREMENTS.md and the tail of libs/«usr»/LOG.md.

Run the build loop from CLAUDE.md §6 on the next READY requirement (lowest stage, then highest priority). If none are READY, promote the next PROPOSED by sharpening its acceptance criteria first. Do up to «3» requirements this run.

For each requirement, follow the loop exactly:
1. SPECIFY — sharpen acceptance criteria; if anything is ambiguous, log it in docs/open-questions.md, mark the requirement BLOCKED, and move on (never guess).
2. RED — write acceptance + unit + property tests tagged `REQ-«USR»-NNN`; they must fail first.
3. GREEN — smallest change that passes; enforce each invariant in code and annotate the line with its rule id (e.g. `// INV-USR-001`).
4. GATE — run the test suite; fix until all green.
5. TRACE — link code + tests in the ledger row.
6/7. Leave items needing human sign-off at IN_REVIEW; mark the rest ready to merge (PR title = REQ id).
8. CAPTURE & LOG — record every discovery as a PROPOSED row in the owning context's REQUIREMENTS.md with `Raised-by: REQ-«USR»-NNN`, or — if the owner is unclear — a line in /BACKLOG.md. Append a libs/«usr»/LOG.md entry (Done · Decisions · Deferred · Discovered · Follow-ups · Gate).

9. DEVIATION AUDIT — for any infrastructure slice, grep for "TODO", "FIXME", "DEVIATION" in the code. For EACH found, confirm a PROPOSED requirement exists. If not, create one NOW.

10. STATUS HYGIENE CHECK — after any status changes, verify dashboard totals match actual counts:
   ```bash
   grep "^\- \*\*Status:\*\*" libs/«usr»/REQUIREMENTS.md | awk -F'·' '{print $1}' | sed 's/.*Status:\*\* //' | sort | uniq -c
   ```
   Compare to the `Totals:` line. If they disagree, FIX NOW.

Hard rules: red before green; nothing is DONE without passing REQ-tagged tests + ledger link + log entry; deferral is always an explicit DEFERRED requirement; discovery is always a PROPOSED row or /BACKLOG.md line — never silent; don't touch another context's code or tables.

Stop and report: requirements completed/deferred/blocked, discoveries captured (with where they landed), the gate result, updated PROGRESS counts, and the next READY requirement.
```

---

## Prompt 3 — Triage & Replan (run between slices)

```
Read /CLAUDE.md §6A (iterative planning) and §4 (how requirements derive from docs). This is a PLANNING pass — do NOT write implementation code. Scope: «USR» (or «all contexts»).

1. SWEEP /BACKLOG.md — for each item, route it and then remove it from the inbox:
   - clear owning context → add a PROPOSED requirement with `Raised-by:` provenance;
   - design ambiguity → docs/open-questions.md (+ a BLOCKED placeholder if it blocks work);
   - market/scope gap → docs/gap-register.md (+ a DEFERRED requirement if known future need);
   - not worth doing → drop it with a one-line reason in the planning log entry.

2. RECONCILE docs ↔ ledgers — for any design doc changed since the last plan: derive PROPOSED requirements for new rules; flag affected existing requirements for re-review; mark removed ones OBSOLETE.

3. RE-PRIORITIZE & PROMOTE — set stage/priority; promote the next slice's requirements PROPOSED → READY by sharpening their acceptance criteria. Don't guess on ambiguity — raise an OQ and leave BLOCKED.

4. RECORD — append a planning entry to each affected context's LOG.md and refresh PROGRESS.md counts.

Stop and report: backlog items routed (and where), requirements added/re-prioritized/retired, new READY queue per context, and any new open questions or gaps raised.
```

---

## Prompt 4 — Customer Feedback Integration

Use this when you receive new customer feedback, bug reports, or feature requests.

```
Read /CLAUDE.md §6A (emergent requirements).

**Input:** «paste the customer feedback, bug report, or feature request»

Analyze this input and route it appropriately:

1. **If it's a bug in existing functionality:**
   - Identify the owning context and the related requirement(s)
   - Create a new PROPOSED requirement for the fix with `Raised-by: customer-feedback-YYYY-MM-DD`
   - Link to the original requirement it extends/fixes

2. **If it's a new feature request:**
   - Determine if it fits an existing context or needs a new one
   - Check if it conflicts with any existing design doc or invariant
   - If clear scope: create PROPOSED requirement(s) with acceptance criteria
   - If ambiguous: add to docs/open-questions.md and create BLOCKED placeholder

3. **If it's a design change request:**
   - Identify affected design docs
   - Draft the doc changes (don't apply yet)
   - List all requirements that would need re-review
   - Flag for human decision

Report: how you routed the feedback, any requirements created, any open questions raised, and recommended next steps.
```

---

## Tips for Effective Use

1. **Start with Prompt 0A** for any new project or major feature — getting the design docs right is 80% of the work.

2. **Run Prompt 1 for ONE context at a time** — seed its ledger, then build it to completion before seeding the next.

3. **Prompt 2 is the workhorse** — run it repeatedly with small batches (2-3 requirements) so every run ends at a clean stopping point.

4. **Run Prompt 3 when:**
   - `/BACKLOG.md` has more than 5 items
   - A design doc changed
   - You finished a slice
   - Starting a new session

5. **Automate Prompt 2** with a loop command if your environment supports it — the process is designed for continuous execution.

6. **Keep slices thin** — a slice that touches 2-3 requirements across 1-2 contexts is ideal. Larger slices increase risk of drift.
