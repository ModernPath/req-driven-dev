# Requirement-Driven Development — Process Manual

This is the operating manual for building software using a requirement-driven, AI-native development process. Every contributor — human or AI agent — reads it at the start of a session and follows the loop in §6.

This file defines **how** we build. The *what* (domain specs, data models, business rules) lives in `docs/`. The two work together: docs are the source of truth; this process ensures we build exactly what they say.

---

## 1. The Non-Negotiables

These govern every change. A change that violates one is wrong even if its tests pass.

1. **Nothing is "done" without all three: requirement, tests, code — cross-linked.** A passing test with no requirement, a requirement with no test, or code that no test exercises are all defects. (§8 Traceability, §9 Definition of Done.)

2. **Deferral is explicit, never silent.** Work not done is recorded as a `DEFERRED` requirement with a reason and a tracking link. "We'll get to it" is not a state. (§7.)

3. **Contracts are canonical.** Schema definitions (Zod, OpenAPI, Protobuf, etc.) are the source of truth. Hand-written boundary types are banned; derive from the schema.

4. **Configuration values are never literals.** Business rules, thresholds, rates — all come from versioned config, not inline constants.

5. **Thin vertical slices, not horizontal layers.** Every unit of work is a working path from API/event → domain → DB → back. (`docs/81-build-plan.md` if you have one.)

6. **The log tells the truth.** If you defer, decide, or discover something load-bearing, it goes in the context's `LOG.md` the same session. (§7.)

7. **Discoveries are captured, not carried.** A new requirement found mid-build is written down immediately — a `PROPOSED` ledger row or a line in `/BACKLOG.md`, with its provenance — never held in your head and never silently merged into the work in hand. (§6A.)

8. **Status is updated in ALL places, atomically.** When a requirement's status changes, you update THREE things in one edit: (1) the dashboard table row, (2) the detail block `Status:` line, (3) the `Totals:` summary line. A status change that touches only one location is a bug. (§5.)

---

## 2. The Development Lifecycle

