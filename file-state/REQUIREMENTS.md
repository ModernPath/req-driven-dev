# Requirement flat-file state

> Fallback/export for the authoritative process store. `PROCESS.md` defines
> item content, lifecycles, gates, and traces. Generate this file from the
> database when one exists; do not maintain both as authorities.

- **Snapshot at:** «timestamp»
- **Source store/revision:** «database revision or repository SHA»
- **Context / release:** «scope»

## UR/SR-«AREA»-«NNN» — «Title»

- **Kind / status:** UR or SR / «status from PROCESS.md»
- **Statement / source:** «normative content» / USER:/DOC:/CODE:
- **Owner / release:** «owner and delivery scope»
- **Epic membership:** «EPIC id + authority, or none»
- **Declared relations:** «UR scenarios requiring SRs, SR links to UR scenarios, or none»
- **UR content:** «actor, context, intended outcome, and inline scenarios; N/A for SR»
- **SR content:** «boundary, behavior, scope/non-goals, and technical context; N/A for UR»
- **Candidate packet:** «inference sources, proposed relations, consequences, and confirmation brief; DERIVED only»

### Trace references

| Evidence class | Target | Code | Test case | RED result | Passing result | Validity/revision |
|---|---|---|---|---|---|---|
| UR upper | «UR scenario or N/A» | «code refs» | TEST: | RUN: | RUN: | CURRENT / STALE / INVALID / INHERITED_UNVERIFIED + revision |
| SR lower | «SR clause or N/A» | CODE: | TEST: | RUN: | RUN: | CURRENT / STALE / INVALID / INHERITED_UNVERIFIED + revision |

### Gates and delivery

- **Confirmation gates:** «trace/human refs or N/A»
- **Entry gates:** «trace/human refs»
- **Start/review gates:** «refs»
- **Completion gates:** «trace/human refs»
- **Delivered revision:** «repository + revision or not delivered»
- **Gaps / deferrals / blockers / notes:** «refs or none»
