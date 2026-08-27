# Gate flat-file state

> Canonical gate serialization for the authoritative process store.
> `PROCESS.md` defines gate kinds, prerequisites, legal transitions, and
> application rules. A store-backed repository materializes this file from the
> store; a file-backed repository versions it as the store. Never both.

- **Snapshot at:** «timestamp»
- **Source store/revision:** «database revision or repository SHA»
- **Context / release:** «scope»

Trace gates and human gates are recorded in the same file because a human gate
is addressable only through the trace gates that gate it. A human gate with no
recorded prerequisite trace gate is unreadable, not implicitly open.

## GATE-«AREA»-«NNN» — «Transition or decision purpose»

- **Kind:** trace or human / «confirmation, entry, decision, cold-review, start-review, completion»
- **Transition / purpose:** «exact state transition, or the decision being asked»
- **Exact scope:** «named EPIC/UR/SR ids this gate covers; one answer may cover an Epic and named members»
- **Prerequisites:** «gate ids that must be PASS before this one may leave DRAFT, or none»
- **Fingerprint:** «content/code fingerprint the gate was evaluated at; the plan-subject fingerprint for cold-review and entry gates»
- **State:** «trace: PENDING / PASS / FAIL / STALE — human: DRAFT / OPEN / ANSWERED / CLOSED / SUPERSEDED»
- **Verdict / answer:** «trace verdict with exact blockers, or the human answer as given»
- **Actor / evaluator:** «real human actor and role for a human gate; evaluating agent or check for a trace gate»
- **Sources:** «USER:/DOC:/CODE:/TEST:/RUN:/EPIC: support for the verdict or answer»
- **Timestamps:** «evaluated/opened at; answered at; closed at»
- **Application:** «NOT_APPLICABLE / PENDING / APPLIED / FAILED» at «revision»
- **Predecessor / successor:** «superseded gate id and successor gate id, or none»

### Cold-review detail

Cold-review trace gates only. Omit for other gates. Review output is linked to
the plan-subject fingerprint above and does not participate in that
fingerprint.

- **Review mode:** FIRST / RE_REVIEW
- **Round authorization:** «workflow human-gate id and USER: source authorizing the exact re-review finding snapshot, or N/A for FIRST»
- **Predecessor review:** «gate id and reviewed plan-subject fingerprint, or none»
- **Reviewed plan diff:** «old fingerprint -> new fingerprint plus changed packet elements, or N/A for FIRST»
- **Affected-surface denominator:** «repositories, flows, contracts, persistence, integrations, and test boundaries covered»
- **Convergence:** «first review / shrinking / flat / recurring lineage / expanding domains»
- **Structural recommendation:** «split / simplify / remove optional behavior / replan shared boundary / none»

#### Coverage rubric

Every row is required. Add project-specific rows when the Entry packet declares
them.

| Area | Result | Sources / finding ids |
|---|---|---|
| Trace and scope | PASS / NOT_APPLICABLE / FINDINGS | «refs» |
| Affected surface and control/data flow | PASS / NOT_APPLICABLE / FINDINGS | «refs» |
| Contracts, schemas, and compatibility | PASS / NOT_APPLICABLE / FINDINGS | «refs» |
| Persistence | PASS / NOT_APPLICABLE / FINDINGS | «refs» |
| Integrations, failure propagation, and retries | PASS / NOT_APPLICABLE / FINDINGS | «refs» |
| Concurrency, security, and operational risks | PASS / NOT_APPLICABLE / FINDINGS | «refs» |
| Feasibility, dependency order, SR boundaries, and reuse | PASS / NOT_APPLICABLE / FINDINGS | «refs» |
| Testability, RED strategy, and proportional gates | PASS / NOT_APPLICABLE / FINDINGS | «refs» |
| Human authority | PASS / NOT_APPLICABLE / FINDINGS | «refs» |

#### Findings

Finding ids remain stable across a review and its re-reviews. A re-review
updates the existing row rather than renumbering or restating it.

| Finding id | Classification | First seen / last checked fingerprint | Lineage | Domain | Severity / materiality | Direct source | Owner | Required remediation | Disposition | Resolution evidence |
|---|---|---|---|---|---|---|---|---|---|---|
| «CRF-AREA-NNN» | ORIGINAL / INTRODUCED_BY_REMEDIATION / REVIEW_ESCAPE / SCOPE_EXPANSION / OUT_OF_SCOPE | «fingerprints» | «predecessor or introduced-by finding/fix» | «affected domain» | «severity and material/non-material» | «DOC:/CODE:/TEST:/RUN:/USER:» | «owner» | «exact correction or decision» | OPEN / RESOLVED / DEFERRED / REJECTED | «direct proof or none» |

### Brief

Human gates only. Omit for trace gates.

```markdown
**Brief:**
- What: «decision»
- Why now: «trigger and blocked work»
- Changes if approved: «visible outcome»
- Risk if wrong: «downside and reversibility»
- Recommendation: «option and rationale»
- Image: «optional evidence»
```

### Holds

- **Held items:** «EPIC/UR/SR ids blocked until this gate closes, or none»
- **Applied transitions:** «item id -> from -> to, one per line; empty until APPLIED»
