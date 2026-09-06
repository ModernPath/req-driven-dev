# Requirement flat-file state

> Canonical requirement serialization for the authoritative process store.
> `PROCESS.md` defines item content, lifecycles, gates, and traces. A
> store-backed repository materializes this file from the store; a file-backed
> repository versions it as the store. Never both.

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

| Evidence class | Target | Code | Test case | Historical RED result ids | Passing/regression result ids |
|---|---|---|---|---|---|
| UR upper | «UR scenario or N/A» | «code refs» | TEST: | «result ids» | «result ids» |
| SR lower | «SR clause or N/A» | CODE: | TEST: | «result ids» | «result ids» |

### Evidence results

Repeat this block for each immutable run; never share one outcome or fingerprint
between RED and passing results. Store-backed serializers may reference the
equivalent complete result records by id.

- **Result id / role:** «id» / BASELINE_RED / SENSITIVITY_RED / PASSING / REGRESSION
- **Target / assertion fingerprint:** «exact clause or scenario and exercised assertions»
- **Test case / code:** TEST: / CODE:
- **Observed outcome:** PASS / FAIL / SKIP
- **Command / report:** RUN:«exact command and preserved report»
- **Environment:** «relevant configuration/runtime, or N/A with basis»
- **Tested fingerprint / revision:** «code/configuration fingerprint and revision; record patch/tree fingerprint for an uncommitted mutation»
- **Expected RED cause:** «assertion and observed expected failure, or N/A»
- **Mutation / restoration:** «sensitivity mutation/target, original fingerprint, restored fingerprint and verification; N/A for other roles»

Validity assessments are append-only; changing an assessment never rewrites the
observation. Historical RED uses `RETAINED`, not a claim of passing at delivery.

| Assessed at | Validity | Assessment target/revision | Basis / confirming run |
|---|---|---|---|
| «timestamp» | CURRENT / RETAINED / STALE / INVALID / INHERITED_UNVERIFIED | «baseline or candidate/delivered fingerprint + revision» | «role-specific basis and direct evidence; prior run/equivalence proof when confirming at a new target» |

### Gates and delivery

- **Confirmation gates:** «GATES.md gate ids, or N/A»
- **Entry gates:** «GATES.md gate ids»
- **Start/review gates:** «GATES.md gate ids»
- **Engineering-check gates:** «GATES.md gate ids»
- **Completion gates:** «GATES.md gate ids»
- **Delivered revision:** «repository + revision or not delivered»
- **Review corrections:** «direct finding, unchanged approval, affected items, correction boundary, required reruns, and resolution; or none»
- **Hold history:** «WORK-SELECTION.md per-item hold/restoration rows, or none»
- **Gaps / deferrals / blockers / notes:** «refs or none»
