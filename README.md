# Requirement-Driven Development Framework

A methodology for building software using AI agents with full traceability from customer requirements through design docs to tested code.

## What is this?

This framework provides a structured, multi-loop approach to software development where:

1. **Customer requirements** are transformed into **design documentation**
2. **Design docs** are decomposed into **traceable requirements**
3. **Requirements** drive **test-first implementation**
4. **Everything is linked**: code ↔ tests ↔ requirements ↔ design docs

The process is designed for AI-assisted development where agents can autonomously build features while maintaining full traceability and quality.

## The Three Phases

```
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 1: DISCOVERY                                              │
│  Customer requirements + tech stack → Design docs                │
│  Prompt: 0A                                                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 2: PLANNING                                               │
│  Design docs → Requirements ledgers                              │
│  Prompt: 1                                                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 3: BUILD (iterative)                                      │
│  Requirements → Tests → Code                                     │
│  Prompt: 2 (build) + Prompt 3 (triage) — run repeatedly          │
└─────────────────────────────────────────────────────────────────┘
```

## Quick Start

1. **Copy the framework files** to your project root
2. **Run Prompt 0A** with your customer requirements to generate design docs
3. **Run Prompt 0B** to bootstrap your development harness
4. **Run Prompt 1** for each bounded context to seed requirements
5. **Run Prompt 2** repeatedly to build requirements
6. **Run Prompt 3** periodically to triage discoveries and replan

## File Structure

```
/CLAUDE.md           ← The process manual (read this first)
/prompts.md          ← Copy-paste prompts that drive the process
/BACKLOG.md          ← Triage inbox for discoveries
/PROGRESS.md         ← Auto-generated status rollup
/docs/
   00-overview.md    ← System overview and glossary
   01-bounded-contexts.md ← Context map
   10-«domain».md    ← Domain specifications (one per domain)
   data/40-data-model.md  ← Database schema
   data/41-event-catalog.md ← Event definitions
   open-questions.md ← Design ambiguities
   gap-register.md   ← Known capability gaps
/libs/«ctx»/
   CLAUDE.md         ← Context-specific build guide
   REQUIREMENTS.md   ← Requirements ledger
   LOG.md            ← Build history
   src/              ← Code
   tests/            ← Tests
/templates/          ← Templates for new files
```

## Key Principles

1. **Nothing is "done" without all three: requirement, tests, code — cross-linked**
2. **Deferral is explicit, never silent** — every "not now" is tracked
3. **Contracts are canonical** — schemas are the source of truth
4. **Thin vertical slices** — end-to-end features, not horizontal layers
5. **The log tells the truth** — decisions and deferrals are recorded
6. **Discoveries are captured, not carried** — new requirements go to the backlog immediately

## The Build Loop

The core development cycle (Prompt 2):

```
ORIENT → SPECIFY → RED → GREEN → GATE → TRACE → REVIEW → COMMIT → CAPTURE & LOG
   ↑                                                                      │
   └──────────────────────────────────────────────────────────────────────┘
```

- **Red before green, always** — failing tests prove the requirement is real
- **One requirement at a time** — finish before starting the next
- **Discoveries don't derail** — capture them, don't chase them

## Requirements Status Flow

```
PROPOSED → READY → IN_PROGRESS → IN_REVIEW → DONE
                        ↓
                    BLOCKED (waiting on OQ)
                        ↓
                    DEFERRED (conscious postponement)
```

## Traceability

Every piece is linked:

- **Tests** reference requirement IDs: `describe('REQ-USR-001: ...', ...)`
- **Code** references rule IDs: `// INV-USR-001`
- **Ledger** links to tests and code files
- **PRs** titled with requirement IDs

## License

MIT

## Contributing

This framework is battle-tested on 300k+ LOC projects. Contributions welcome — please follow the framework's own principles when contributing!