The process has three major phases, each with its own artifacts:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  PHASE 1: DISCOVERY                                                          │
│  Customer requirements + tech stack → Design docs                            │
│                                                                              │
│  Input:  Customer interviews, user stories, business rules, tech choices    │
│  Output: docs/00-overview.md → docs/NN-domain-*.md + docs/data/*.md          │
│          + docs/api.md + docs/tech-stack.md                                  │
│  Prompt: Prompt 0A (Discovery)                                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  PHASE 2: PLANNING                                                           │
│  Design docs → Requirements ledgers                                          │
│                                                                              │
│  Input:  docs/00-overview.md → docs/NN-*.md (invariants, rules, commands)   │
│  Output: libs/<ctx>/REQUIREMENTS.md per bounded context                      │
│  Prompt: Prompt 1 (Seed Requirements)                                        │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  PHASE 3: BUILD                                                              │
│  Requirements → Tests → Code (the iterative loop)                            │
│                                                                              │
│  Input:  libs/<ctx>/REQUIREMENTS.md (READY items)                           │
│  Output: Passing tests, traced code, LOG.md entries                          │
│  Prompt: Prompt 2 (Build Loop) — run repeatedly                              │
│          Prompt 3 (Planning/Triage) — run between slices                     │
└─────────────────────────────────────────────────────────────────────────────┘
```

**The outer loop (Prompt 3)** replenishes the requirements backlog from discoveries and doc changes. **The inner loop (Prompt 2)** builds requirements into working code. They run concurrently.

---

## 3. Where Everything Lives

```
/CLAUDE.md                      ← this file (the process)
/PROGRESS.md                    ← generated rollup of all context ledgers (do not hand-edit)
/BACKLOG.md                     ← triage inbox: discoveries without a clear home yet (swept in §6A)
/prompts.md                     ← copy-paste prompts that drive the process
/docs/                          ← canonical design. Requirements DERIVE from these.
   00-overview.md               ← system overview, conventions, glossary
   01-bounded-contexts.md       ← context map, ownership, integration points
   10-<domain>.md               ← one per domain (invariants, rules, commands, events)
   data/40-data-model.md        ← canonical DB schema
   data/41-event-catalog.md     ← canonical event payloads
   api.md                       ← API conventions, endpoints
   tech-stack.md                ← technology choices, ADRs
   open-questions.md            ← design ambiguities awaiting resolution
   gap-register.md              ← known capability gaps
/libs/<ctx>/                    ← one library per bounded context
   ├── CLAUDE.md                ← context build guide (template in §10)
   ├── REQUIREMENTS.md          ← the domain requirements ledger (§5) — current state
   ├── LOG.md                   ← the build log (§7) — append-only history
   ├── src/                     ← code
   └── tests/                   ← unit · property · integration · golden
/apps/                          ← deployable applications that compose libs
```

**Two artifacts per context carry the process state:**
- **`REQUIREMENTS.md`** — the *current state*: every requirement, its acceptance criteria, status, and links to code and tests. This is what you query.
- **`LOG.md`** — the *history*: dated, append-only narrative of what was done, decided, and deferred, and why. This is what you read to understand how we got here.

---

## 4. Requirements Derive from the Design Docs

We do not invent requirements. Each one traces to canonical design:

- **Invariants & business rules** (`docs/10–20` §4–5) → enforcement requirements with `INV-*`/`BR-*` sources.
- **Commands & events** (`docs/10–20` §6–8) → behavioral requirements.
- **Read models & APIs** (`docs/10–20` §11, `docs/api.md`) → query/endpoint requirements.
- **Data model** (`docs/data/40`) → persistence requirements.

When a design doc is ambiguous, you do **not** guess: raise it in `docs/open-questions.md`, mark the requirement `BLOCKED`, and move on. When you find a true gap, add it to `docs/gap-register.md`.

---

## 5. The Requirements Ledger (`libs/<ctx>/REQUIREMENTS.md`)

One per context. It opens with a **dashboard table** (the at-a-glance completeness view) and continues with one **detail block per requirement**.

**Requirement ID:** `REQ-<CTX>-NNN` (e.g. `REQ-USR-014`). Stable; never reused.

**Status vocabulary:**

| Status | Meaning |
|---|---|
| `PROPOSED` | Identified from the design docs; acceptance criteria not yet written |
| `READY` | Acceptance criteria written and reviewed; ready to build |
| `IN_PROGRESS` | Tests written (red) and/or implementation underway |
| `IN_REVIEW` | Green + traced; awaiting human/domain sign-off |
| `DONE` | Merged; all acceptance criteria pass; traced; logged |
| `DEFERRED` | Consciously not now — **must** carry `reason` + tracking link |
| `BLOCKED` | Cannot proceed — **must** carry the blocking OQ id |
| `OBSOLETE` | Superseded by design change — **must** carry the superseding ref |

**Dashboard (top of file):**

```markdown
## Dashboard — USR (User Management)
Totals: 14 DONE · 3 IN_PROGRESS · 2 READY · 4 PROPOSED · 1 DEFERRED · 0 BLOCKED

| ID | Title | Stage | Status | Source | Tests | Code |
|----|-------|-------|--------|--------|-------|------|
| REQ-USR-001 | User registration validates email | MVP | DONE | INV-USR-001 | tests/user.register.spec.ts | domain/user.ts |
| REQ-USR-014 | Password reset expires after 24h | MVP | IN_PROGRESS | BR-USR-005 | tests/password.reset.spec.ts | domain/auth.ts |
```

**Detail block (one per requirement):**

```markdown
### REQ-USR-001 — User registration validates email
- **Status:** DONE  ·  **Stage:** MVP  ·  **Priority:** must  ·  **Owner:** —
- **Raised-by:** seeded from `docs/10` (Prompt 1)
- **Source:** INV-USR-001 (`docs/10` §4)
- **Statement:** A user may only be registered if their email is syntactically valid and not already taken.
- **Acceptance criteria:**
  - GIVEN a valid, unique email WHEN RegisterUser THEN user is created and confirmation email sent.
  - GIVEN an invalid email WHEN RegisterUser THEN rejected with `INV-USR-001`.
  - GIVEN an already-registered email WHEN RegisterUser THEN rejected with `EMAIL_TAKEN`.
- **Tests:** `tests/user.register.spec.ts` (unit), `tests/user.register.property.ts` (fast-check)
- **Code:** `domain/user.ts` (enforcement annotated `// INV-USR-001`)
- **Log:** see LOG entries 2026-07-xx
- **Deferred / notes:** —
```

**Status hygiene (CRITICAL):**

Status lives in **three places** in `REQUIREMENTS.md`. When you change a requirement's status, you MUST update ALL THREE atomically:

1. **Dashboard table row** — the `| REQ-XXX-NNN | ... | STATUS | ...` cell
2. **Detail block `Status:` line** — the `- **Status:** STATUS · **Stage:** ...` line
3. **Dashboard `Totals:` line** — decrement the old status count, increment the new status count

---

## 6. The Build Loop (the iterative engine)

This is the core cycle. It runs per requirement; a sequence of them delivers a slice.

```
        ┌─────────────────────────────────────────────────────────────┐
        ▼                                                             │
 0. ORIENT   read REQUIREMENTS dashboard + tail of LOG; pick next     │
             READY requirement (or promote a PROPOSED one to READY)   │
        │                                                             │
 1. SPECIFY  sharpen acceptance criteria against the domain doc       │
             (rules/commands/events). Ambiguous? → log OQ, mark       │
             BLOCKED, pick another. Status → READY → IN_PROGRESS      │
        │                                                             │
 2. RED      write acceptance + unit + property tests that encode     │
             the criteria; tag each with REQ-<CTX>-NNN; they FAIL     │
        │                                                             │
 3. GREEN    implement the smallest change that passes; enforce       │
             invariants in code, annotate with the rule id            │
        │                                                             │
 4. GATE     run the test suite; fix until all green                  │
        │                                                             │
 5. TRACE    update the ledger: link code + tests; update status →    │
             IN_REVIEW in ALL THREE places                            │
        │                                                             │
 6. REVIEW   human sign-off on correctness                            │
        │                                                             │
 7. COMMIT   PR titled with REQ id; merge                             │
        │                                                             │
 8. CAPTURE  record every discovery as a PROPOSED row or BACKLOG      │
   & LOG     line; append LOG entry; update status → DONE             │
        │                                                             │
        └──────────────► back to 0 (next requirement) ───────────────┘
```

**Key rules:**
- **Red before green, always.** The failing test proves the requirement is real.
- **One requirement at a time**, but a slice may span several; finish end-to-end before starting the next.
- **Discoveries don't derail.** Capture them; don't chase them now.

---

## 6A. Iterative Planning & Emergent Requirements

Seeding a context's ledger from the docs (Prompt 1) is the *start* of planning, not the end. Many requirements surface while building.

### Where discoveries come from
Building (an edge case) · code review · integration discovery · user feedback · a bug or incident · a **design-doc change**.

### Capture rule
The moment you discover something, **capture it, then triage it separately**:

| The discovery is… | Route it to… |
|---|---|
| A clear new requirement with an obvious owner | a `PROPOSED` row in **that context's `REQUIREMENTS.md`** |
| A design ambiguity | **`docs/open-questions.md`**; if it blocks, a `BLOCKED` placeholder |
| A market/scope gap | **`docs/gap-register.md`**; a `DEFERRED` requirement if known future need |
| Unclear owner / cross-cutting | a line in **`/BACKLOG.md`** (the triage inbox) |

### The planning loop (outer loop)
Run a triage/replan pass at natural boundaries — at session start, when `/BACKLOG.md` fills up, at the end of each slice, and when a design doc changes:

1. **Sweep `/BACKLOG.md`** — route every item to a context ledger, `docs/open-questions.md`, `docs/gap-register.md`, or drop it.
2. **Reconcile docs ↔ ledgers** — derive new requirements for new rules; flag affected ones for re-review.
3. **Re-prioritize & promote** — promote `PROPOSED → READY` by sharpening acceptance criteria.
4. **Record it** — note the replan in affected contexts' `LOG.md`.

---

## 7. The Build Log (`libs/<ctx>/LOG.md`)

Append-only, reverse-chronological narrative. The **ledger is the queryable state; the log is the history and the reasoning.**

**Entry format:**

```markdown
## 2026-07-14 — REQ-USR-014 password reset expiry (IN_PROGRESS → DONE)
**Done:** Password reset tokens now expire after 24h; enforced BR-USR-005.
**Decisions:** Chose to invalidate all existing tokens on new reset request (idempotency).
**Deferred:** Multi-factor reset flow → REQ-USR-037 (DEFERRED, Phase 2).
**Discovered:** Need rate limiting on reset endpoint → REQ-USR-038 (PROPOSED).
**Follow-ups:** none.
**Gate:** all tests green; coverage 94%.
```

What every entry captures: **Done · Decisions · Deferred · Discovered · Follow-ups · Gate result.**

---

## 8. Traceability: code ↔ tests ↔ requirements ↔ rules

The triad is enforced mechanically:

- **Tests → requirements:** every test references its requirement id, e.g. `describe('REQ-USR-001: email validation', …)`.
- **Code → rules:** the line(s) enforcing an invariant carry a comment with the rule id, e.g. `// INV-USR-001`.
- **Ledger → code & tests:** each requirement row links the implementing files and the covering tests.
- **Commits/PRs → requirements:** PR title = `REQ-USR-014: password reset expiry`.

`PROGRESS.md` at the repo root is regenerated from the ledgers on every merge.

---

## 9. Definition of Done

A requirement is `DONE` only when **all** hold:

1. Every acceptance criterion maps to a passing, `REQ`-tagged test.
2. All `INV-*` it covers are enforced in code and annotated.
3. Architecture/lint checks pass.
4. Contract tests pass (no schema drift).
5. Human sign-off (domain expert sign-off for business logic).
6. Ledger updated, `LOG.md` entry written, any deferral recorded.
7. **Status updated in ALL THREE places:** dashboard row, detail block, Totals line.

---

## 10. Per-Context Build Guide (`libs/<ctx>/CLAUDE.md`) — Template

Each context gets its own short `CLAUDE.md` so an agent can build it with only that file in hand:

```markdown
# <CTX> — <Context name> — build guide
- **Design doc:** `docs/<NN>-<name>.md` (authoritative for this context)
- **Aggregates / events / rules:** `docs/01` §4–5; rule ids `INV/BR-<CTX>-*`
- **Contracts:** schemas in `./contracts/`; DB in `docs/data/40`; events in `docs/data/41`
- **Requirements:** `./REQUIREMENTS.md`   ·   **Log:** `./LOG.md`
- **Boundary:** may import only `shared`. Never read another context's tables.
- **This context's invariants you must never break:** <list load-bearing INV-* in one line each>
- **Commands to run:** `npm test <ctx>` · `npm run trace`
- **Definition of done:** root `CLAUDE.md` §9.
- **Start here:** open `REQUIREMENTS.md`, pick the next `READY` requirement, run the loop (root `CLAUDE.md` §6).
```

---

## 11. Session Ritual

**Start of a work session:**
1. Read this file's §1 (non-negotiables) and §6 (the loop).
2. Open the target context's `REQUIREMENTS.md` (state) and the tail of `LOG.md` (recent history).
3. If `/BACKLOG.md` has items or a `docs/` doc changed, run a planning pass (§6A) first.
4. Pick the next `READY` requirement (or promote/specify one).

**End of a work session:**
1. Ensure tests are green.
2. Update the ledger row(s) and write the `LOG.md` entry.
3. Record any deferral as a `DEFERRED` requirement, any discovery as a `PROPOSED` row or `/BACKLOG.md` line.
4. Leave the context in a coherent state.

---

## 12. Quick Reference

| Need | Doc |
|---|---|
| What a term means | `docs/00-overview.md` glossary |
| Which context owns a concept | `docs/01-bounded-contexts.md` |
| How a domain works | `docs/10–20` |
| Tables / events | `docs/data/40`, `docs/data/41` |
| API conventions | `docs/api.md` |
| Tech choices | `docs/tech-stack.md` |
| Open questions / gaps | `docs/open-questions.md` · `docs/gap-register.md` |

**The discipline in one sentence:** every change starts as a requirement with acceptance criteria, becomes a failing test, then code that passes, then a traced ledger row and an honest log entry — and anything we choose not to do is written down as a deferral, not forgotten.
