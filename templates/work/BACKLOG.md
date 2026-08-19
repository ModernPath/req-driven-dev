# Backlog projection template

Copy into a consuming repository if it needs a versioned triage inbox.
Discoveries without a clear home are swept through
`.modernpath/rdd/process/V-model-loop.md` "Planning and discoveries" and
routed according to `.modernpath/rdd/process/state-tracking.md`.

> **Inbox status:** EMPTY (initialized)

## Inbox

| Discovery | Tracked as |
|---|---|
| *No items yet* | — |

---

## Routing Log

Record every triage pass here with the date and what was routed where.

### Template Entry

```markdown
## YYYY-MM-DD — Triage pass N
**Routed:**
- Item inferred from code/SRs without human confirmation → CONTEXT REQ-XXX-NNN (DERIVED) + confirmation gate
- Item description → owning EPIC + CONTEXT REQ-XXX-NNN (PROPOSED)
- Item description → docs/open-questions.md OQ-NNN
- Item description → DROPPED (reason)

**Promoted PROPOSED → READY:**
- REQ-XXX-NNN (entry packet fulfilled + attributable human gate/source)

**Human-confirmed DERIVED:**
- REQ-XXX-NNN → PROPOSED (USER source; accepted as-built rows may then take the PENDING_VERIFICATION route; candidate links sent to planning)

**Notes:** any observations about the backlog state
```
